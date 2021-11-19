import { GridcoinRPC } from 'gridcoin-rpc';
import { config } from '../config';
import { log } from './log';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const rpc = new GridcoinRPC({
  port: config.GRC_RPC_PORT,
  host: config.GRC_RPC_HOST,
  username: config.GRC_RPC_USER,
  password: config.GRC_RPC_PASSWORD,
});

export async function connect(): Promise<boolean> {
  try {
    await rpc.getWalletInfo();
    return true;
  } catch (err) {
    log.warning('Connection error');
    await wait(5000);
    return false;
  }
}
