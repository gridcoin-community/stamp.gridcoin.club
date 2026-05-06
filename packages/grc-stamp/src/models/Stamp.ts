import { TX } from 'gridcoin-rpc/dist/types';
import { db } from '../lib/db';
import { log } from '../lib/log';
import { StampsType } from '../lib/database';

export class Stamp {
  public protocol!: string;

  public type!: StampsType;

  public hash!: string;

  public block!: number;

  public tx!: TX;

  public rawTransaction!: string;

  public time!: number;

  public createdAt!: Date;

  public updatedAt!: Date;

  public async saveOrUpdate(): Promise<void> {
    // Try to find existing one
    const result = await db
      .selectFrom('stamps')
      .select(['id', 'block'])
      .where('protocol', '=', this.protocol)
      .where('hash', '=', this.hash)
      .where('tx', '=', this.tx)
      .executeTakeFirst();

    if (result && result.id && result.block === null) {
      log.info('Update existing record');
      await db
        .updateTable('stamps')
        .set({
          block: BigInt(this.block),
          raw_transaction: this.rawTransaction,
          time: this.time,
        })
        .where('id', '=', result.id)
        .execute();
      return;
    }

    if (!result || !result.id) {
      log.info('Create new record');
      await db
        .insertInto('stamps')
        .values({
          protocol: this.protocol,
          hash: this.hash,
          type: this.type,
          block: BigInt(this.block),
          raw_transaction: this.rawTransaction,
          time: this.time,
          tx: this.tx,
        })
        .execute();
    }
  }
}
