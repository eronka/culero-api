import { Logger, Provider } from '@nestjs/common';
import { exit } from 'process';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'RedisClient';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const logger = new Logger('RedisProvider');
    if (!process.env.REDIS_URL) {
      logger.error('Redis credentials are not set. Stopping the application.');
      exit(1);
    }

    return new Redis(process.env.REDIS_URL, {
      family: 6,
      connectTimeout: 10000,
    });
  },
};
