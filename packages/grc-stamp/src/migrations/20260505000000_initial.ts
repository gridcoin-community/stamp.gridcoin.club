import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('stamps')
    .addColumn('id', 'bigint', (col) => col.unsigned().primaryKey().autoIncrement())
    .addColumn('protocol', 'varchar(16)', (col) => col.notNull())
    .addColumn('type', sql`enum('sha256','ipfs')`, (col) => col.notNull())
    .addColumn('hash', 'varchar(256)', (col) => col.notNull())
    .addColumn('block', 'bigint', (col) => col.unsigned())
    .addColumn('tx', 'varchar(64)')
    .addColumn('raw_transaction', 'text')
    .addColumn('time', 'integer', (col) => col.unsigned())
    .addColumn('created_at', 'datetime(3)', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP(3)`))
    .addColumn('updated_at', 'datetime(3)', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP(3)`).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP(3)`))
    .execute();

  await db.schema.createIndex('stamps_block_index').on('stamps').column('block').execute();
  await db.schema.createIndex('stamps_hash_index').on('stamps').column('hash').execute();
  await db.schema.createIndex('stamps_tx_index').on('stamps').column('tx').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('stamps').execute();
}
