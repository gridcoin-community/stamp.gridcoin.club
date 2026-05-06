import { db } from '../lib/db';
import { migrateToLatest } from '../lib/migrate';

async function main(): Promise<void> {
  try {
    await migrateToLatest();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('migration failed:', err);
    await db.destroy();
    process.exit(1);
  }
  await db.destroy();
}

main();
