import { JsonApiDocument, JsonApiLink, PresenterOptions } from 'yayson';

export type Attributes = { [key: string]: unknown };

export type Relationship<T> = { [key: string]: T };

export enum EntityType {
  STATUS = 'status',
  WALLET = 'wallet',
  STAMPS = 'stamps',
  BALANCE = 'balance',
  INDEXER_STATUS = 'indexerStatus',
}

export interface PresenterInterface {
  render(data: unknown, options?: PresenterOptions): JsonApiDocument;
  selfLinks?(instance: object): JsonApiLink | string | undefined;
  attributes?(instance: object | null): Attributes;
  id?(instance: object): string | undefined;
  // type?: EntityType;
}
