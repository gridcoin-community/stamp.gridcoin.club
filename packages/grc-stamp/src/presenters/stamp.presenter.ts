import yayson from 'yayson';
import { Stamp } from '../lib/database';
import { Attributes, EntityType, PresenterInterface } from './types';

const { Presenter } = yayson();

export class StampPresenter extends Presenter implements PresenterInterface {
  static type = EntityType.STAMPS;

  public selfLinks(instance: Stamp): string {
    return `/stamps/${this.id(instance)}`;
  }

  public attributes(instanse: Stamp): Attributes {
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

  public id(instance: Stamp): string {
    return instance.id.toString();
  }
}
