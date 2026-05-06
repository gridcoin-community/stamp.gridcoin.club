import nconf from 'nconf';
import path from 'path';
import packageJson from '../package.json';

interface Config {
  // Which Gridcoin network this instance is anchored to. Required and
  // validated against {'mainnet','testnet'} so a typo or omission fails
  // loud at startup instead of silently inheriting the wrong identity.
  NETWORK: 'mainnet' | 'testnet';
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  GRC_RPC_USER: string;
  GRC_RPC_PASSWORD: string;
  GRC_RPC_HOST: string;
  GRC_RPC_PORT: number;
  isProduction: boolean;
  isTesting: boolean;
  START_BLOCK: number;
  BLOCK_GROUPS: number;
  // Blocks per getBlocksBatch RPC call when in backfill mode (lag >
  // BACKFILL_THRESHOLD_BLOCKS). Capped at 1000 by gridcoin-rpc. Tip
  // mode ignores this and fetches one block at a time.
  BACKFILL_BATCH_SIZE: number;
  SCRAPER_TIMEOUT: number;
  PUBLISH_TIMEOUT: number;
  PORT: number;
  MINIMUM_WALLET_AMOUNT: number;
  REDIS_SCRAPER_KEY: string;
  // Number of trusted reverse-proxy hops in front of this process. Express
  // uses this to derive `req.ip` from `X-Forwarded-For`, which feeds the
  // per-IP rate limiter and SSE caps. 1 (single nginx hop).
  // Defaults is 2 if Cloudflare fronts your nginx, etc. Setting it too high
  // lets clients spoof their IP via the X-Forwarded-For header.
  TRUST_PROXY_HOPS: number;
}

/**
 * Check setting existance and throw error if not provided
 * @param {Array} settings Setting name to check
 */
const checkConfig = (settings: string[]): void => {
  settings.forEach((setting: string): void => {
    if (!nconf.get(setting)) {
      throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
    }
  });
};

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'NETWORK',
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'CHECK_INTERVAL_SECONDS',
    'GRC_RPC_USER',
    'GRC_RPC_PASSWORD',
    'GRC_RPC_HOST',
    'GRC_RPC_PORT',
    'START_BLOCK',
    'BACKFILL_BATCH_SIZE',
    'PORT',
    'MINIMUM_WALLET_AMOUNT',
    'REDIS_SCRAPER_KEY',
    'TRUST_PROXY_HOPS',
  ])
  // 3. Config file
  .file({
    file: path.join(__dirname, '../config.json'),
  })
  // 4. Defaults
  //
  // REDIS_SCRAPER_KEY is deliberately NOT defaulted — mainnet uses
  // `grc-stamp:processedBlock`, testnet uses `grc-stamp-testnet:…`,
  // and a missing env var should fail loud at startup rather than
  // silently colliding the two cursors on one key.
  .defaults({
    MYSQL_HOST: 'mysql',
    MYSQL_LOGIN: '',
    MYSQL_PASSWORD: '',
    MYSQL_DB: 'grc',
    isTesting: process.env.NODE_ENV === 'testing',
    isProduction: process.env.NODE_ENV === 'production',
    START_BLOCK: 1581500,
    BLOCK_GROUPS: 1500,
    BACKFILL_BATCH_SIZE: 1000,
    SCRAPER_TIMEOUT: 60000,
    PUBLISH_TIMEOUT: 2 * 60 * 1000,
    PORT: packageJson.port,
    MINIMUM_WALLET_AMOUNT: 1,
    TRUST_PROXY_HOPS: 2,
  });

// Check required settings
checkConfig([
  'NETWORK',
  'DATABASE_URL',
  'GRC_RPC_USER',
  'GRC_RPC_PASSWORD',
  'GRC_RPC_HOST',
  'GRC_RPC_PORT',
  'START_BLOCK',
  'BLOCK_GROUPS',
  'PORT',
  'MINIMUM_WALLET_AMOUNT',
  'REDIS_SCRAPER_KEY',
]);

const networkValue = nconf.get('NETWORK');
if (networkValue !== 'mainnet' && networkValue !== 'testnet') {
  throw new Error(`NETWORK must be either 'mainnet' or 'testnet', got: ${networkValue}`);
}

export const config = Object.freeze(nconf.get()) as Config;
