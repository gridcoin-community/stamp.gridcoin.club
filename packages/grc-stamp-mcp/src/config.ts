import nconf from 'nconf';

export type Network = 'mainnet' | 'testnet';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Transport = 'stdio' | 'http';

export interface Config {
  network: Network;
  // 'stdio' — the npx/local transport (Phase 1). 'http' — the hosted remote
  // Streamable-HTTP transport (Phase 2). Defaults to stdio.
  transport: Transport;
  // TCP port for the HTTP transport. Ignored under stdio.
  port: number;
  // Base URL of the grc-stamp JSON:API (no trailing slash), e.g.
  // https://stamp.gridcoin.club/api
  apiUrl: string;
  // Base URL of the public stamp frontend (no trailing slash) — the host that
  // serves the human proof page and the PDF certificate.
  webUrl: string;
  // Explorer transaction URL template with a `[data]` placeholder for the txid.
  explorerTxUrl: string;
  logLevel: LogLevel;
  // Defense-in-depth cap on how many stamps this process will submit per
  // minute. Each stamp burns real GRC from a shared service wallet, so this
  // bounds a runaway agent even though the backend also rate-limits per IP.
  maxStampsPerMinute: number;
}

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];
const TRANSPORTS: Transport[] = ['stdio', 'http'];
const DEFAULT_HTTP_PORT = 7010;

// Per-network defaults, matching the values the stamp frontend ships in its
// .env / .env.testnet files. Every one is overridable via the matching env var
// so a self-hoster can point the server at their own deployment.
type NetworkUrls = { apiUrl: string; webUrl: string; explorerTxUrl: string };

const NETWORK_DEFAULTS: Record<Network, NetworkUrls> = {
  mainnet: {
    apiUrl: 'https://stamp.gridcoin.club/api',
    webUrl: 'https://stamp.gridcoin.club',
    explorerTxUrl: 'https://gridcoinstats.eu/tx/[data]',
  },
  testnet: {
    apiUrl: 'https://testnet-stamp.gridcoin.club/api',
    webUrl: 'https://testnet-stamp.gridcoin.club',
    explorerTxUrl: 'https://testnet.gridcoinstats.eu/tx/[data]',
  },
};

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

function requireHttpUrl(name: string, value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL, got: ${value}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${name} must be an http(s) URL, got: ${value}`);
  }
  return stripTrailingSlash(value);
}

function requireExplorerTemplate(value: string): string {
  if (!value.includes('[data]')) {
    throw new Error(`EXPLORER_TX_URL must contain the [data] placeholder, got: ${value}`);
  }
  // Validate the host part by substituting a dummy txid.
  requireHttpUrl('EXPLORER_TX_URL', value.replace('[data]', 'x'));
  return value;
}

function requirePositiveInt(name: string, raw: unknown, fallback: number): number {
  if (raw === undefined) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`${name} must be a positive integer, got: ${raw}`);
  }
  return n;
}

export function loadConfig(): Config {
  nconf
    .argv()
    .env([
      'NETWORK', 'STAMP_API_URL', 'STAMP_WEB_URL', 'EXPLORER_TX_URL',
      'LOG_LEVEL', 'MAX_STAMPS_PER_MINUTE', 'TRANSPORT', 'PORT',
    ])
    .defaults({ NETWORK: 'mainnet', LOG_LEVEL: 'info', TRANSPORT: 'stdio' });

  const network = nconf.get('NETWORK') as Network;
  if (network !== 'mainnet' && network !== 'testnet') {
    throw new Error(`NETWORK must be either 'mainnet' or 'testnet', got: ${network}`);
  }

  const logLevel = nconf.get('LOG_LEVEL') as LogLevel;
  if (!LOG_LEVELS.includes(logLevel)) {
    throw new Error(`LOG_LEVEL must be one of ${LOG_LEVELS.join(', ')}, got: ${logLevel}`);
  }

  const transport = nconf.get('TRANSPORT') as Transport;
  if (!TRANSPORTS.includes(transport)) {
    throw new Error(`TRANSPORT must be one of ${TRANSPORTS.join(', ')}, got: ${transport}`);
  }

  const defaults = NETWORK_DEFAULTS[network];

  return Object.freeze({
    network,
    transport,
    port: requirePositiveInt('PORT', nconf.get('PORT'), DEFAULT_HTTP_PORT),
    apiUrl: requireHttpUrl('STAMP_API_URL', nconf.get('STAMP_API_URL') || defaults.apiUrl),
    webUrl: requireHttpUrl('STAMP_WEB_URL', nconf.get('STAMP_WEB_URL') || defaults.webUrl),
    explorerTxUrl: requireExplorerTemplate(nconf.get('EXPLORER_TX_URL') || defaults.explorerTxUrl),
    logLevel,
    maxStampsPerMinute: requirePositiveInt('MAX_STAMPS_PER_MINUTE', nconf.get('MAX_STAMPS_PER_MINUTE'), 20),
  });
}
