import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Controller } from './BaseController';
import { EventsService } from '../services/EventsService';
import { log } from '../lib/log';
import { ErrorModel } from '../models/Error';

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
    const ip = this.req.ip ?? 'unknown';
    const clientId = this.service.addClient(this.res, ip);
    if (!clientId) {
      this.res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .send({
          errors: [
            new ErrorModel(
              HttpStatus.SERVICE_UNAVAILABLE,
              'Too many active subscriptions',
            ),
          ],
        });
      return;
    }

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

    log.debug(`[EventsController] Client ${clientId} connected from ${ip}`);

    this.req.on('close', () => {
      log.debug(`[EventsController] ${clientId} Connection closed`);
      this.service.removeClient(clientId);
    });
  }
}
