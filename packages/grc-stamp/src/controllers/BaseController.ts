import { Request, Response } from 'express';
import { PresenterInterface } from '../presenters/types';
import { GenericInterface } from '../models/Generic';
import { RepoListResults } from '../repositories/types';

export const DEFAULT_PAGINATION_LIMIT = 25;
export const MAXIMUM_PAGINATION_LIMIT = 100;
export const DEFAULT_SORT_FIELD = 'id';

enum FilterTypes {
  'gt',
  'lt',
  'gte',
  'lte',
  'ne',
  'eq',
  // 'between',
  // 'notBetween',
  // 'in',
  // 'notIn',
  // 'like',
  // 'notLike',
}
enum MapFilterTypes {
  'gt' = 'gt',
  'lt' = 'lt',
  'gte' = 'gte',
  'lte' = 'lte',
  'ne' = 'not',
  'eq' = 'equals',
  // 'between',
  // 'notBetween',
  // 'in',
  // 'notIn',
  // 'like',
  // 'notLike',
}
export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

interface Query {
  readonly include?: string;
  readonly page: {
    readonly size?: string;
    readonly offset?: string;
    readonly number?: string;
  };
  readonly fields?: {
    readonly [key: string]: string;
  };
  readonly sort: string;
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

export interface Includes {
  include: string[];
}

export interface Filters {
  [key: string]: unknown;
}

export class Controller {
  protected req: Request;

  protected res: Response;

  public useSort: Sorting;

  public useFields: Fields;

  public useInclude: Includes;

  public usePagination: Pagination;

  public useFilters: Filters;

  protected model: GenericInterface;

  protected presenter: PresenterInterface;

  protected allFilters?: Record<string, string>;

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
    this.discoverIncludes();
  }

  private discoverIncludes(): void {
    if (!this.req.query) return;
    const query = this.req.query as unknown as Query;
    if ('include' in query && query.include) {
      if (!this.useInclude) {
        this.useInclude = { include: null };
      }
      this.useInclude.include = query.include.split(/,/);
    }
  }

  public hasInclude(include: string): boolean {
    if (this.useInclude && 'include' in this.useInclude) {
      return this.useInclude.include.includes(include);
    }
    return false;
  }

  private discoverPagination(): void {
    const query = this.req.query as unknown as Query;
    if (query && 'page' in query) {
      // we keep "limit" keyword in the data structure for compatibility
      let paginationLimit = parseInt(query.page.size, 10) || DEFAULT_PAGINATION_LIMIT;
      // Do not allow it to be too big
      if (paginationLimit > MAXIMUM_PAGINATION_LIMIT) {
        paginationLimit = MAXIMUM_PAGINATION_LIMIT;
      }
      this.usePagination = {
        offset: parseInt(query.page.offset, 10)
          || parseInt(query.page.number, 10) * paginationLimit
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
    if (!query) return;
    let empty = true;
    if ('fields' in query) {
      const fields = Object.entries(query.fields).reduce((prev, curr) => {
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
  }

  public hasField(entry: string, field: string): boolean {
    return entry in this.useFields
        && this.useFields[entry]
        && this.useFields[entry].includes(field);
  }

  private discoverSorting(): void {
    const query = this.req.query as unknown as Query;
    if (!query) return;
    if ('sort' in query) {
      const fields: [{ [key: string]: SortOrder }] = query.sort.split(/,/).reduce((orderByArray, currentElem) => {
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
      }, [] as any);
      if (fields) {
        this.useSort = { order: fields };
      }
    } else {
      this.useSort = { order: [{ [DEFAULT_SORT_FIELD]: SortOrder.asc }] };
    }
  }

  /**
   * Discover filters
   * We have a hack here
   * As sl got a bug when it doesn't map fields in where
   * It is up to us
   */
  private discoverFilters(): void {
    const { query } = this.req;
    if (!query || !this.model) return;
    const { attributes } = this.model;
    if ('filter' in query) {
      this.allFilters = query.filter as Record<string, string>;
      // Store fields so we can use it for the search
      let filters = {};
      Object.keys(query.filter).forEach((key) => {
        let dbProperKey = key;
        if (attributes[key] && attributes[key].field) {
          dbProperKey = attributes[key].field;
        }
        if (this.isObject(query.filter[key])) {
          const filterTypeUnresolved = ([Object.keys(query.filter[key])]).toString();
          if (Object.values(FilterTypes).includes(filterTypeUnresolved)) {
            const filterType = MapFilterTypes[filterTypeUnresolved];
            let list = query.filter[key][filterTypeUnresolved].split(',');
            list = list.map((value: any) => (Number.isNaN(value) ? value : BigInt(value)));

            filters = {
              ...filters,
              [dbProperKey]: { [filterType]: list.length > 1 ? list : list[0] },
            };
          }
        } else {
          const list = query.filter[key].split(',');
          if (list.length > 1) {
            filters = {
              ...filters,
              [dbProperKey]: { in: list },
            };
          } else if (list[0]) {
            filters = {
              ...filters,
              [dbProperKey]: list[0],
            };
          }
        }
      });
      this.useFilters = filters;
    }
  }

  public hasFilter(filter: string): boolean {
    if ('where' in this.useFilters) {
      const filtersLength = Object.keys(this.useFilters).length;
      for (let i = 0; i < filtersLength; i++) {
        if (Object.keys(this.useFilters.where[i]).includes(filter)) return true;
      }
    }
    if (this.allFilters) {
      return (filter in this.allFilters);
    }
    return false;
  }

  public getFilter(filter: string): string | null {
    if ('where' in this.useFilters) {
      const filtersLength = Object.keys(this.useFilters).length;
      for (let i = 0; i < filtersLength; i++) {
        if (Object.keys(this.useFilters.where[i]).includes(filter)) {
          return this.useFilters.where[i][filter];
        }
      }
    }
    if (filter in this.allFilters) {
      return this.allFilters[filter];
    }
    return null;
  }

  public getAllFilters(): {[key: string]: string} {
    return this.allFilters;
  }

  /**
   * Chek whenever value is object
   *
   * @param {*} value
   * @returns {boolean}
   * @memberof Controller
   */
  public isObject(value: any): value is typeof Object { // eslint-disable-line
    return value === Object(value);
    // return value && typeof value === 'object' && value.constructor === Object;
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
