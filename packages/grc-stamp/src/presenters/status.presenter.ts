import yayson from 'yayson';
import { EntityType } from './types';

const { Presenter } = yayson();

export class StatusPresenter extends Presenter {
  public static type = EntityType.STATUS;
}
