import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from './user.module';
import { MAIL_SERVICE } from '../mail/interface.service';
import { MockMailService } from '../mail/mail.mock';
import { AuthType } from '@prisma/client';

describe('User Controller Tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    })
      .overrideProvider(MAIL_SERVICE)
      .useClass(MockMailService)
      .compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    prisma = moduleRef.get(PrismaService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        id: '1',
        email: 'johndoe@example.com',
        password: 'password',
        name: 'John Doe',
        isEmailVerified: true,
        authType: AuthType.EMAIL,
      },
    });
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should be able to get the current user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/user',
      headers: {
        'x-e2e-user-email': 'johndoe@example.com',
      },
    });

    expect(response.statusCode).toBe(200);

    const user = response.json();
    expect(user.id).toBeDefined();
    expect(user.email).toBe('johndoe@example.com');
    expect(user.name).toBe('John Doe');
  });
});
