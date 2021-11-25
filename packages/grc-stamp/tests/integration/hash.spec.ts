import HttpStatus from 'http-status-codes';
import { expect } from 'chai';
import request from 'supertest';
import { StampsType } from '.prisma/client';
import { app, server } from '../../src/api';
import { PROTOCOL } from '../../src/constants';
import { disconnect } from '../../src/lib/prisma';
import { cleanUp, createManyWithSameHash, initDatabase } from './helpers';

jest.mock('../../src/lib/gridcoin', () => ({
  connect: () => Promise.resolve(true),
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

describe('GET /hashes', () => {
  it('should select the very first hash out of many if present', async () => {
    const hash = '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7';
    await createManyWithSameHash(hash, 13);
    const res = await request(app)
      .get(`/hashes/${hash}`)
      .send();
    const { data } = res.body;
    expect(res.status).to.be.equal(HttpStatus.OK);
    expect(data).to.be.an('object')
      .to.have.property('id').that.equal('1');
    const { attributes } = data;
    expect(attributes)
      .to.have.property('hash')
      .that.equal(hash);
    expect(attributes)
      .to.have.property('protocol')
      .that.equal(PROTOCOL);
    expect(attributes)
      .to.have.property('type')
      .that.equal(StampsType.sha256);
    expect(attributes)
      .to.have.property('time')
      .that.equal(0);
  });

  it('should give not found if record is not presented', async () => {
    const res = await request(app)
      .get('/hashes/1')
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
});
