import readline from 'readline';
import { db } from '../lib/db';
import { redis } from '../lib/redis';
import { config } from '../config';
import { migrateToLatest } from '../lib/migrate';

// Operator script for re-indexing from genesis. Truncates the stamps
// table and clears the scraper cursor in Redis so the next boot starts
// at config.START_BLOCK. Use after a protocol bump, a corrupted index,
// or any time you need a clean slate. Run with `--yes` to skip the
// confirmation prompt (intended for scripted use; interactive runs
// should always confirm).

function readEnv(name: string, fallback?: string): string {
  return process.env[name] ?? fallback ?? '<unset>';
}

async function confirm(): Promise<boolean> {
  if (process.argv.includes('--yes') || process.argv.includes('-y')) {
    return true;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('Type RESET to wipe stamps + scraper cursor: ', (answer) => {
      rl.close();
      resolve(answer.trim() === 'RESET');
    });
  });
}

async function main(): Promise<void> {
  /* eslint-disable no-console */
  console.log('grc-stamp reset');
  console.log(`  database  ${readEnv('DATABASE_URL', readEnv('MYSQL_HOST'))}`);
  console.log(`  redis     ${config.REDIS_HOST}:${config.REDIS_PORT}`);
  console.log(`  cursor    ${config.REDIS_SCRAPER_KEY}`);
  console.log(`  start     ${config.START_BLOCK}`);
  console.log('');
  console.log('This drops the stamps table and clears the scraper cursor.');
  console.log('After the next boot the indexer will restart from START_BLOCK.');
  console.log('');

  const ok = await confirm();
  if (!ok) {
    console.log('aborted');
    await db.destroy();
    redis.disconnect();
    process.exit(1);
  }

  try {
    // Drop stamps + the kysely migration tables so migrateToLatest can
    // recreate everything in a single shot. Drops are conditional so
    // re-runs on a partially-reset DB still succeed.
    await db.schema.dropTable('stamps').ifExists().execute();
    await db.schema.dropTable('kysely_migration').ifExists().execute();
    await db.schema.dropTable('kysely_migration_lock').ifExists().execute();
    console.log('mysql: dropped stamps + migration tables');

    await migrateToLatest();
    console.log('mysql: migrations re-applied');

    const removed = await redis.del(config.REDIS_SCRAPER_KEY);
    console.log(`redis: cleared ${config.REDIS_SCRAPER_KEY} (${removed} key${removed === 1 ? '' : 's'} removed)`);

    console.log('');
    console.log('done. restart grc-stamp to begin re-indexing from block', config.START_BLOCK);
  } catch (err) {
    console.error('reset failed:', err);
    await db.destroy();
    redis.disconnect();
    process.exit(1);
  }

  await db.destroy();
  redis.disconnect();
  /* eslint-enable no-console */
}

main();
