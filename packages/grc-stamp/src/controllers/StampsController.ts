import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { Prisma, stamps, StampsType } from '@prisma/client';
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
import { MINIMUM, MIN_FEE } from '../constants';
import { config } from '../config';
import { log } from '../lib/log';
import { withHashLock } from '../lib/hashLock';
import { emitPendingCount } from '../lib/emitter';

const { Store } = yayson();
export class StampsController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private repository = StampsRepository,
    private walletRepository = WalletRepository,
    protected model = new Stamp(),
    protected presenter = StampPresenter,
  ) {
    super(req, res);
    this.init();
  }

  public async getById(id: number): Promise<void> {
    try {
      const opts = {
        fields: this.useFields,
      };
      const bigId = BigInt(id);
      const result = await this.repository.getById(bigId, opts);
      if (!result) {
        log.debug(`Cannot find record with id: ${id}`);
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
      log.error(e);
      // Bad filter/sort/field values produce a Prisma validation error — return
      // 400 so callers see "your query is malformed" instead of a mystery 404.
      if (e instanceof Prisma.PrismaClientValidationError) {
        this.res.status(HttpStatus.BAD_REQUEST).send({
          errors: [
            new ErrorModel(
              HttpStatus.BAD_REQUEST,
              'Invalid query parameters',
            ),
          ],
        });
        return;
      }
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
      const [balance, pendingCount] = await Promise.all([
        this.walletRepository.getBalance(),
        this.repository.countPending(),
      ]);
      const costPerTx = MINIMUM + MIN_FEE;
      // +1 accounts for the stamp we're about to create
      const pendingCost = Math.ceil((pendingCount + 1) / 2) * costPerTx;
      const effectiveBalance = balance - pendingCost;
      if (effectiveBalance < Number(config.MINIMUM_WALLET_AMOUNT)) {
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
      log.error(e);
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
    } catch (e) {
      const message = e instanceof Error && e.message
        ? e.message
        : HttpStatus.getStatusText(HttpStatus.BAD_REQUEST);
      this.res
        .status(HttpStatus.BAD_REQUEST)
        .send({
          errors: [new ErrorModel(HttpStatus.BAD_REQUEST, message)],
        });
      return;
    }

    const hashType = data.hashType
      ? data.hashType as StampsType
      : StampsType.sha256;

    // Serialize check+insert per hash to prevent duplicate stamps from
    // concurrent requests. Different hashes still proceed in parallel.
    await withHashLock(`${data.hash}:${hashType}`, async () => {
      const existing = await this.repository.getByHash(data.hash, hashType);
      if (existing) {
        this.res
          .status(HttpStatus.OK)
          .send(this.render<stamps>(existing));
        return;
      }

      try {
        const result = await this.repository.createStamp(data.hash, hashType);
        this.res
          .status(HttpStatus.CREATED)
          .send(this.render<stamps>(result));

        emitPendingCount();
      } catch (e) {
        log.error(e);
        this.res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          errors: [
            new ErrorModel(
              HttpStatus.INTERNAL_SERVER_ERROR,
              HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
            ),
          ],
        });
      }
    });
  }
}
