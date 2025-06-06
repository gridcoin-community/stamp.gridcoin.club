import { ErrorModel } from './Error';

describe('ErrorModel', () => {
  describe('constructor', () => {
    it('should create an instance with default values when message is not provided', () => {
      const error = new ErrorModel(404, 'Not Found');
      expect(error.status).toBe(404);
      expect(error.title).toBe('Not Found');
      expect(error.detail).toBeUndefined();
    });

    it('should create an instance with custom detail when message is provided', () => {
      const error = new ErrorModel(500, 'Internal Server Error', 'Something went wrong');
      expect(error.status).toBe(500);
      expect(error.title).toBe('Internal Server Error');
      expect(error.detail).toBe('Something went wrong');
    });
  });

  describe('static properties', () => {
    it('should have a BAD_PARAMETER constant with value 470', () => {
      expect(ErrorModel.BAD_PARAMETER).toBe(470);
    });

    it('should have a NOT_FOUND constant with value 404', () => {
      expect(ErrorModel.NOT_FOUND).toBe(404);
    });
  });
});
