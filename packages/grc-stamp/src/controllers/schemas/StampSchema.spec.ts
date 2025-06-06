import { StampSchema } from './StampSchema';

describe('StampSchema', () => {
  it('should validate a valid stamp', () => {
    const validStamp = {
      type: 'stamps',
      hash: '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7',
      protocol: '0.0.1',
      hashType: 'sha256',
    };

    const { error } = StampSchema.validate(validStamp);
    expect(error).toBeUndefined();
  });

  it('should invalidate a stamp with an invalid hash', () => {
    const invalidStamp = {
      type: 'stamps',
      hash: 'invalidhash',
      protocol: '0.0.1',
      hashType: 'sha256',
    };

    const { error } = StampSchema.validate(invalidStamp);
    expect(error).toBeDefined();
  });

  it('should invalidate a stamp with an invalid protocol', () => {
    const invalidStamp = {
      type: 'stamps',
      hash: '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7',
      protocol: 'invalidprotocol',
      hashType: 'sha256',
    };

    const { error } = StampSchema.validate(invalidStamp);
    expect(error).toBeDefined();
  });

  it('should invalidate a stamp with an invalid hashType', () => {
    const invalidStamp = {
      type: 'stamps',
      hash: '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7',
      protocol: '0.0.1',
      hashType: 'invalidhashType',
    };

    const { error } = StampSchema.validate(invalidStamp);
    expect(error).toBeDefined();
  });

  it('should validate a stamp with optional fields missing', () => {
    const validStamp = {
      type: 'stamps',
      hash: '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7',
    };

    const { error } = StampSchema.validate(validStamp);
    expect(error).toBeUndefined();
  });

  it('should invalidate a stamp with a hash shorter than 64 characters', () => {
    const invalidStamp = {
      type: 'stamps',
      hash: '1234567890',
    };

    const { error } = StampSchema.validate(invalidStamp);
    expect(error).toBeDefined();
  });

  it('should invalidate a stamp with a hash longer than 64 characters', () => {
    const invalidStamp = {
      type: 'stamps',
      hash: '12345678901234567890123456789012345678901234567890123456789012345',
    };

    const { error } = StampSchema.validate(invalidStamp);
    expect(error).toBeDefined();
  });

  it('should validate a stamp with default values for protocol and hashType', () => {
    const validStamp = {
      type: 'stamps',
      hash: '87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7',
    };

    const { value, error } = StampSchema.validate(validStamp);
    expect(error).toBeUndefined();
    expect(value).toHaveProperty('protocol', '0.0.1');
    expect(value).toHaveProperty('hashType', 'sha256');
  });
});
