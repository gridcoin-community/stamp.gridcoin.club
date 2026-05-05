import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import { txUrl, blockUrl } from '@/lib/explorerLinks';

describe('explorerLinks', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_EXPLORER_TX_URL', 'https://explorer.example.com/tx/[data]');
    vi.stubEnv('NEXT_PUBLIC_EXPLORER_BLOCK_URL', 'https://explorer.example.com/block/[data]');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('txUrl', () => {
    it('should substitute tx hash into the URL template', () => {
      expect(txUrl('abc123')).toBe('https://explorer.example.com/tx/abc123');
    });

    it('returns undefined when tx is undefined', () => {
      expect(txUrl(undefined)).toBeUndefined();
    });

    it('returns undefined when tx is empty string', () => {
      expect(txUrl('')).toBeUndefined();
    });

    it('returns undefined when env var is not set', () => {
      delete process.env.NEXT_PUBLIC_EXPLORER_TX_URL;
      expect(txUrl('abc123')).toBeUndefined();
    });
  });

  describe('blockUrl', () => {
    it('should substitute block number into the URL template', () => {
      expect(blockUrl(12345)).toBe('https://explorer.example.com/block/12345');
    });

    it('returns undefined when block is undefined', () => {
      expect(blockUrl(undefined)).toBeUndefined();
    });

    it('returns undefined when block is 0', () => {
      expect(blockUrl(0)).toBeUndefined();
    });

    it('returns undefined when env var is not set', () => {
      delete process.env.NEXT_PUBLIC_EXPLORER_BLOCK_URL;
      expect(blockUrl(12345)).toBeUndefined();
    });
  });
});
