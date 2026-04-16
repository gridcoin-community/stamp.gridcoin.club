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
      let foundAny = false;
      txs.forEach((tx) => {
        const TXID = tx.txid;
        const { vout: vouts } = tx;
        vouts.forEach(async (vout) => {
          const script = vout.scriptPubKey;
          const { hex: hexString, asm } = script;
          const hex = Buffer.from(hexString);
          const re = new RegExp(`${OP_RETURN} ${this.blockPrefix}`);
          if (re.test(asm)) {
            log.info('[Scraper] We have found transaction');
            // Payload format: 12-hex-char prefix + up to two 64-hex-char hashes
            const stamps2save = [
              hex.toString('utf8', 16, 16 + 64),
              hex.toString('utf8', 16 + 64, 16 + 128),
            ].map((hash: string) => {
              if (hash && hash.length) {
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
              }
              return Promise.resolve();
            });

            await Promise.all(stamps2save);
            foundAny = true;
          }
        });
      });
      if (foundAny) {
        emitPendingCount();
      }
      await this.redis.set(config.REDIS_SCRAPER_KEY, this.currentBlock + 1);
    } catch (e) {
      log.error(e);
    }
  }
}
