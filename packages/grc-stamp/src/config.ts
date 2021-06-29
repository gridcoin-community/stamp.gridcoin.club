import nconf from 'nconf';
import path from 'path';
// import packageJson from '../package.json';

interface Config {
  MYSQL_HOST: string;
  MYSQL_LOGIN: string;
  MYSQL_PASSWORD: string;
  MYSQL_DB: string;
  GRC_RPC_USER: string;
  GRC_RPC_PASSWORD: string;
  GRC_RPC_HOST: string;
  GRC_RPC_PORT: number;
  isProduction: boolean;
  isTesting: boolean;
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
    'MYSQL_HOST',
    'MYSQL_LOGIN',
    'MYSQL_PASSWORD',
    'MYSQL_DB',
    'CHECK_INTERVAL_SECONDS',
    'GRC_RPC_USER',
    'GRC_RPC_PASSWORD',
    'GRC_RPC_HOST',
    'GRC_RPC_PORT',
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
  });

// Check required settings
checkConfig([
  'MYSQL_HOST',
  'MYSQL_LOGIN',
  'MYSQL_PASSWORD',
  'MYSQL_DB',
  'GRC_RPC_USER',
  'GRC_RPC_PASSWORD',
  'GRC_RPC_HOST',
  'GRC_RPC_PORT',
]);

export const config = Object.freeze(nconf.get()) as Config;
