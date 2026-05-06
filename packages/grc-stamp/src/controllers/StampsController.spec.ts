import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { StampsController } from './StampsController';
import { StampsRepositoryClass } from '../repositories/StampsRepository';
import { WalletRepositoryClass } from '../repositories/WalletRepository';
import { DEFAULT_PAGINATION_LIMIT } from './BaseController';
import { StampInput } from './schemas/StampSchema';

const validHash = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';

jest.mock('../repositories/WalletRepository');
jest.mock('../lib/db', () => ({ db: {} }));
jest.mock('../lib/emitter', () => ({
  getEmitter: () => ({ emit: jest.fn() }),
  emitPendingCount: jest.fn(),
}));

describe('StampsController', () => {
  let req: Request;
  let res: Response;
  let stampsRepository: {
    getById: jest.Mock;
    listStamps: jest.Mock;
    getByHash: jest.Mock;
    createStamp: jest.Mock;
    countPending: jest.Mock;
  };
  let walletRepository: {
    getBalance: jest.Mock;
  };
  let controller: StampsController;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    stampsRepository = {
      getById: jest.fn(),
      listStamps: jest.fn(),
      getByHash: jest.fn(),
      createStamp: jest.fn(),
      countPending: jest.fn().mockResolvedValue(0),
    };
    walletRepository = {
      getBalance: jest.fn(),
    };
    controller = new StampsController(
      req,
      res,
      stampsRepository as unknown as StampsRepositoryClass,
      walletRepository as unknown as WalletRepositoryClass,
    );
  });

  describe('getById', () => {
    it('should return 200 and the stamp data if found', async () => {
      const id = 1;
      const stampData = { id: 1, hash: validHash };
      stampsRepository.getById.mockResolvedValue(stampData);

      await controller.getById(id);

      expect(stampsRepository.getById).toHaveBeenCalledWith(
        BigInt(id),
        { fields: {} },
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          attributes: expect.objectContaining({
            hash: validHash,
          }),
          id: '1',
        }),
      }));
    });

    it('should return 404 if the stamp is not found', async () => {
      const id = 1;
      stampsRepository.getById.mockResolvedValue(null);

      await controller.getById(id);

      expect(stampsRepository.getById).toHaveBeenCalledWith(
        BigInt(id),
        { fields: {} },
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.NOT_FOUND,
            title: 'Not Found',
          }),
        ],
      });
    });

    it('should return 404 and log an error if an exception occurs', async () => {
      const id = 1;
      const error = new Error('Database error');
      stampsRepository.getById.mockRejectedValue(error);

      await controller.getById(id);

      expect(stampsRepository.getById).toHaveBeenCalledWith(
        BigInt(id),
        { fields: {} },
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.NOT_FOUND,
            title: 'Not Found',
          }),
        ],
      });
    });
  });

  describe('listStamps', () => {
    it('should return 200 and the list of stamps', async () => {
      const stampsData = [{ id: 1, hash: validHash }];
      stampsRepository.listStamps.mockResolvedValue(stampsData);

      await controller.listStamps();

      expect(stampsRepository.listStamps).toHaveBeenCalledWith({
        pagination: {
          limit: DEFAULT_PAGINATION_LIMIT,
        },
        sort: undefined,
        fields: {},
        filters: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            attributes: expect.objectContaining({
              hash: validHash,
            }),
            id: '1',
          }),
        ]),
      }));
    });

    it('should return 404 and log an error if an exception occurs', async () => {
      const error = new Error('Database error');
      stampsRepository.listStamps.mockRejectedValue(error);

      await controller.listStamps();

      expect(stampsRepository.listStamps).toHaveBeenCalledWith({
        pagination: {
          limit: DEFAULT_PAGINATION_LIMIT,
        },
        sort: undefined,
        fields: {},
        filters: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.NOT_FOUND,
            title: 'Not Found',
          }),
        ],
      });
    });
  });

  describe('createStamp', () => {
    const validInput: StampInput = {
      data: {
        type: 'stamps',
        attributes: {
          hash: validHash,
          hashType: 'sha256',
        },
      },
    };
    const validStampData = { id: 1, hash: validHash };

    it('should return 201 and the created stamp data if successful', async () => {
      walletRepository.getBalance.mockResolvedValue(100);
      stampsRepository.getByHash.mockResolvedValue(null);
      stampsRepository.createStamp.mockResolvedValue(validStampData);

      await controller.createStamp(validInput);

      expect(walletRepository.getBalance).toHaveBeenCalled();
      expect(stampsRepository.getByHash).toHaveBeenCalledWith(validHash, 'sha256');
      expect(stampsRepository.createStamp).toHaveBeenCalledWith(validHash, 'sha256');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          attributes: expect.objectContaining({
            hash: validHash,
          }),
          id: '1',
        }),
      }));
    });

    it('should return 406 if wallet balance is insufficient', async () => {
      walletRepository.getBalance.mockResolvedValue(0);

      await controller.createStamp(validInput);

      expect(walletRepository.getBalance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_ACCEPTABLE);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.NOT_ACCEPTABLE,
            title: 'Insufficient Funds',
          }),
        ],
      });
    });

    it('should return 406 if pending stamps exhaust the effective balance', async () => {
      // Balance is 2 GRC, but 2000 pending stamps need ~1 GRC to publish,
      // plus this new one pushes effective balance below MINIMUM_WALLET_AMOUNT (1)
      walletRepository.getBalance.mockResolvedValue(2);
      stampsRepository.countPending.mockResolvedValue(2000);

      await controller.createStamp(validInput);

      expect(stampsRepository.countPending).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_ACCEPTABLE);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.NOT_ACCEPTABLE,
            title: 'Insufficient Funds',
          }),
        ],
      });
    });

    it('should return 400 if input validation fails', async () => {
      const input = { data: { type: 'stamps', attributes: { hash: 'invalidHash' } } };
      walletRepository.getBalance.mockResolvedValue(100);

      await controller.createStamp(input);

      expect(walletRepository.getBalance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.BAD_REQUEST,
          }),
        ],
      });
    });

    it('should return 500 and log an error if an exception occurs', async () => {
      const error = new Error('Database error');
      walletRepository.getBalance.mockResolvedValue(100);
      stampsRepository.createStamp.mockRejectedValue(error);

      await controller.createStamp(validInput);

      expect(walletRepository.getBalance).toHaveBeenCalled();
      expect(stampsRepository.createStamp).toHaveBeenCalledWith(validHash, 'sha256');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          }),
        ],
      });
    });
  });
});
