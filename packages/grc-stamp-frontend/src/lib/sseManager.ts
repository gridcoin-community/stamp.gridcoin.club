import { BaseEvent, EventType } from '@/types';

type SSECallback = (data: any) => void;

class SSEManager {
  private static instance: SSEManager;

  private eventSource: EventSource | null = null;

  private listeners: { [type: string]: SSECallback[] } = {};

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

    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (e) => {
      try {
        const message: BaseEvent = JSON.parse(e.data);
        // console.log('SSE message received:', message);
        const { type, data } = message;
        if (type && this.listeners[type]) {
          this.listeners[type].forEach((cb) => cb(data));
        }
      } catch (err) {
        // console.error('Failed to parse SSE message', e.data);
      }
    };

    this.eventSource.onerror = (e) => {
      console.error('SSE error:', e);
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
