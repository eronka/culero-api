import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// function initializeS3() {
//   const logger = new Logger('initializeS3');
//   if (
//     process.env.AWS_ACCESS_KEY_ID &&
//     process.env.AWS_SECRET_ACCESS_KEY &&
//     process.env.AWS_REGION &&
//     process.env.AWS_S3_BUCKET_NAME
//   ) {
//     AWSConfig.update({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region: process.env.AWS_REGION,
//     });
//     logger.log('AWS S3 initialized');
//   } else {
//     logger.error('AWS S3 initialization skipped');
//   }
// }

function initializeSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('culero API')
    .setDescription('The culero API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // initializeS3();
  initializeSwagger(app);
  await app.listen(4200);
}
bootstrap();
