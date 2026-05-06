import { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { emitPendingCount, getEmitter } from '../lib/emitter';
import {
  Events, IndexerStatusEvent, PendingCountEvent, ProcessBlockEvent,
} from '../types';
import { log } from '../lib/log';

// SSE connections are long-lived and consume an FD + heap entry each. These
// caps stop a single host (or the whole internet) from holding the process
// hostage with kept-open sockets. Tuned for "obvious DDoS" — legitimate
// browsers open one stream per tab.
export const MAX_TOTAL_CLIENTS = 1000;
export const MAX_CLIENTS_PER_IP = 15;

interface Client {
  id: string;
  ip: string;
  res: Response;
}

export class EventsService {
  public static instance;

  public static getInstance(): EventsService {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private lastPendingCount: number | null = null;

  private lastPendingCountAt = 0;

  private lastIndexerStatus: IndexerStatusEvent | null = null;

  private constructor(
    private clients: Client[] = [],
  ) {
    getEmitter().on('processBlock', (data: ProcessBlockEvent) => {
      this.broadcast(data);
    });
    getEmitter().on('stampSubmitted', (data: Events) => {
      this.broadcast(data);
    });
    getEmitter().on('transactionFound', (data: Events) => {
      this.broadcast(data);
    });
    getEmitter().on('pendingCount', (data: PendingCountEvent) => {
      this.lastPendingCount = data.data.count;
      this.lastPendingCountAt = Date.now();
      this.broadcast(data);
    });
    getEmitter().on('indexerStatus', (data: IndexerStatusEvent) => {
      this.lastIndexerStatus = data;
      this.broadcast(data);
    });
    setInterval(() => {
      this.ping();
    }, 15000);
    // Prime the cache so the first SSE client doesn't see a stale value
    emitPendingCount();
  }

  public ping(): void {
    if (this.clients && this.clients.length > 0) {
      log.debug('Send keep-alive to all clients');
      this.clients.forEach((client) => client.res.write(': keep-alive\n\n'));
    }
  }

  public addClient(res: Response, ip: string): string | null {
    if (this.clients.length >= MAX_TOTAL_CLIENTS) {
      log.warn(`[EventsService] Refusing new client from ${ip}: total cap (${MAX_TOTAL_CLIENTS}) reached`);
      return null;
    }
    const perIpCount = this.clients.reduce((n, c) => (c.ip === ip ? n + 1 : n), 0);
    if (perIpCount >= MAX_CLIENTS_PER_IP) {
      log.warn(`[EventsService] Refusing new client from ${ip}: per-IP cap (${MAX_CLIENTS_PER_IP}) reached`);
      return null;
    }

    const id = randomUUID();
    this.clients.push({ id, ip, res });
    log.info(`[EventsService] Clients connected: ${this.clients.length}`);

    // Send last known pending count so the client doesn't start blank
    if (this.lastPendingCount !== null) {
      const event: PendingCountEvent = {
        type: 'pendingCount',
        data: { count: this.lastPendingCount },
      };
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    // Same for indexer status: a backfilling instance must surface to
    // the very first client without waiting for the next scrape tick.
    if (this.lastIndexerStatus !== null) {
      res.write(`data: ${JSON.stringify(this.lastIndexerStatus)}\n\n`);
    }

    // Refresh if the cache is stale or missing
    if (Date.now() - this.lastPendingCountAt > 30_000) {
      emitPendingCount();
    }

    return id;
  }

  public removeClient(id: string): void {
    this.clients = this
      .clients.filter((client) => client.id !== id);
  }

  public broadcast(data: Events): void {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    log.debug('[EventsService] Broadcasting to clients', payload);
    this.clients.forEach((client) => client.res.write(payload));
  }
}
