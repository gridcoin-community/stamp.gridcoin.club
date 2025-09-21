export type EventType = 'processBlock' | 'stampSubmitted' | 'transactionFound';

export interface BaseEvent {
  type: EventType;
  data: unknown;
}

export interface ProcessBlockEvent extends BaseEvent {
  type: 'processBlock',
  data: {
    block: number;
  }
}

export interface StampSubmittedEvent extends BaseEvent {
  type: 'stampSubmitted',
  data: {
    hash: string;
    tx: string;
  }
}

export interface TransactionFoundEvent extends BaseEvent {
  type: 'transactionFound',
  data: {
    hash: string;
  }
}

export type Events = ProcessBlockEvent;
