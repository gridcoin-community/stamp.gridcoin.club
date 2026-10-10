import { rpc } from '../lib/gridcoin';
import { Wallet } from '../models/Wallet';

const BALANCE_TTL_MS = 15_000;

// Label holding the service's receive address
const ADDRESS_LABEL = 'grc-stamp';

const RPC_METHOD_NOT_FOUND = -32601;
// Returned by getaddressesbylabel when the label has no addresses yet
const RPC_WALLET_INVALID_LABEL_NAME = -11;

export class WalletRepositoryClass {
  private addressInflight: Promise<string> | null = null;

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
    // The address never changes once resolved; coalesce so concurrent
    // first callers can't each mint and label a new one.
    if (!this.addressInflight) {
      this.addressInflight = this.resolveAddress().catch((err) => {
        this.addressInflight = null;
        throw err;
      });
    }
    return this.addressInflight;
  }

  private async resolveAddress(): Promise<string> {
    try {
      const addresses = await this.grcRpc.getAddressesByLabel(ADDRESS_LABEL);
      return Object.keys(addresses).sort()[0];
    } catch (err) {
      const { code } = err as { code?: number };
      // Wallets that predate labels (<= 5.5.1.0) still have the accounts subsystem
      if (code === RPC_METHOD_NOT_FOUND) {
        return this.grcRpc.getAccountAddress('');
      }
      if (code !== RPC_WALLET_INVALID_LABEL_NAME) {
        throw err;
      }
    }

    const address = await this.grcRpc.getNewAddress();
    await this.grcRpc.setLabel(address, ADDRESS_LABEL);
    return address;
  }

  public resetCache(): void {
    this.cachedBalance = null;
    this.balanceFetchedAt = 0;
    this.balanceInflight = null;
    this.addressInflight = null;
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
