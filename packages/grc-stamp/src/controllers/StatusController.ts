import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { ErrorModel } from '../models/Error';
import { StatusPresenter } from '../presenters/status.presenter';
import { PresenterInterface } from '../presenters/types';

export interface ServiceInfo {
  name: string,
  version: string,
}

export class StatusController {
  private presenter: PresenterInterface;

  private model: typeof ErrorModel;

  protected req: Request;

  protected res: Response;

  constructor(req: Request, res: Response) {
    this.presenter = StatusPresenter;
    this.model = ErrorModel;
    this.req = req;
    this.res = res;
  }

  public getStatus(serviceInfo: ServiceInfo): void {
    const errors = [];
    if (!errors.length) {
      this.res
        .status(HttpStatus.OK)
        .send(this.presenter.render(serviceInfo));
    } else {
      this.res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ errors });
    }
  }
}
