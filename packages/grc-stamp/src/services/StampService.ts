import { Kysely } from 'kysely';
import {
  MINIMUM, PREFIX, MIN_FEE,
} from '../constants';
import { rpc } from '../lib/gridcoin';
import { db as defaultDb } from '../lib/db';
import { Database } from '../lib/database';
import { log } from '../lib/log';
import { StampSubmittedEvent } from '../types';
import { emitPendingCount, getEmitter } from '../lib/emitter';

export class StampService {
  private publishing = false;

  constructor(private db: Kysely<Database> = defaultDb) {}

  public async publishStamp(): Promise<void> {
    // Re-entry guard: prevents overlapping ticks from double-burning fees.
    if (this.publishing) {
      log.info('[StampService] Previous publish run still in progress, skipping tick');
      return;
    }
    this.publishing = true;
    try {
      await this.publishStampInner();
    } finally {
      this.publishing = false;
    }
  }

  private async publishStampInner(): Promise<void> {
    // Drain until the queue is empty so burst load doesn't have to wait for
    // the next interval tick to make progress.
    let published = 0;
    let hasMore = true;
    while (hasMore) {
      const readyStamps = await this.db
        .selectFrom('stamps')
        .select(['id', 'hash'])
        .where('block', 'is', null)
        .where('tx', 'is', null)
        .where('raw_transaction', 'is', null)
        .where('time', 'is', null)
        .orderBy('id', 'asc')
        .limit(2)
        .execute();

      if (readyStamps.length === 0) {
        hasMore = false;
        break;
      }

      const hashes = readyStamps.map((stamp) => stamp.hash);
      // OP_RETURN max 80 bytes / 160 hex chars → prefix (12) + 2 hashes (128)
      const string = `${PREFIX}000001${hashes.join('')}`;

      await rpc.setTXfee(MIN_FEE);
      const tx = await rpc.burn(MINIMUM, string);
      log.debug(`[StampService] Publishing ${JSON.stringify(tx)}`);
      if (tx) {
        await this.db
          .updateTable('stamps')
          .set({ tx })
          .where('id', 'in', readyStamps.map((stamp) => stamp.id))
          .execute();
      }

      hashes.forEach((hash) => {
        log.info(`[StampService] Stamp submitted: ${hash}/${tx}`);
        const stampSubmittedEvent: StampSubmittedEvent = {
          type: 'stampSubmitted',
          data: { hash, tx },
        };
        getEmitter().emit('stampSubmitted', stampSubmittedEvent);
      });
      published += hashes.length;
    }

    if (published === 0) {
      log.info('[StampService] Nothing to publish');
      return;
    }

    emitPendingCount();
  }
}

// 7e5d00a0f94b7ee23377877bfd020e58abcf56163f345899caa747071f0acfd3b4ad02784963851ac4d2
// 3fe3b34d393b3920d81560aeb92e01712af1f66e52604849d1ecbd2916c035440e319414c2b7
