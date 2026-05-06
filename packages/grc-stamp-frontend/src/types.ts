export type EventType = 'processBlock' | 'stampSubmitted' | 'transactionFound' | 'pendingCount' | 'indexerStatus';

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

export interface PendingCountEvent extends BaseEvent {
  type: 'pendingCount',
  data: {
    count: number;
  }
}

export interface IndexerStatusEvent extends BaseEvent {
  type: 'indexerStatus',
  data: {
    indexerBlock: number;
    chainTip: number;
    lag: number;
    isBackfilling: boolean;
  }
}

export type Events = ProcessBlockEvent;
