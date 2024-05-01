import { stamps } from '@prisma/client';
import yayson from 'yayson';
import { Attributes, EntityType, PresenterInterface } from './types';

const { Presenter } = yayson();

export class StampPresenter extends Presenter implements PresenterInterface {
  static type = EntityType.STAMPS;

  public selfLinks(instance: stamps): string {
    return `/stamps/${this.id(instance)}`;
  }

  public attributes(instanse: stamps): Attributes {
    return {
      protocol: instanse.protocol,
      type: instanse.type,
      hash: instanse.hash,
      block: instanse.block ? Number(instanse.block.toString()) : undefined,
      tx: instanse.tx,
      rawTransaction: instanse.raw_transaction,
      time: instanse.time,
      createdAt: instanse.created_at,
      updatedAt: instanse.updated_at,
    };
  }

  public id(instance: stamps): string {
    return instance.id.toString();
  }
}
