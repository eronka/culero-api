import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { ProviderModule } from '../../provider/provider.module';
import { MailService } from '../../mail/mail.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [ProviderModule],
      providers: [UserService, PrismaService, MailService],
    })
      .overrideProvider(MailService)
      .useValue(mockDeep<MailService>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
