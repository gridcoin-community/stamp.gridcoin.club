import { Request, Response } from 'express';
import { Controller } from './BaseController';
import { EventsService } from '../services/EventsService';
import { log } from '../lib/log';

export class EventsController extends Controller {
  private service: EventsService;

  public constructor(
    req: Request,
    res: Response,
  ) {
    super(req, res);
    this.init();
    this.service = EventsService.getInstance();
  }

  public async subscribe(): Promise<void> {
    log.debug('[EventsController] Creating new subscription');
    this.res.setHeader('Content-Type', 'text/event-stream');
    this.res.setHeader('Connection', 'keep-alive');
    // no-transform tells intermediaries (Cloudflare, nginx) not to gzip; gzip
    // buffers the entire response and breaks the streaming model of SSE.
    this.res.setHeader('Cache-Control', 'no-cache, no-transform');
    // Belt-and-suspenders: force uncompressed body regardless of what the
    // caller's Accept-Encoding says.
    this.res.setHeader('Content-Encoding', 'identity');
    // nginx + Cloudflare honour this to disable per-response buffering —
    // without it they hold the response until a chunk boundary fills.
    this.res.setHeader('X-Accel-Buffering', 'no');
    this.res.flushHeaders();
    // Push a comment line immediately so any proxy that waits for the first
    // body byte before forwarding starts streaming now, not when the first
    // real event fires (which could be minutes later on a quiet chain).
    this.res.write(':ok\n\n');

    const clientId = this.service.addClient(this.res);
    log.debug(`[EventsController] Client ${clientId} connected`);

    this.req.on('close', () => {
      log.debug(`[EventsController] ${clientId} Connection closed`);
      this.service.removeClient(clientId);
    });
  }
}
