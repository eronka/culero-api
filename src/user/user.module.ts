import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { LinkedInOAuthStrategyFactory } from '../oauth/factory/linkedin/linkedin-strategy.factory';
import { LinkedInStrategy } from '../oauth/strategy/linkedin/linkedin.strategy';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
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
  ],
})
export class UserModule {}
