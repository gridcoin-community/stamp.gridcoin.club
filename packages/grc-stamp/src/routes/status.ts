import { Request, Response, Router } from 'express';
import { existsSync } from 'fs';
import { ServiceInfo, StatusController } from '../controllers/StatusController';
import packageJson from '../../package.json';

export const statusRouter = Router();

const info: Omit<ServiceInfo, 'maintenance'> = {
  name: packageJson.name,
  version: packageJson.version,
};

// GET /status
statusRouter.get('/', async (req: Request, res: Response) => {
  const controller = new StatusController(req, res);
  // Maintenance mmust be checked every time this endpoint gets called
  const fullInfo: ServiceInfo = {
    ...info,
    maintenance: !!existsSync('.maintenance'),
  };
  return controller.getStatus(fullInfo);
});
