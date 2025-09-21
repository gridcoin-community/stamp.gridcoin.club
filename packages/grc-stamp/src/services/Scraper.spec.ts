import { Scraper } from './Scraper';
import { log } from '../lib/log';
import { Stamp } from '../models/Stamp';

jest.mock('.prisma/client');
jest.mock('../lib/log');
jest.mock('../models/Stamp');
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
  const blockPrefix = 'f055aa';

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
    it('should process transactions with valid OP_RETURN data', async () => {
      const mockTx = {
        txid: 'test-tx-id',
        vout: [{
          scriptPubKey: {
            hex: Buffer.from(`6a08${blockPrefix}4754535f76302e31307465737468617368`).toString('hex'),
            asm: `OP_RETURN ${blockPrefix}4754535f76302e31`,
          },
        }],
      };

      mockRedis.get.mockResolvedValue('1000');
      mockRpc.getMiningInfo.mockResolvedValue({ blocks: 1002 });
      mockRpc.getBlockByNumber.mockResolvedValue({
        tx: [mockTx],
        time: 123456789,
      });

      const mockSaveOrUpdate = jest.fn().mockResolvedValue(undefined);
      (Stamp as jest.Mock).mockImplementation(() => ({
        saveOrUpdate: mockSaveOrUpdate,
      }));

      await scraper.scrape();

      expect(mockSaveOrUpdate).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith('grc-stamp:processedBlock', 1001);
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
