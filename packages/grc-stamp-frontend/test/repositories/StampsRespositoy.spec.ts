import {
  describe,
  it,
  expect,
  vi,
  type MockedObject,
} from 'vitest';
import axios from 'axios';
import { StampEntity } from '@/entities/StampEntity';
import { StampRepository } from '@/repositories/StampsRepository';
import { getDataMock, HashListMock } from './mocks';

vi.mock('axios');
const mockedAxios = axios as MockedObject<typeof axios>;

// process.env.NEXT_PUBLIC_API_URL = 'http://localhost:7000';

describe('StampRespository', () => {
  it('Should get stamps by id and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: getDataMock,
    });
    const repo = new StampRepository();
    const entity = await repo.getStampById(2) as StampEntity;
    expect(entity.id).toBe(Number(getDataMock.data.id));
    expect(entity.time).toBe(getDataMock.data.attributes.time);
    expect(entity.protocol).toBe(getDataMock.data.attributes.protocol);
    expect(entity.hash).toBe(getDataMock.data.attributes.hash);
    expect(entity.block).toBe(getDataMock.data.attributes.block);
  });
  it('Should return null if data was not found by id', async () => {
    mockedAxios.get.mockResolvedValue({});
    const repo = new StampRepository();
    const entity = await repo.getStampById(2);
    expect(entity).toBeNull();
  });
  it('Should find stamp by hash and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: HashListMock,
    });
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash) as StampEntity;
    expect(entity).toBeInstanceOf(StampEntity);
    expect(entity.id).toBe(Number(getDataMock.data.id));
  });
  it('should return null if no data was returned', async () => {
    mockedAxios.get.mockResolvedValue({});
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash);
    expect(entity).toBeNull();
  });
  it('should return null if no hash was found', async () => {
    mockedAxios.get.mockResolvedValue({
      meta: { count: 0 },
    });
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash);
    expect(entity).toBeNull();
  });
});
