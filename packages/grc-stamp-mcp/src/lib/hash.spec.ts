import {
  describe, it, expect, afterAll,
} from 'vitest';
import { writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { hashText, hashFile, isSha256Hex } from './hash.ts';

// SHA-256("abc"), a NIST test vector.
const ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
// SHA-256("").
const EMPTY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

describe('isSha256Hex', () => {
  it('accepts 64 hex chars in either case', () => {
    expect(isSha256Hex(ABC)).toBe(true);
    expect(isSha256Hex(ABC.toUpperCase())).toBe(true);
  });

  it('rejects wrong length or non-hex', () => {
    expect(isSha256Hex('abc')).toBe(false);
    expect(isSha256Hex(`${ABC}0`)).toBe(false);
    expect(isSha256Hex(ABC.replace('a', 'z'))).toBe(false);
  });
});

describe('hashText', () => {
  it('matches known SHA-256 vectors', () => {
    expect(hashText('abc')).toBe(ABC);
    expect(hashText('')).toBe(EMPTY);
  });
});

describe('hashFile', () => {
  const file = path.join(tmpdir(), `grc-stamp-mcp-hash-${process.pid}.txt`);

  afterAll(async () => {
    await rm(file, { force: true });
  });

  it('hashes file contents by streaming', async () => {
    await writeFile(file, 'abc');
    expect(await hashFile(file)).toBe(ABC);
  });

  it('rejects with ENOENT for a missing file', async () => {
    await expect(hashFile(`${file}.nope`)).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
