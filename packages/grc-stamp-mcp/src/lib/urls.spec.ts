import { describe, it, expect } from 'vitest';
import type { Config } from '../config.ts';
import { proofUrl, certificateUrl, txUrl } from './urls.ts';

const config: Config = {
  network: 'testnet',
  apiUrl: 'https://testnet-stamp.gridcoin.club/api',
  webUrl: 'https://testnet-stamp.gridcoin.club',
  explorerTxUrl: 'https://testnet.gridcoinstats.eu/tx/[data]',
  logLevel: 'info',
  maxStampsPerMinute: 20,
  transport: 'stdio',
  port: 7010,
};

const HASH = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

describe('url builders', () => {
  it('builds the public proof page url', () => {
    expect(proofUrl(config, HASH)).toBe(`https://testnet-stamp.gridcoin.club/proof/${HASH}`);
  });

  it('builds the certificate pdf url', () => {
    expect(certificateUrl(config, HASH))
      .toBe(`https://testnet-stamp.gridcoin.club/proof/${HASH}/certificate.pdf`);
  });

  it('substitutes the txid into the explorer template', () => {
    expect(txUrl(config, 'deadbeef')).toBe('https://testnet.gridcoinstats.eu/tx/deadbeef');
  });

  it('returns undefined when there is no txid', () => {
    expect(txUrl(config, null)).toBeUndefined();
    expect(txUrl(config, undefined)).toBeUndefined();
  });
});
