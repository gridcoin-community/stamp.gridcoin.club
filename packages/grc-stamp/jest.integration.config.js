// Integration test config. Extends the base unit-test config and adds
// a globalSetup that runs Kysely migrations against the test DB before
// any test forks. Unit tests don't need a DB and use jest.config.js.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./jest.config');

module.exports = {
  ...base,
  globalSetup: '<rootDir>/tests/globalSetup.ts',
};
