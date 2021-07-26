import { Request, Response, Router } from 'express';
import { StampsController } from '../controllers/StampsController';

export const stampsRouter = Router();

stampsRouter.get('/', async (req: Request, res: Response) => {
  const controller = new StampsController(req, res);
  return controller.listStamps();
});

stampsRouter.get('/:id', async (req: Request, res: Response) => {
  const controller = new StampsController(req, res);
  return controller.getById(Number(req.params.id));
});
