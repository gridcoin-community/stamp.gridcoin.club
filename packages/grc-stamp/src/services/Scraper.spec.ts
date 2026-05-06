import { Scraper } from './Scraper';
import { log } from '../lib/log';
import { Stamp } from '../models/Stamp';

jest.mock('../lib/log');
jest.mock('../models/Stamp');
jest.mock('../lib/db', () => ({ db: {} }));
jest.mock('../lib/emitter', () => ({
  getEmitter: () => ({ emit: jest.fn() }),
  emitPendingCount: jest.fn(),
  emitIndexerStatus: jest.fn(),
}));
jest.mock('../config', () => ({
  config: {
    START_BLOCK: 1000,
    BLOCK_GROUPS: 2,
    BACKFILL_BATCH_SIZE: 1000,
    REDIS_SCRAPER_KEY: 'grc-stamp:processedBlock',
  },
}));

// Matches src/constants.ts. Inlined here so tests stay self-contained
// and don't reach across module boundaries for a constant.
const BACKFILL_THRESHOLD_BLOCKS = 1000;

describe('Scraper', () => {
  let scraper: Scraper;
  let mockRedis: any;
  let mockRpc: any;
  const blockPrefix = '5ea1ed';

  beforeEach(() => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockRpc = {
      getStakingInfo: jest.fn(),
      getBlockByNumber: jest.fn(),
      getBlocksBatch: jest.fn(),
    };

    scraper = new Scraper(mockRedis, mockRpc, blockPrefix);
  });

  describe('scrape — tip mode (lag ≤ threshold)', () => {
    it('processes blocks one by one when only a couple behind', async () => {
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1002 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledTimes(2);
      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1001, true);
      expect(mockRpc.getBlocksBatch).not.toHaveBeenCalled();
    });

    it('uses START_BLOCK when no redis value exists', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1005 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1001, true);
    });

    it('processes remaining blocks when one block behind chain tip', async () => {
      mockRedis.get.mockResolvedValue('1003');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1004 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledTimes(1);
      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1004, true);
    });

    it('returns false when at the tip', async () => {
      mockRedis.get.mockResolvedValue('1004');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1004 });

      const moreWork = await scraper.scrape();

      expect(moreWork).toBe(false);
      expect(mockRpc.getBlockByNumber).not.toHaveBeenCalled();
      expect(mockRpc.getBlocksBatch).not.toHaveBeenCalled();
    });
  });

  describe('scrape — backfill mode (lag > threshold)', () => {
    it('uses getBlocksBatch when far behind chain tip', async () => {
      // 1500 blocks of lag (well past the 1000-block threshold).
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 2500 });
      mockRpc.getBlocksBatch.mockResolvedValue({
        blocks: Array.from({ length: 1000 }, (_, i) => ({
          height: 1001 + i,
          tx: [],
          time: 123456789,
        })),
        blockCount: 1000,
      });

      const moreWork = await scraper.scrape();

      expect(mockRpc.getBlocksBatch).toHaveBeenCalledTimes(1);
      // First batch is capped at BACKFILL_BATCH_SIZE (1000), not the full lag.
      expect(mockRpc.getBlocksBatch).toHaveBeenCalledWith(1001, 1000, true);
      expect(mockRpc.getBlockByNumber).not.toHaveBeenCalled();
      // Cursor persisted exactly once at the end of the batch.
      expect(mockRedis.set).toHaveBeenCalledTimes(1);
      expect(mockRedis.set).toHaveBeenCalledWith('grc-stamp:processedBlock', 2000);
      // 500 blocks still remain (under threshold) — caller should NOT schedule
      // immediately; the next tick will pick up tip-mode.
      expect(moreWork).toBe(false);
    });

    it('caps the batch at BACKFILL_BATCH_SIZE when lag is huge', async () => {
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 100000 });
      mockRpc.getBlocksBatch.mockResolvedValue({
        blocks: Array.from({ length: 1000 }, (_, i) => ({
          height: 1001 + i,
          tx: [],
          time: 123456789,
        })),
        blockCount: 1000,
      });

      const moreWork = await scraper.scrape();

      expect(mockRpc.getBlocksBatch).toHaveBeenCalledWith(1001, 1000, true);
      expect(mockRedis.set).toHaveBeenCalledWith('grc-stamp:processedBlock', 2000);
      // Plenty of lag remains — caller should schedule the next batch immediately.
      expect(moreWork).toBe(true);
    });

    it('flips back to per-block path once lag drops to the threshold', async () => {
      // Cursor sits exactly threshold-distance from tip → tip mode.
      mockRedis.get.mockResolvedValue(String(1100 - BACKFILL_THRESHOLD_BLOCKS));
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1100 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlocksBatch).not.toHaveBeenCalled();
      expect(mockRpc.getBlockByNumber).toHaveBeenCalledTimes(BACKFILL_THRESHOLD_BLOCKS);
    });

    it('does NOT advance the cursor if the batch RPC fails', async () => {
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1200 });
      mockRpc.getBlocksBatch.mockRejectedValue(new Error('RPC Error'));

      await scraper.scrape();

      expect(log.error).toHaveBeenCalled();
      expect(mockRedis.set).not.toHaveBeenCalled();
    });
  });

  describe('block processing', () => {
    const HASH_A = '5bbbbbee48b735693478140de1b7f09fe0acddc0c7bce87f8665074efe53410f';
    const HASH_B = '7158380aca149fa8422fb1274a69155303d4aaa76bf67defe0bb31628293afd2';
    const VERSION = '000001';

    function makeTx(txid: string, hex: string): any {
      // Real Gridcoin RPC returns the asm form with the wrapper byte stripped
      // and the pushed payload rendered as hex. Build it the same way so the
      // scraper's `OP_RETURN <prefix>` regex sees a realistic shape.
      const payloadHex = hex.startsWith('6a4c')
        ? hex.slice(6)
        : hex.slice(4);
      return {
        txid,
        vout: [{
          scriptPubKey: { hex, asm: `OP_RETURN ${payloadHex}` },
        }],
      };
    }

    function setupMocks(tx: any) {
      // blocks=1001 keeps the loop to a single iteration so saveOrUpdate
      // call counts reflect the fixture and not BLOCK_GROUPS=2. Lag=1
      // also keeps us in tip mode (per-block path) which exercises
      // getBlockByNumber.
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1001 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [tx],
        time: 123456789,
      });
    }

    let mockSaveOrUpdate: jest.Mock;

    beforeEach(() => {
      mockSaveOrUpdate = jest.fn().mockResolvedValue(undefined);
      (Stamp as jest.Mock).mockImplementation(() => ({
        saveOrUpdate: mockSaveOrUpdate,
      }));
    });

    it('indexes both hashes from a two-hash transaction', async () => {
      const hex = `6a46${blockPrefix}${VERSION}${HASH_A}${HASH_B}`;
      setupMocks(makeTx('two-hash-tx', hex));

      await scraper.scrape();

      expect(mockSaveOrUpdate).toHaveBeenCalledTimes(2);
      expect(mockRedis.set).toHaveBeenCalledWith('grc-stamp:processedBlock', 1001);
    });

    it('indexes a single-hash transaction', async () => {
      const hex = `6a26${blockPrefix}${VERSION}${HASH_A}`;
      setupMocks(makeTx('single-hash-tx', hex));

      await scraper.scrape();

      expect(mockSaveOrUpdate).toHaveBeenCalledTimes(1);
    });

    it('skips transactions that use a push-data-1 wrapper', async () => {
      // 6a4c46… is a non-conformant encoding of the same payload length.
      const hex = `6a4c46${blockPrefix}${VERSION}${HASH_A}${HASH_B}`;
      setupMocks(makeTx('pushdata1-tx', hex));

      await scraper.scrape();

      expect(mockSaveOrUpdate).not.toHaveBeenCalled();
    });

    it('skips transactions with an unknown protocol version', async () => {
      const hex = `6a46${blockPrefix}000099${HASH_A}${HASH_B}`;
      setupMocks(makeTx('future-version-tx', hex));

      await scraper.scrape();

      expect(mockSaveOrUpdate).not.toHaveBeenCalled();
    });

    it('skips transactions with a malformed hash slot', async () => {
      // Truncated payload: declares 6a46 (70-byte push) but only carries one
      // hash. The second slot can't pass the 64-hex-char gate.
      const hex = `6a46${blockPrefix}${VERSION}${HASH_A}${HASH_B.slice(0, 32)}`;
      setupMocks(makeTx('truncated-tx', hex));

      await scraper.scrape();

      expect(mockSaveOrUpdate).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getStakingInfo.mockResolvedValue({ blocks: 1002 });
      mockRpc.getBlockByNumber.mockRejectedValue(new Error('RPC Error'));

      await scraper.scrape();

      expect(log.error).toHaveBeenCalled();
    });
  });
});
