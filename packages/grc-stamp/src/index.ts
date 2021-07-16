import crypto from 'crypto';
import { connect } from './lib/gridcoin';
import { StampService } from './Services/StampService';

async function initConnections(): Promise<void> {
  while (!await connect()) {
    console.log('Connecting to the gridcoin wallet...');
  }
  console.log('Connected to the gridcoin wallet...');
}

async function main(): Promise<void> {
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
