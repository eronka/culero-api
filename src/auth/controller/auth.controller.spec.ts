import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleOAuthStrategyFactory } from '../../oauth/factory/google/google-strategy.factory';
import { LinkedInOAuthStrategyFactory } from '../../oauth/factory/linkedin/linkedin-strategy.factory';
import { FacebookOAuthStrategyFactory } from '../../oauth/factory/facebook/facebook-strategy.factory';
import { AppleOAuthStrategyFactory } from '../../oauth/factory/apple/apple-strategy.factory';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service';
import { mockDeep } from 'jest-mock-extended';
import { GithubOAuthStrategyFactory } from '../../oauth/factory/github/github-strategy.factory';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        GoogleOAuthStrategyFactory,
        LinkedInOAuthStrategyFactory,
        FacebookOAuthStrategyFactory,
        AppleOAuthStrategyFactory,
        GithubOAuthStrategyFactory,
        ConfigService,
        MailService,
      ],
    })
      .overrideProvider(MailService)
      .useValue(mockDeep<MailService>())
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
