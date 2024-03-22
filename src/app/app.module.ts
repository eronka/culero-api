import { Module } from '@nestjs/common';
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
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    OauthModule,
    PrismaModule,
    MailModule,
    ProviderModule,
    CacheModule.register(
      process.env.NODE_ENV === 'e2e'
        ? {
            isGlobal: true,
          }
        : {
            isGlobal: true,
            store: redisStore,
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
            password: process.env.REDIS_PASSWORD ?? 'password',
            ttl: 60 * 60 * 24,
          },
    ),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
