import { redis as redisConn } from '../lib/redis';
import { Wallet } from '../models/Wallet';
import { WalletRepository } from '../repositories/WalletRepository';
import { config } from '../config';

export class WalletServiceClass {
  public constructor(
    private redis = redisConn,
    private repository = WalletRepository,
  ) {}

  public async getWalletInfo(): Promise<Wallet> {
    const [
      walletInfo,
      block,
    ] = await Promise.all([
      this.repository.getWalletInfo(),
      this.redis.get(config.REDIS_SCRAPER_KEY),
    ]);
    walletInfo.block = Number(block) || config.START_BLOCK;
    return walletInfo;
  }

  public getBalance(): Promise<number> {
    return this.repository.getBalance();
  }
}

export const WalletService = new WalletServiceClass(
  redisConn,
  WalletRepository,
);
