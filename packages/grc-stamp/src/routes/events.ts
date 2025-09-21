import { Request, Response, Router } from 'express';
import { EventsController } from '../controllers/EventsController';

export const eventsRouter = Router();

eventsRouter.get('/', async (req: Request, res: Response) => {
  const controller = new EventsController(req, res);
  return controller.subscribe();
});
