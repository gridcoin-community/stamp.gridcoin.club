import { Scraper } from './Scraper';
import { log } from '../lib/log';
import { Stamp } from '../models/Stamp';

jest.mock('.prisma/client');
jest.mock('../lib/log');
jest.mock('../models/Stamp');
jest.mock('../lib/emitter', () => ({
  getEmitter: () => ({ emit: jest.fn() }),
  emitPendingCount: jest.fn(),
}));
jest.mock('../config', () => ({
  config: {
    START_BLOCK: 1000,
    BLOCK_GROUPS: 2,
    REDIS_SCRAPER_KEY: 'grc-stamp:processedBlock',
  },
}));

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
      getMiningInfo: jest.fn(),
      getBlockByNumber: jest.fn(),
    };

    scraper = new Scraper(mockRedis, mockRpc, blockPrefix);
  });

  describe('scrape', () => {
    it('should process blocks up to BLOCK_GROUPS limit', async () => {
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1002 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledTimes(2);
      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1001, true);
    });

    it('should use START_BLOCK when no redis value exists', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1005 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1001, true);
    });

    it('should process remaining blocks when near chain tip', async () => {
      mockRedis.get.mockResolvedValue('1003');
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1004 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [],
        time: 123456789,
      });

      await scraper.scrape();

      expect(mockRpc.getBlockByNumber).toHaveBeenCalledTimes(1);
      expect(mockRpc.getBlockByNumber).toHaveBeenCalledWith(1004, true);
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
      // call counts reflect the fixture and not BLOCK_GROUPS=2.
      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1001 });
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
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1002 });
      mockRpc.getBlockByNumber.mockRejectedValue(new Error('RPC Error'));

      await scraper.scrape();

      expect(log.error).toHaveBeenCalled();
    });
  });
});
