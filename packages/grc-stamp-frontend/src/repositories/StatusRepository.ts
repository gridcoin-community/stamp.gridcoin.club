import axios from 'axios';
import yayson from 'yayson';
import {
  StatusEntity,
  StatusRawData,
} from '@/entities/StatusEntity';

const { Store } = yayson();

export class StatusRepository {
  public constructor(
    private readonly httpClient = axios,
  ) {}

  public async getStatusData(): Promise<StatusEntity | null> {
    const store = new Store();
    const { data: result } = await this.httpClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/status`,
    );
    if (result) {
      const data: StatusRawData = store.sync(result);
      if (data) {
        return new StatusEntity(data);
      }
    }
    return null;
  }
}
