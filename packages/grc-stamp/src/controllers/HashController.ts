import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { stamps } from '.prisma/client';
import { Stamp } from '../models/Stamp';
import { StampPresenter } from '../presenters/stamp.presenter';
import { StampsRepository } from '../repositories/StampsRepository';
import { Controller } from './BaseController';
import { log } from '../lib/log';
import { ErrorModel } from '../models/Error';

export class HashController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private repository = StampsRepository,
  ) {
    super(req, res);
    this.presenter = StampPresenter;
    this.model = new Stamp();
    this.init();
  }

  public async getById(hash: string): Promise<void> {
    try {
      const result = await this.repository.getByHash(hash);
      if (!result) {
        log.debug(`Cannot find record with hash: ${hash}`);
        throw new Error('Record not found');
      }
      this.res
        .status(HttpStatus.OK)
        .send(this.render<stamps>(result));
    } catch (e) {
      log.error(e);
      this.res.status(HttpStatus.NOT_FOUND).send({
        errors: [
          new ErrorModel(
            HttpStatus.NOT_FOUND,
            HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
          ),
        ],
      });
    }
  }
}
