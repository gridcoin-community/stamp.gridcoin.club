import { EventEmitter } from 'node:stream';
import { StampsRepository } from '../repositories/StampsRepository';
import { IndexerStatusEvent, PendingCountEvent } from '../types';
import { BACKFILL_THRESHOLD_BLOCKS } from '../constants';
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

export function emitIndexerStatus(indexerBlock: number, chainTip: number): void {
  const lag = Math.max(0, chainTip - indexerBlock);
  const event: IndexerStatusEvent = {
    type: 'indexerStatus',
    data: {
      indexerBlock,
      chainTip,
      lag,
      isBackfilling: lag > BACKFILL_THRESHOLD_BLOCKS,
    },
  };
  getEmitter().emit('indexerStatus', event);
}
