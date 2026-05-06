import { Request, Response } from 'express';
import {
  Controller,
  DEFAULT_PAGINATION_LIMIT,
  MAXIMUM_PAGINATION_LIMIT,
  DEFAULT_SORT_FIELD,
} from './BaseController';

class TestController extends Controller {
  constructor(req: Request, res: Response) {
    super(req, res);
    this.init();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setPresenter(p: any) {
    this.presenter = p;
  }
}

describe('BaseController', () => {
  let req: Request;
  let res: Response;

  const createInstance = (
    request: Request,
    response: Response,
  ) => new TestController(request, response);

  beforeEach(() => {
    req = {
      query: {},
    } as unknown as Request;
    res = {} as Response;
  });

  describe('discoverPagination', () => {
    it('should set usePagination with default values if page query parameter is absent', () => {
      const controller = createInstance(req, res);
      expect(controller.usePagination).toEqual({ limit: DEFAULT_PAGINATION_LIMIT });
    });

    it('should set usePagination with provided values if page query parameter is present', () => {
      req.query = { page: { size: '10', offset: '20' } };
      const controller = createInstance(req, res);
      expect(controller.usePagination).toEqual({ limit: 10, offset: 20 });
    });

    it('should not allow pagination limit to exceed MAXIMUM_PAGINATION_LIMIT', () => {
      req.query = { page: { size: '200' } };
      const controller = createInstance(req, res);
      expect(controller.usePagination.limit).toBe(MAXIMUM_PAGINATION_LIMIT);
    });
  });

  describe('discoverFields', () => {
    it('should set useFields with provided values if fields query parameter is present', () => {
      req.query = { fields: { field1: 'value1,value2' } };
      const controller = createInstance(req, res);
      expect(controller.useFields).toEqual({ field1: ['value1', 'value2'] });
    });

    it('should not set useFields if fields query parameter is absent', () => {
      const controller = createInstance(req, res);
      expect(controller.useFields).toEqual({});
    });
  });

  describe('discoverSorting', () => {
    it('should set useSort with default values if sort query parameter is absent', () => {
      const controller = createInstance(req, res);
      expect(controller.useSort).toEqual({ order: [{ [DEFAULT_SORT_FIELD]: 'asc' }] });
    });

    it('should set useSort with provided values if sort query parameter is present', () => {
      req.query = { sort: '-field1,field2' };
      const controller = createInstance(req, res);
      expect(controller.useSort).toEqual({ order: [{ field1: 'desc' }, { field2: 'asc' }] });
    });
  });

  describe('discoverFilters', () => {
    it('should set useFilters with provided values if filter query parameter is present', () => {
      req.query = { filter: { field1: 'value1,value2' } };
      const controller = createInstance(req, res);
      expect(controller.useFilters).toEqual({ field1: { in: ['value1', 'value2'] } });
    });

    it('should not set useFilters if filter query parameter is absent', () => {
      const controller = createInstance(req, res);
      expect(controller.useFilters).toBeUndefined();
    });

    it('should convert numeric values to BigInt when using a comparison operator', () => {
      req.query = { filter: { field1: { gt: '123' } } };
      const controller = createInstance(req, res);
      expect(controller.useFilters).toEqual({ field1: { gt: BigInt(123) } });
    });

    it('should not throw and should pass through non-numeric string values when using a comparison operator', () => {
      // Regression test: previously `BigInt("abc")` threw synchronously, which
      // turned into an unhandled promise rejection from the async route handler
      // and crashed the Node process — letting any unauthenticated caller DoS
      // the service with `?filter[hash][ne]=abc`.
      req.query = { filter: { field1: { ne: 'abc' } } };
      expect(() => createInstance(req, res)).not.toThrow();
      const controller = createInstance(req, res);
      expect(controller.useFilters).toEqual({ field1: { ne: 'abc' } });
    });

    it('should not throw and should pass through float string values when using a comparison operator', () => {
      // `BigInt("1.5")` also throws — `Number.isNaN("1.5")` would have missed this.
      req.query = { filter: { field1: { gt: '1.5' } } };
      expect(() => createInstance(req, res)).not.toThrow();
      const controller = createInstance(req, res);
      expect(controller.useFilters).toEqual({ field1: { gt: '1.5' } });
    });

    it('should accept a comma-separated list of mixed values without throwing', () => {
      req.query = { filter: { field1: { gt: '10,abc,20' } } };
      expect(() => createInstance(req, res)).not.toThrow();
      const controller = createInstance(req, res);
      expect(controller.useFilters).toEqual({
        field1: { gt: [BigInt(10), 'abc', BigInt(20)] },
      });
    });
  });

  describe('isObject', () => {
    it('should return true if value is an object', () => {
      const controller = createInstance(req, res);
      expect(controller.isObject({})).toBe(true);
    });

    it('should return false if value is not an object', () => {
      const controller = createInstance(req, res);
      expect(controller.isObject('string')).toBe(false);
    });
  });

  describe('render', () => {
    it('should render data with presenter', () => {
      const data = { rows: [{ id: 1 }] };
      const presenter = {
        render: jest.fn().mockReturnValue({ data: 'rendered' }),
      };
      const controller = createInstance(req, res);
      controller.setPresenter(presenter);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = controller.render(data as any);
      expect(result).toEqual({ data: 'rendered' });
      expect(presenter.render).toHaveBeenCalledWith(data.rows, { meta: { count: 0 } });
    });

    it('should render data with custom presenter', () => {
      const data = { rows: [{ id: 1 }] };
      const customPresenter = {
        render: jest.fn().mockReturnValue({ data: 'custom rendered' }),
      };
      const controller = createInstance(req, res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = controller.render(data as any, customPresenter);
      expect(result).toEqual({ data: 'custom rendered' });
      expect(customPresenter.render).toHaveBeenCalledWith(data.rows, { meta: { count: 0 } });
    });
  });
});
