import { expect } from 'chai';
import request from 'supertest';
import { app, server } from '../../src/api';
import { disconnect } from '../../src/lib/prisma';
import { createManyCompletedStamps, cleanUp, initDatabase } from './helpers';
import { DEFAULT_PAGINATION_LIMIT, MAXIMUM_PAGINATION_LIMIT } from '../../src/controllers/BaseController';

jest.mock('../../src/lib/gridcoin', () => ({
  connect: () => Promise.resolve(true),
}));

const MANY_RECORDS = 111;

beforeAll(async () => {
  await initDatabase();
  await createManyCompletedStamps(MANY_RECORDS);
});

afterAll(async () => {
  server.close();
  await cleanUp();
  await disconnect();
});

describe('GET /stamps', () => {
  it('should get list of stamps', async () => {
    const res = await request(app)
      .get('/stamps')
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(200);
    // Default is 25, we create 50, check that
    expect(data).to.be.an('array').lengthOf(DEFAULT_PAGINATION_LIMIT);
    // And meta should show 50
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });

  it('should get requested number of records', async () => {
    const pageSize = 7;
    const res = await request(app)
      .get(`/stamps?page[size]=${pageSize}`)
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(pageSize);
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });

  it('should enforce max pagination limit', async () => {
    const pageSize = MAXIMUM_PAGINATION_LIMIT + 1;
    const res = await request(app)
      .get(`/stamps?page[size]=${pageSize}`)
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(MAXIMUM_PAGINATION_LIMIT);
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });

  it('should paginate through results with page number', async () => {
    const pageSize = MAXIMUM_PAGINATION_LIMIT;
    const desiredLeftover = MANY_RECORDS - MAXIMUM_PAGINATION_LIMIT;
    const res = await request(app)
      .get(`/stamps?page[size]=${pageSize}&page[number]=1`)
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(desiredLeftover);
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });

  it('should paginate through results with offset', async () => {
    const pageSize = MAXIMUM_PAGINATION_LIMIT;
    const desiredLeftover = MANY_RECORDS - MAXIMUM_PAGINATION_LIMIT;
    const res = await request(app)
      .get(`/stamps?page[size]=${pageSize}&page[offset]=${MAXIMUM_PAGINATION_LIMIT}`)
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(desiredLeftover);
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });
});
