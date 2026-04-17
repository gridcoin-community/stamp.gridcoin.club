import { EventEmitter } from 'node:stream';
import { StampsRepository } from '../repositories/StampsRepository';
import { PendingCountEvent } from '../types';
import { log } from './log';

let emitter: EventEmitter;

export function getEmitter() {
  if (!emitter) {
    emitter = new EventEmitter();
  }
  return emitter;
}

/**
 * Query the current in-progress count and broadcast it on the emitter.
 * Fire-and-forget: errors are logged and swallowed so callers don't have to.
 */
export function emitPendingCount(): void {
  StampsRepository.countInProgress()
    .then((count) => {
      const event: PendingCountEvent = { type: 'pendingCount', data: { count } };
      getEmitter().emit('pendingCount', event);
    })
    .catch((err) => log.error(err));
}
