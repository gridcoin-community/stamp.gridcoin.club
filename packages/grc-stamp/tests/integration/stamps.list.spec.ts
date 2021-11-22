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

  it('should sort all results', async () => {
    const res = await request(app)
      .get('/stamps?page[size]=3&sort=time')
      .send();
    const { data } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(3);
    const time1 = Number(data[0].attributes.time);
    const time2 = Number(data[1].attributes.time);
    const time3 = Number(data[2].attributes.time);
    expect(time1).to.be.lessThanOrEqual(time2);
    expect(time2).to.be.lessThanOrEqual(time3);
  });

  it('should sort all results in reverce order as well', async () => {
    const res = await request(app)
      .get('/stamps?page[size]=3&sort=-block')
      .send();
    const { data } = res.body;
    expect(res.status).to.be.equal(200);
    expect(data).to.be.an('array').lengthOf(3);
    const block1 = Number(data[0].attributes.block);
    const block2 = Number(data[1].attributes.block);
    const block3 = Number(data[2].attributes.block);
    expect(block3).to.be.lessThanOrEqual(block2);
    expect(block2).to.be.lessThanOrEqual(block1);
  });

  it('should find record by id (primary key)', async () => {
    const id = 1;
    const res = await request(app)
      .get(`/stamps/${id}`)
      .send();
    expect(res.status).to.be.equal(200);
    const { data } = res.body;
    expect(data).to.be.an('object')
      .to.have.property('id').that.equal(String(id));
  });

  it('should give 404 when getting by id (primary key) and there is no record', async () => {
    const id = 0;
    const res = await request(app)
      .get(`/stamps/${id}`)
      .send();
    expect(res.status).to.be.equal(404);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({ status: 404, title: 'Not Found' });
  });

  it('should give not found when search for non existing record', async () => {
    const res = await request(app)
      .get('/stamp?filter[hash]=0')
      .send();
    expect(res.status).to.be.equal(404);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({ status: 404, title: 'Not Found' });
  });
});
