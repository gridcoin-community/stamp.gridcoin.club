import { rpc } from '../lib/gridcoin';
import { Wallet } from '../models/Wallet';

export class WalletRepositoryClass {
  constructor(private grcRpc = rpc) {}

  public async getWalletInfo(): Promise<Wallet> {
    const [address, balance] = await Promise.all([
      this.getAddress(),
      this.getBalance(),
    ]);
    const wallet = new Wallet();
    wallet.address = address;
    wallet.balance = balance;
    return wallet;
  }

  public async getAddress(): Promise<string> {
    return this.grcRpc.getAccountAddress('');
  }

  public async getBalance(): Promise<number> {
    return this.grcRpc.getBalance();
  }
}

export const WalletRepository = new WalletRepositoryClass(rpc);
