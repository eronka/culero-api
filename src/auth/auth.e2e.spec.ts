import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { mockDeep } from 'jest-mock-extended';
import { MailModule } from '../mail/mail.module';

describe('Auth Controller Tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule, MailModule],
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

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should be able to sign up using email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/email',
      payload: {
        email: 'jane@example.com',
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(response.json()).toEqual({
      status: 'success',
    });
  });

  it('should send verification code to email on sign up', async () => {
    await app.inject({
      method: 'POST',
      url: '/auth/email',
      payload: {
        email: 'jane@example.com',
      },
    });

    const verificationCode = await prisma.verificationCode.findUnique({
      where: {
        email: 'jane@example.com',
      },
    });

    expect(verificationCode).toBeDefined();
    expect(verificationCode.code).toBeDefined();
    expect(verificationCode.email).toEqual('jane@example.com');
  });

  it('should not resend verification code if email is already verified', async () => {
    await prisma.user.create({
      data: {
        email: 'jane@example.com',
        isEmailVerified: true,
        authType: AuthType.EMAIL,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/regenerate-code/jane@example.com',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should not resend verification code if user does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/regenerate-code/abc',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should be able to verify email using verification code', async () => {
    // Sign up
    await app.inject({
      method: 'POST',
      url: '/auth/email',
      payload: {
        email: 'jane@example.com',
      },
    });

    // Get verification code
    const verificationCode = await prisma.verificationCode.findUnique({
      where: {
        email: 'jane@example.com',
      },
    });

    // Verify email
    const response = await app.inject({
      method: 'POST',
      url: '/auth/verify-email',
      payload: {
        email: 'jane@example.com',
        code: verificationCode.code,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(response.json().email).toEqual('jane@example.com');
    expect(response.json().isEmailVerified).toEqual(true);
    expect(response.json().password).toBeUndefined();
    expect(response.json().token).toBeDefined();

    // Verify that the verification code is deleted
    const deletedVerificationCode = await prisma.verificationCode.findUnique({
      where: {
        email: 'jane@example.com',
      },
    });

    expect(deletedVerificationCode).toBeNull();
  });

  afterEach(async () => {
    await prisma.userSettings.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verificationCode.deleteMany();
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.log('error', error);
    }
  });
});
