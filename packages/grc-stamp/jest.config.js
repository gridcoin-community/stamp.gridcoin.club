/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/tests/setEnv.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  moduleDirectories: [
    '<rootDir>',
    'src',
    'node_modules',
  ],
};
