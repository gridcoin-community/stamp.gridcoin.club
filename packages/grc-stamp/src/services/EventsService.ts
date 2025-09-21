import { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { getEmitter } from '../lib/emitter';
import { Events, ProcessBlockEvent } from '../types';
import { log } from '../lib/log';

interface Client {
  id: string;
  res: Response
}

export class EventsServiceClass {
  public constructor(
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
  }

  public addClient(res: Response): string {
    const id = randomUUID();
    this.clients.push({ id, res });
    log.info(`[EventsService] Clients connected: ${this.clients.length}`);
    return id;
  }

  public removeClient(id: string): void {
    this.clients = this.clients.filter((client) => client.id !== id);
  }

  public broadcast(data: Events): void {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    log.debug('[EventsService] Broadcasting to clients', payload);
    this.clients.forEach((client) => client.res.write(payload));
  }
}

export const EventsService = new EventsServiceClass();
