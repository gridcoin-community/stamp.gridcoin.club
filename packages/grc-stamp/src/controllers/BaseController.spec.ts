import { Request, Response } from 'express';
import {
  Controller,
  DEFAULT_PAGINATION_LIMIT,
  MAXIMUM_PAGINATION_LIMIT,
  DEFAULT_SORT_FIELD,
} from './BaseController';

const dummyModel = {
  attributes: {
    f1: ['field1', 'field2'],
    f2: ['field3', 'field4'],
  },
};

class TestController extends Controller {
  constructor(req: Request, res: Response) {
    super(req, res);
    this.model = dummyModel as any;
    super.init();
  }

  public setPresenter(p: any) {
    this.presenter = p as any;
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

  describe('discoverIncludes', () => {
    it('should set useInclude when include query parameter is present', () => {
      req.query = { include: 'field1,field2' };
      const controller = createInstance(req, res);
      expect(controller.useInclude).toEqual({ include: ['field1', 'field2'] });
    });

    it('should not set useInclude when include query parameter is absent', () => {
      const controller = createInstance(req, res);
      expect(controller.useInclude).toBeUndefined();
    });
  });

  describe('hasInclude', () => {
    it('should return true if include is present', () => {
      req.query = { include: 'field1,field7' };
      const controller = createInstance(req, res);
      expect(controller.hasInclude('field1')).toBe(true);
      expect(controller.hasInclude('field7')).toBe(true);
    });

    it('should return false if include is not present', () => {
      req.query = { include: 'field1,field7' };
      const controller = createInstance(req, res);
      expect(controller.hasInclude('field2')).toBe(false);
    });
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

  describe('hasField', () => {
    it('should return true if field is present', () => {
      req.query = { fields: { field1: 'value1,value2' } };
      const controller = createInstance(req, res);
      expect(controller.hasField('field1', 'value1')).toBe(true);
    });

    it('should return false if field is not present', () => {
      req.query = { fields: { field1: 'value1,value22' } };
      const controller = createInstance(req, res);
      expect(controller.hasField('field1', 'value2')).toBe(false);
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
  });

  describe('hasFilter', () => {
    it('should return true if filter is present', () => {
      req.query = { filter: { field1: 'value1' } };
      const controller = createInstance(req, res);
      expect(controller.hasFilter('field1')).toBe(true);
    });

    it('should return false if filter is not present', () => {
      req.query = { filter: { field1: 'value1' } };
      const controller = createInstance(req, res);
      expect(controller.hasFilter('field2')).toBe(false);
    });
  });

  describe('getFilter', () => {
    it('should return filter value if filter is present', () => {
      req.query = { filter: { field1: 'value1' } };
      const controller = createInstance(req, res);
      expect(controller.getFilter('field1')).toBe('value1');
    });

    it('should return null if filter is not present', () => {
      req.query = { filter: { field1: 'value1' } };
      const controller = createInstance(req, res);
      expect(controller.getFilter('field2')).toBeNull();
    });
  });

  describe('getAllFilters', () => {
    it('should return all filters', () => {
      req.query = { filter: { field1: 'value1' } };
      const controller = createInstance(req, res);
      expect(controller.getAllFilters()).toEqual({ field1: 'value1' });
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
      const result = controller.render(data as any, customPresenter);
      expect(result).toEqual({ data: 'custom rendered' });
      expect(customPresenter.render).toHaveBeenCalledWith(data.rows, { meta: { count: 0 } });
    });
  });
});
