import { rpc } from '../lib/gridcoin';
import { Wallet } from '../models/Wallet';

const BALANCE_TTL_MS = 15_000;

export class WalletRepositoryClass {
  private cachedBalance: number | null = null;

  private balanceFetchedAt = 0;

  private balanceInflight: Promise<number> | null = null;

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

  public resetCache(): void {
    this.cachedBalance = null;
    this.balanceFetchedAt = 0;
    this.balanceInflight = null;
  }

  public async getBalance(): Promise<number> {
    const now = Date.now();
    if (this.cachedBalance !== null && now - this.balanceFetchedAt < BALANCE_TTL_MS) {
      return this.cachedBalance;
    }

    // Coalesce concurrent callers onto a single RPC request
    if (!this.balanceInflight) {
      this.balanceInflight = this.grcRpc.getBalance()
        .then((balance) => {
          this.cachedBalance = balance;
          this.balanceFetchedAt = Date.now();
          this.balanceInflight = null;
          return balance;
        })
        .catch((err) => {
          this.balanceInflight = null;
          throw err;
        });
    }

    return this.balanceInflight;
  }
}

export const WalletRepository = new WalletRepositoryClass(rpc);
