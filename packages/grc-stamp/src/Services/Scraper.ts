import { ScriptPubKey } from 'gridcoin-rpc/dist/contracts/transaction';
import { TX } from 'gridcoin-rpc/dist/types';
import { config } from '../config';
import { PREFIX } from '../constants';
import { rpc } from '../lib/gridcoin';
import { redis } from '../lib/redis';

export class Scraper {
  private currentBlock: number;

  private async readBlockInfo() {
    this.currentBlock = Number(await redis.get('grc-stamp:processedBlock'))
      || Number(config.START_BLOCK);
  }

  public async scrape(): Promise<void> {
    await this.readBlockInfo();

    // Get current block number
    const info = await rpc.getMiningInfo();
    const { blocks } = info;
    let steps = config.BLOCK_GROUPS;
    if (this.currentBlock + steps > blocks) {
      steps = blocks - this.currentBlock;
    }
    for (let i = 0; i < steps; i++) {
      await this.getNextBlock();
    }
  }

  private async getNextBlock() {
    await this.readBlockInfo();
    const block = await rpc.getBlockByNumber(this.currentBlock + 1, true);
    // go through transactions
    const { tx: txs } = block;
    // console.log(txs);
    txs.forEach((tx) => {
      // console.log(JSON.stringify(tx, null, 2));
      const TXID = tx.txid;
      // looking for the vout
      const { vout: vouts } = tx;
      // looping through all vouts, looking for the specific data (OP_RETURN)
      vouts.forEach((vout) => {
        const script = vout.scriptPubKey;
        // we have asm, we can easy match
        const re = new RegExp(`^OP_RETURN ${PREFIX}`);
        if (re.test(script.asm)) {
          console.log('We have found this motherfucker');
          console.log(script.asm, TXID);
          // Now use protocol and parse result, translate it to the stamp object
          // then compare the result with database results
          // if record exists, update it
          // if record doesn't exists - create it
          // (because someone else could have created the transaction using my protocol)
        }
      });
    });
    // we have parsed the block
  }
}
