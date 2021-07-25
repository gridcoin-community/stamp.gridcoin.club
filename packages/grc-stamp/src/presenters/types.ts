import { JsonOptions } from 'yayson';

export type Attributes = { [key: string]: unknown };

export type Relationship<T> = { [key: string]: T };

export interface PresenterInterface {
  render(data: any, options?: JsonOptions): Record<string, unknown>;
  selfLinks?(): string;
  attributes?(): Attributes;
  id?(instance: Record<string, unknown>): string;
  type?: string;
}
