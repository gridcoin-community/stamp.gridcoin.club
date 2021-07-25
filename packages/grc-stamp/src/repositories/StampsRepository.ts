import { PrismaClient, Prisma, stamps } from '@prisma/client';
import {
  Fields, Filters, Pagination, Sorting,
} from '../controllers/BaseController';
import { RepoListResults } from './types';

interface SelectOptions {
  sort?: Sorting;
  filters?: Filters;
  fields?: Fields;
  pagination?: Pagination;
}
export class StampsRepositoryClass {
  constructor(private prisma = new PrismaClient()) {}

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
    }
    // console.log(opts);
    const res = await this.prisma.stamps.findMany(opts);
    return {
      rows: res,
      count: await this.prisma.stamps.count(),
    };
  }
}

export const StampsRepository = new StampsRepositoryClass();
