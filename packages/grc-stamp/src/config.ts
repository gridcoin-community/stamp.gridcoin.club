import nconf from 'nconf';
import path from 'path';
// import packageJson from '../package.json';

interface Config {
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
  SCRAPER_TIMEOUT: number;
  PUBLISH_TIMEOUT: number;
}

/**
 * Check setting existance and throw error if not provided
 * @param {Array} settings Setting name to check
 */
const checkConfig = (settings: any[]): void => {
  settings.forEach((setting: any): void => {
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
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'CHECK_INTERVAL_SECONDS',
    'GRC_RPC_USER',
    'GRC_RPC_PASSWORD',
    'GRC_RPC_HOST',
    'GRC_RPC_PORT',
    'START_BLOCK',
  ])
  // 3. Config file
  .file({
    file: path.join(__dirname, '../config.json'),
  })
  // 4. Defaults
  .defaults({
    MYSQL_HOST: 'mysql',
    MYSQL_LOGIN: '',
    MYSQL_PASSWORD: '',
    MYSQL_DB: 'grc',
    isTesting: process.env.NODE_ENV === 'testing',
    isProduction: process.env.NODE_ENV === 'production',
    START_BLOCK: 1581500,
    // START_BLOCK: 1629037,
    BLOCK_GROUPS: 500,
    // Run scraper once per minute by default
    SCRAPER_TIMEOUT: 60000,
    PUBLISH_TIMEOUT: 2 * 60 * 1000,
    // PUBLISH_TIMEOUT: 20 * 1000,
  });

// Check required settings
checkConfig([
  'DATABASE_URL',
  'GRC_RPC_USER',
  'GRC_RPC_PASSWORD',
  'GRC_RPC_HOST',
  'GRC_RPC_PORT',
  'START_BLOCK',
  'BLOCK_GROUPS',
]);

export const config = Object.freeze(nconf.get()) as Config;
