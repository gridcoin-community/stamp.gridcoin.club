/**
 * A minimal in-process sliding-window rate limiter.
 *
 * This is defense-in-depth for stamp_document: every stamp burns real GRC from
 * a shared service wallet, so a runaway or looping agent must not be able to
 * drain it. The grc-stamp backend already rate-limits per IP, but a local stdio
 * server shares the user's IP, so we also cap submissions here.
 */
export class RateLimiter {
  private readonly hits: number[] = [];

  constructor(private readonly max: number, private readonly windowMs: number = 60_000) {}

  /**
   * Attempt to consume one slot. Returns whether it was granted, and — when
   * denied — how many seconds until the oldest hit ages out of the window.
   */
  tryAcquire(now: number = Date.now()): { allowed: boolean; retryAfterSeconds?: number } {
    while (this.hits.length > 0 && now - this.hits[0] >= this.windowMs) {
      this.hits.shift();
    }
    if (this.hits.length >= this.max) {
      const retryAfterMs = this.windowMs - (now - this.hits[0]);
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
    }
    this.hits.push(now);
    return { allowed: true };
  }
}
