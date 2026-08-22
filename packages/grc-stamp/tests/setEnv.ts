process.env.NETWORK = 'mainnet';
// Deliberately keyed off TEST_DATABASE_URL, never DATABASE_URL: globalSetup
// drops tables on whatever this resolves to, so an ambient app DSN must not
// be able to steer it. Unset anywhere but a local run on a spare port.
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'mysql://test:test@localhost:3306/test';
process.env.PORT = '7777';
process.env.GRC_RPC_USER = 'grc-user';
process.env.GRC_RPC_PASSWORD = 'grc-password';
process.env.GRC_RPC_HOST = 'localhost';
process.env.GRC_RPC_PORT = '8888';
process.env.REDIS_SCRAPER_KEY = 'grc-stamp:processedBlock';
