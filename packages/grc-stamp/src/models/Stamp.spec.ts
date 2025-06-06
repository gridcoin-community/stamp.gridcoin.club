import { StampsType } from '@prisma/client';
import { Stamp } from './Stamp';
import { log } from '../lib/log';

// Mock modules
jest.mock('../lib/prisma', () => ({
  getPrisma: () => ({
    stamps: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  }),
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
    stamp.type = StampsType.ipfs;
    stamp.hash = 'test-hash';
    stamp.block = 123;
    stamp.tx = 'stamp-tx';
    stamp.rawTransaction = 'raw-tx';
    stamp.time = 456;
  });

  describe('saveOrUpdate', () => {
    it('should create new record when no existing record found', async () => {
      stamp.model.findFirst = jest.fn().mockResolvedValue(null);
      stamp.model.create = jest.fn().mockResolvedValue({ id: 1 });

      await stamp.saveOrUpdate();

      expect(stamp.model.findFirst).toHaveBeenCalledWith({
        where: {
          protocol: 'test',
          hash: 'test-hash',
          tx: 'stamp-tx',
        },
      });
      expect(log.info).toHaveBeenCalledWith('Create new record');
      expect(stamp.model.create).toHaveBeenCalledWith({
        data: {
          protocol: 'test',
          hash: 'test-hash',
          type: StampsType.ipfs,
          block: 123,
          raw_transaction: 'raw-tx',
          time: 456,
          tx: 'stamp-tx',
        },
      });
    });

    it('should update existing record when found with null block', async () => {
      stamp.model.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        block: null,
      });
      stamp.model.update = jest.fn().mockResolvedValue({ id: 1 });

      await stamp.saveOrUpdate();

      expect(log.info).toHaveBeenCalledWith('Update existing record');
      expect(stamp.model.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          block: 123,
          raw_transaction: 'raw-tx',
          time: 456,
        },
      });
    });

    it('should do nothing when record exists with non-null block', async () => {
      stamp.model.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        block: 123,
      });

      const result = await stamp.saveOrUpdate();

      expect(stamp.model.update).not.toHaveBeenCalled();
      expect(stamp.model.create).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
