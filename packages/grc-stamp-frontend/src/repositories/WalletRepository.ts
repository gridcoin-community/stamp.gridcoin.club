import axios from 'axios';
import yayson from 'yayson';
import {
  WalletEntity,
  WalletRawData,
} from 'entities/WalletEntity';

const { Store } = yayson();

export class WalletRepository {
  public constructor(
    private readonly httpClient = axios,
  ) {}

  public async getWalletData(): Promise<WalletEntity | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/wallet`,
    );
    if (result) {
      const data: WalletRawData = store.sync(result);
      if (data) {
        return new WalletEntity(data);
      }
    }
    return null;
  }
}
