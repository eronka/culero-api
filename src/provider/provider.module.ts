import { Global, Module } from '@nestjs/common';
import { S3Provider, S3_CLIENT } from './s3.provider';
import { REDIS_CLIENT, RedisProvider } from './redis.provider';

@Global()
@Module({
  exports: [
    {
      provide: S3_CLIENT,
      useValue: S3Provider,
    },
    {
      provide: REDIS_CLIENT,
      useValue: RedisProvider,
    },
  ],
  providers: [S3Provider, RedisProvider],
})
export class ProviderModule {}
