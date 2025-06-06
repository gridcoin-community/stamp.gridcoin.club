import { PrismaClient } from '@prisma/client';
import { StampService } from './StampService';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { MINIMUM, MIN_FEE } from '../constants';

jest.mock('@prisma/client');
jest.mock('../lib/gridcoin');
jest.mock('../lib/log');

describe('StampService', () => {
  let service: StampService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = {
      stamps: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
    } as any;

    service = new StampService(mockPrisma);
  });

  describe('publishStamp', () => {
    it('should do nothing when no stamps are ready', async () => {
      (mockPrisma.stamps.findMany as any).mockResolvedValue([]);

      await service.publishStamp();

      expect(rpc.setTXfee).not.toHaveBeenCalled();
      expect(rpc.burn).not.toHaveBeenCalled();
      expect(log.info).toHaveBeenCalledWith('Nothing to publish');
    });

    it('should publish stamps and update database when stamps are ready', async () => {
      const mockStamps = [
        { id: 1, hash: 'hash1' },
        { id: 2, hash: 'hash2' },
      ];
      const mockTxId = 'testTxId';

      (mockPrisma.stamps.findMany as any).mockResolvedValue(mockStamps);
      (rpc.burn as jest.Mock).mockResolvedValue(mockTxId);

      await service.publishStamp();

      expect(rpc.setTXfee).toHaveBeenCalledWith(MIN_FEE);
      expect(rpc.burn).toHaveBeenCalledWith(MINIMUM, expect.stringContaining('hash1'));
      expect(mockPrisma.stamps.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1, 2] },
        },
        data: {
          tx: mockTxId,
        },
      });
    });
  });
});
