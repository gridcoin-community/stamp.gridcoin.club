import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import type { Database } from './database';
import { config } from '../config';

// mysql2 returns BIGINT as JS Number by default, which silently loses
// precision above 2^53. The schema uses BIGINT UNSIGNED for the id and
// block columns, so anything other than BigInt is unsafe. typeCast
// intercepts each column on the wire and converts LONGLONG to native
// bigint; numbers/strings stay untouched.
const pool = createPool({
  uri: config.DATABASE_URL,
  connectionLimit: 10,
  supportBigNumbers: true,
  bigNumberStrings: false,
  dateStrings: false,
  typeCast(field, next) {
    if (field.type === 'LONGLONG') {
      const v = field.string();
      return v === null ? null : BigInt(v);
    }
    return next();
  },
});

export const db = new Kysely<Database>({
  // mysql2 v3 Pool type drift from Kysely's MysqlPool interface; runtime contract holds.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialect: new MysqlDialect({ pool: pool as any }),
});
