import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { stamps, StampsType } from '@prisma/client';
import { NOTFOUND } from 'dns';
import { ValidationResult } from 'joi';
import yayson from 'yayson';
import { StampPresenter } from '../presenters/stamp.presenter';
// import { PresenterInterface } from '../presenters/types';
import { StampsRepository } from '../repositories/StampsRepository';
import { Controller } from './BaseController';
import { Stamp } from '../models/Stamp';
import { StampData, StampInput, StampSchema } from './schemas/StampSchema';
import { ErrorModel } from '../models/Error';

const { Store } = yayson();
export class StampsController extends Controller {
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

  public async getById(id: number): Promise<void> {
    try {
      const opts = {
        fields: this.useFields,
      };
      const bigId = BigInt(id);
      const result = await this.repository.getById(bigId, opts);
      this.res
        .status(HttpStatus.OK)
        .send(this.render<stamps>(result));
    } catch (e) {
      console.error(e);
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

  public async listStamps(): Promise<void> {
    try {
      const opts = {
        pagination: this.usePagination,
        sort: this.useSort,
        fields: this.useFields,
        filters: this.useFilters,
      };
      const results = await this.repository.listStamps(opts);
      this.res
        .status(HttpStatus.OK)
        .send(this.render<stamps>(results));
    } catch (e) {
      console.error(e);
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

  public async createStamp(input: StampInput): Promise<void> {
    const store = new Store();
    let data: StampData;
    try {
      data = store.sync(input);
      const result = StampSchema.validate(data);
      if (result.error && result.error.details) {
        throw new Error(result.error.details[0].message);
      }
    } catch (_e) {
      this.res
        .status(HttpStatus.BAD_REQUEST)
        .send({
          errors: [
            new ErrorModel(
              HttpStatus.BAD_REQUEST,
              _e.message
                ? _e.message
                : HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
            ),
          ],
        });
      return;
    }
    const result = await this.repository.createStamp(
      data.hash,
      data.hashType
        ? data.hashType as StampsType
        : StampsType.sha256,
    );
    this.res
      .status(HttpStatus.CREATED)
      .send(this.render<stamps>(result));
  }
}
