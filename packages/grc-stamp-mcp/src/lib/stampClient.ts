import axios, { AxiosError, type AxiosInstance } from 'axios';

// A stamp as seen through the JSON:API presenter (camelCase attributes) plus
// the resource id. `block`/`tx`/`time` are null/undefined until the queued
// stamp is burned and confirmed on-chain.
export interface Stamp {
  id: string;
  protocol: string;
  type: string;
  hash: string;
  block?: number | null;
  tx?: string | null;
  rawTransaction?: string | null;
  time?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wallet {
  address: string;
  balance: number;
  block: number;
  minimumBalance: number;
  effectiveBalance: number;
}

export interface CreateStampResult {
  stamp: Stamp;
  // true when the API created a new row (HTTP 201); false when an identical
  // hash already existed and the existing stamp was returned (HTTP 200).
  created: boolean;
}

const INSUFFICIENT_FUNDS_MESSAGE = 'The stamp service wallet has insufficient funds to anchor new stamps right now.';

/** The service wallet cannot currently fund a burn (HTTP 406). Retryable later. */
export class InsufficientFundsError extends Error {
  constructor(message = INSUFFICIENT_FUNDS_MESSAGE) {
    super(message);
    this.name = 'InsufficientFundsError';
  }
}

/** The API rejected the request as invalid (HTTP 400). Not retryable as-is. */
export class StampValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StampValidationError';
  }
}

/** The per-IP rate limit was exceeded (HTTP 429). */
export class RateLimitError extends Error {
  readonly retryAfterSeconds?: number;

  constructor(retryAfterSeconds?: number) {
    super('Rate limit exceeded on the stamp service. Try again shortly.');
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const JSON_API = 'application/vnd.api+json';

interface JsonApiResource {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
}

function parseResource(body: unknown): { id: string; attributes: Record<string, unknown> } {
  const data = (body as { data?: JsonApiResource } | undefined)?.data;
  if (!data || typeof data.id !== 'string') {
    throw new Error('Malformed JSON:API response from the stamp service.');
  }
  return { id: data.id, attributes: data.attributes ?? {} };
}

// Coerce a value to a number, preserving null/undefined. The JSON:API layer
// (yayson over gridcoin-rpc) can serialize monetary/block fields as strings, so
// numeric attributes are normalized before they reach the zod output schemas.
function num(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function toStamp(id: string, a: Record<string, unknown>): Stamp {
  return {
    id,
    protocol: String(a.protocol ?? ''),
    type: String(a.type ?? ''),
    hash: String(a.hash ?? ''),
    block: num(a.block) ?? null,
    tx: (a.tx as string | null) ?? null,
    rawTransaction: (a.rawTransaction as string | null) ?? null,
    time: num(a.time) ?? null,
    createdAt: a.createdAt as string | undefined,
    updatedAt: a.updatedAt as string | undefined,
  };
}

function toWallet(id: string, a: Record<string, unknown>): Wallet {
  return {
    address: String(a.address ?? id),
    balance: num(a.balance) ?? 0,
    block: num(a.block) ?? 0,
    minimumBalance: num(a.minimumBalance) ?? 0,
    effectiveBalance: num(a.effectiveBalance) ?? 0,
  };
}

function firstErrorDetail(body: unknown): string | undefined {
  type JsonApiError = { detail?: string; title?: string };
  const errors = (body as { errors?: JsonApiError[] } | undefined)?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors[0].detail ?? errors[0].title;
  }
  return undefined;
}

/** Thin HTTP client over the grc-stamp JSON:API. One instance per server. */
export class StampClient {
  private readonly http: AxiosInstance;

  constructor(apiUrl: string, http?: AxiosInstance) {
    this.http = http ?? axios.create({
      baseURL: apiUrl,
      timeout: 15_000,
      headers: { Accept: JSON_API },
    });
  }

  /** POST /stamps — queue a hash for anchoring. Idempotent per hash. */
  async createStamp(hash: string): Promise<CreateStampResult> {
    try {
      const res = await this.http.post(
        '/stamps',
        { data: { type: 'stamps', attributes: { hash } } },
        { headers: { 'Content-Type': JSON_API } },
      );
      const { id, attributes } = parseResource(res.data);
      return { stamp: toStamp(id, attributes), created: res.status === 201 };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /** GET /hashes/:hash — returns the stamp or null if none exists. */
  async getByHash(hash: string): Promise<Stamp | null> {
    return this.getStamp(`/hashes/${encodeURIComponent(hash)}`);
  }

  /** GET /stamps/:id — returns the stamp or null if none exists. */
  async getById(id: string): Promise<Stamp | null> {
    return this.getStamp(`/stamps/${encodeURIComponent(id)}`);
  }

  /** GET /wallet — service wallet balance snapshot. */
  async getWallet(): Promise<Wallet> {
    try {
      const { id, attributes } = parseResource((await this.http.get('/wallet')).data);
      return toWallet(id, attributes);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  private async getStamp(path: string): Promise<Stamp | null> {
    try {
      const { id, attributes } = parseResource((await this.http.get(path)).data);
      return toStamp(id, attributes);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) return null;
      throw this.mapError(err);
    }
  }

  private mapError(err: unknown): Error {
    if (!(err instanceof AxiosError) || !err.response) {
      return err instanceof Error ? err : new Error(String(err));
    }
    const { status, data, headers } = err.response;
    const detail = firstErrorDetail(data);
    switch (status) {
      case 406:
        return new InsufficientFundsError(detail);
      case 400:
        return new StampValidationError(
          detail ?? 'The stamp service rejected the request as invalid.',
        );
      case 429: {
        const retryAfter = Number(headers?.['retry-after']);
        return new RateLimitError(Number.isFinite(retryAfter) ? retryAfter : undefined);
      }
      default:
        return new Error(detail ?? `Stamp service error (HTTP ${status}).`);
    }
  }
}
