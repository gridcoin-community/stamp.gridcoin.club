import type { Stamp } from './stampClient.js';

/**
 * A stamp is "confirmed" once it has been burned into a transaction and mined:
 * block, tx and time are all populated. Freshly-queued stamps have them null.
 */
export function isConfirmed(stamp: Stamp): boolean {
  return stamp.block != null && !!stamp.tx && stamp.time != null;
}

/** Format a unix-seconds timestamp as an unambiguous UTC string. */
export function formatUtc(unixSeconds: number): string {
  const iso = new Date(unixSeconds * 1000).toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}
