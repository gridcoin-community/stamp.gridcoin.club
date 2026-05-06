import type {
  ColumnType,
  Generated,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';

export type StampsType = 'sha256' | 'ipfs';

interface StampsTable {
  id: Generated<bigint>;
  protocol: string;
  type: ColumnType<StampsType, StampsType | undefined, StampsType>;
  hash: string;
  block: bigint | null;
  tx: string | null;
  raw_transaction: string | null;
  time: number | null;
  created_at: ColumnType<Date, Date | string | undefined, never>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export interface Database {
  stamps: StampsTable;
}

export type Stamp = Selectable<StampsTable>;
export type NewStamp = Insertable<StampsTable>;
export type StampUpdate = Updateable<StampsTable>;
