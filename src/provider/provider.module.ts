import { Global, Module } from '@nestjs/common';
import { S3Provider, S3_CLIENT } from './s3.provider';

@Global()
@Module({
  exports: [
    {
      provide: S3_CLIENT,
      useValue: S3Provider,
    },
  ],
  providers: [S3Provider],
})
export class ProviderModule {}
