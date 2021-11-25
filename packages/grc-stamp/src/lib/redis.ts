import Redis from 'ioredis';
import { config } from '../config';

export const redis = new Redis(
  Number(config.REDIS_PORT),
  config.REDIS_HOST,
  {},
);
