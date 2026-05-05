import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ErrorModel } from '../models/Error';

interface Bucket {
  count: number;
  resetAt: number;
}

interface Options {
  windowMs: number;
  max: number;
}

/**
 * Tiny in-process per-IP fixed-window limiter. Aimed at "obvious DDoS" —
 * bursts that flood the wallet-budget check or the DB. A determined attacker
 * who rotates X-Forwarded-For will get past it; do real per-IP throttling at
 * Cloudflare or nginx for that.
 *
 * Resets at fixed 60s boundaries per IP. Map entries are reaped lazily on
 * subsequent hits, plus a periodic sweep so idle IPs don't linger forever.
 */
export function rateLimit({ windowMs, max }: Options) {
  const buckets = new Map<string, Bucket>();

  // Periodic sweep so an idle Map doesn't grow unbounded under sustained
  // unique-IP traffic. `unref` keeps it from holding the event loop open
  // during shutdown.
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((bucket, ip) => {
      if (bucket.resetAt <= now) buckets.delete(ip);
    });
  }, windowMs).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();
    let bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(ip, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
      res
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .send({
          errors: [
            new ErrorModel(
              HttpStatus.TOO_MANY_REQUESTS,
              HttpStatus.getStatusText(HttpStatus.TOO_MANY_REQUESTS),
            ),
          ],
        });
      return;
    }
    next();
  };
}
