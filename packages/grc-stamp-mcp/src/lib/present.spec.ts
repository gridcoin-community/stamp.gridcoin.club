import { describe, it, expect } from 'vitest';
import { isConfirmed, formatUtc } from './present.js';
import type { Stamp } from './stampClient.js';

const base: Stamp = {
  id: '1', protocol: '0.0.1', type: 'sha256', hash: 'a'.repeat(64),
};

describe('isConfirmed', () => {
  it('is false when block/tx/time are missing', () => {
    expect(isConfirmed(base)).toBe(false);
    expect(isConfirmed({ ...base, block: 123 })).toBe(false);
    expect(isConfirmed({ ...base, block: 123, tx: 'abc' })).toBe(false);
  });

  it('is true only when block, tx and time are all present', () => {
    expect(isConfirmed({
      ...base, block: 123, tx: 'abc', time: 1_700_000_000,
    })).toBe(true);
  });

  it('treats block 0 as present but time null as unconfirmed', () => {
    expect(isConfirmed({
      ...base, block: 0, tx: 'abc', time: null,
    })).toBe(false);
  });
});

describe('formatUtc', () => {
  it('renders unix seconds as an unambiguous UTC string', () => {
    expect(formatUtc(1_700_000_000)).toBe('2023-11-14 22:13:20 UTC');
  });
});
