import { Request, Response, Router } from 'express';
import { ServiceInfo, StatusController } from '../controllers/StatusController';
import packageJson from '../../package.json';

export const statusRouter = Router();

const info: ServiceInfo = {
  name: packageJson.name,
  version: packageJson.version,
};

// GET /status
statusRouter.get('/', async (req: Request, res: Response) => {
  const controller = new StatusController(req, res);
  return controller.getStatus(info);
});
