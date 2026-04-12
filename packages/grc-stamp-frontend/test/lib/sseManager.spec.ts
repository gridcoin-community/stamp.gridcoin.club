import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';

describe('SSEManager', () => {
  let closeMock: ReturnType<typeof vi.fn>;
  let onmessageHandler: ((e: MessageEvent) => void) | null;

  beforeEach(() => {
    closeMock = vi.fn();
    onmessageHandler = null;

    // Use a class (constructor) instead of arrow function for `new EventSource()`
    vi.stubGlobal('EventSource', class MockEventSource {
      url: string;

      close = closeMock;

      onerror: any = null;

      constructor(url: string) {
        this.url = url;
      }

      set onmessage(handler: any) { onmessageHandler = handler; }

      get onmessage() { return onmessageHandler; }
    });

    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be a singleton', async () => {
    const mod1 = await import('@/lib/sseManager');
    const mod2 = await import('@/lib/sseManager');
    expect(mod1.default).toBe(mod2.default);
  });

  it('should connect and create an EventSource', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    sseManager.connect('http://localhost/events');
    // Connection happened if onmessage was set
    expect(onmessageHandler).not.toBeNull();
  });

  it('should not create a second EventSource if already connected', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    sseManager.connect('http://localhost/events');
    const firstHandler = onmessageHandler;
    sseManager.connect('http://localhost/events2');
    // Handler should be the same (no second connection)
    expect(onmessageHandler).toBe(firstHandler);
  });

  it('should dispatch parsed messages to registered listeners', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    const callback = vi.fn();
    sseManager.connect('http://localhost/events');
    sseManager.on('processBlock', callback);

    onmessageHandler!({ data: JSON.stringify({ type: 'processBlock', data: { block: 42 } }) } as MessageEvent);

    expect(callback).toHaveBeenCalledWith({ block: 42 });
  });

  it('should not dispatch to listeners of a different event type', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    const callback = vi.fn();
    sseManager.connect('http://localhost/events');
    sseManager.on('stampSubmitted', callback);

    onmessageHandler!({ data: JSON.stringify({ type: 'processBlock', data: { block: 1 } }) } as MessageEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove listeners with off()', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    const callback = vi.fn();
    sseManager.connect('http://localhost/events');
    sseManager.on('processBlock', callback);
    sseManager.off('processBlock', callback);

    onmessageHandler!({ data: JSON.stringify({ type: 'processBlock', data: { block: 1 } }) } as MessageEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should close EventSource on disconnect', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    sseManager.connect('http://localhost/events');
    sseManager.disconnect();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should handle malformed JSON gracefully', async () => {
    const { default: sseManager } = await import('@/lib/sseManager');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    sseManager.connect('http://localhost/events');

    // Should not throw
    onmessageHandler!({ data: 'not-json' } as MessageEvent);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
