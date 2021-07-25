import { Request, Response } from 'express';
import { PresenterInterface } from '../presenters/types';
import { GenericInterface } from '../models/Generic';

export const DEFAULT_PAGINATION_LIMIT = 25;
export const DEFAULT_SORT_FIELD = 'id';
enum FilterTypes {
  'gt',
  'lt',
  'gte',
  'lte',
  'ne',
  'eq',
  'between',
  'notBetween',
  'in',
  'notIn',
  'like',
  'notLike',
}
enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
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

interface Pagination {
  offset?: number;
  limit?: number;
}

interface Sorting {
  order: [string, SortOrder][];
}

interface Fields {
  fields: {
    [key: string]: string[];
  };
}

interface Includes {
  include: string[];
}

interface Filters {
  where: {
    [key: string]: unknown;
  };
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

  protected allFilters?: {[key: string]: string};

  public constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
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
      const paginationLimit = parseInt(query.page.size, 10) || DEFAULT_PAGINATION_LIMIT;
      this.usePagination = {
        offset: parseInt(query.page.offset, 10)
          || parseInt(query.page.number, 10) * paginationLimit
          || 0,
        limit: paginationLimit,
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
          newFields[key] = values.split(/,/);
          return newFields;
        }
        return prev;
      }, {});
      if (!empty) {
        this.useFields.fields = fields;
      }
    }
  }

  public hasField(entry: string, field: string): boolean {
    if ('fields' in this.useFields) {
      return entry in this.useFields.fields
        && this.useFields.fields[entry].includes(field);
    }
    return false;
  }

  private discoverSorting(): void {
    const query = this.req.query as unknown as Query;
    if (!query) return;
    if ('sort' in query) {
      const fields = query.sort.split(/,/).reduce((orderByArray, currentElem) => {
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

        orderByArray.push([fieldName, order]);
        return orderByArray;
      }, []);
      if (fields) {
        this.useSort = { order: fields };
      }
    } else {
      this.useSort = { order: [[DEFAULT_SORT_FIELD, SortOrder.asc]] };
    }
  }

  /**
   * Discover filters
   * We have a hack here
   * As sl got a bug when it doesn't map fields in where
   * It is up to us
   */
  private discoverFilters(): void {
    // const { query } = this.req;
    // if (!query) return;
    // const attributes = this.model.rawAttributes;
    // if ('filter' in query) {
    //   this.allFilters = query.filter;
    //   // Store fields so we can use it for the search
    //   const filters = [];
    //   Object.keys(query.filter).forEach((key) => {
    //     let dbProperKey = key;
    //     if (attributes[key] && attributes[key].field) {
    //       dbProperKey = attributes[key].field;
    //     }
    //     if (this.isObject(query.filter[key])) {
    //       const filterType = ([Object.keys(query.filter[key])]).toString();
    //       if ((Object as any).values(FilterTypes).includes(filterType)) {
    //       // if (FILTER_TYPES.indexOf(filterType) > -1) {
    //         let list = query.filter[key][filterType].split(',');
    //         if (filterType === 'like' || filterType === 'notLike') {
    //           list = `%${list.toString()}%`;
    //         }
    //         // filters.push({ [dbProperKey]: { [Op[filterType]]: list } });
    //         filters.push(
    //          { [dbProperKey]: { [Op[filterType]]: list.length > 1 ? list : list[0] } });
    //       }
    //     } else {
    //       const list = query.filter[key].split(',');
    //       if (list.length > 1) {
    //         filters.push({ [dbProperKey]: { [Op.in]: list } });
    //       } else if (list[0]) {
    //         filters.push({ [dbProperKey]: list[0] });
    //       }
    //     }
    //   });
    //   if (filters.length) {
    //     this.useFilters = { where: filters };
    //   }
    // }
  }

  public hasFilter(filter: string): boolean {
    if ('where' in this.useFilters) {
      const filtersLength = this.useFilters.where.length;
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
      const filtersLength = this.useFilters.where.length;
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
  public isObject(value): boolean { // eslint-disable-line
    return value === Object(value);
    // return value && typeof value === 'object' && value.constructor === Object;
  }

  public render(data: Record<string, unknown>): Record<string, unknown> {
    if (data.rows) {
      const meta = {
        count: 0,
      };
      if (data.count) {
        meta.count = data.count as number;
      }
      return this.presenter.render(data.rows, { meta });
    }
    return this.presenter.render(data);
  }
}
