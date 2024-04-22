import { S3Client } from '@aws-sdk/client-s3';
import { Logger, Provider } from '@nestjs/common';

export const S3_CLIENT = 'S3Client';

export const S3Provider: Provider = {
  provide: S3_CLIENT,
  useFactory: () => {
    const logger = new Logger('S3Provider');
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_REGION
    ) {
      logger.warn('AWS credentials are not set. Skipping S3 client creation.');
      return null;
    }

    return new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  },
};
