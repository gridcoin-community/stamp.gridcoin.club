import { Stamp } from './Stamp';
import { db } from '../lib/db';
import { log } from '../lib/log';
import { chain } from '../../tests/helpers/kyselyChain';

jest.mock('../lib/db', () => ({
  db: {
    selectFrom: jest.fn(),
    updateTable: jest.fn(),
    insertInto: jest.fn(),
  },
}));

jest.mock('../lib/log', () => ({
  log: {
    info: jest.fn(),
  },
}));

describe('Stamp', () => {
  let stamp: Stamp;

  beforeEach(() => {
    jest.clearAllMocks();
    stamp = new Stamp();
    stamp.protocol = 'test';
    stamp.type = 'ipfs';
    stamp.hash = 'test-hash';
    stamp.block = 123;
    stamp.tx = 'stamp-tx' as any;
    stamp.rawTransaction = 'raw-tx';
    stamp.time = 456;
  });

  describe('saveOrUpdate', () => {
    it('should create new record when no existing record found', async () => {
      const select = chain(undefined, 'executeTakeFirst');
      const insert = chain([{}], 'execute');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);
      (db.insertInto as jest.Mock).mockReturnValue(insert.proxy);

      await stamp.saveOrUpdate();

      expect(db.selectFrom).toHaveBeenCalledWith('stamps');
      expect(log.info).toHaveBeenCalledWith('Create new record');
      expect(db.insertInto).toHaveBeenCalledWith('stamps');
      const values = insert.calls.find((c) => c.name === 'values');
      expect(values?.args[0]).toEqual({
        protocol: 'test',
        hash: 'test-hash',
        type: 'ipfs',
        block: BigInt(123),
        raw_transaction: 'raw-tx',
        time: 456,
        tx: 'stamp-tx',
      });
    });

    it('should update existing record when found with null block', async () => {
      const existing = { id: BigInt(1), block: null };
      const select = chain(existing, 'executeTakeFirst');
      const update = chain([{}], 'execute');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);
      (db.updateTable as jest.Mock).mockReturnValue(update.proxy);

      await stamp.saveOrUpdate();

      expect(log.info).toHaveBeenCalledWith('Update existing record');
      expect(db.updateTable).toHaveBeenCalledWith('stamps');
      const set = update.calls.find((c) => c.name === 'set');
      expect(set?.args[0]).toEqual({
        block: BigInt(123),
        raw_transaction: 'raw-tx',
        time: 456,
      });
      expect(db.insertInto).not.toHaveBeenCalled();
    });

    it('should do nothing when record exists with non-null block', async () => {
      const existing = { id: BigInt(1), block: BigInt(123) };
      const select = chain(existing, 'executeTakeFirst');
      (db.selectFrom as jest.Mock).mockReturnValue(select.proxy);

      const result = await stamp.saveOrUpdate();

      expect(db.updateTable).not.toHaveBeenCalled();
      expect(db.insertInto).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
