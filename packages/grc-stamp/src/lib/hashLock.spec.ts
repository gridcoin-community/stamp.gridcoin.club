/* eslint-disable no-promise-executor-return */
import { withHashLock } from './hashLock';

describe('withHashLock', () => {
  it('should execute the function and return its result', async () => {
    const result = await withHashLock('key1', async () => 42);
    expect(result).toBe(42);
  });

  it('should propagate errors from the function', async () => {
    await expect(
      withHashLock('key1', async () => { throw new Error('boom'); }),
    ).rejects.toThrow('boom');
  });

  it('should allow different keys to run in parallel', async () => {
    const order: string[] = [];

    const a = withHashLock('key-a', async () => {
      order.push('a-start');
      await new Promise((r) => setTimeout(r, 10));
      order.push('a-end');
    });

    const b = withHashLock('key-b', async () => {
      order.push('b-start');
      await new Promise((r) => setTimeout(r, 10));
      order.push('b-end');
    });

    await Promise.all([a, b]);

    // Both started before either finished
    expect(order.indexOf('a-start')).toBeLessThan(order.indexOf('a-end'));
    expect(order.indexOf('b-start')).toBeLessThan(order.indexOf('b-end'));
    expect(order.indexOf('b-start')).toBeLessThan(order.indexOf('a-end'));
  });

  it('should serialize concurrent calls with the same key', async () => {
    const order: string[] = [];

    const a = withHashLock('same', async () => {
      order.push('a-start');
      await new Promise((r) => setTimeout(r, 10));
      order.push('a-end');
    });

    const b = withHashLock('same', async () => {
      order.push('b-start');
      await new Promise((r) => setTimeout(r, 10));
      order.push('b-end');
    });

    await Promise.all([a, b]);

    // b must start after a finishes
    expect(order).toEqual(['a-start', 'a-end', 'b-start', 'b-end']);
  });

  it('should release the lock even if the function throws', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await withHashLock('key', async () => { throw new Error('fail'); }).catch(() => {});

    // A subsequent call should succeed, not deadlock
    const result = await withHashLock('key', async () => 'ok');
    expect(result).toBe('ok');
  });
});
