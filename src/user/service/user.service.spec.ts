import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { ProviderModule } from '../../provider/provider.module';
import { MailService } from '../../mail/mail.service';
import { REDIS_CLIENT } from '../../provider/redis.provider';
import { LinkedInOAuthStrategyFactory } from '../../oauth/factory/linkedin/linkedin-strategy.factory';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProviderModule],
      providers: [
        UserService,
        PrismaService,
        MailService,
        ConfigService,
        LinkedInOAuthStrategyFactory,
        {
          provide: REDIS_CLIENT,
          useValue: {},
        },
      ],
    })
      .overrideProvider(MailService)
      .useValue(mockDeep<MailService>())
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
