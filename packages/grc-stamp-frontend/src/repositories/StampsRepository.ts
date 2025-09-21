import axios from 'axios';
import yayson from 'yayson';
import {
  StampEntity,
  StampRawData,
} from '@/entities/StampEntity';

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
   * Even if somebody will craft the transaction manually,
   * server must return the very first record and ignore the rest
   */
  public async findStampByHash(hash: string, isServer = false): Promise<StampEntity | null> {
    const store = new Store();
    let url = `stamps?filter[hash]=${hash}`;
    if (isServer) {
      url = `${process.env.NEXT_PUBLIC_API_URL_SERVER}/${url}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
    }
    const { data: result } = await this.httpClient.get<ApiResponse & { data: StampRawData[] }>(url);

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

  /**
   * Get the list of 10 recent stamps
   *
   */
  public async getRecentStamps(): Promise<StampEntity[] | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get<ApiResponse & { data: StampRawData[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/stamps/`
      + `?sort=-id&page[size]=${process.env.NEXT_PUBLIC_RECENT_STAMPS_NUMBER}`
      + '&filter[block][gt]=0',
    );
    if (!result?.meta?.count) {
      return null;
    }
    const list: StampRawData[] = store.sync(result);
    const data = list.map((entity) => new StampEntity(entity));
    if (data) return data;
    return null;
  }
}
