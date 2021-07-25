import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { stamps } from '@prisma/client';
import { StampPresenter } from '../presenters/stamp.presenter';
// import { PresenterInterface } from '../presenters/types';
import { StampsRepository } from '../repositories/StampsRepository';
import { Controller } from './BaseController';

export class StampsController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private repository = StampsRepository,
  ) {
    super(req, res);
    this.presenter = StampPresenter;
    this.init();
  }

  public async listStamps(): Promise<void> {
    try {
      const opts = {
        pagination: this.usePagination,
        sort: this.useSort,
        fields: this.useFields,
      };
      const results = await this.repository.listStamps(opts);
      this.res
        .status(HttpStatus.OK)
        .send(this.render<stamps>(results));
    } catch (e) {
      console.error(e);
    }
  }
}
