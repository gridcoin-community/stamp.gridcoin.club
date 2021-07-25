import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
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
      const results = await this.repository.listStamps();
      this.res
        .status(HttpStatus.OK)
        .send(this.presenter.render(results));
    } catch (e) {
      console.error(e);
    }
  }
}
