import { PrismaClient, StampsType } from '@prisma/client';
import { TX } from 'gridcoin-rpc/dist/types';

export class Stamp {
  public protocol: string;

  public type: StampsType;

  public hash: string;

  public block: number;

  public tx: TX;

  public rawTransaction: string;

  public time: number;

  constructor(private prisma = new PrismaClient()) {}

  public async saveOrUpdate(): Promise<any> {
    // Try to find existing one
    const result = await this.prisma.stamps.findFirst({
      where: {
        protocol: this.protocol,
        hash: this.hash,
        tx: this.tx,
      },
    });
    if (result && result.id && result.block === null) {
      console.log('Update existing record');
      return this.prisma.stamps.update({
        where: {
          id: result.id,
        },
        data: {
          block: this.block,
          raw_transaction: this.rawTransaction,
          time: this.time,
        },
      });
    }
    if (!result || !result.id) {
      console.log('Create new record');
      return this.prisma.stamps.create({
        data: {
          protocol: this.protocol,
          hash: this.hash,
          type: this.type,
          block: this.block,
          raw_transaction: this.rawTransaction,
          time: this.time,
          tx: this.tx,
        },
      });
    }
    return Promise.resolve();
  }
}
