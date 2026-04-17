import { describe, it, expect } from 'vitest';
import {
  stateHasFile,
  getFirstFromTheStore,
  readableFileSize,
} from '@/routes/notarize/actions';
import { StateInterface } from '@/routes/notarize/reducer';
import { makeFile } from './helpers';

describe('stateHasFile', () => {
  it('should return true when state has entries', () => {
    const state: StateInterface = {
      'test.txt': { file: makeFile('test.txt'), existing: false },
    };
    expect(stateHasFile(state)).toBe(true);
  });

  it('should return false for empty state', () => {
    expect(stateHasFile({})).toBe(false);
  });
});

describe('getFirstFromTheStore', () => {
  it('should return the first file entry', () => {
    const file = makeFile('test.txt');
    const state: StateInterface = {
      'test.txt': { file, existing: false },
    };
    const result = getFirstFromTheStore(state);
    expect(result.file).toBe(file);
  });

  it('should throw when state is empty', () => {
    expect(() => getFirstFromTheStore({})).toThrow('Can not get element from the store');
  });
});

describe('readableFileSize', () => {
  it.each([
    [0, '0 B'],
    [100, '100 B'],
    [1024, '1 KB'],
    [10002, '9.8 KB'],
    [10002100, '9.5 MB'],
    [1024 * 1024 * 1024 * 2.5, '2.5 GB'],
  ])('should format %i as %s', (bytes, expected) => {
    expect(readableFileSize(bytes)).toBe(expected);
  });
});
