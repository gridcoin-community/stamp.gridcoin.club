import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { WalletController } from './WalletController';
import { WalletRepositoryClass } from '../repositories/WalletRepository';

describe('WalletController', () => {
  let req: Request;
  let res: Response;
  let walletRepository: {
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
    walletRepository = {
      getWalletInfo: jest.fn(),
      getBalance: jest.fn(),
    };
    controller = new WalletController(
      req,
      res,
      walletRepository as unknown as WalletRepositoryClass,
      // balancePresenterMock as unknown as BalancePresenter,
      // walletPresenterMock as unknown as WalletPresenter,
    );
  });

  describe('getWalletInfo', () => {
    it('should return 200 and the wallet info if found', async () => {
      const walletInfo = { id: 1, balance: 100 };
      walletRepository.getWalletInfo.mockResolvedValue(walletInfo);

      await controller.getWalletInfo();

      expect(walletRepository.getWalletInfo).toHaveBeenCalled();
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
      walletRepository.getWalletInfo.mockRejectedValue(error);

      await controller.getWalletInfo();

      expect(walletRepository.getWalletInfo).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            title: 'Internal Server Error',
          }),
        ],
      });
    });
  });

  describe('getBalance', () => {
    it('should return 200 and the balance if found', async () => {
      const balance = { amount: 100 };
      walletRepository.getBalance.mockResolvedValue(balance);

      await controller.getBalance();

      expect(walletRepository.getBalance).toHaveBeenCalled();
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
      walletRepository.getBalance.mockRejectedValue(error);

      await controller.getBalance();

      expect(walletRepository.getBalance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            title: 'Internal Server Error',
          }),
        ],
      });
    });
  });
});
