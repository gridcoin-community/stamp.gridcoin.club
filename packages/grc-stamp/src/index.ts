import { config } from './config';
import { connect } from './lib/gridcoin';
import { log } from './lib/log';
import { migrateToLatest } from './lib/migrate';
import { Scraper } from './services/Scraper';
import { StampService } from './services/StampService';
import './api';
import './services/EventsService';

async function initConnections(): Promise<void> {
  while (!await connect()) {
    log.info('Connecting to the gridcoin wallet...');
  }
  log.info('Connected to the gridcoin wallet...');
}

// Last-resort safety net. The scraper and publisher fire on intervals
// and talk to remote services (RPC, MySQL) where transient
// ECONNRESET/timeout/refused are normal. Without these handlers, a
// single dropped MySQL packet during a scrape became an unhandled
// rejection and crashed the whole process — taking SSE clients,
// pending publishes, and the API down with it. Log loudly and stay up;
// the next interval tick will retry.
process.on('unhandledRejection', (reason) => {
  log.error('[boot] unhandled promise rejection — keeping process alive');
  log.error(reason);
});
process.on('uncaughtException', (err) => {
  log.error('[boot] uncaught exception — keeping process alive');
  log.error(err);
});

async function main(): Promise<void> {
  // Apply pending DB migrations before anything else touches the schema.
  // Idempotent — Kysely's kysely_migration_lock makes concurrent runs
  // safe, and stamp is single-replica anyway.
  try {
    await migrateToLatest();
  } catch (err) {
    log.error('[boot] migration failed, refusing to start');
    log.error(err);
    process.exit(1);
  }

  await initConnections();

  const stampService = new StampService();
  const scraper = new Scraper();
  // Self-scheduling scrape loop. While backfilling, each tick returns
  // `true` and the next batch is queued via setImmediate — back-to-back
  // RPC, no wall-clock wait. Once at the tip the tick returns `false`
  // and we fall back to the polite SCRAPER_TIMEOUT poll. A failed tick
  // logs and reschedules at the polite cadence so a flapping wallet
  // doesn't get hammered.
  const runScrape = (): void => {
    scraper.scrape()
      .then((moreWork) => {
        if (moreWork) setImmediate(runScrape);
        else setTimeout(runScrape, config.SCRAPER_TIMEOUT);
      })
      .catch((err) => {
        log.error('[scraper] tick failed, will retry on the polite interval');
        log.error(err);
        setTimeout(runScrape, config.SCRAPER_TIMEOUT);
      });
  };
  runScrape();

  setInterval(() => {
    stampService.publishStamp().catch((err) => {
      log.error('[publisher] tick failed, will retry next interval');
      log.error(err);
    });
  }, config.PUBLISH_TIMEOUT);
}

main();
