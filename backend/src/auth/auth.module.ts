import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleOAuthStrategyFactory } from '../oauth/factory/google/google-strategy.factory';
import { GoogleStrategy } from '../oauth/strategy/google/google.strategy';
import { FacebookOAuthStrategyFactory } from '../oauth/factory/facebook/facebook-strategy.factory';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
        issuer: 'culero',
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOAuthStrategyFactory,
    {
      provide: GoogleStrategy,
      useFactory: (googleOAuthStrategyFactory: GoogleOAuthStrategyFactory) => {
        googleOAuthStrategyFactory.createOAuthStrategy();
      },
      inject: [GoogleOAuthStrategyFactory],
    },
    FacebookOAuthStrategyFactory,
    {
      provide: GoogleStrategy,
      useFactory: (
        facebookOAuthStrategyFactory: FacebookOAuthStrategyFactory,
      ) => {
        facebookOAuthStrategyFactory.createOAuthStrategy();
      },
      inject: [FacebookOAuthStrategyFactory],
    },
  ],
})
export class AuthModule {}
