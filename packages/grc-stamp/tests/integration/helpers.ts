// eslint-disable-next-line import/no-extraneous-dependencies
import Chance from 'chance';
import { db } from '../../src/lib/db';
import { NewStamp, StampsType } from '../../src/lib/database';
import { PROTOCOL } from '../../src/constants';

const chance = new Chance();

function fakeHash() {
  return chance.hash({ length: 64 });
}

// Schema is created once by tests/globalSetup.ts. Per-test isolation is
// just a truncate, which is fast and avoids a roundtrip to the migration
// runner.
export async function initDatabase(): Promise<void> {
  await db.deleteFrom('stamps').execute();
}

interface SeedStamp {
  protocol: string;
  type: StampsType;
  hash: string;
  block: number;
  tx: string;
  raw_transaction: string;
  time: number;
}

export async function createManyWithSameHash(hash: string, amount = 3): Promise<void> {
  const data: SeedStamp[] = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: 'sha256',
      hash,
      block: 10000 + i,
      tx: fakeHash(),
      raw_transaction: `${fakeHash()}${fakeHash()}`,
      time: i,
    });
  }
  const rows: NewStamp[] = data.map((d) => ({
    protocol: d.protocol,
    type: d.type,
    hash: d.hash,
    block: BigInt(d.block),
    tx: d.tx,
    raw_transaction: d.raw_transaction,
    time: d.time,
  }));
  await db.insertInto('stamps').values(rows).execute();
}

export async function createManyCompletedStamps(amount = 10): Promise<void> {
  const data: SeedStamp[] = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      protocol: PROTOCOL,
      type: 'sha256',
      hash: `${fakeHash()}${fakeHash()}`.substr(0, 64),
      block: chance.integer({ min: 0, max: 99999999 }),
      tx: fakeHash(),
      raw_transaction: `${fakeHash()}${fakeHash()}`,
      time: chance.integer({ min: 0, max: 163736024 }),
    });
  }
  const rows: NewStamp[] = data.map((d) => ({
    protocol: d.protocol,
    type: d.type,
    hash: d.hash,
    block: BigInt(d.block),
    tx: d.tx,
    raw_transaction: d.raw_transaction,
    time: d.time,
  }));
  await db.insertInto('stamps').values(rows).execute();
}

export async function cleanUp(): Promise<void> {
  await db.deleteFrom('stamps').execute();
}
