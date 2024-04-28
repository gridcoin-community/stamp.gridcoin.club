import { JsonOptions } from 'yayson';

export type Attributes = { [key: string]: unknown };

export type Relationship<T> = { [key: string]: T };

export enum EntityType {
  STATUS = 'status',
  WALLET = 'wallet',
  STAMPS = 'stamps',
  BALANCE = 'balance',
}

export interface PresenterInterface {
  render(data: any, options?: JsonOptions): Record<string, unknown>;
  selfLinks?(instance: Record<string, unknown>): string;
  attributes?(instance: Record<string, unknown> | number | unknown): Attributes;
  id?(instance: Record<string, unknown> | unknown): string;
  // type?: EntityType;
}
