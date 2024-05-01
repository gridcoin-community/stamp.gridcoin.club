import yayson from 'yayson';
import { Attributes, EntityType, PresenterInterface } from './types';

const { Presenter } = yayson();

export class BalancePresenter extends Presenter implements PresenterInterface {
  public static type = EntityType.BALANCE;

  public selfLinks(): string {
    return '/wallet/balance';
  }

  public attributes(instance: number): Attributes {
    return {
      balance: instance,
    };
  }
}
