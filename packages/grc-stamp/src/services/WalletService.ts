import { redis as redisConn } from '../lib/redis';
import { Wallet } from '../models/Wallet';
import { WalletRepository } from '../repositories/WalletRepository';
import { StampsRepository } from '../repositories/StampsRepository';
import { config } from '../config';
import { computePendingCost } from '../lib/walletPricing';

export class WalletServiceClass {
  public constructor(
    private redis = redisConn,
    private repository = WalletRepository,
    private stampsRepository = StampsRepository,
  ) {}

  public async getWalletInfo(): Promise<Wallet> {
    const [
      walletInfo,
      block,
      pendingCount,
    ] = await Promise.all([
      this.repository.getWalletInfo(),
      this.redis.get(config.REDIS_SCRAPER_KEY),
      this.stampsRepository.countPending(),
    ]);
    walletInfo.block = Number(block) || config.START_BLOCK;
    walletInfo.minimumBalance = Number(config.MINIMUM_WALLET_AMOUNT);
    walletInfo.effectiveBalance = walletInfo.balance - computePendingCost(pendingCount);
    return walletInfo;
  }

  public getBalance(): Promise<number> {
    return this.repository.getBalance();
  }
}

export const WalletService = new WalletServiceClass(
  redisConn,
  WalletRepository,
  StampsRepository,
);
