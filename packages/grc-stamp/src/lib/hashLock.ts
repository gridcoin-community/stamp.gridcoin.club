const locks = new Map<string, Promise<void>>();

/**
 * Serialize async operations keyed by a string (e.g. "hash:type").
 * Concurrent callers with the same key queue up; different keys run in parallel.
 */
export async function withHashLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  while (locks.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await locks.get(key)!.catch(() => {});
  }

  let release: () => void;
  const lock = new Promise<void>((r) => { release = r; });
  locks.set(key, lock);

  try {
    return await fn();
  } finally {
    locks.delete(key);
    release!();
  }
}
