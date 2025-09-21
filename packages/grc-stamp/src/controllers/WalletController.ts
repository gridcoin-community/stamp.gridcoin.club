import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { BalancePresenter } from '../presenters/balance.presenter';
import { WalletPresenter } from '../presenters/wallet.presenter';
import { Controller } from './BaseController';
import { ErrorModel } from '../models/Error';
import { log } from '../lib/log';
import { WalletService } from '../services/WalletService';

export class WalletController extends Controller {
  constructor(
    req: Request,
    res: Response,
    private service = WalletService,
    private balancePresenter = BalancePresenter,
    private walletPresenter = WalletPresenter,
  ) {
    super(req, res);
    this.init();
  }

  public async getWalletInfo(): Promise<void> {
    try {
      const wallet = await this.service.getWalletInfo();
      this.res
        .status(HttpStatus.OK)
        .send(this.render(wallet, this.walletPresenter));
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
  }

  public async getBalance(): Promise<void> {
    try {
      const balance = await this.service.getBalance();
      this.res
        .status(HttpStatus.OK)
        .send(this.render(balance, this.balancePresenter));
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
  }
}
