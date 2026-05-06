import HttpStatus from 'http-status-codes';
import { expect } from 'chai';
import request from 'supertest';
import { rpc } from '../../src/lib/gridcoin';
import { app, server } from '../../src/api';
import { db } from '../../src/lib/db';
import { WalletRepository } from '../../src/repositories/WalletRepository';
import { EntityType } from '../../src/presenters/types';
import { computePendingCost } from '../../src/lib/walletPricing';

const ADDRESS = 'S74mjeRTQbpPzDoibmnMz23hThXCxRUMhn';
const AMOUNT = '10.221';
const BLOCK = 123456;
const PENDING_COUNT = 0;

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
// WalletService now hits StampsRepository.countPending to derive
// effectiveBalance for the low-funds banner. The other endpoints in
// these integration tests have their own DB plumbing — for the wallet
// endpoint we just stub the count so the suite stays DB-free.
jest.mock('../../src/repositories/StampsRepository', () => ({
  StampsRepository: {
    countPending: jest.fn(() => Promise.resolve(PENDING_COUNT)),
  },
}));

afterAll(async () => {
  server.close();
  await db.destroy();
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
    // Default MINIMUM_WALLET_AMOUNT is 1; effectiveBalance = balance -
    // computePendingCost(PENDING_COUNT). Asserted via the helper so the
    // expectation tracks any future change to the pricing math.
    expect(attributes.minimumBalance).to.be.equal(1);
    expect(attributes.effectiveBalance).to.be.equal(
      Number(AMOUNT) - computePendingCost(PENDING_COUNT),
    );
  });
  it('GET /wallet failure', async () => {
    rpc.getBalance = jest.fn(() => Promise.reject(new Error('a')));
    WalletRepository.resetCache();
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
