import { Request, Response } from 'express';
import { HashController } from './HashController';

// jest.mock('../repositories/StampsRepository');
jest.mock('../models/Stamp');
jest.mock('.prisma/client');

describe('HashController', () => {
  let req: Request;
  let res: Response;
  let stampsRepository: {
    getByHash: jest.Mock;
  };
  const stampMock = jest.fn();

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    stampsRepository = {
      getByHash: jest.fn(),
    };
  });

  describe('getById', () => {
    it('should return 200 and the stamp data if found', async () => {
      const hash = 'validHash';
      const stampData = { id: 1, hash: 'validHash' };
      stampsRepository.getByHash.mockResolvedValue(stampData);

      const controller = new HashController(
        req,
        res,
        stampsRepository as any,
        stampMock as any,
      );
      await controller.getById(hash);

      expect(stampsRepository.getByHash).toHaveBeenCalledWith(hash);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          attributes: expect.objectContaining({
            hash: 'validHash',
          }),
          id: '1',
        }),
      }));
    });

    it('should return 404 if the stamp is not found', async () => {
      const hash = 'invalidHash';
      stampsRepository.getByHash.mockResolvedValue(null);

      const controller = new HashController(
        req,
        res,
        stampsRepository as any,
        stampMock as any,
      );
      await controller.getById(hash);

      expect(stampsRepository.getByHash).toHaveBeenCalledWith(hash);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: 404,
            title: 'Not Found',
          }),
        ],
      });
    });

    it('should return 404 and log an error if an exception occurs', async () => {
      const hash = 'errorHash';
      const error = new Error('Database error');
      stampsRepository.getByHash.mockRejectedValue(error);

      const controller = new HashController(
        req,
        res,
        stampsRepository as any,
        stampMock as any,
      );
      await controller.getById(hash);

      expect(stampsRepository.getByHash).toHaveBeenCalledWith(hash);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        errors: [
          expect.objectContaining({
            status: 404,
            title: 'Not Found',
          }),
        ],
      });
    });
  });
});
