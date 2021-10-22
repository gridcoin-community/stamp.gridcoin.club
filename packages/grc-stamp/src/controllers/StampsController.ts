import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { stamps, StampsType } from '@prisma/client';
// import { ValidationResult } from 'joi';
import yayson from 'yayson';
import { StampPresenter } from '../presenters/stamp.presenter';
// import { PresenterInterface } from '../presenters/types';
import { StampsRepository } from '../repositories/StampsRepository';
import { Controller } from './BaseController';
import { Stamp } from '../models/Stamp';
import { StampData, StampInput, StampSchema } from './schemas/StampSchema';
import { ErrorModel } from '../models/Error';
import { WalletRepository } from '../repositories/WalletRepository';
import { config } from '../config';

const { Store } = yayson();
export class StampsController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private repository = StampsRepository,
    private walletRepository = WalletRepository,
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
    // Check wallet balance
    try {
      const balance = await this.walletRepository.getBalance();
      if (balance < Number(config.MINIMUM_WALLET_AMOUNT)) {
        // insufficient funds
        this.res.status(HttpStatus.NOT_ACCEPTABLE).send({
          errors: [
            new ErrorModel(
              HttpStatus.NOT_ACCEPTABLE,
              'Insufficient Funds',
            ),
          ],
        });
        return;
      }
    } catch (e) {
      console.error(e);
      this.res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        errors: [
          new ErrorModel(
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
          ),
        ],
      });
      return;
    }
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

    // Find existing record
    const existing = await this.repository.getByHash(data.hash, data.hashType as StampsType);
    if (existing) {
      this.res
        .status(HttpStatus.OK)
        .send(this.render<stamps>(existing));
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
