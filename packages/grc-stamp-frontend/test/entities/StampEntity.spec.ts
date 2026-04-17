import { describe, it, expect } from 'vitest';
import { StampEntity } from '@/entities/StampEntity';

describe('StampEntity', () => {
  describe('constructor', () => {
    it('should initialize all fields from data, converting string id to number', () => {
      const entity = new StampEntity({
        id: '42',
        protocol: '0.0.1',
        hash: 'abc123',
        block: 100,
        tx: 'tx-hash',
        time: 1629273488,
      });
      expect(entity.id).toBe(42);
      expect(entity.protocol).toBe('0.0.1');
      expect(entity.hash).toBe('abc123');
      expect(entity.block).toBe(100);
      expect(entity.tx).toBe('tx-hash');
      expect(entity.time).toBe(1629273488);
    });

    it('should set id to undefined for non-numeric string', () => {
      const entity = new StampEntity({ id: 'not-a-number' });
      expect(entity.id).toBeUndefined();
    });

    it('should leave all fields undefined when no data is passed', () => {
      const entity = new StampEntity();
      expect(entity.id).toBeUndefined();
      expect(entity.protocol).toBeUndefined();
      expect(entity.hash).toBeUndefined();
      expect(entity.block).toBeUndefined();
      expect(entity.tx).toBeUndefined();
      expect(entity.time).toBeUndefined();
    });
  });

  describe('isFinished', () => {
    it('should return truthy when tx, block, and time are all present', () => {
      const entity = new StampEntity({ tx: 'tx', block: 1, time: 1000 });
      expect(entity.isFinished()).toBeTruthy();
    });

    it('should return falsy when tx is missing', () => {
      const entity = new StampEntity({ block: 1, time: 1000 });
      expect(entity.isFinished()).toBeFalsy();
    });

    it('should return falsy when block is missing', () => {
      const entity = new StampEntity({ tx: 'tx', time: 1000 });
      expect(entity.isFinished()).toBeFalsy();
    });

    it('should return falsy when time is missing', () => {
      const entity = new StampEntity({ tx: 'tx', block: 1 });
      expect(entity.isFinished()).toBeFalsy();
    });

    it('should return falsy for empty entity', () => {
      const entity = new StampEntity();
      expect(entity.isFinished()).toBeFalsy();
    });
  });

  describe('toJson', () => {
    it('should serialize all fields, converting id back to string', () => {
      const entity = new StampEntity({
        id: '5',
        protocol: '0.0.1',
        hash: 'abc',
        block: 100,
        tx: 'tx-hash',
        time: 9999,
      });
      const json = entity.toJson();
      expect(json.id).toBe('5');
      expect(json.protocol).toBe('0.0.1');
      expect(json.hash).toBe('abc');
      expect(json.block).toBe(100);
      expect(json.tx).toBe('tx-hash');
      expect(json.time).toBe(9999);
    });

    it('should omit undefined fields', () => {
      const entity = new StampEntity({ hash: 'only-hash' });
      const json = entity.toJson();
      expect(json.hash).toBe('only-hash');
      expect(json).not.toHaveProperty('id');
      expect(json).not.toHaveProperty('tx');
      expect(json).not.toHaveProperty('block');
      expect(json).not.toHaveProperty('time');
      expect(json).not.toHaveProperty('protocol');
    });

    it('should return empty object for empty entity', () => {
      const entity = new StampEntity();
      const json = entity.toJson();
      expect(Object.keys(json)).toHaveLength(0);
    });
  });
});
