import { StampsType } from '@prisma/client';
import { config } from '../config';
import { OP_RETURN, PREFIX, PROTOCOL } from '../constants';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { redis as redisConn } from '../lib/redis';
import { Stamp } from '../models/Stamp';

const REDIS_SCRAPER_KEY = 'grc-stamp:processedBlock';

export class Scraper {
  private currentBlock: number;

  public constructor(
    private redis = redisConn,
    private grcRpc = rpc,
  ) {}

  private async readBlockInfo() {
    this.currentBlock = Number(await this.redis.get(REDIS_SCRAPER_KEY))
      || Number(config.START_BLOCK);
  }

  public async scrape(): Promise<void> {
    await this.readBlockInfo();

    log.info('Starting the scraper');
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
    log.debug(`Processing block #${this.currentBlock + 1}`);
    try {
      const block = await this.grcRpc.getBlockByNumber(this.currentBlock + 1, true);
      // go through transactions
      const { tx: txs } = block;
      txs.forEach((tx) => {
      // console.log(JSON.stringify(tx, null, 2));
        const TXID = tx.txid;
        // looking for the vout
        const { vout: vouts } = tx;
        // looping through all vouts, looking for the specific data (OP_RETURN)
        vouts.forEach(async (vout) => {
          const script = vout.scriptPubKey;
          const { hex: hexString, asm } = script;
          const hex = Buffer.from(hexString);
          const re = new RegExp(`${OP_RETURN} ${PREFIX}`);
          if (re.test(asm)) {
            log.info('We have found transaction');
            // console.log(hex.toString('utf8'));
            // console.log(hexString);
            // console.log(JSON.stringify(block, null, 2));
            // console.log(script.hex, TXID);
            // Now use protocol and parse result, translate it to the stamp object
            // then compare the result with database results
            // if record exists, update it
            // if record doesn't exists - create it
            // (because someone else could have created the transaction using my protocol)
            // get protocol version
            // const protocol = hex.toString('utf8', 10, 16)
            // I know there will be maximum 2 hashes
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
                return stamp.saveOrUpdate();
              }
              return Promise.resolve();
            });

            await Promise.all(stamps2save);
          }
        });
      });
      // save all stamps
      // we have parsed the block
      await this.redis.set(REDIS_SCRAPER_KEY, this.currentBlock + 1);
    } catch (e) {
      log.error(e);
    }
  }
}
