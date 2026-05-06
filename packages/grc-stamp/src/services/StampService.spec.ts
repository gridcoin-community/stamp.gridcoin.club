import { StampService } from './StampService';
import { rpc } from '../lib/gridcoin';
import { log } from '../lib/log';
import { MINIMUM, MIN_FEE } from '../constants';
import { chain, ChainResult } from '../../tests/helpers/kyselyChain';

jest.mock('../lib/gridcoin');
jest.mock('../lib/log');
jest.mock('../lib/emitter', () => ({
  getEmitter: () => ({ emit: jest.fn() }),
  emitPendingCount: jest.fn(),
}));

describe('StampService', () => {
  let service: StampService;
  let mockDb: { selectFrom: jest.Mock; updateTable: jest.Mock };
  let updateChains: Array<ChainResult>;

  beforeEach(() => {
    jest.clearAllMocks();
    updateChains = [];
    mockDb = {
      selectFrom: jest.fn(),
      updateTable: jest.fn().mockImplementation(() => {
        const c = chain([{}], 'execute');
        updateChains.push(c);
        return c.proxy;
      }),
    };

    service = new StampService(mockDb as any);
  });

  function queueSelect(rows: unknown[]): void {
    mockDb.selectFrom.mockReturnValueOnce(chain(rows, 'execute').proxy);
  }

  describe('publishStamp', () => {
    it('should do nothing when no stamps are ready', async () => {
      queueSelect([]);

      await service.publishStamp();

      expect(rpc.setTXfee).not.toHaveBeenCalled();
      expect(rpc.burn).not.toHaveBeenCalled();
      expect(log.info).toHaveBeenCalledWith('[StampService] Nothing to publish');
    });

    it('should publish stamps and update database when stamps are ready', async () => {
      const mockStamps = [
        { id: BigInt(1), hash: 'hash1' },
        { id: BigInt(2), hash: 'hash2' },
      ];
      const mockTxId = 'testTxId';

      queueSelect(mockStamps);
      queueSelect([]);
      (rpc.burn as jest.Mock).mockResolvedValue(mockTxId);

      await service.publishStamp();

      expect(rpc.setTXfee).toHaveBeenCalledWith(MIN_FEE);
      expect(rpc.burn).toHaveBeenCalledWith(MINIMUM, expect.stringContaining('hash1'));
      expect(mockDb.updateTable).toHaveBeenCalledWith('stamps');
      const setCall = updateChains[0].calls.find((c) => c.name === 'set');
      expect(setCall?.args[0]).toEqual({ tx: mockTxId });
      const whereCall = updateChains[0].calls.find((c) => c.name === 'where');
      expect(whereCall?.args).toEqual(['id', 'in', [BigInt(1), BigInt(2)]]);
    });

    it('skips overlapping ticks while a publish run is still in progress', async () => {
      const mockStamps = [
        { id: BigInt(1), hash: 'hash1' },
        { id: BigInt(2), hash: 'hash2' },
      ];
      let resolveBurn!: (tx: string) => void;
      const burnPromise = new Promise<string>((r) => { resolveBurn = r; });

      queueSelect(mockStamps);
      queueSelect([]);
      (rpc.burn as jest.Mock).mockReturnValueOnce(burnPromise);

      // First call enters the critical section and parks on rpc.burn.
      const first = service.publishStamp();
      // Second call should observe `publishing=true` and bail without
      // touching the db or rpc.
      const second = service.publishStamp();

      resolveBurn('tx-1');
      await Promise.all([first, second]);

      expect(rpc.burn).toHaveBeenCalledTimes(1);
      expect(mockDb.updateTable).toHaveBeenCalledTimes(1);
    });

    it('should drain multiple batches until the queue is empty', async () => {
      const batch1 = [
        { id: BigInt(1), hash: 'hash1' },
        { id: BigInt(2), hash: 'hash2' },
      ];
      const batch2 = [
        { id: BigInt(3), hash: 'hash3' },
      ];

      queueSelect(batch1);
      queueSelect(batch2);
      queueSelect([]);
      (rpc.burn as jest.Mock)
        .mockResolvedValueOnce('tx1')
        .mockResolvedValueOnce('tx2');

      await service.publishStamp();

      expect(rpc.burn).toHaveBeenCalledTimes(2);
      expect(mockDb.updateTable).toHaveBeenCalledTimes(2);
      const set1 = updateChains[0].calls.find((c) => c.name === 'set');
      const where1 = updateChains[0].calls.find((c) => c.name === 'where');
      expect(set1?.args[0]).toEqual({ tx: 'tx1' });
      expect(where1?.args).toEqual(['id', 'in', [BigInt(1), BigInt(2)]]);
      const set2 = updateChains[1].calls.find((c) => c.name === 'set');
      const where2 = updateChains[1].calls.find((c) => c.name === 'where');
      expect(set2?.args[0]).toEqual({ tx: 'tx2' });
      expect(where2?.args).toEqual(['id', 'in', [BigInt(3)]]);
    });
  });
});
