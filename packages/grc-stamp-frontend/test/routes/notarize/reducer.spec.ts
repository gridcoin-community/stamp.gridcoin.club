import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import {
  reducer,
  ActionType,
  InitialState,
  StateInterface,
} from '@/routes/notarize/reducer';
import { makeFile, makeStateWithFile } from './helpers';

// Mock URL.createObjectURL and URL.revokeObjectURL
const createObjectURLMock = vi.fn((file: File) => `blob:${file.name}`);
const revokeObjectURLMock = vi.fn();
vi.stubGlobal('URL', {
  ...URL,
  createObjectURL: createObjectURLMock,
  revokeObjectURL: revokeObjectURLMock,
});

describe('reducer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ActionType.add', () => {
    it('should add a file to state with a preview URL', () => {
      const file = makeFile('test.txt');
      const result = reducer(InitialState, {
        type: ActionType.add,
        payload: { file },
      });
      expect(result['test.txt']).toBeDefined();
      expect(result['test.txt'].file).toBe(file);
      expect(result['test.txt'].preview).toBe('blob:test.txt');
      expect(result['test.txt'].existing).toBe(false);
      expect(createObjectURLMock).toHaveBeenCalledWith(file);
    });

    it('should not mutate the original state', () => {
      const state = { ...InitialState };
      const file = makeFile('test.txt');
      const result = reducer(state, {
        type: ActionType.add,
        payload: { file },
      });
      expect(result).not.toBe(state);
      expect(state).toEqual(InitialState);
    });
  });

  describe('ActionType.remove', () => {
    it('should remove a file from state and revoke its preview URL', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.remove,
        payload: { id: 'test.txt' },
      });
      expect(result).not.toHaveProperty('test.txt');
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test.txt');
    });

    it('should handle removing a non-existent file gracefully', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.remove,
        payload: { id: 'nonexistent.txt' },
      });
      expect(result).toHaveProperty('test.txt');
      expect(revokeObjectURLMock).not.toHaveBeenCalled();
    });

    it('should not revoke if no preview exists', () => {
      const file = makeFile('test.txt');
      const state: StateInterface = {
        'test.txt': { file, existing: false },
      };
      reducer(state, {
        type: ActionType.remove,
        payload: { id: 'test.txt' },
      });
      expect(revokeObjectURLMock).not.toHaveBeenCalled();
    });
  });

  describe('ActionType.clear', () => {
    it('should return initial state and revoke all preview URLs', () => {
      const state: StateInterface = {
        ...makeStateWithFile('a.txt'),
        ...makeStateWithFile('b.txt'),
      };
      const result = reducer(state, { type: ActionType.clear });
      expect(result).toEqual(InitialState);
      expect(revokeObjectURLMock).toHaveBeenCalledTimes(2);
    });

    it('should skip files without previews', () => {
      const file = makeFile('no-preview.txt');
      const state: StateInterface = {
        'no-preview.txt': { file, existing: false },
      };
      reducer(state, { type: ActionType.clear });
      expect(revokeObjectURLMock).not.toHaveBeenCalled();
    });
  });

  describe('ActionType.hash', () => {
    it('should set hash on the specified file', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.hash,
        payload: { id: 'test.txt', hash: 'sha256-hash-value' },
      });
      expect(result['test.txt'].hash).toBe('sha256-hash-value');
    });

    it('should not mutate the original file entry', () => {
      const state = makeStateWithFile('test.txt');
      const original = state['test.txt'];
      reducer(state, {
        type: ActionType.hash,
        payload: { id: 'test.txt', hash: 'sha256-hash-value' },
      });
      expect(original.hash).toBeUndefined();
    });

    it('should do nothing for non-existent file', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.hash,
        payload: { id: 'missing.txt', hash: 'hash' },
      });
      expect(result['test.txt'].hash).toBeUndefined();
    });
  });

  describe('ActionType.existing', () => {
    it('should mark file as existing with blockchain data', () => {
      const state = makeStateWithFile('test.txt');
      const blockchainData = { tx: 'tx-123', block: 100, time: 9999 };
      const result = reducer(state, {
        type: ActionType.existing,
        payload: { id: 'test.txt', blockchainData },
      });
      expect(result['test.txt'].existing).toBe(true);
      expect(result['test.txt'].blockchainData).toEqual(blockchainData);
    });
  });

  describe('ActionType.setId', () => {
    it('should set dataId on the specified file', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.setId,
        payload: { id: 'test.txt', dataId: 42 },
      });
      expect(result['test.txt'].dataId).toBe(42);
    });
  });

  describe('ActionType.setTransaction', () => {
    it('should set tx in blockchainData', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.setTransaction,
        payload: { id: 'test.txt', transaction: 'tx-abc' },
      });
      expect(result['test.txt'].blockchainData?.tx).toBe('tx-abc');
    });

    it('should preserve existing blockchainData fields', () => {
      const state = makeStateWithFile('test.txt');
      // First set a block
      const withBlock = reducer(state, {
        type: ActionType.setBlock,
        payload: { id: 'test.txt', block: 500 },
      });
      // Then set a transaction
      const result = reducer(withBlock, {
        type: ActionType.setTransaction,
        payload: { id: 'test.txt', transaction: 'tx-abc' },
      });
      expect(result['test.txt'].blockchainData?.block).toBe(500);
      expect(result['test.txt'].blockchainData?.tx).toBe('tx-abc');
    });
  });

  describe('ActionType.setBlock', () => {
    it('should set block in blockchainData', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.setBlock,
        payload: { id: 'test.txt', block: 12345 },
      });
      expect(result['test.txt'].blockchainData?.block).toBe(12345);
    });
  });

  describe('ActionType.setTime', () => {
    it('should set time in blockchainData', () => {
      const state = makeStateWithFile('test.txt');
      const result = reducer(state, {
        type: ActionType.setTime,
        payload: { id: 'test.txt', time: 1700000000 },
      });
      expect(result['test.txt'].blockchainData?.time).toBe(1700000000);
    });
  });

  describe('unknown action', () => {
    it('should throw for unknown action type', () => {
      expect(() => {
        reducer(InitialState, { type: 999 } as any);
      }).toThrow('Action type is unknown');
    });
  });
});
