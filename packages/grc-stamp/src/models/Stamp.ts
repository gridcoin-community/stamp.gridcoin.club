import { PrismaClient, StampsType, stamps } from '@prisma/client';
import { TX } from 'gridcoin-rpc/dist/types';
import { log } from '../lib/log';
import { GenericInterface } from './Generic';

export class Stamp implements GenericInterface {
  public protocol: string;

  public type: StampsType;

  public hash: string;

  public block: number;

  public tx: TX;

  public rawTransaction: string;

  public time: number;

  public createdAt: Date;

  public updatedAt: Date;

  public attributes = [
    'protocol',
    'type',
    'hash',
    'block',
    'tx',
    'rawTransaction',
    'time',
    'createdAt',
    'updatedAt',
  ];

  constructor(public model = (new PrismaClient()).stamps) {}

  public async saveOrUpdate(): Promise<any> {
    // Try to find existing one
    const result = await this.model.findFirst({
      where: {
        protocol: this.protocol,
        hash: this.hash,
        tx: this.tx,
      },
    });
    if (result && result.id && result.block === null) {
      log.info('Update existing record');
      return this.model.update({
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
      log.info('Create new record');
      return this.model.create({
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
