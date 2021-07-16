import crypto from 'crypto';
import { connect } from './lib/gridcoin';
import { StampService } from './Services/StampService';

async function initConnections() {
  await Promise.all([
    connect(),
  ]);
}

async function main() {
  await initConnections();
  const stampService = new StampService();
  // // ss.createStamp();
  // const hash = `${Math.random() * 100000000000000}`;
  // const sha = crypto.createHash('sha256');
  // sha.update(hash);
  // const shaman = sha.digest('hex');
  // // 9999
  // // ss.createStamp(shaman);
  // ss.publishStamp();
}

main();
