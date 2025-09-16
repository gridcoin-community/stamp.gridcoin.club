// eslint-disable-next-line import/no-extraneous-dependencies
import Chance from 'chance';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import { StampsType } from '@prisma/client';
import { getPrisma } from '../../src/lib/prisma';
import { PROTOCOL } from '../../src/constants';

const chance = new Chance();
const execPromise = util.promisify(exec);

const prismaBinary = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma',
);

function fakeHash() {
  return chance.hash({ length: 64 });
}

export async function initDatabase(): Promise<void> {
  await execPromise(`DATABASE_URL=${process.env.DATABASE_URL} ${prismaBinary} db push  --force-reset `);
}

interface IStamp {
  protocol: string;
  type: StampsType;
  hash: string;
  block: number;
  tx: string;
  raw_transaction: string;
  time: number;
}

export async function createManyWithSameHash(hash: string, amount = 3): Promise<void> {
  const data: IStamp[] = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: StampsType.sha256,
      hash,
      block: 10000 + i,
      tx: fakeHash(),
      raw_transaction: `${fakeHash()}${fakeHash()}`,
      time: i,
    });
  }
  await getPrisma().stamps.createMany({ data });
}

export async function createManyCompletedStamps(amount = 10): Promise<void> {
  const data: IStamp[] = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: StampsType.sha256,
      hash: `${fakeHash()}${fakeHash()}`.substr(0, 64),
      block: chance.integer({ min: 0, max: 99999999 }),
      tx: fakeHash(),
      raw_transaction: `${fakeHash()}${fakeHash()}`,
      time: chance.integer({ min: 0, max: 163736024 }),
    });
  }

  await getPrisma().stamps.createMany({ data });
}

export async function cleanUp(): Promise<void> {
  await getPrisma().$transaction([
    getPrisma().stamps.deleteMany(),
  ]);
}
