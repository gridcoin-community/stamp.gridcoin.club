import { rpc } from '../lib/gridcoin';

export class WalletRepositoryClass {
  constructor(private grcRpc = rpc) {}

  public async getBalance(): Promise<number> {
    return this.grcRpc.getBalance();
  }
}

export const WalletRepository = new WalletRepositoryClass(rpc);
