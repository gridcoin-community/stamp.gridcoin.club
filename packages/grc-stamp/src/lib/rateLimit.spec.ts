import { rateLimit } from './rateLimit';

function makeReqRes(ip: string) {
  const req: any = { ip };
  const headers: Record<string, string | number> = {};
  let statusCode: number | undefined;
  let body: any;
  const res: any = {
    setHeader: (k: string, v: string | number) => { headers[k] = v; },
    status(code: number) { statusCode = code; return this; },
    send(payload: any) { body = payload; return this; },
  };
  return {
    req,
    res,
    next: jest.fn(),
    get: () => ({ statusCode, headers, body }),
  };
}

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 3 });
    const ip = '1.2.3.4';

    for (let i = 0; i < 3; i++) {
      const ctx = makeReqRes(ip);
      limiter(ctx.req, ctx.res, ctx.next);
      expect(ctx.next).toHaveBeenCalledTimes(1);
      expect(ctx.get().statusCode).toBeUndefined();
    }
  });

  it('blocks the request after the limit and emits Retry-After', () => {
    const limiter = rateLimit({ windowMs: 60_000, max: 2 });
    const ip = '1.2.3.4';

    for (let i = 0; i < 2; i++) {
      const ctx = makeReqRes(ip);
      limiter(ctx.req, ctx.res, ctx.next);
    }

    const ctx = makeReqRes(ip);
    limiter(ctx.req, ctx.res, ctx.next);

    expect(ctx.next).not.toHaveBeenCalled();
    expect(ctx.get().statusCode).toBe(429);
    expect(ctx.get().headers['Retry-After']).toBeGreaterThan(0);
  });

  it('isolates buckets by IP', () => {
    const limiter = rateLimit({ windowMs: 60_000, max: 1 });

    const a1 = makeReqRes('1.1.1.1');
    limiter(a1.req, a1.res, a1.next);
    expect(a1.next).toHaveBeenCalled();

    const b1 = makeReqRes('2.2.2.2');
    limiter(b1.req, b1.res, b1.next);
    expect(b1.next).toHaveBeenCalled();

    const a2 = makeReqRes('1.1.1.1');
    limiter(a2.req, a2.res, a2.next);
    expect(a2.next).not.toHaveBeenCalled();
    expect(a2.get().statusCode).toBe(429);
  });

  it('resets the bucket once the window has elapsed', async () => {
    const limiter = rateLimit({ windowMs: 25, max: 1 });
    const ip = '1.2.3.4';

    const first = makeReqRes(ip);
    limiter(first.req, first.res, first.next);
    expect(first.next).toHaveBeenCalled();

    const second = makeReqRes(ip);
    limiter(second.req, second.res, second.next);
    expect(second.get().statusCode).toBe(429);

    await new Promise((r) => { setTimeout(r, 40); });

    const third = makeReqRes(ip);
    limiter(third.req, third.res, third.next);
    expect(third.next).toHaveBeenCalled();
    expect(third.get().statusCode).toBeUndefined();
  });
});
