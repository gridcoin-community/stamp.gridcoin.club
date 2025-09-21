import HttpStatus from 'http-status-codes';
import { expect } from 'chai';
import request from 'supertest';
import { rpc } from '../../src/lib/gridcoin';
import { app, server } from '../../src/api';
import { EntityType } from '../../src/presenters/types';

const ADDRESS = 'S74mjeRTQbpPzDoibmnMz23hThXCxRUMhn';
const AMOUNT = '10.221';
const BLOCK = 123456;

jest.mock('../../src/lib/gridcoin', () => ({
  connect: () => Promise.resolve(true),
  rpc: {
    getAccountAddress: jest.fn(() => Promise.resolve(ADDRESS)),
    getBalance: jest.fn(() => Promise.resolve(AMOUNT)),
  },
}));
jest.mock('../../src/lib/redis', () => ({
  redis: {
    get: jest.fn(() => Promise.resolve(BLOCK)),
  },
}));

afterAll((done) => {
  server.close();
  done();
});

describe('Wallet endpoints', () => {
  it('GET /wallet', async () => {
    const res = await request(app)
      .get('/wallet')
      .send();
    const { data } = res.body;
    const { attributes } = data;
    expect(res.status).to.be.equal(HttpStatus.OK);
    expect(data.id).to.be.equal(ADDRESS);
    expect(data.type).to.be.equal(EntityType.WALLET);
    expect(attributes.address).to.be.equal(ADDRESS);
    expect(attributes.balance).to.be.equal(AMOUNT);
    expect(attributes.block).to.be.equal(BLOCK);
  });
  it('GET /wallet failure', async () => {
    rpc.getBalance = jest.fn(() => Promise.reject(new Error('a')));
    const res = await request(app)
      .get('/wallet')
      .send({});
    expect(res.status).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        title: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      });
  });
});
