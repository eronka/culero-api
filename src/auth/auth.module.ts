import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleOAuthStrategyFactory } from '../oauth/factory/google/google-strategy.factory';
import { GoogleStrategy } from '../oauth/strategy/google/google.strategy';
import { FacebookOAuthStrategyFactory } from '../oauth/factory/facebook/facebook-strategy.factory';
import { LinkedInOAuthStrategyFactory } from '../oauth/factory/linkedin/linkedin-strategy.factory';
import { FacebookStrategy } from '../oauth/strategy/facebook/facebook.strategy';
import { LinkedInStrategy } from '../oauth/strategy/linkedin/linkedin.strategy';
import { AppleOAuthStrategyFactory } from '../oauth/factory/apple/apple-strategy.factory';
import { AppleStrategy } from '../oauth/strategy/apple/apple.strategy';
import { MailService } from '../mail/mail.service';
import { GithubOAuthStrategyFactory } from '../oauth/factory/github/github-strategy.factory';
import { GithubStrategy } from '../oauth/strategy/github/github.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: {
        expiresIn: '1d',
        issuer: 'culero',
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    MailService,
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
      provide: FacebookStrategy,
      useFactory: (
        facebookOAuthStrategyFactory: FacebookOAuthStrategyFactory,
      ) => {
        facebookOAuthStrategyFactory.createOAuthStrategy();
      },
      inject: [FacebookOAuthStrategyFactory],
    },
    LinkedInOAuthStrategyFactory,
    {
      provide: LinkedInStrategy,
      useFactory: (
        linkedinOAuthStrategyFactory: LinkedInOAuthStrategyFactory,
      ) => {
        linkedinOAuthStrategyFactory.createOAuthStrategy();
      },
      inject: [LinkedInOAuthStrategyFactory],
    },
    AppleOAuthStrategyFactory,
    {
      provide: AppleStrategy,
      useFactory: (appleOAuthStrategyFactory: AppleOAuthStrategyFactory) => {
        appleOAuthStrategyFactory.createOAuthStrategy();
      },
      inject: [AppleOAuthStrategyFactory],
    },
    GithubOAuthStrategyFactory,
    {
      provide: GithubStrategy,
      useFactory: (githubOAuthFactory: GithubOAuthStrategyFactory) => {
        githubOAuthFactory.createOAuthStrategy();
      },
      inject: [GithubOAuthStrategyFactory],
    },
  ],
})
export class AuthModule {}
