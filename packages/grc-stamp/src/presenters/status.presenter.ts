import yayson from 'yayson';
import { PresenterInterface } from './types';

const { Presenter } = yayson();

export class StatusPresenter extends Presenter implements PresenterInterface {}

StatusPresenter.prototype.type = 'status';
