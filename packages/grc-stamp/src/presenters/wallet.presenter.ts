import yayson from 'yayson';
import { Wallet } from '../models/Wallet';
import { Attributes } from './types';

const { Presenter } = yayson();

export class WalletPresenter extends Presenter {
  public selfLinks(): string {
    return '/wallet/';
  }

  public attributes(instanse: Wallet): Attributes {
    return {
      address: instanse.address,
      balance: instanse.balance,
    };
  }

  public id(instance: Wallet): string {
    return instance.address;
  }
}

WalletPresenter.prototype.type = 'wallet';
