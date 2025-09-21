import yayson from 'yayson';
import { Wallet } from '../models/Wallet';
import { Attributes, EntityType, PresenterInterface } from './types';

const { Presenter } = yayson();

export class WalletPresenter extends Presenter implements PresenterInterface {
  public static type = EntityType.WALLET;

  public selfLinks(): string {
    return '/wallet/';
  }

  public attributes(instanse: Wallet): Attributes {
    return {
      address: instanse.address,
      balance: instanse.balance,
      block: instanse.block,
    };
  }

  public id(instance: Wallet): string {
    return instance.address;
  }
}
