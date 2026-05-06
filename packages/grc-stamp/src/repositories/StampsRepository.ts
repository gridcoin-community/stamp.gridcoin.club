import {
  ExpressionBuilder, OperandExpression, SelectQueryBuilder, SqlBool,
} from 'kysely';
import {
  Fields,
  FilterOp,
  Filters,
  FILTER_OPS,
  Pagination,
  Sorting,
} from '../controllers/BaseController';
import { db } from '../lib/db';
import {
  Database, Stamp, StampsType,
} from '../lib/database';
import { RepoListResults } from './types';
import { BadFilterError } from './errors';
import { PROTOCOL } from '../constants';

export interface SelectOptions {
  sort?: Sorting;
  filters?: Filters;
  fields?: Fields;
  pagination?: Pagination;
}

export { BadFilterError };

const OPERATOR_MAP: Record<FilterOp, '=' | '!=' | '>' | '<' | '>=' | '<='> = {
  eq: '=',
  ne: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
};

type StampColumn = keyof Database['stamps'];

const STAMPS_COLUMNS: readonly StampColumn[] = [
  'id', 'protocol', 'type', 'hash', 'block', 'tx',
  'raw_transaction', 'time', 'created_at', 'updated_at',
];

// BaseController.discoverFilters tries BigInt() and falls back to a raw
// string on parse failure, so the translator catches the failure here
// rather than letting MySQL coerce silently.
const BIGINT_COLUMNS: ReadonlySet<StampColumn> = new Set(['id', 'block']);

function isStampColumn(name: string): name is StampColumn {
  return (STAMPS_COLUMNS as readonly string[]).includes(name);
}

function assertBigintCompatible(key: StampColumn, value: unknown, label: string): void {
  if (BIGINT_COLUMNS.has(key) && typeof value !== 'bigint') {
    throw new BadFilterError(`Filter ${label} requires a bigint value`);
  }
}

// Translate one filter entry from the BaseController.discoverFilters
// shape into a Kysely where expression. Recognized shapes per key:
//   { field: scalar }                     -> field = scalar
//   { field: { in: [a, b, c] } }          -> field IN (a, b, c)
//   { field: { eq|ne|gt|lt|gte|lte: x } } -> field <op> x
// Unknown columns or operators throw BadFilterError, which the controller
// surfaces as 400.
function translateFilter(
  eb: ExpressionBuilder<Database, 'stamps'>,
  key: string,
  value: unknown,
): OperandExpression<SqlBool> {
  if (!isStampColumn(key)) {
    throw new BadFilterError(`Unknown filter field: ${key}`);
  }
  if (value === null) {
    return eb(key, 'is', null);
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    assertBigintCompatible(key, value, key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return eb(key, '=', value as any);
  }

  const v = value as Record<string, unknown>;
  if ('in' in v) {
    const list = v.in as unknown[];
    if (BIGINT_COLUMNS.has(key) && list.some((x) => typeof x !== 'bigint')) {
      throw new BadFilterError(`Filter ${key}[in] requires bigint values`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return eb(key, 'in', list as any);
  }

  const opKeys = Object.keys(v);
  if (opKeys.length !== 1) {
    throw new BadFilterError(`Filter for ${key} must specify exactly one operator`);
  }
  const op = opKeys[0];
  if (!FILTER_OPS.has(op as FilterOp)) {
    throw new BadFilterError(`Unknown filter operator: ${op}`);
  }
  assertBigintCompatible(key, v[op], `${key}[${op}]`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return eb(key, OPERATOR_MAP[op as FilterOp], v[op] as any);
}

function applyFilters<O>(
  qb: SelectQueryBuilder<Database, 'stamps', O>,
  filters: Filters,
): SelectQueryBuilder<Database, 'stamps', O> {
  return qb.where((eb) => eb.and(
    Object.entries(filters).map(([key, value]) => translateFilter(eb, key, value)),
  ));
}

function projectionColumns(fields?: Fields): StampColumn[] {
  const requested = fields?.stamps?.filter(isStampColumn) ?? [];
  return requested.length > 0 ? requested : [...STAMPS_COLUMNS];
}

export class StampsRepositoryClass {
  public async createStamp(hash: string, type: StampsType = 'sha256'): Promise<Stamp> {
    if (!type || !hash) {
      throw new Error('Not enough data');
    }
    const result = await db
      .insertInto('stamps')
      .values({ protocol: PROTOCOL, type, hash })
      .executeTakeFirstOrThrow();
    const id = BigInt(result.insertId ?? 0);
    return db
      .selectFrom('stamps')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  // Unpublished stamps (will cost burn fees) — used for the balance check
  public async countPending(): Promise<number> {
    const row = await db
      .selectFrom('stamps')
      .select((eb) => eb.fn.countAll<number>().as('c'))
      .where('block', 'is', null)
      .where('tx', 'is', null)
      .where('raw_transaction', 'is', null)
      .where('time', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(row.c);
  }

  // Unconfirmed stamps (queued + mempool) — used for the live UI counter
  public async countInProgress(): Promise<number> {
    const row = await db
      .selectFrom('stamps')
      .select((eb) => eb.fn.countAll<number>().as('c'))
      .where('block', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(row.c);
  }

  public async getByHash(
    hash: string,
    hashType: StampsType = 'sha256',
  ): Promise<Stamp | null> {
    const row = await db
      .selectFrom('stamps')
      .selectAll()
      .where('hash', '=', hash)
      .where('type', '=', hashType)
      .orderBy('time', 'asc')
      .limit(1)
      .executeTakeFirst();
    return row ?? null;
  }

  public async getById(
    id: bigint,
    options?: Pick<SelectOptions, 'fields'>,
  ): Promise<Stamp | null> {
    const row = await db
      .selectFrom('stamps')
      .select(projectionColumns(options?.fields))
      .where('id', '=', id)
      .executeTakeFirst();
    return (row as Stamp | undefined) ?? null;
  }

  public async listStamps(options?: SelectOptions): Promise<RepoListResults<Stamp>> {
    let query = db.selectFrom('stamps').select(projectionColumns(options?.fields));
    let countQuery = db.selectFrom('stamps').select((eb) => eb.fn.countAll<number>().as('c'));

    if (options?.filters && Object.keys(options.filters).length > 0) {
      query = applyFilters(query, options.filters);
      countQuery = applyFilters(countQuery, options.filters);
    }

    if (options?.pagination) {
      if (typeof options.pagination.limit === 'number') {
        query = query.limit(options.pagination.limit);
      }
      if (typeof options.pagination.offset === 'number') {
        query = query.offset(options.pagination.offset);
      }
    }

    if (options?.sort) {
      options.sort.order.forEach((entry) => {
        const [field, direction] = Object.entries(entry)[0] ?? [];
        if (!field || !isStampColumn(field)) {
          throw new BadFilterError(`Unknown sort field: ${field}`);
        }
        query = query.orderBy(field, direction === 'desc' ? 'desc' : 'asc');
      });
    }

    const [rows, countRow] = await Promise.all([
      query.execute(),
      countQuery.executeTakeFirstOrThrow(),
    ]);

    return {
      rows: rows as Stamp[],
      count: Number(countRow.c),
    };
  }
}

export const StampsRepository = new StampsRepositoryClass();
