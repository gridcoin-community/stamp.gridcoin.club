import { expect } from 'chai';
import axios from 'axios';
import { StampEntity } from 'entities/StampEntity';
import { StampRepository } from '../../src/repositories/StampsRepository';
import { getDataMock, HashListMock } from './mocks';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// process.env.NEXT_PUBLIC_API_URL = 'http://localhost:7000';

describe('StampRespository', () => {
  it('Should get stamps by id and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: getDataMock,
    });
    const repo = new StampRepository();
    const entity = await repo.getStampById(2) as StampEntity;
    expect(entity.id).to.be.equal(Number(getDataMock.data.id));
    expect(entity.time).to.be.equal(getDataMock.data.attributes.time);
    expect(entity.protocol).to.be.equal(getDataMock.data.attributes.protocol);
    expect(entity.hash).to.be.equal(getDataMock.data.attributes.hash);
    expect(entity.block).to.be.equal(getDataMock.data.attributes.block);
  });
  it('Should return null if data was not found by id', async () => {
    mockedAxios.get.mockResolvedValue({});
    const repo = new StampRepository();
    const entity = await repo.getStampById(2);
    expect(entity).to.be.equal(null);
  });
  it('Should find stamp by hash and transform it to the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: HashListMock,
    });
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash) as StampEntity;
    expect(entity).to.be.instanceOf(StampEntity);
    expect(entity.id).to.be.equal(Number(getDataMock.data.id));
  });
  it('should return null if no data was returned', async () => {
    mockedAxios.get.mockResolvedValue({});
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash);
    expect(entity).to.be.equal(null);
  });
  it('should return null if no hash was found', async () => {
    mockedAxios.get.mockResolvedValue({
      meta: { count: 0 },
    });
    const repo = new StampRepository();
    const entity = await repo.findStampByHash(getDataMock.data.attributes.hash);
    expect(entity).to.be.equal(null);
  });
});
