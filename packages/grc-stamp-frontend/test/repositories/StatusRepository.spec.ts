import {
  describe,
  it,
  expect,
  vi,
  type MockedObject,
} from 'vitest';
import axios from 'axios';
import { StatusEntity } from '@/entities/StatusEntity';
import { StatusRepository } from '@/repositories/StatusRepository';
import { statusMock } from './mocks';

vi.mock('axios');
const mockedAxios = axios as MockedObject<typeof axios>;

describe('StatusRepository', () => {
  it('should get status data and transform to entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: statusMock,
    });
    const repo = new StatusRepository();
    const entity = await repo.getStatusData() as StatusEntity;
    expect(entity).toBeInstanceOf(StatusEntity);
    expect(entity.name).toBe('grc-stamp');
    expect(entity.version).toBe(1);
    expect(entity.maintenance).toBe(false);
  });

  it('should return null when no data is returned', async () => {
    mockedAxios.get.mockResolvedValue({});
    const repo = new StatusRepository();
    const entity = await repo.getStatusData();
    expect(entity).toBeNull();
  });
});
