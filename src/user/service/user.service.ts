import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthType, SocialAccountType, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CLIENT } from '../../provider/s3.provider';
// This is needed for file upload to work. Don't remove this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { REDIS_CLIENT } from '../../provider/redis.provider';
import { Redis } from 'ioredis';
import { ProfileFetcherDelegator } from '../profile-fetcher/delegator.profile-fetcher';
import { v4 } from 'uuid';
import { getMimeType } from 'utils/image';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    @Inject(REDIS_CLIENT) private cache: Redis,
    private readonly prisma: PrismaService,
  ) {}

  async getSelf(user: User) {
    return user;
  }

  async updateSelf(user: User, dto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: dto.name,
        headline: dto.headline,
      },
    });
  }

  async updateProfilePicture(user: User, file: string) {
    const type = getMimeType(file);
    if (type !== 'image/jpg' && type !== 'image/jpeg' && type !== 'image/png') {
      throw new BadRequestException('Only jpg, jpeg and png are accepted');
    }

    const buf = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    console.log('here', file, user);
    const putObjectRequest = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-pictures/${user.id}`,
      Body: buf,
      ContentType: type,
    });

    try {
      await this.s3.send(putObjectRequest);
      this.logger.log('Profile picture uploaded');

      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          profilePictureUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-pictures/${user.id}`,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Failed to upload profile picture',
      );
    }
  }

  async rateUser(user: User, postedToId: User['id'], ratingDto: RatingDto) {
    const ratedUser = await this.prisma.user.findUnique({
      where: { id: postedToId },
    });

    // Check if the user exists
    if (!ratedUser) {
      throw new NotFoundException('User not found');
    }

    // Check if the user is trying to rate himself
    if (user.id === postedToId) {
      throw new BadRequestException('You cannot rate yourself');
    }

    ratingDto.anonymous = ratingDto.anonymous ?? false;

    // Rate the user
    const rating = await this.prisma.rating.create({
      data: {
        postedToId: postedToId,
        postedById: ratingDto.anonymous ? null : user.id,
        professionalism: ratingDto.professionalism,
        reliability: ratingDto.reliability,
        communication: ratingDto.communication,
        comment: ratingDto.comment,
        anonymous: ratingDto.anonymous,
      },
    });

    // Update the cache
    const avgRatings = await this.calculateAvgRating(postedToId);
    await this.cache.set(
      `avg-ratings-${postedToId}`,
      JSON.stringify(avgRatings),
    );

    return rating;
  }

  async getUserRatings(user: User, self: boolean, revieweeUserId?: User['id']) {
    if (self) revieweeUserId = user.id;

    const ratings = await this.prisma.rating.findMany({
      where: { postedToId: revieweeUserId },
      include: {
        postedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings.map((review) => ({
      userName: review.postedBy ? review.postedBy.name : 'Anonymous',
      isEmailVerified: review.postedBy
        ? review.postedBy.isEmailVerified
        : false,
      isAnonymous: !review.postedBy,
      profilePictureUrl: review.postedBy?.profilePictureUrl,
      professionalism: review.professionalism,
      reliability: review.reliability,
      communication: review.communication,
      comment: review.comment,
      createdOn: review.createdAt.toISOString(),
      postedById:
        review.postedBy && !review.anonymous ? review.postedById : undefined,
    }));
  }

  async searchUsers(userId: User['id'], searchTerm?: string) {
    if (!searchTerm) {
      throw new BadRequestException('Search term is required');
    }
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: searchTerm } },
          { name: { contains: searchTerm } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        joinedAt: true,
        isEmailVerified: true,
        headline: true,
        profilePictureUrl: true,
        followings: true,
        _count: {
          select: {
            followings: true,
            ratingsReceived: true,
          },
        },
      },
    });
    return users.map(({ _count, followings, ...user }) => ({
      connectionsCount: _count.followings,
      ratingsCount: _count.ratingsReceived,
      isConnection: followings.length != 0,
      ...user,
    }));
  }

  /**
   * This function aims to either create a social account link for the user. If a social
   * account with the same profile URL already exists, it will be linked to the user, and
   * all the followers and ratings will be transferred to the current user. The existing
   * account will be deleted.
   * @param req The request object returned from the passport strategy
   * @param socialAccountType The type of social account to link
   */
  async linkSocialAccount(req: any, socialAccountType: SocialAccountType) {
    const { emails, profileUrl } = req.user;
    const email = emails[0].value;

    // Check if the user exists
    const currentUser = await this.prisma.user.findUniqueOrThrow({
      where: { email },
    });

    // Check if the particular account exists for any other user
    const existingAccount = await this.prisma.socialAccount.findFirst({
      where: {
        platform: socialAccountType,
        profileUrl: profileUrl,
      },
    });
    if (existingAccount) {
      const socialAccountUser = await this.prisma.user.findUnique({
        where: { id: existingAccount.userId },
      });

      // TODO: Merge account here
      await this.prisma.$transaction([
        // Update all the ratings to the existing account with the current user
        this.prisma.rating.updateMany({
          where: { postedToId: socialAccountUser.id },
          data: { postedToId: currentUser.id },
        }),

        // Update all the followers to the existing account with the current user
        this.prisma.connection.updateMany({
          where: { followingId: socialAccountUser.id },
          data: { followingId: currentUser.id },
        }),

        // Delete the existing account
        this.prisma.socialAccount.delete({
          where: { id: existingAccount.id },
        }),
      ]);
    } else {
      // Add the social account to the user
      await this.prisma.socialAccount.create({
        data: {
          platform: socialAccountType,
          profileUrl,
          userId: currentUser.id,
        },
      });
    }
  }

  async searchUserByExternalProfile(profileUrlBase64: string) {
    // Check if the profile by url exists
    // If the account exists, we just return the user associated with it.
    const profileUrl = Buffer.from(profileUrlBase64, 'base64').toString();

    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: { profileUrl },
      include: {
        user: true,
      },
    });
    if (socialAccount) return socialAccount.user;

    // Fetch the profile details
    const profileData = await new ProfileFetcherDelegator(
      profileUrl,
    ).getProfileDetails();

    // Else, we create a new user, associate the social account with it, and return the user.

    const newUserId = v4();
    const [newUser] = await this.prisma.$transaction([
      this.prisma.user.create({
        data: {
          id: newUserId,
          name: profileData.name,
          authType: AuthType.EXTERNAL,
          jobTitle: profileData.jobTitle,
          profilePictureUrl: profileData.profilePictureUrl,
        },
      }),
      this.prisma.socialAccount.create({
        data: {
          platform: profileData.socialAccountType,
          profileUrl,
          userId: newUserId,
        },
      }),
    ]);
    return newUser;
  }

  async getAvgUserRatings(user: User, self: boolean, userId?: User['id']) {
    if (self) userId = user.id;

    // Check the cache first
    const cachedRatings = JSON.parse(
      await this.cache.get(`avg-ratings-${userId}`),
    );

    // If present, return the cached ratings
    if (cachedRatings) {
      return cachedRatings;
    }

    // If not, calculate the average ratings
    const avgRatings = await this.calculateAvgRating(userId);

    // Cache the ratings for 24 hours
    await this.cache.set(`avg-ratings-${userId}`, JSON.stringify(avgRatings));

    return avgRatings;
  }

  private async calculateAvgRating(userId: User['id']) {
    const result = await this.prisma.rating.aggregate({
      where: { postedToId: userId },
      _avg: {
        professionalism: true,
        reliability: true,
        communication: true,
      },
    });

    return {
      professionalism: result._avg.professionalism ?? 0,
      reliability: result._avg.reliability ?? 0,
      communication: result._avg.communication ?? 0,
      overall:
        (result._avg.professionalism +
          result._avg.reliability +
          result._avg.communication) /
        3,
    };
  }
}
