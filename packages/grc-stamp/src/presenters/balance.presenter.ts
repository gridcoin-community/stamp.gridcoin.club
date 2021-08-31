import yayson from 'yayson';
import { Attributes } from './types';

const { Presenter } = yayson();

export class BalancePresenter extends Presenter {
  public selfLinks(): string {
    return '/wallet/balance';
  }

  public attributes(instance: number): Attributes {
    return {
      balance: instance,
    };
  }
}

BalancePresenter.prototype.type = 'balance';
