import { Request, Response, Router } from 'express';
import { IndexerStatusController } from '../controllers/IndexerStatusController';

export const indexerRouter = Router();

indexerRouter.get('/status', async (req: Request, res: Response) => {
  const controller = new IndexerStatusController(req, res);
  return controller.getStatus();
});
