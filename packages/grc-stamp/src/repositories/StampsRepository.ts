import { Prisma, stamps } from '@prisma/client';
import {
  Fields,
  Filters,
  Pagination,
  Sorting,
} from '../controllers/BaseController';
import { StampData } from '../controllers/schemas/StampSchema';
import { Stamp } from '../models/Stamp';
import { RepoListResults } from './types';

interface SelectOptions {
  sort?: Sorting;
  filters?: Filters;
  fields?: Fields;
  pagination?: Pagination;
}
export class StampsRepositoryClass {
  constructor(private stamp = new Stamp()) {}

  public createStamp(stampData: StampData): void {
    console.log(stampData);
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
    // console.log('------------------------------------------------');
    // console.log(options);
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