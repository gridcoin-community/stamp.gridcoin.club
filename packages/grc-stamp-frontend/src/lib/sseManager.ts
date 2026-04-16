import { BaseEvent, EventType } from '@/types';

type SSECallback = (data: any) => void;

const READY_STATE_LABEL: Record<number, string> = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
};

class SSEManager {
  private static instance: SSEManager;

  private eventSource: EventSource | null = null;

  private listeners: { [type: string]: SSECallback[] } = {};

  private url: string | null = null;

  private loggedError = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  public connect(url: string) {
    if (this.eventSource) return;

    this.url = url;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      // eslint-disable-next-line no-console
      console.info(`[SSE] connected to ${url}`);
      this.loggedError = false;
    };

    this.eventSource.onmessage = (e) => {
      try {
        const message: BaseEvent = JSON.parse(e.data);
        const { type, data } = message;
        if (type && this.listeners[type]) {
          this.listeners[type].forEach((cb) => cb(data));
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error('[SSE] failed to parse message', e.data);
      }
    };

    this.eventSource.onerror = () => {
      // SSE error events carry no detail by design. Log what we can, once
      // per disconnected streak — the browser retries in the background.
      if (this.loggedError) return;
      this.loggedError = true;
      const state = this.eventSource?.readyState ?? -1;
      // eslint-disable-next-line no-console
      console.error(
        `[SSE] connection error (url=${this.url}, state=${READY_STATE_LABEL[state] ?? state}).`
        + ' Check that the backend is running and reachable.',
      );
    };
  }

  public on(type: EventType, callback: SSECallback) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(callback);
  }

  public off(type: EventType, callback: SSECallback) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((cb) => cb !== callback);
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export default SSEManager.getInstance();
