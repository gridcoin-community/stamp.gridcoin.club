import { execFileSync } from 'child_process';
import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
// Imported for its side effects: setEnv assigns to process.env
// synchronously on import, which populates DATABASE_URL below.
import './setEnv';

// Vitest globalSetup runs once in the main process before any test
// file forks. Drops the stamps table from the test DB and re-runs
// migrations so the suite always boots against a known shape.

export default async function globalSetup(): Promise<void> {
  const pool = createPool({ uri: process.env.DATABASE_URL });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new Kysely<unknown>({ dialect: new MysqlDialect({ pool: pool as any }) });

  // Wipe + recreate. Drop the migration tables too so each run
  // re-applies the full schema and dev tweaks land immediately.
  await db.schema.dropTable('stamps').ifExists().execute();
  await db.schema.dropTable('kysely_migration').ifExists().execute();
  await db.schema.dropTable('kysely_migration_lock').ifExists().execute();
  await db.destroy();

  // Migrations go through the package's own CLI instead of a Migrator wired
  // up here. Kysely's FileMigrationProvider imports each migration at
  // runtime, and those imports bypass Vite's transform, so Node chokes on
  // the .ts sources. ts-node reads them fine, and this keeps a single
  // migration path shared with `npm run db:migrate`.
  execFileSync('npm', ['run', '--silent', 'db:migrate'], {
    env: process.env,
    stdio: 'inherit',
  });
}
