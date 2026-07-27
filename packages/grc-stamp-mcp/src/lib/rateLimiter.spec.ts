import { describe, it, expect } from 'vitest';
import { RateLimiter } from './rateLimiter.js';

describe('RateLimiter', () => {
  it('allows up to max hits within the window, then denies', () => {
    const rl = new RateLimiter(2, 60_000);
    expect(rl.tryAcquire(1_000).allowed).toBe(true);
    expect(rl.tryAcquire(1_100).allowed).toBe(true);
    const denied = rl.tryAcquire(1_200);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('frees a slot once the oldest hit ages out of the window', () => {
    const rl = new RateLimiter(1, 60_000);
    expect(rl.tryAcquire(0).allowed).toBe(true);
    expect(rl.tryAcquire(30_000).allowed).toBe(false);
    // 60s after the first hit, the window has slid past it.
    expect(rl.tryAcquire(60_000).allowed).toBe(true);
  });

  it('reports retry-after as whole seconds, at least 1', () => {
    const rl = new RateLimiter(1, 60_000);
    rl.tryAcquire(0);
    const denied = rl.tryAcquire(59_500);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterSeconds).toBe(1);
  });
});
