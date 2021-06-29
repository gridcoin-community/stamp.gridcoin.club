import { GridcoinRPC } from 'gridcoin-rpc';
import { config } from '../config';

export const rpc = new GridcoinRPC({
  port: config.GRC_RPC_PORT,
  host: config.GRC_RPC_HOST,
  username: config.GRC_RPC_USER,
  password: config.GRC_RPC_PASSWORD,
});

export async function connect(): Promise<void> {
  try {
    const result = await rpc.testConnection();
    console.log(JSON.stringify(result));
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}
