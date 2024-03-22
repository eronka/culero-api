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

  describe('Rating tests', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          id: '2',
          email: 'janedoe@example.com',
          password: 'password',
          name: 'Jane Doe',
          isEmailVerified: true,
          authType: AuthType.EMAIL,
        },
      });

      await prisma.rating.createMany({
        data: [
          {
            ratedUserId: '2',
            raterUserId: '1',
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'Something',
          },
          {
            ratedUserId: '2',
            raterUserId: '1',
            professionalism: 5,
            reliability: 5,
            communication: 5,
          },
        ],
      });

      await prisma.rating.create({
        data: {
          ratedUserId: '1',
          raterUserId: '2',
          professionalism: 5,
          reliability: 5,
          communication: 5,
        },
      });
    });

    it('should not be able to rate a user that does not exist', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/3',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          reliability: 5,
          communication: 5,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json().message).toBe('User not found');
    });

    it('should throw validation error if professionalism rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          reliability: 5,
          communication: 5,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw validation error if reliability rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          communication: 5,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw validation error if communication rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          reliability: 5,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should not allow a user to rate themselves', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/1',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          reliability: 5,
          communication: 5,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toBe('You cannot rate yourself');
    });

    it('should not be able to rate anything lesser than 1', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 0,
          reliability: 0,
          communication: 0,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should not be able to rate anything greater than 5', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 6,
          reliability: 6,
          communication: 6,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should be able to rate another user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          reliability: 5,
          communication: 5,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().ratedUserId).toBe('2');
      expect(response.json().raterUserId).toBe('1');
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);

      const rating = await prisma.rating.findUnique({
        where: {
          id: response.json().id,
        },
      });
      expect(rating).toBeDefined();
      expect(rating.ratedUserId).toBe('2');
      expect(rating.raterUserId).toBe('1');
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
    });

    it('should be able to rate another user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/rate/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          professionalism: 5,
          reliability: 5,
          communication: 5,
          anonymous: true,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().ratedUserId).toBe('2');
      expect(response.json().raterUserId).toBe(null);
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);
      expect(response.json().anonymous).toBe(true);

      const rating = await prisma.rating.findUnique({
        where: {
          id: response.json().id,
        },
      });
      expect(rating).toBeDefined();
      expect(rating.ratedUserId).toBe('2');
      expect(rating.raterUserId).toBe(null);
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
      expect(rating.anonymous).toBe(true);
    });

    it('should be able to get the ratings of the current user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/ratings/self',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(1);

      const rating = response.json()[0];
      expect(rating.userName).toBe('Jane Doe');
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
    });

    it('should be able to get the ratings of another user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/ratings/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(2);

      const rating = response.json()[0];
      expect(rating.userName).toBe('John Doe');
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
      expect(rating.comment).toBe('Something');
    });

    it('should be able to get average ratings of another user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/avg-rating/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);
      expect(response.json().overall).toBe(5);
    });

    it('should be able to get average rating of self', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/avg-rating/self',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);
      expect(response.json().overall).toBe(5);
    });
  });

  it('should be able to search for a user', async () => {
    await prisma.user.create({
      data: {
        id: '3',
        email: 'abc@examil.com',
        password: 'password',
        name: 'John',
        isEmailVerified: true,
        authType: AuthType.EMAIL,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/user/search/doe',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveLength(1);
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany();
      await prisma.rating.deleteMany();
      await app.close();
    } catch (error) {
      console.log('error', error);
    }
  });
});
