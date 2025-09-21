import { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { getEmitter } from '../lib/emitter';
import { Events, ProcessBlockEvent } from '../types';
import { log } from '../lib/log';

interface Client {
  id: string;
  res: Response
}

export class EventsService {
  public static instance;

  public static getInstance(): EventsService {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

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
    setInterval(() => {
      this.ping();
    }, 15000);
  }

  public ping(): void {
    if (this.clients && this.clients.length > 0) {
      log.debug('Send keep-alive to all clients');
      this.clients.forEach((client) => client.res.write(': keep-alive\n\n'));
    }
  }

  public addClient(res: Response): string {
    const id = randomUUID();
    this.clients.push({ id, res });
    log.info(`[EventsService] Clients connected: ${this.clients.length}`);
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
