import { Request, Response } from 'express';
import { Controller } from './BaseController';
import { EventsService, EventsServiceClass } from '../services/EventsService';
import { log } from '../lib/log';

export class EventsController extends Controller {
  private service: EventsServiceClass;

  public constructor(
    req: Request,
    res: Response,
  ) {
    super(req, res);
    this.init();
    this.service = EventsService;
  }

  public async subscribe(): Promise<void> {
    log.debug('[EventsController] Creating new subscription');
    this.res.setHeader('Content-Type', 'text/event-stream');
    this.res.setHeader('Connection', 'keep-alive');
    this.res.setHeader('Cache-Control', 'no-cache');
    this.res.flushHeaders();

    const clientId = this.service.addClient(this.res);
    log.debug(`[EventsController] Client ${clientId} connected`);

    this.req.on('close', () => {
      log.debug(`[EventsController] ${clientId} Connection closed`);
      this.service.removeClient(clientId);
    });
  }
}
