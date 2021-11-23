import { expect } from 'chai';
import request from 'supertest';
import HttpStatus from 'http-status-codes';
import { StampsType } from '.prisma/client';
import { app, server } from '../../src/api';
import { PROTOCOL } from '../../src/constants';
import { rpc } from '../../src/lib/gridcoin';
import { disconnect } from '../../src/lib/prisma';
import { cleanUp, initDatabase } from './helpers';

const AMOUNT = '10.221';
const HASH = '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7';

jest.mock('../../src/lib/gridcoin', () => ({
  connect: () => Promise.resolve(true),
  rpc: {
    getBalance: jest.fn(() => Promise.resolve(AMOUNT)),
  },
}));

beforeAll(async () => {
  await initDatabase();
});

afterAll(async () => {
  server.close();
  await cleanUp();
  await disconnect();
});

afterEach(async () => {
  await cleanUp();
});

describe('POST /stamps', () => {
  it('should create new record with a minimum required data', async () => {
    const res = await request(app)
      .post('/stamps')
      .send({
        data: {
          type: 'stamps',
          attributes: {
            hash: HASH,
          },
        },
      });
    expect(res.status).to.be.equal(HttpStatus.CREATED);
    const { data } = res.body;
    const { attributes } = data;
    expect(attributes).to.have.property('hash')
      .that.equal(HASH);
    expect(data).to.have.property('id');
    expect(attributes).to.have.property('protocol')
      .that.equal(PROTOCOL);
    expect(attributes).to.have.property('type')
      .that.equal(StampsType.sha256);
    expect(attributes).to.have.property('tx')
      .that.equal(null);
    expect(attributes).to.have.property('rawTransaction')
      .that.equal(null);
    expect(attributes).to.have.property('time')
      .that.equal(null);
  });

  it('should fail if there is no enough funds', async () => {
    rpc.getBalance = jest.fn(() => Promise.resolve(0));
    const res = await request(app)
      .post('/stamps')
      .send({
        data: {
          type: 'stamps',
          attributes: {
            hash: HASH,
          },
        },
      });
    expect(res.status).to.be.equal(HttpStatus.NOT_ACCEPTABLE);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({
        status: HttpStatus.NOT_ACCEPTABLE,
        title: 'Insufficient Funds',
      });
  });
});
