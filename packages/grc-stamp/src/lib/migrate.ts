import path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { db } from './db';
import { log } from './log';

// Boot-time migration runner. Pointed at the same src/migrations folder
// as the CLI; safe to call from the app entrypoint because Kysely uses
// kysely_migration_lock to serialize concurrent runners. Does NOT
// destroy the pool — the long-running app keeps using it.
export async function migrateToLatest(): Promise<void> {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '..', 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((r) => {
    if (r.status === 'Success') {
      log.info(`[migrate] applied ${r.migrationName}`);
    } else if (r.status === 'Error') {
      log.error(`[migrate] failed ${r.migrationName}`);
    }
  });

  if (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
