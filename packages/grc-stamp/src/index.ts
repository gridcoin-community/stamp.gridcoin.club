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
  // run scraper once per minute
  setInterval(() => scraper.scrape(), config.SCRAPER_TIMEOUT);
  setInterval(() => stampService.publishStamp(), config.PUBLISH_TIMEOUT);
}

main();
