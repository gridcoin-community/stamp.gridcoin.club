import { expect } from 'chai';
import request from 'supertest';
import { rpc } from '../../src/lib/gridcoin';
import { app, server } from '../../src/api';

const ADDRESS = 'S74mjeRTQbpPzDoibmnMz23hThXCxRUMhn';
const AMOUNT = '10.221';
const TYPE = 'wallet';

jest.mock('../../src/lib/gridcoin', () => ({
  connect: () => Promise.resolve(true),
  rpc: {
    getAccountAddress: jest.fn(() => Promise.resolve(ADDRESS)),
    getBalance: jest.fn(() => Promise.resolve(AMOUNT)),
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
      .send({});
    const { data } = res.body;
    const { attributes } = data;
    expect(res.status).to.be.equal(200);
    expect(data.id).to.be.equal(ADDRESS);
    expect(data.type).to.be.equal(TYPE);
    expect(attributes.address).to.be.equal(ADDRESS);
    expect(attributes.balance).to.be.equal(AMOUNT);
  });
  it('GET /wallet failure', async () => {
    rpc.getBalance = jest.fn(() => Promise.reject(new Error('a')));
    const res = await request(app)
      .get('/wallet')
      .send({});
    expect(res.status).to.be.equal(500);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({ status: 500, title: 'Internal Server Error' });
  });
});
