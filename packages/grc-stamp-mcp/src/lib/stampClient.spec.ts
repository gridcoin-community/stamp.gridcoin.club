import {
  describe, it, expect, vi,
} from 'vitest';
import { AxiosError, type AxiosInstance } from 'axios';
import { StampClient, InsufficientFundsError } from './stampClient.js';

const HASH = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

function resource(attrs: Record<string, unknown>, id = '5') {
  return { data: { data: { id, type: 'stamps', attributes: attrs } } };
}

function axiosError(status: number, data: unknown, headers: Record<string, string> = {}) {
  const response = {
    status, data, headers, statusText: '', config: {} as never,
  };
  return new AxiosError('boom', 'ERR', {} as never, {}, response as never);
}

function fakeHttp(over: Partial<Record<'get' | 'post', ReturnType<typeof vi.fn>>>): AxiosInstance {
  return { get: vi.fn(), post: vi.fn(), ...over } as unknown as AxiosInstance;
}

describe('StampClient.createStamp', () => {
  it('sends a JSON:API body and reports created=true on 201', async () => {
    const post = vi.fn().mockResolvedValue({
      status: 201,
      ...resource({
        hash: HASH, protocol: '0.0.1', type: 'sha256', block: null, tx: null, time: null,
      }),
    });
    const client = new StampClient('http://x', fakeHttp({ post }));

    const result = await client.createStamp(HASH);

    expect(post).toHaveBeenCalledWith(
      '/stamps',
      { data: { type: 'stamps', attributes: { hash: HASH } } },
      { headers: { 'Content-Type': 'application/vnd.api+json' } },
    );
    expect(result.created).toBe(true);
    expect(result.stamp).toMatchObject({ id: '5', hash: HASH, block: null });
  });

  it('reports created=false when the hash already existed (200)', async () => {
    const post = vi.fn().mockResolvedValue({ status: 200, ...resource({ hash: HASH }) });
    const client = new StampClient('http://x', fakeHttp({ post }));
    expect((await client.createStamp(HASH)).created).toBe(false);
  });

  it('maps 406 to InsufficientFundsError with the API detail', async () => {
    const post = vi.fn().mockRejectedValue(axiosError(406, { errors: [{ detail: 'Insufficient Funds' }] }));
    const client = new StampClient('http://x', fakeHttp({ post }));
    await expect(client.createStamp(HASH)).rejects.toBeInstanceOf(InsufficientFundsError);
  });

  it('maps 400 to StampValidationError', async () => {
    const post = vi.fn().mockRejectedValue(axiosError(400, { errors: [{ detail: 'bad hash' }] }));
    const client = new StampClient('http://x', fakeHttp({ post }));
    await expect(client.createStamp(HASH)).rejects.toMatchObject({
      name: 'StampValidationError', message: 'bad hash',
    });
  });

  it('maps 429 to RateLimitError with retry-after', async () => {
    const post = vi.fn().mockRejectedValue(axiosError(429, {}, { 'retry-after': '30' }));
    const client = new StampClient('http://x', fakeHttp({ post }));
    await expect(client.createStamp(HASH)).rejects.toMatchObject({
      name: 'RateLimitError', retryAfterSeconds: 30,
    });
  });
});

describe('StampClient.getByHash', () => {
  it('returns the stamp on success', async () => {
    const get = vi.fn().mockResolvedValue(resource({ hash: HASH, block: 10, tx: 'abc' }));
    const client = new StampClient('http://x', fakeHttp({ get }));
    const stamp = await client.getByHash(HASH);
    expect(stamp).toMatchObject({ id: '5', hash: HASH, block: 10 });
    expect(get).toHaveBeenCalledWith(`/hashes/${HASH}`);
  });

  it('returns null on 404', async () => {
    const get = vi.fn().mockRejectedValue(axiosError(404, {}));
    const client = new StampClient('http://x', fakeHttp({ get }));
    expect(await client.getByHash(HASH)).toBeNull();
  });
});

describe('StampClient.getWallet', () => {
  it('parses the wallet resource', async () => {
    const get = vi.fn().mockResolvedValue(resource(
      {
        address: 'S123', balance: 5, minimumBalance: 1, effectiveBalance: 4, block: 100,
      },
      'S123',
    ));
    const client = new StampClient('http://x', fakeHttp({ get }));
    expect(await client.getWallet()).toMatchObject({ address: 'S123', effectiveBalance: 4 });
  });

  it('coerces string-typed numeric fields to numbers', async () => {
    const get = vi.fn().mockResolvedValue(resource(
      {
        address: 'S123', balance: '1003.85', minimumBalance: '0.01', effectiveBalance: '1002.5', block: '100',
      },
      'S123',
    ));
    const client = new StampClient('http://x', fakeHttp({ get }));
    const wallet = await client.getWallet();
    expect(wallet.balance).toBe(1003.85);
    expect(wallet.effectiveBalance).toBe(1002.5);
    expect(wallet.block).toBe(100);
  });
});
