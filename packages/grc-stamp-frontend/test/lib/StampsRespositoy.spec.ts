import { expect } from 'chai';
import axios from 'axios';
import { StampRepository } from '../../src/lib/StampsRepository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const getDataMock = {
  data: {
    id: '2',
    type: 'stamps',
    attributes: {
      protocol: '0.0.1',
      type: 'sha256',
      hash: 'f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5',
      block: 1654233,
      tx: '782f131b9ef917669040f8a4bd94596275fcee0ac4a628a765a09674ed6d519f',
      rawTransaction: '6a26f055aa000001f6fc84c9f21c24907d6bee6eec38cabab5fa9a7be8c4a7827fe9e56f245bd2d5',
      time: 1629273488,
      createdAt: '2021-08-18T07:59:34.000Z',
      updatedAt: '2021-08-18T07:59:34.000Z',
    },
    links: { self: '/stamps/2' },
  },
};
// process.env.NEXT_PUBLIC_API_URL = 'http://localhost:7000';

describe('StampRespository', () => {
  it('Should get stamps by id and build the entity', async () => {
    mockedAxios.get.mockResolvedValue({
      data: getDataMock,
    });
    const repo = new StampRepository();
    const entity = await repo.getStampById(2);
    expect(entity.id).to.be.equal(Number(getDataMock.data.id));
    expect(entity.time).to.be.equal(getDataMock.data.attributes.time);
    expect(entity.protocol).to.be.equal(getDataMock.data.attributes.protocol);
    expect(entity.hash).to.be.equal(getDataMock.data.attributes.hash);
    expect(entity.block).to.be.equal(getDataMock.data.attributes.block);
  });
});
