import Joi from 'joi';

interface StampAttributes {
  hash: string;
  protocol?: string;
  hashType?: string;
}

export interface StampInput {
  data: {
    type: string;
    attributes: StampAttributes;
  }
}

export interface StampData extends StampAttributes {
  id: undefined;
  type: string;
}

export const StampSchema = Joi.object<StampData>({
  type: 'stamps',
  id: Joi.any().optional(),
  hash: Joi.string()
    .required()
    .min(64)
    .max(64)
    .regex(/^[a-fA-F0-9]{64}$/),
  protocol: Joi.string()
    .valid('0.0.1')
    .default('0.0.1')
    .optional(),
  hashType: Joi.string()
    .valid('sha256')
    .default('sha256')
    .optional(),
});
