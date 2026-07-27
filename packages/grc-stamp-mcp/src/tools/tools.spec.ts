import {
  describe, it, expect,
} from 'vitest';
import { tmpdir } from 'node:os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../server.js';
import type { Config } from '../config.js';
import {
  StampClient, InsufficientFundsError, type Stamp, type Wallet,
} from '../lib/stampClient.js';
import { hashText } from '../lib/hash.js';

const config: Config = {
  network: 'testnet',
  apiUrl: 'https://testnet-stamp.gridcoin.club/api',
  webUrl: 'https://testnet-stamp.gridcoin.club',
  explorerTxUrl: 'https://testnet.gridcoinstats.eu/tx/[data]',
  logLevel: 'error',
  maxStampsPerMinute: 20,
  transport: 'stdio',
  port: 7010,
};

type FakeClient = Partial<Record<'createStamp' | 'getByHash' | 'getById' | 'getWallet', unknown>>;

async function connect(fake: FakeClient, overrides: Partial<Config> = {}): Promise<Client> {
  const server = createServer({ ...config, ...overrides }, fake as unknown as StampClient);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '1.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

function stamp(over: Partial<Stamp>): Stamp {
  return {
    id: '7', protocol: '0.0.1', type: 'sha256', hash: 'a'.repeat(64), ...over,
  };
}

describe('stamp_document', () => {
  it('hashes text, stamps it, and returns a pending proof url', async () => {
    const expected = hashText('hello world');
    const calls: string[] = [];
    const client = await connect({
      createStamp: async (hash: string) => {
        calls.push(hash);
        return { stamp: stamp({ hash }), created: true };
      },
    });

    const res: any = await client.callTool({ name: 'stamp_document', arguments: { text: 'hello world' } });

    expect(calls).toEqual([expected]);
    expect(res.isError).toBeFalsy();
    expect(res.structuredContent).toMatchObject({
      hash: expected,
      status: 'pending',
      alreadyExisted: false,
      certificateAvailable: false,
      proofUrl: `https://testnet-stamp.gridcoin.club/proof/${expected}`,
      certificateUrl: `https://testnet-stamp.gridcoin.club/proof/${expected}/certificate.pdf`,
    });
  });

  it('marks a confirmed stamp and includes the explorer link', async () => {
    const client = await connect({
      createStamp: async (hash: string) => ({
        stamp: stamp({
          hash, block: 42, tx: 'deadbeef', time: 1_700_000_000,
        }),
        created: false,
      }),
    });

    const res: any = await client.callTool({
      name: 'stamp_document',
      arguments: { sha256: 'b'.repeat(64) },
    });

    expect(res.structuredContent).toMatchObject({
      status: 'confirmed',
      alreadyExisted: true,
      certificateAvailable: true,
      txUrl: 'https://testnet.gridcoinstats.eu/tx/deadbeef',
    });
  });

  it('rejects an invalid sha256', async () => {
    const client = await connect({});
    const res: any = await client.callTool({ name: 'stamp_document', arguments: { sha256: 'nope' } });
    expect(res.isError).toBe(true);
  });

  it('rejects when more than one input is given', async () => {
    const client = await connect({});
    const res: any = await client.callTool({
      name: 'stamp_document',
      arguments: { text: 'a', sha256: 'c'.repeat(64) },
    });
    expect(res.isError).toBe(true);
  });

  it('surfaces insufficient funds as a clean error', async () => {
    const client = await connect({
      createStamp: async () => { throw new InsufficientFundsError(); },
    });
    const res: any = await client.callTool({ name: 'stamp_document', arguments: { text: 'x' } });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/insufficient funds/i);
  });

  it('rejects a relative filePath', async () => {
    const client = await connect({});
    const res: any = await client.callTool({
      name: 'stamp_document',
      arguments: { filePath: 'relative/path.txt' },
    });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/absolute/i);
  });

  it('refuses filePath on the hosted (http) transport but still accepts text', async () => {
    let stamped: string | null = null;
    const client = await connect(
      {
        createStamp: async (hash: string) => {
          stamped = hash;
          return { stamp: stamp({ hash }), created: true };
        },
      },
      { transport: 'http' },
    );
    const withFile: any = await client.callTool({
      name: 'stamp_document',
      arguments: { filePath: '/etc/passwd' },
    });
    expect(withFile.isError).toBe(true);
    const withText: any = await client.callTool({ name: 'stamp_document', arguments: { text: 'ok' } });
    expect(withText.isError).toBeFalsy();
    expect(stamped).toBe(hashText('ok'));
  });

  it('rejects a non-regular file (e.g. a directory)', async () => {
    const client = await connect({ createStamp: async () => { throw new Error('should not reach'); } });
    const res: any = await client.callTool({
      name: 'stamp_document',
      arguments: { filePath: tmpdir() },
    });
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/not a regular file/i);
  });

  it('enforces the local per-minute stamp rate limit', async () => {
    let calls = 0;
    const client = await connect(
      {
        createStamp: async (hash: string) => {
          calls += 1;
          return { stamp: stamp({ hash }), created: true };
        },
      },
      { maxStampsPerMinute: 2 },
    );
    const call = (text: string) => client.callTool({ name: 'stamp_document', arguments: { text } });

    expect(((await call('a')) as any).isError).toBeFalsy();
    expect(((await call('b')) as any).isError).toBeFalsy();
    const third: any = await call('c');
    expect(third.isError).toBe(true);
    expect(third.content[0].text).toMatch(/rate limit/i);
    expect(calls).toBe(2);
  });
});

describe('check_stamp', () => {
  it('reports found=false for an unknown hash', async () => {
    const client = await connect({ getByHash: async () => null });
    const res: any = await client.callTool({
      name: 'check_stamp',
      arguments: { hash: 'd'.repeat(64) },
    });
    expect(res.structuredContent).toMatchObject({ found: false, confirmed: false });
  });

  it('returns full proof for a confirmed stamp', async () => {
    const hash = 'e'.repeat(64);
    const client = await connect({
      getByHash: async () => stamp({
        hash, block: 42, tx: 'cafe', time: 1_700_000_000,
      }),
    });
    const res: any = await client.callTool({ name: 'check_stamp', arguments: { hash } });
    expect(res.structuredContent).toMatchObject({
      found: true,
      confirmed: true,
      block: 42,
      tx: 'cafe',
      timeUtc: '2023-11-14 22:13:20 UTC',
      certificateUrl: `https://testnet-stamp.gridcoin.club/proof/${hash}/certificate.pdf`,
      txUrl: 'https://testnet.gridcoinstats.eu/tx/cafe',
    });
  });
});

describe('get_wallet_status', () => {
  it('reports canStamp=false when the effective balance is below the minimum', async () => {
    const wallet: Wallet = {
      address: 'S1', balance: 0.5, minimumBalance: 1, effectiveBalance: 0.5, block: 100,
    };
    const client = await connect({ getWallet: async () => wallet });
    const res: any = await client.callTool({ name: 'get_wallet_status', arguments: {} });
    expect(res.structuredContent).toMatchObject({ canStamp: false, effectiveBalance: 0.5 });
  });
});
