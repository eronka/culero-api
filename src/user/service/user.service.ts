import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CLIENT } from '../../provider/s3.provider';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async updateProfilePicture(user: User, file: Express.Multer.File) {
    const putObjectRequest = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-pictures/${user.id}`,
      Body: file.buffer,
      ContentType: file.mimetype,
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

  async rateUser(user: User, ratedUserId: User['id'], ratingDto: RatingDto) {
    const ratedUser = await this.prisma.user.findUnique({
      where: { id: ratedUserId },
    });

    // Check if the user exists
    if (!ratedUser) {
      throw new NotFoundException('User not found');
    }

    // Check if the user is trying to rate himself
    if (user.id === ratedUserId) {
      throw new BadRequestException('You cannot rate yourself');
    }

    ratingDto.anonymous = ratingDto.anonymous ?? false;

    // Rate the user
    const rating = await this.prisma.rating.create({
      data: {
        ratedUserId: ratedUserId,
        raterUserId: ratingDto.anonymous ? null : user.id,
        professionalism: ratingDto.professionalism,
        reliability: ratingDto.reliability,
        communication: ratingDto.communication,
        comment: ratingDto.comment,
        anonymous: ratingDto.anonymous,
      },
    });

    // Update the cache
    const avgRatings = await this.calculateAvgRating(ratedUserId);
    await this.cacheManager.set(`avg-ratings-${ratedUserId}`, avgRatings);

    return rating;
  }

  async getUserRatings(user: User, self: boolean, revieweeUserId?: User['id']) {
    if (self) revieweeUserId = user.id;

    const ratings = await this.prisma.rating.findMany({
      where: { ratedUserId: revieweeUserId },
      include: {
        raterUser: true,
      },
    });

    return ratings.map((review) => ({
      userName: review.raterUser ? review.raterUser.name : 'Anonymous',
      profilePictureUrl: review.raterUser?.profilePictureUrl,
      professionalism: review.professionalism,
      reliability: review.reliability,
      communication: review.communication,
      createdOn: review.createdAt.toISOString(),
      comment: !self ? review.comment : undefined,
    }));
  }

  async searchUsers(searchTerm?: string) {
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
        profilePictureUrl: true,
      },
    });
    return users;
  }

  async linkSocialAccount(
    userId: string,
    provider: string,
    accessToken: string,
  ) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let email: string | undefined;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictException(
        'Social account already linked to a different user',
      );
    }

    // Add the social account to the user
    await this.prisma.linkedSocialAccount.create({
      data: {
        platform: provider,
        accessToken,
        userId,
      },
    });
  }

  async getAvgUserRatings(user: User, self: boolean, userId?: User['id']) {
    if (self) userId = user.id;

    // Check the cache first
    const cachedRatings = await this.cacheManager.get(`avg-ratings-${userId}`);

    // If present, return the cached ratings
    if (cachedRatings) {
      return cachedRatings;
    }

    // If not, calculate the average ratings
    const avgRatings = await this.calculateAvgRating(userId);

    // Cache the ratings for 24 hours
    await this.cacheManager.set(`avg-ratings-${userId}`, avgRatings);

    return avgRatings;
  }

  private async findUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  private async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  private async calculateAvgRating(userId: User['id']) {
    const result = await this.prisma.rating.aggregate({
      where: { ratedUserId: userId },
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
