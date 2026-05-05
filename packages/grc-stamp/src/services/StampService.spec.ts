import { PrismaClient } from '@prisma/client';
import { StampService } from './StampService';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { MINIMUM, MIN_FEE } from '../constants';

jest.mock('@prisma/client');
jest.mock('../lib/gridcoin');
jest.mock('../lib/log');
jest.mock('../lib/emitter', () => ({
  getEmitter: () => ({ emit: jest.fn() }),
  emitPendingCount: jest.fn(),
}));

describe('StampService', () => {
  let service: StampService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = {
      stamps: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
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
      expect(log.info).toHaveBeenCalledWith('[StampService] Nothing to publish');
    });

    it('should publish stamps and update database when stamps are ready', async () => {
      const mockStamps = [
        { id: 1, hash: 'hash1' },
        { id: 2, hash: 'hash2' },
      ];
      const mockTxId = 'testTxId';

      (mockPrisma.stamps.findMany as any)
        .mockResolvedValueOnce(mockStamps)
        .mockResolvedValueOnce([]);
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

    it('skips overlapping ticks while a publish run is still in progress', async () => {
      const mockStamps = [
        { id: 1, hash: 'hash1' },
        { id: 2, hash: 'hash2' },
      ];
      let resolveBurn!: (tx: string) => void;
      const burnPromise = new Promise<string>((r) => { resolveBurn = r; });

      (mockPrisma.stamps.findMany as any)
        .mockResolvedValueOnce(mockStamps)
        .mockResolvedValueOnce([]);
      (rpc.burn as jest.Mock).mockReturnValueOnce(burnPromise);

      // First call enters the critical section and parks on rpc.burn.
      const first = service.publishStamp();
      // Second call should observe `publishing=true` and bail without
      // touching prisma or rpc.
      const second = service.publishStamp();

      resolveBurn('tx-1');
      await Promise.all([first, second]);

      expect(rpc.burn).toHaveBeenCalledTimes(1);
      expect(mockPrisma.stamps.updateMany).toHaveBeenCalledTimes(1);
    });

    it('should drain multiple batches until the queue is empty', async () => {
      const batch1 = [
        { id: 1, hash: 'hash1' },
        { id: 2, hash: 'hash2' },
      ];
      const batch2 = [
        { id: 3, hash: 'hash3' },
      ];

      (mockPrisma.stamps.findMany as any)
        .mockResolvedValueOnce(batch1)
        .mockResolvedValueOnce(batch2)
        .mockResolvedValueOnce([]);
      (rpc.burn as jest.Mock)
        .mockResolvedValueOnce('tx1')
        .mockResolvedValueOnce('tx2');

      await service.publishStamp();

      expect(rpc.burn).toHaveBeenCalledTimes(2);
      expect(mockPrisma.stamps.updateMany).toHaveBeenCalledTimes(2);
      expect(mockPrisma.stamps.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        data: { tx: 'tx1' },
      });
      expect(mockPrisma.stamps.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [3] } },
        data: { tx: 'tx2' },
      });
    });
  });
});
