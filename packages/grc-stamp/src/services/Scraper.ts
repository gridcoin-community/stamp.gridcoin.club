import { StampsType } from '@prisma/client';
import { config } from '../config';
import { OP_RETURN, PREFIX, PROTOCOL } from '../constants';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { redis as redisConn } from '../lib/redis';
import { Stamp } from '../models/Stamp';
import { emitPendingCount, getEmitter } from '../lib/emitter';
import { ProcessBlockEvent, TransactionFoundEvent } from '../types';

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
    const info = await this.grcRpc.getMiningInfo();
    const { blocks } = info;
    let steps = config.BLOCK_GROUPS;
    if (this.currentBlock + steps > blocks) {
      steps = blocks - this.currentBlock;
    }
    for (let i = 0; i < steps; i++) {
      await this.getNextBlock();
    }
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

          log.info('[Scraper] We have found transaction');
          const hex = Buffer.from(hexString);
          // Payload format: 12-hex-char prefix + up to two 64-hex-char hashes
          const stamps2save = [
            hex.toString('utf8', 16, 16 + 64),
            hex.toString('utf8', 16 + 64, 16 + 128),
          ].map((hash: string) => {
            if (!hash || !hash.length) return Promise.resolve();
            const stamp = new Stamp();
            stamp.block = this.currentBlock + 1;
            stamp.hash = hash;
            stamp.protocol = PROTOCOL;
            stamp.rawTransaction = hex.toString('utf8');
            stamp.time = block.time;
            stamp.tx = TXID;
            stamp.type = StampsType.sha256;

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
