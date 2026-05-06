import { expect } from 'chai';
import HttpStatus from 'http-status-codes';
import request from 'supertest';
import { app, server } from '../../src/api';
import { db } from '../../src/lib/db';
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
  await db.destroy();
});

describe('GET /stamps', () => {
  it('should get list of stamps', async () => {
    const res = await request(app)
      .get('/stamps')
      .send();
    const { data, meta } = res.body;
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
    expect(data).to.be.an('array').lengthOf(desiredLeftover);
    expect(meta).to.be.an('object').to.have.property('count');
    expect(meta.count).to.be.equal(MANY_RECORDS);
  });

  it('should sort all results', async () => {
    const res = await request(app)
      .get('/stamps?page[size]=3&sort=time')
      .send();
    const { data } = res.body;
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
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
    expect(res.status).to.be.equal(HttpStatus.OK);
    const { data } = res.body;
    expect(data).to.be.an('object')
      .to.have.property('id').that.equal(String(id));
  });

  it('should give 404 when getting by id (primary key) and there is no record', async () => {
    const id = 0;
    const res = await request(app)
      .get(`/stamps/${id}`)
      .send();
    expect(res.status).to.be.equal(HttpStatus.NOT_FOUND);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({
        status: HttpStatus.NOT_FOUND,
        title: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
      });
  });

  it('should give not found when search for non existing record', async () => {
    const res = await request(app)
      .get('/stamp?filter[hash]=0')
      .send();
    expect(res.status).to.be.equal(HttpStatus.NOT_FOUND);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({
        status: HttpStatus.NOT_FOUND,
        title: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
      });
  });

  // Regression: a non-numeric comparison filter on any field used to throw
  // BigInt('abc') synchronously inside the StampsController constructor,
  // producing an unhandled rejection that crashed the Node process. The fix
  // makes BigInt() failures fall through to the raw string value, and the
  // repo's filter translator now maps invalid bigint inputs to a clean 400.
  it('should not crash on a non-numeric ne filter (DoS regression)', async () => {
    const res = await request(app)
      .get('/stamps?filter[hash][ne]=abc')
      .send();
    // The server must respond — anything other than a crash is acceptable.
    expect(res.status).to.not.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.status).to.be.oneOf([HttpStatus.OK, HttpStatus.BAD_REQUEST]);
  });

  it('should not crash on a float filter on a BigInt column', async () => {
    const res = await request(app)
      .get('/stamps?filter[id][gt]=1.5')
      .send();
    expect(res.status).to.not.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.status).to.be.oneOf([HttpStatus.OK, HttpStatus.BAD_REQUEST]);
  });

  it('should not crash when the filter value is delivered as an array', async () => {
    // qs parses `filter[hash][ne][]=a&filter[hash][ne][]=b` into an array value,
    // which used to blow up the `.split(',')` call with TypeError.
    const res = await request(app)
      .get('/stamps?filter[hash][ne][]=a&filter[hash][ne][]=b')
      .send();
    expect(res.status).to.not.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.status).to.be.oneOf([HttpStatus.OK, HttpStatus.BAD_REQUEST]);
  });

  it('should return 400 for a non-bigint value on a bigint column', async () => {
    // id is a BigInt column — comparing it against a non-numeric string
    // surfaces a BadFilterError from the repo translator, which the
    // controller maps to 400.
    const res = await request(app)
      .get('/stamps?filter[id][gt]=not-a-number')
      .send();
    expect(res.status).to.be.equal(HttpStatus.BAD_REQUEST);
    const { errors } = res.body;
    expect(errors).to.be.an('array')
      .to.have.lengthOf(1)
      .that.deep.includes({
        status: HttpStatus.BAD_REQUEST,
        title: 'Invalid query parameters',
      });
  });
});
