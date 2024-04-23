import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { ProviderModule } from '../../provider/provider.module';
import { MailService } from '../../mail/mail.service';
import { REDIS_CLIENT } from '../../provider/redis.provider';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [ProviderModule],
      providers: [
        UserService,
        PrismaService,
        MailService,
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

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
