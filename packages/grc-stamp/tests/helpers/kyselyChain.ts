// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChainResult = { proxy: any; calls: Array<{ name: string; args: unknown[] }> };

// Builds a chainable Kysely-shaped mock that resolves the named
// terminal call to `value`. Records every method invocation so tests
// can assert composition.
export function chain(value: unknown, terminalKey: string): ChainResult {
  const calls: Array<{ name: string; args: unknown[] }> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proxy: any = new Proxy({}, {
    get(_t, prop: string) {
      return (...args: unknown[]) => {
        calls.push({ name: prop, args });
        if (prop === terminalKey) {
          return Promise.resolve(value);
        }
        return proxy;
      };
    },
  });
  return { proxy, calls };
}
