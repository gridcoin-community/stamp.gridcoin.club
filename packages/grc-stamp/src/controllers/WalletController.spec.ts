import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { WalletController } from './WalletController';
import { WalletServiceClass } from '../services/WalletService';

describe('WalletController', () => {
  let req: Request;
  let res: Response;
  let walletService: {
    getWalletInfo: jest.Mock;
    getBalance: jest.Mock;
  };
  let controller: WalletController;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    walletService = {
      getWalletInfo: jest.fn(),
      getBalance: jest.fn(),
    };
    controller = new WalletController(
      req,
      res,
      walletService as unknown as WalletServiceClass,
    );
  });

  describe('getWalletInfo', () => {
    it('should return 200 and the wallet info if found', async () => {
      const walletInfo = { id: 1, balance: 100 };
      walletService.getWalletInfo.mockResolvedValue(walletInfo);

      await controller.getWalletInfo();

      expect(walletService.getWalletInfo).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          attributes: expect.objectContaining({
            balance: 100,
          }),
        }),
      }));
    });

    it('should return 500 if an error occurs', async () => {
      const error = new Error('Database error');
      walletService.getWalletInfo.mockRejectedValue(error);

      await controller.getWalletInfo();

      expect(walletService.getWalletInfo).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            title: 'Internal Server Error',
          }),
        ]),
      }));
    });
  });

  describe('getBalance', () => {
    it('should return 200 and the balance if found', async () => {
      const balance = { amount: 100 };
      walletService.getBalance.mockResolvedValue(balance);

      await controller.getBalance();

      expect(walletService.getBalance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          attributes: expect.objectContaining({
            balance: expect.objectContaining({
              amount: 100,
            }),
          }),
        }),
      }));
    });

    it('should return 500 if an error occurs', async () => {
      const error = new Error('Database error');
      walletService.getBalance.mockRejectedValue(error);

      await controller.getBalance();

      expect(walletService.getBalance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            title: 'Internal Server Error',
          }),
        ]),
      }));
    });
  });
});
