import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { OauthModule } from '../oauth/oauth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/guard/auth/auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { ProviderModule } from '../provider/provider.module';
import { ReviewsModule } from '../../src/reviews/reviews.module';
import { ConnectionsModule } from '../../src/connections/connections.module';
import { AppLoggerMiddleware } from '../../src/middlewares/logger.middleware';
import { CommonModule } from '../common/common.module';
import { NotificationsModule } from '../../src/notifications/notifications.module';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../src/provider/redis.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    AuthModule,
    UserModule,
    OauthModule,
    PrismaModule,
    MailModule,
    ProviderModule,
    ReviewsModule,
    NotificationsModule,
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        AppLoggerMiddleware,
        session({
          secret: process.env.SESSION_SECRET || 'lala',
          resave: false,
          saveUninitialized: false,
          store: new RedisStore({ client: this.redis }),
        }),
      )
      .forRoutes('*');
  }
}
