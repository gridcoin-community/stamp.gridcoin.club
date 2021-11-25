import { Prisma, stamps, StampsType } from '@prisma/client';
import {
  Fields,
  Filters,
  Pagination,
  Sorting,
} from '../controllers/BaseController';
import { Stamp } from '../models/Stamp';
import { RepoListResults } from './types';
import { PROTOCOL } from '../constants';

interface SelectOptions {
  sort?: Sorting;
  filters?: Filters;
  fields?: Fields;
  pagination?: Pagination;
}
export class StampsRepositoryClass {
  constructor(private stamp = new Stamp()) {}

  /**
   * Creates empty stamp in the database
   * @param type
   * @param hash
   */
  public async createStamp(hash: string, type: StampsType = StampsType.sha256): Promise<any> {
    if (!type || !hash) {
      throw new Error('Not enough data');
    }
    return this.stamp.model.create({
      data: {
        protocol: PROTOCOL,
        type,
        hash,
      },
    });
  }

  public async getByHash(
    hash: string,
    hashType: StampsType = StampsType.sha256,
  ): Promise<stamps | null> {
    return this.stamp.model.findFirst({
      where: { hash, type: hashType },
      orderBy: { time: 'asc' },
    });
  }

  public async getById(id: bigint, options: Pick<SelectOptions, 'fields'>): Promise<stamps> {
    const opts: Record<string, unknown> = {
      where: { id },
    };
    if (options) {
      if (options.fields && options.fields?.stamps) {
        opts.select = options.fields.stamps.reduce(
          (prev: { [key: string]: boolean }, curr: string) => ({ ...prev, [curr]: true }),
          {},
        ) as Prisma.stampsSelect;
      }
    }
    return this.stamp.model.findUnique(opts as any);
  }

  public async listStamps(options?: SelectOptions): Promise<RepoListResults<stamps>> {
    const opts: Prisma.stampsFindManyArgs = {};
    if (options) {
      if (options.fields && options.fields?.stamps) {
        opts.select = options.fields.stamps.reduce(
          (prev: { [key: string]: boolean }, curr: string) => ({ ...prev, [curr]: true }),
          {},
        ) as Prisma.stampsSelect;
      }
      if (options.pagination) {
        opts.skip = options.pagination.offset;
        opts.take = options.pagination.limit;
      }
      if (options.filters) {
        opts.where = options.filters;
      }
      if (options.sort) {
        opts.orderBy = options.sort.order;
      }
    }
    const res = await this.stamp.model.findMany(opts);
    return {
      rows: res,
      count: await this.stamp.model.count({
        where: options.filters || {},
      }),
    };
  }
}

export const StampsRepository = new StampsRepositoryClass();
