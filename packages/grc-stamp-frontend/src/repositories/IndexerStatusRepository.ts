import axios from 'axios';
import yayson from 'yayson';
import { IndexerStatusEvent } from '@/types';

const { Store } = yayson();

// Mirrors the SSE indexerStatus event payload — same shape, different
// transport. The REST endpoint exists so SSR can prefill the footer
// + BackfillBanner before the SSE stream connects.
export class IndexerStatusRepository {
  public constructor(
    private readonly httpClient = axios,
    private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL_SERVER
      ?? process.env.NEXT_PUBLIC_API_URL,
  ) {}

  public async getStatus(): Promise<IndexerStatusEvent['data'] | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get(
      `${this.baseUrl}/indexer/status`,
    );
    if (!result) return null;
    const data = store.sync(result) as IndexerStatusEvent['data'] | null;
    return data ?? null;
  }
}
