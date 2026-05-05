import { Request, Response, Router } from 'express';
import { StampsController } from '../controllers/StampsController';
import { rateLimit } from '../lib/rateLimit';

export const stampsRouter = Router();

// 90 req/min/IP is generous for legitimate use (frontend submit, GitHub
// Action burst on a release with several assets) and well below the rate
// needed to drain the wallet via flood. See lib/rateLimit.ts for the caveat
// about X-Forwarded-For spoofing.
const createStampLimiter = rateLimit({ windowMs: 60_000, max: 90 });

stampsRouter.get('/', async (req: Request, res: Response) => {
  const controller = new StampsController(req, res);
  return controller.listStamps();
});

stampsRouter.get('/:id', async (req: Request, res: Response) => {
  const controller = new StampsController(req, res);
  return controller.getById(Number(req.params.id));
});

stampsRouter.post('/', createStampLimiter, async (req: Request, res: Response) => {
  const controller = new StampsController(req, res);
  return controller.createStamp(req.body);
});
