import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { StatusController } from './StatusController';
import { StatusPresenter } from '../presenters/status.presenter';

jest.mock('../models/Error');
jest.mock('../presenters/status.presenter');

describe('StatusController', () => {
  let req: Request;
  let res: Response;
  let controller: StatusController;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    controller = new StatusController(req, res);
  });

  describe('getStatus', () => {
    const serviceInfo = {
      name: 'Test Service',
      version: '1.0.0',
      maintenance: false,
    };

    it('should return 200 and the service info if no errors', () => {
      const renderMock = jest.fn().mockReturnValue(serviceInfo);
      (StatusPresenter.render as jest.Mock) = renderMock;

      controller.getStatus(serviceInfo);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(serviceInfo);
    });
  });
});
