import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthType } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { mockDeep } from 'jest-mock-extended';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { ReviewsModule } from './reviews.module';
import { NotificationsModule } from '../../src/notifications/notifications.module';

describe('Reviws Controller Tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        MailModule,
        ReviewsModule,
        NotificationsModule,
      ],
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
    await prisma.userSettings.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        id: '1',
        email: 'johndoe@example.com',
        name: 'John Doe',
        isEmailVerified: true,
        onboarded: true,
        authType: AuthType.EMAIL,
      },
    });
  });

  describe('review tests', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          id: '2',
          email: 'janedoe@example.com',
          name: 'Jane Doe',
          isEmailVerified: true,
          authType: AuthType.EMAIL,
        },
      });

      await prisma.review.createMany({
        data: [
          {
            postedToId: '2',
            postedById: '1',
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'Something',
          },
          {
            postedToId: '2',
            postedById: '1',
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'lala',
          },
        ],
      });

      await prisma.review.create({
        data: {
          postedToId: '1',
          postedById: '2',
          professionalism: 5,
          reliability: 5,
          communication: 5,
          comment: 'lala',
        },
      });
    });

    it('should not be able to rate a user that does not exist', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'lala',
          },
          postedToId: '3',
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json().message).toBe('User not found');
    });

    it('should throw validation error if professionalism rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            reliability: 5,
            communication: 5,
            comment: 'lala',
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw validation error if reliability rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            communication: 5,
            comment: 'lala',
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw validation error if communication rating is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          method: 'POST',
          url: '/reviews',
          headers: {
            'x-e2e-user-email': 'johndoe@example.com',
          },
          payload: {
            review: {
              professionalism: 2,
              reliability: 5,
              comment: 'lala',
            },
            postedToId: '2',
          },
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should not allow a user to rate themselves', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'lala',
          },
          postedToId: '1',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toBe('You cannot rate yourself');
    });

    it('should not be able to rate anything lesser than 1', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 0,
            comment: 'lala',
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should not be able to rate anything greater than 5', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 6,
            comment: 'lala',
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should be able to rate another user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'lala',
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().postedToId).toBe('2');
      expect(response.json().postedBy.id).toBe('1');
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);

      const rating = await prisma.review.findUnique({
        where: {
          id: response.json().id,
        },
      });
      expect(rating).toBeDefined();
      expect(rating.postedToId).toBe('2');
      expect(rating.postedById).toBe('1');
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
    });

    it('should be able to rate another user - anon', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
        payload: {
          review: {
            professionalism: 5,
            reliability: 5,
            communication: 5,
            comment: 'lala',
            anonymous: true,
          },
          postedToId: '2',
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().postedToId).toBe('2');
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);
      expect(response.json().isAnonymous).toBe(true);
      expect(response.json().postedBy).toBe(undefined);

      const rating = await prisma.review.findUnique({
        where: {
          id: response.json().id,
        },
      });
      expect(rating).toBeDefined();
      expect(rating.postedToId).toBe('2');
      expect(rating.postedById).toBe('1');
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
      expect(rating.anonymous).toBe(true);
    });

    it('should be able to get the ratings of another user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/reviews/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);

      const rating = response.json()[0];
      expect(rating.professionalism).toBe(5);
      expect(rating.reliability).toBe(5);
      expect(rating.communication).toBe(5);
      expect(rating.comment).toBe('Something');
    });

    it('should be able to get average ratings of another user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/reviews/avg-rating/2',
        headers: {
          'x-e2e-user-email': 'johndoe@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().professionalism).toBe(5);
      expect(response.json().reliability).toBe(5);
      expect(response.json().communication).toBe(5);
    });
  });
  afterAll(async () => {
    try {
      await prisma.user.deleteMany();
      await prisma.review.deleteMany();
      await app.close();
    } catch (error) {
      console.log('error', error);
    }
  });
});
