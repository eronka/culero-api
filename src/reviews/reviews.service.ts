import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewDto } from './DTO/reviews.dto';
import { REDIS_CLIENT } from 'src/provider/redis.provider';
import Redis from 'ioredis';
import { CreateReviewDto } from './DTO/create-review.dto';
import { RatingDto } from './DTO/rating.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private cache: Redis,
  ) {}

  private transformReview(
    review: Review & { postedBy: User },
    currentUserId: User['id'],
  ): ReviewDto {
    return {
      postedBy: review.anonymous
        ? {
            id: review.postedBy.id,
            isEmailVerified: review.postedBy.isEmailVerified,
            profilePictureUrl: review.postedBy.profilePictureUrl,
            name: review.postedBy.name,
          }
        : undefined,
      isAnonymous: !review.postedBy,
      professionalism: review.professionalism,
      reliability: review.reliability,
      communication: review.communication,
      comment: review.comment,
      createdAt: review.createdAt,
      isOwnReview: review.postedById == currentUserId,
      postedToId: review.postedToId,
      id: review.id,
    };
  }

  private async calculateAvgRating(userId: User['id']): Promise<RatingDto> {
    const result = await this.prisma.review.aggregate({
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
    };
  }

  async getUserReviews(user: User, postedToId: User['id']) {
    const ratings = await this.prisma.review.findMany({
      where: { postedToId: postedToId },
      include: {
        postedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings.map((review) => this.transformReview(review, user.id));
  }

  async createReview(
    user: User,
    postedToId: User['id'],
    ratingDto: CreateReviewDto,
  ) {
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
    const review = await this.prisma.review.create({
      data: {
        postedToId: postedToId,
        postedById: ratingDto.anonymous ? null : user.id,
        professionalism: ratingDto.professionalism,
        reliability: ratingDto.reliability,
        communication: ratingDto.communication,
        comment: ratingDto.comment,
        anonymous: ratingDto.anonymous,
      },
      include: {
        postedBy: true,
      },
    });

    // Update the cache
    const avgRatings = await this.calculateAvgRating(postedToId);
    await this.cache.set(
      `avg-ratings-${postedToId}`,
      JSON.stringify(avgRatings),
    );

    return this.transformReview(review, user.id);
  }

  async getAvgUserRatings(userId: User['id']) {
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
}
