import axios from 'axios';
import yayson from 'yayson';
import {
  StampEntity,
  StampRawData,
} from '../entities/StampEntity';

const { Store } = yayson();

export class StampRepository {
  public constructor(
    private readonly httpClient = axios,
  ) {}

  public async getStampById(id: number): Promise<StampEntity> {
    const store = new Store();
    const { data: result } = await this.httpClient.get(`${process.env.NEXT_PUBLIC_API_URL}/stamps/${id}`);
    const data: StampRawData = store.sync(result);
    return new StampEntity(data);
  }
}
