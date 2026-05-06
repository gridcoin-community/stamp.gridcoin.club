import { config } from '../config';
import { OP_RETURN, PREFIX, PROTOCOL } from '../constants';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { redis as redisConn } from '../lib/redis';
import { Stamp } from '../models/Stamp';
import { emitIndexerStatus, emitPendingCount, getEmitter } from '../lib/emitter';
import { ProcessBlockEvent, TransactionFoundEvent } from '../types';

// OP_RETURN + push-data length byte. The spec at /about#protocol-overview
// allows two layouts: 0x26 (38 bytes — single hash) and 0x46 (70 bytes — two
// hashes). Anything else (push-data-1 wrappers, foreign lengths) doesn't
// match the published protocol and is skipped.
const PUSH_SINGLE = '6a26';
const PUSH_DOUBLE = '6a46';
// On-chain encoding of supported protocol versions. `PROTOCOL = '0.0.1'` →
// `000001` here. New entries are added when this indexer learns to decode a
// new layout; until then unknown versions are skipped rather than mis-sliced.
const KNOWN_PROTOCOL_VERSIONS = new Set(['000001']);
const HEX64 = /^[0-9a-f]{64}$/;

export class Scraper {
  private currentBlock: number;

  public constructor(
    private redis = redisConn,
    private grcRpc = rpc,
    private blockPrefix = PREFIX,
  ) {}

  private async readBlockInfo() {
    this.currentBlock = Number(await this.redis.get(config.REDIS_SCRAPER_KEY))
      || Number(config.START_BLOCK);
  }

  public async scrape(): Promise<void> {
    await this.readBlockInfo();

    log.info('[Scraper] Starting the scraper');

    // Get current block number
    const info = await this.grcRpc.getStakingInfo();
    const { blocks } = info;
    emitIndexerStatus(this.currentBlock, blocks);
    let steps = config.BLOCK_GROUPS;
    if (this.currentBlock + steps > blocks) {
      steps = blocks - this.currentBlock;
    }
    for (let i = 0; i < steps; i++) {
      await this.getNextBlock();
    }
    // Emit again at the end so clients see we've made progress within
    // the same chain tip without waiting for the next tick.
    emitIndexerStatus(this.currentBlock, blocks);
  }

  private async getNextBlock(): Promise<void> {
    await this.readBlockInfo();
    log.debug(`[Scraper] Processing block #${this.currentBlock + 1}`);
    const processBlockEvent: ProcessBlockEvent = {
      type: 'processBlock',
      data: {
        block: this.currentBlock + 1,
      },
    };
    getEmitter().emit('processBlock', processBlockEvent);
    try {
      const block = await this.grcRpc.getBlockByNumber(
        this.currentBlock + 1,
        true,
      );
      const { tx: txs } = block;
      const re = new RegExp(`${OP_RETURN} ${this.blockPrefix}`);
      let foundAny = false;
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];
        const TXID = tx.txid;
        for (let j = 0; j < tx.vout.length; j++) {
          const vout = tx.vout[j];
          const { hex: hexString, asm } = vout.scriptPubKey;
          if (!re.test(asm)) continue;

          // Protocol-compliance gate. The asm regex above is a coarse filter
          // (any push of bytes starting with the prefix matches), so verify
          // the full layout against the spec before we slice and index.
          const wrapper = hexString.slice(0, 4);
          if (wrapper !== PUSH_SINGLE && wrapper !== PUSH_DOUBLE) {
            log.info(`[Scraper] Skipping ${TXID}: unsupported OP_RETURN wrapper ${wrapper}`);
            continue;
          }
          const version = hexString.slice(10, 16);
          if (!KNOWN_PROTOCOL_VERSIONS.has(version)) {
            log.info(`[Scraper] Skipping ${TXID}: unknown protocol version ${version}`);
            continue;
          }
          const hashCount = wrapper === PUSH_SINGLE ? 1 : 2;
          const hashSlots = [
            hexString.slice(16, 80),
            hashCount === 2 ? hexString.slice(80, 144) : '',
          ];
          if (!HEX64.test(hashSlots[0])
              || (hashCount === 2 && !HEX64.test(hashSlots[1]))) {
            log.info(`[Scraper] Skipping ${TXID}: hash slot is not 64 hex chars`);
            continue;
          }

          log.info('[Scraper] We have found transaction');
          const hex = Buffer.from(hexString);
          const stamps2save = hashSlots.map((hash: string) => {
            if (!hash || !hash.length) return Promise.resolve();
            const stamp = new Stamp();
            stamp.block = this.currentBlock + 1;
            stamp.hash = hash;
            stamp.protocol = PROTOCOL;
            stamp.rawTransaction = hex.toString('utf8');
            stamp.time = block.time;
            stamp.tx = TXID;
            stamp.type = 'sha256';

            const transactionFoundEvent: TransactionFoundEvent = {
              type: 'transactionFound',
              data: { hash },
            };
            getEmitter().emit('transactionFound', transactionFoundEvent);

            return stamp.saveOrUpdate();
          });

          await Promise.all(stamps2save);
          foundAny = true;
        }
      }
      if (foundAny) {
        emitPendingCount();
      }
      await this.redis.set(config.REDIS_SCRAPER_KEY, this.currentBlock + 1);
    } catch (e) {
      log.error(e);
    }
  }
}
