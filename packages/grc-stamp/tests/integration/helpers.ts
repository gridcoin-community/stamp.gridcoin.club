import faker from 'faker';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import { getPrisma } from '../../src/lib/prisma';
import { StampsType } from '.prisma/client';
import { PROTOCOL } from '../../src/constants';

const execPromise = util.promisify(exec);

const prismaBinary = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma',
);

export async function initDatabase(): Promise<void> {
  await execPromise(`DATABASE_URL=${process.env.DATABASE_URL} ${prismaBinary} db push  --force-reset `);
}

export async function createManyWithSameHash(hash: string, amount = 3): Promise<void> {
  const data = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: StampsType.sha256,
      hash,
      block: 10000 + i,
      tx: faker.git.commitSha(),
      raw_transaction: `${faker.git.commitSha()}${faker.git.commitSha()}`,
      time: i,
    });
  }
  await getPrisma().stamps.createMany({ data });
}

export async function createManyCompletedStamps(amount = 10): Promise<void> {
  const data = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: StampsType.sha256,
      hash: `${faker.git.commitSha()}${faker.git.commitSha()}`.substr(0, 64),
      block: faker.datatype.number(99999999),
      tx: faker.git.commitSha(),
      raw_transaction: `${faker.git.commitSha()}${faker.git.commitSha()}`,
      time: faker.datatype.number(163736024),
    });
  }

  await getPrisma().stamps.createMany({ data });
}

export async function cleanUp(): Promise<void> {
  await getPrisma().$transaction([
    getPrisma().stamps.deleteMany(),
  ]);
}
