import crypto from 'crypto';
import { config } from './config';
import { connect } from './lib/gridcoin';
import { log } from './lib/log';
import { Scraper } from './services/Scraper';
import { StampService } from './services/StampService';
import './api';

async function initConnections(): Promise<void> {
  while (!await connect()) {
    log.info('Connecting to the gridcoin wallet...');
  }
  log.info('Connected to the gridcoin wallet...');
}

async function main(): Promise<void> {
  await initConnections();

  const stampService = new StampService();
  const scraper = new Scraper();
  // run scraper once per minute
  setInterval(() => scraper.scrape(), config.SCRAPER_TIMEOUT);
  const hash = `${Math.random() * 100000000000000}`;
  const sha = crypto.createHash('sha256');
  sha.update(hash);
  setInterval(() => stampService.publishStamp(), config.PUBLISH_TIMEOUT);
}

main();
