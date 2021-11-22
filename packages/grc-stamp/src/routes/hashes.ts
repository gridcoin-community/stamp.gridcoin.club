import { Request, Response, Router } from 'express';
import { HashController } from '../controllers/HashController';

export const hashesRouter = Router();

hashesRouter.get('/:hash', async (req: Request, res: Response) => {
  const controller = new HashController(req, res);
  return controller.getById(req.params.hash);
});
