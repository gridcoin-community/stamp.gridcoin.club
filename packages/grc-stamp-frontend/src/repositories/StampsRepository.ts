import axios from 'axios';
import yayson from 'yayson';
import {
  StampEntity,
  StampRawData,
} from '../entities/StampEntity';

const { Store } = yayson();

interface ApiResponse {
  meta?: {
    count?: number;
  }
}

export class StampRepository {
  public constructor(
    private readonly httpClient = axios,
  ) {}

  public async getStampById(id: number): Promise<StampEntity | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get(`${process.env.NEXT_PUBLIC_API_URL}/stamps/${id}`);
    if (result) {
      const data: StampRawData = store.sync(result);
      if (data) {
        return new StampEntity(data);
      }
    }
    return null;
  }

  /**
   * Assumption: We will always get the single record from the server side
   * Even if somebody will craf the transaction manually,
   * server must return the very first record and ignore the rest
   */
  public async findStampByHash(hash: string): Promise<StampEntity | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get<ApiResponse & { data: StampRawData[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/stamps?filter[hash]=${hash}`,
    );
    if (!result?.meta?.count) {
      return null;
    }
    const list: StampRawData[] = store.sync(result);
    const data = list.shift();
    if (data) {
      return new StampEntity(data);
    }
    return null;
  }
}
