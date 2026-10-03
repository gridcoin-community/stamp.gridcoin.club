import axios from 'axios';
import {
  StatusEntity,
  StatusRawData,
} from '@/entities/StatusEntity';

export class StatusRepository {
  public constructor(
    private readonly httpClient = axios,
  ) {}

  public async getStatusData(): Promise<StatusEntity | null> {
    const { data: result } = await this.httpClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/status`,
    );
    if (result) {
      // Read directly: /status is an id-less singleton, which yayson 4's
      // Store refuses to sync.
      const data: StatusRawData | undefined = result.data?.attributes;
      if (data) {
        return new StatusEntity(data);
      }
    }
    return null;
  }
}
