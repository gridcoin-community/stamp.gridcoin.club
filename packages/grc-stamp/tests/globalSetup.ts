import path from 'path';
import { promises as fs } from 'fs';
import {
  Kysely, MysqlDialect, Migrator, FileMigrationProvider,
} from 'kysely';
import { createPool } from 'mysql2';

// Jest globalSetup runs once in the parent process before any test
// file forks. Drops the stamps table from the test DB and re-runs
// migrations so the suite always boots against a known shape.
//
// DATABASE_URL is set by tests/setEnv.ts; this hook reads it the
// same way.

export default async function globalSetup(): Promise<void> {
  // Load setEnv side effects so DATABASE_URL is populated. setEnv
  // assigns to process.env synchronously on import.
  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
  require('./setEnv');

  const pool = createPool({ uri: process.env.DATABASE_URL });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new Kysely<unknown>({ dialect: new MysqlDialect({ pool: pool as any }) });

  // Wipe + recreate. Drop the migration tables too so each run
  // re-applies the full schema and dev tweaks land immediately.
  await db.schema.dropTable('stamps').ifExists().execute();
  await db.schema.dropTable('kysely_migration').ifExists().execute();
  await db.schema.dropTable('kysely_migration_lock').ifExists().execute();

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve(__dirname, '..', 'src', 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();
  results?.forEach((r) => {
    if (r.status === 'Error') {
      // eslint-disable-next-line no-console
      console.error(`[globalSetup] migration ${r.migrationName} FAILED`);
    }
  });
  if (error) {
    await db.destroy();
    throw new Error(`[globalSetup] migrate failed: ${error}`);
  }
  await db.destroy();
}
