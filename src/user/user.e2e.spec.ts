import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from './user.module';
import { AuthType } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { mockDeep } from 'jest-mock-extended';
import { MailModule } from '../mail/mail.module';

describe('User Controller Tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UserModule, MailModule],
    })
      .overrideProvider(MailService)
      .useValue(mockDeep<MailService>())
      .compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe());
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

  it('should be able to update the name of the current user', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/user',
      headers: {
        'x-e2e-user-email': 'johndoe@example.com',
      },
      payload: {
        name: 'Jane Doe',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().name).toBe('Jane Doe');

    const updatedUser = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });
    expect(updatedUser.name).toBe('Jane Doe');
  });

  it('should be able to update the headline of the current user', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/user',
      headers: {
        'x-e2e-user-email': 'johndoe@example.com',
      },
      payload: {
        headline: 'Some headline',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().headline).toBe('Some headline');
    expect(response.json().name).toBe('John Doe');

    const updatedUser = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });
    expect(updatedUser.headline).toBe('Some headline');
    expect(updatedUser.name).toBe('John Doe');
  });

  afterAll(async () => {
    try {
      await prisma.userSettings.deleteMany();
      await prisma.user.deleteMany();
      await prisma.review.deleteMany();
      await app.close();
    } catch (error) {
      console.log('error', error);
    }
  });
});
