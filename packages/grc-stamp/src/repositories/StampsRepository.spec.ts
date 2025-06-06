import { StampsType } from '@prisma/client';
import { SelectOptions, StampsRepositoryClass } from './StampsRepository';
import { Stamp } from '../models/Stamp';
import { PROTOCOL } from '../constants';

jest.mock('../models/Stamp');
jest.mock('.prisma/client');

describe('StampsRepository', () => {
  let repository: StampsRepositoryClass;
  let mockCreate: jest.Mock;
  let mockFindFirst: jest.Mock;
  let mockFindUnique: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockCount: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    mockFindFirst = jest.fn();
    mockFindUnique = jest.fn();
    mockFindMany = jest.fn();
    mockCount = jest.fn();

    (Stamp as jest.Mock).mockImplementation(() => ({
      model: {
        create: mockCreate,
        findFirst: mockFindFirst,
        findUnique: mockFindUnique,
        findMany: mockFindMany,
        count: mockCount,
      },
    }));

    repository = new StampsRepositoryClass(new Stamp());
  });

  describe('createStamp', () => {
    it('should create a stamp with default type', async () => {
      const hash = 'test-hash';
      await repository.createStamp(hash);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          protocol: PROTOCOL,
          type: StampsType.sha256,
          hash,
        },
      });
    });

    it('should create a stamp with specified type', async () => {
      const hash = 'test-hash';
      const type = StampsType.ipfs;
      await repository.createStamp(hash, type);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          protocol: PROTOCOL,
          type,
          hash,
        },
      });
    });

    it('should throw error if hash is missing', async () => {
      await expect(repository.createStamp('')).rejects.toThrow('Not enough data');
    });
  });

  describe('getByHash', () => {
    it('should find stamp by hash with default type', async () => {
      const hash = 'test-hash';
      await repository.getByHash(hash);

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { hash, type: StampsType.sha256 },
        orderBy: { time: 'asc' },
      });
    });

    it('should find stamp by hash with specified type', async () => {
      const hash = 'test-hash';
      const type = StampsType.ipfs;
      await repository.getByHash(hash, type);

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { hash, type },
        orderBy: { time: 'asc' },
      });
    });
  });

  describe('getById', () => {
    it('should find stamp by id without fields', async () => {
      const id = BigInt(1);
      await repository.getById(id, {});

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should find stamp by id with selected fields', async () => {
      const id = BigInt(1);
      const fields = { stamps: ['hash', 'type'] };
      await repository.getById(id, { fields });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          hash: true,
          type: true,
        },
      });
    });
  });

  describe('listStamps', () => {
    it('should list stamps without options', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.listStamps();

      expect(mockFindMany).toHaveBeenCalledWith({});
      expect(mockCount).toHaveBeenCalledWith({ where: {} });
    });

    it('should list stamps with all options', async () => {
      const options = {
        fields: { stamps: ['hash', 'type'] },
        pagination: { offset: 0, limit: 10 },
        filters: { type: StampsType.ipfs },
      } as SelectOptions;

      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.listStamps(options);

      expect(mockFindMany).toHaveBeenCalledWith({
        select: {
          hash: true,
          type: true,
        },
        skip: 0,
        take: 10,
        where: { type: StampsType.ipfs },
      });

      expect(mockCount).toHaveBeenCalledWith({
        where: { type: StampsType.ipfs },
      });
    });
  });
});
