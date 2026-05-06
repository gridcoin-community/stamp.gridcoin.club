import { Request, Response } from 'express';
import { PresenterInterface } from '../presenters/types';
import { RepoListResults } from '../repositories/types';

export const DEFAULT_PAGINATION_LIMIT = 25;
export const MAXIMUM_PAGINATION_LIMIT = 100;
export const DEFAULT_SORT_FIELD = 'id';

export type FilterOp = 'gt' | 'lt' | 'gte' | 'lte' | 'ne' | 'eq';

export const FILTER_OPS: ReadonlySet<FilterOp> = new Set(['gt', 'lt', 'gte', 'lte', 'ne', 'eq']);

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

interface Query {
  readonly page?: {
    readonly size?: string;
    readonly offset?: string;
    readonly number?: string;
  };
  readonly fields?: {
    readonly [key: string]: string;
  };
  readonly filter?: {
    readonly [key: string]: string | { readonly [op: string]: string };
  };
  readonly sort?: string;
}

export interface Pagination {
  offset?: number;
  limit?: number;
}

export interface Sorting {
  order: [{
    [key: string]: SortOrder;
  }];
}

export interface Fields {
  [key: string]: string[];
}

export interface Filters {
  [key: string]: unknown;
}

export class Controller {
  protected req: Request;

  protected res: Response;

  public useSort?: Sorting;

  public useFields: Fields;

  public usePagination!: Pagination;

  public useFilters?: Filters;

  protected presenter!: PresenterInterface;

  public constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.useFields = { };
  }

  protected init(): void {
    this.discoverPagination();
    this.discoverSorting();
    this.discoverFilters();
    this.discoverFields();
  }

  private discoverPagination(): void {
    const query = this.req.query as unknown as Query;
    if (query?.page) {
      // we keep "limit" keyword in the data structure for compatibility
      let paginationLimit = parseInt(query.page.size ?? '', 10) || DEFAULT_PAGINATION_LIMIT;
      // Do not allow it to be too big
      if (paginationLimit > MAXIMUM_PAGINATION_LIMIT) {
        paginationLimit = MAXIMUM_PAGINATION_LIMIT;
      }
      this.usePagination = {
        offset: parseInt(query.page.offset ?? '', 10)
          || parseInt(query.page.number ?? '', 10) * paginationLimit
          || 0,
        limit: paginationLimit,
      };
    } else {
      this.usePagination = {
        limit: DEFAULT_PAGINATION_LIMIT,
      };
    }
  }

  private discoverFields(): void {
    const query = this.req.query as unknown as Query;
    if (!query?.fields) return;
    let empty = true;
    const fields = Object.entries(query.fields).reduce<Fields>((prev, curr) => {
      const [key, values] = curr;
      if (values) {
        empty = false;
        const newFields = prev;
        // Filter out all non-fields-like values
        newFields[key] = values.split(/,/).filter((field) => field.match(/^[a-zA-Z_0-9]+$/)).filter(Boolean);
        return newFields;
      }
      return prev;
    }, {});
    if (!empty) {
      this.useFields = fields;
    }
  }

  private discoverSorting(): void {
    const query = this.req.query as unknown as Query;
    if (!query) return;
    if (query.sort) {
      const fields = query.sort.split(/,/).reduce<{ [key: string]: SortOrder }[]>((orderByArray, currentElem) => {
        let fieldName: string = currentElem;
        let order: SortOrder;
        order = SortOrder.asc;
        // '-' as a prefix gives a reverse ordering
        if (currentElem[0] === '-') {
          order = SortOrder.desc;
          fieldName = currentElem.replace(/^-/, '');
        }
        // cleanup fieldname
        fieldName = fieldName.replace(/[^a-z0-9_-]/ig, '');

        orderByArray.push({ [fieldName]: order });
        return orderByArray;
      }, []);
      if (fields.length) {
        this.useSort = { order: fields as Sorting['order'] };
      }
    } else {
      this.useSort = { order: [{ [DEFAULT_SORT_FIELD]: SortOrder.asc }] };
    }
  }

  // Parse `?filter[<field>][<op>]=…` into the normalized intermediate
  // shape the repository's filter translator consumes:
  //   { field: scalar }                     scalar equality
  //   { field: { in: [a, b, c] } }          comma-separated list
  //   { field: { eq|ne|gt|lt|gte|lte: x } } operator filter
  private discoverFilters(): void {
    const query = this.req.query as unknown as Query;
    if (!query?.filter) return;
    const filterQuery = query.filter;
    let filters: Filters = {};
    Object.keys(filterQuery).forEach((key) => {
      const value = filterQuery[key];
      if (this.isObject(value)) {
        const opMap = value as { readonly [op: string]: string };
        const [op] = Object.keys(opMap);
        if (FILTER_OPS.has(op as FilterOp)) {
          const raw = opMap[op];
          // Coerce via String() — express's qs parser can deliver arrays or
          // objects for the same key, and .split() would throw TypeError.
          // BigInt() throws on non-numeric input; fall through to the raw string.
          const list = String(raw).split(',').map((v) => {
            try {
              return BigInt(v);
            } catch {
              return v;
            }
          });

          filters = {
            ...filters,
            [key]: { [op]: list.length > 1 ? list : list[0] },
          };
        }
      } else {
        const list = String(value).split(',');
        if (list.length > 1) {
          filters = { ...filters, [key]: { in: list } };
        } else if (list[0]) {
          filters = { ...filters, [key]: list[0] };
        }
      }
    });
    this.useFilters = filters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public isObject(value: any): value is typeof Object {
    return value === Object(value);
  }

  public render<T>(
    data: T | RepoListResults<T>,
    customPresenter?: PresenterInterface,
  ): Record<string, unknown> {
    const presenter = customPresenter || this.presenter;
    if (this.isObject(data) && 'rows' in data) {
      const meta = {
        count: 0,
      };
      if ('count' in data) {
        meta.count = data.count as number;
      }
      return presenter.render(data.rows, { meta });
    }
    return presenter.render(data);
  }
}
