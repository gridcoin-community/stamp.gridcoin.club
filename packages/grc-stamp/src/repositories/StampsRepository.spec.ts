import { db } from '../lib/db';
import { BadFilterError, SelectOptions, StampsRepositoryClass } from './StampsRepository';
import { PROTOCOL } from '../constants';
import { chain } from '../../tests/helpers/kyselyChain';

jest.mock('../lib/db', () => ({
  db: {
    selectFrom: jest.fn(),
    insertInto: jest.fn(),
  },
}));

describe('StampsRepository', () => {
  let repository: StampsRepositoryClass;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new StampsRepositoryClass();
  });

  describe('createStamp', () => {
    it('should throw error if hash is missing', async () => {
      await expect(repository.createStamp('')).rejects.toThrow('Not enough data');
    });

    it('inserts and re-fetches with default sha256 type', async () => {
      const insert = chain({ insertId: BigInt(7) }, 'executeTakeFirstOrThrow');
      const select = chain({ id: BigInt(7), hash: 'h', type: 'sha256' }, 'executeTakeFirstOrThrow');
      (db.insertInto as jest.Mock).mockReturnValue(insert.proxy);
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.createStamp('h');

      expect(db.insertInto).toHaveBeenCalledWith('stamps');
      const values = insert.calls.find((c) => c.name === 'values');
      expect(values?.args[0]).toEqual({ protocol: PROTOCOL, type: 'sha256', hash: 'h' });
      expect(result).toEqual({ id: BigInt(7), hash: 'h', type: 'sha256' });
    });

    it('inserts with the supplied type', async () => {
      const insert = chain({ insertId: BigInt(7) }, 'executeTakeFirstOrThrow');
      const select = chain({ id: BigInt(7) }, 'executeTakeFirstOrThrow');
      (db.insertInto as jest.Mock).mockReturnValue(insert.proxy);
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      await repository.createStamp('h', 'ipfs');

      const values = insert.calls.find((c) => c.name === 'values');
      expect(values?.args[0]).toEqual({ protocol: PROTOCOL, type: 'ipfs', hash: 'h' });
    });
  });

  describe('countPending', () => {
    it('returns the count from the c column', async () => {
      const select = chain({ c: 42 }, 'executeTakeFirstOrThrow');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.countPending();

      expect(result).toBe(42);
      // Ensure the four nullness predicates are wired up.
      const wheres = select.calls.filter((c) => c.name === 'where');
      const cols = wheres.map((w) => w.args[0]);
      expect(cols).toEqual(['block', 'tx', 'raw_transaction', 'time']);
    });
  });

  describe('countInProgress', () => {
    it('returns the count from the c column', async () => {
      const select = chain({ c: 10 }, 'executeTakeFirstOrThrow');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.countInProgress();

      expect(result).toBe(10);
      const wheres = select.calls.filter((c) => c.name === 'where');
      expect(wheres).toHaveLength(1);
      expect(wheres[0].args[0]).toBe('block');
    });
  });

  describe('getByHash', () => {
    it('returns the row when present', async () => {
      const row = { id: BigInt(1), hash: 'h', type: 'sha256' };
      const select = chain(row, 'executeTakeFirst');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.getByHash('h');

      expect(result).toEqual(row);
      const wheres = select.calls.filter((c) => c.name === 'where');
      expect(wheres[0].args).toEqual(['hash', '=', 'h']);
      expect(wheres[1].args).toEqual(['type', '=', 'sha256']);
    });

    it('returns null when not found', async () => {
      const select = chain(undefined, 'executeTakeFirst');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.getByHash('nope');

      expect(result).toBeNull();
    });
  });

  describe('getById', () => {
    it('selects all columns when no field projection requested', async () => {
      const row = { id: BigInt(1) };
      const select = chain(row, 'executeTakeFirst');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await repository.getById(BigInt(1), {});

      expect(result).toEqual(row);
    });

    it('respects the fields projection', async () => {
      const row = { hash: 'h', type: 'sha256' };
      const select = chain(row, 'executeTakeFirst');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      await repository.getById(BigInt(1), { fields: { stamps: ['hash', 'type'] } });

      const selectCall = select.calls.find((c) => c.name === 'select');
      expect(selectCall?.args[0]).toEqual(['hash', 'type']);
    });
  });

  describe('listStamps', () => {
    it('returns rows + count in the bare case', async () => {
      const rowsChain = chain([], 'execute');
      const countChain = chain({ c: 0 }, 'executeTakeFirstOrThrow');
      (db.selectFrom as jest.Mock)
        .mockReturnValueOnce(rowsChain.proxy)
        .mockReturnValueOnce(countChain.proxy);

      const result = await repository.listStamps();

      expect(result).toEqual({ rows: [], count: 0 });
    });

    it('rejects unknown filter operators with BadFilterError', async () => {
      const rowsChain = chain([], 'execute');
      const countChain = chain({ c: 0 }, 'executeTakeFirstOrThrow');
      (db.selectFrom as jest.Mock)
        .mockReturnValueOnce(rowsChain.proxy)
        .mockReturnValueOnce(countChain.proxy);
      const opts: SelectOptions = { filters: { hash: { weird: 'x' } } };

      // The where lambda is recorded but invoked synchronously by Kysely
      // at execute time. Our chain doesn't invoke it, so we trigger the
      // translator manually by inspecting the captured callable.
      await repository.listStamps(opts);
      const whereCall = rowsChain.calls.find((c) => c.name === 'where');
      const whereLambda = whereCall?.args[0] as (eb: any) => unknown;
      // Build a faux ExpressionBuilder that just returns its args so we
      // can drive the translator's branches without spinning up Kysely.
      const fakeEb: any = (...args: unknown[]) => ({ args });
      fakeEb.and = (xs: unknown[]) => xs;

      expect(() => whereLambda(fakeEb)).toThrow(BadFilterError);
    });
  });
});
