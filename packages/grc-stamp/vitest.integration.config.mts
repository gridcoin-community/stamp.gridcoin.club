import { defineConfig } from 'vitest/config';

// Standalone rather than merged from vitest.config.ts on purpose: Vitest's
// mergeConfig concatenates arrays, so the unit `include` would survive here
// and the integration run would start collecting src/**/*.spec.ts too.
//
// fileParallelism replaces jest's --runInBand, and the reason is the shared
// `stamps` table, not the port: stamps.list.test.ts seeds 111 rows once and
// asserts on that count while hash/stamps truncate in afterEach, so running
// these files concurrently corrupts the fixture. Do not relax this.
// Per-file isolation stays on (the default) — each file mocks
// src/lib/gridcoin differently, and a shared module registry would let the
// first import win for all of them.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: false,
    setupFiles: ['./tests/setEnv.ts'],
    globalSetup: ['./tests/globalSetup.ts'],
    pool: 'forks',
    fileParallelism: false,
  },
});
