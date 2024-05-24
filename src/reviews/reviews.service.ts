import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, Review, FavoriteReview, ReviewState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewDto } from './dto/reviews.dto';
import { REDIS_CLIENT } from 'src/provider/redis.provider';
import Redis from 'ioredis';
import { CreateReviewDto } from './dto/create-review.dto';
import { RatingDto } from './dto/rating.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private cache: Redis,
  ) {}

  // transform a review from the DB to ReviewDTO (as expected by the API)
  private transformReview(
    review: Review & { postedBy: User } & { favorites: FavoriteReview[] },
    currentUserId: User['id'],
  ): ReviewDto {
    return {
      postedBy: !review.anonymous
        ? {
            id: review.postedBy.id,
            isEmailVerified: review.postedBy.isEmailVerified,
            profilePictureUrl: review.postedBy.profilePictureUrl,
            name: review.postedBy.name,
          }
        : undefined,
      isAnonymous: review.anonymous,
      professionalism: review.professionalism,
      reliability: review.reliability,
      communication: review.communication,
      comment: review.comment,
      createdAt: review.createdAt,
      isOwnReview: review.postedById == currentUserId,
      // hide "postedBy" for anonymous reviews
      postedToId: review.postedToId,
      id: review.id,
      isFavorite: !!review.favorites.find((f) => f.userId === currentUserId),
      state: review.state,
    };
  }

  // properties to include with the review. Based on the userId to calculate if review is favorite by review.
  private includeWithReview(currentUserId: User['id']) {
    return {
      postedBy: true,
      favorites: {
        where: {
          userId: currentUserId,
        },
      },
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
      include: this.includeWithReview(user.id),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings
      .map((review) => this.transformReview(review, user.id))
      .filter((r) => r.state === 'APPROVED' || r.isOwnReview);
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
        postedById: user.id,
        professionalism: ratingDto.professionalism,
        reliability: ratingDto.reliability,
        communication: ratingDto.communication,
        comment: ratingDto.comment,
        anonymous: ratingDto.anonymous,
        state: ReviewState.APPROVED,
      },
      include: this.includeWithReview(user.id),
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

  async getReview(userId: User['id'], reviewId: Review['id']) {
    return this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: this.includeWithReview(userId),
    });
  }

  async likeReview(user: User, reviewId: Review['id']): Promise<ReviewDto> {
    await this.prisma.favoriteReview.upsert({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: reviewId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        reviewId: reviewId,
      },
    });
    const review = await this.getReview(user.id, reviewId);

    return this.transformReview(review, user.id);
  }

  async unlikeReview(user: User, reviewId: Review['id']): Promise<ReviewDto> {
    await this.prisma.favoriteReview.delete({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: reviewId,
        },
      },
    });

    const review = await this.getReview(user.id, reviewId);

    return this.transformReview(review, user.id);
  }

  // check if the review with reviewId is posted by the user with userID
  async canUserModifyReview(userId: User['id'], reviewId: Review['id']) {
    const review = await this.getReview(userId, reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.postedById !== userId) {
      throw new ForbiddenException(
        `User ${userId} has no access to review ${reviewId}`,
      );
    }

    return true;
  }

  async deleteReview(reviewId: Review['id']) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    const avgRatings = await this.calculateAvgRating(review.postedToId);
    await this.cache.set(
      `avg-ratings-${review.postedToId}`,
      JSON.stringify(avgRatings),
    );

    return true;
  }

  async updateReview(
    user: User,
    reviewId: string,
    data: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        professionalism: data.professionalism,
        communication: data.communication,
        reliability: data.reliability,
        comment: data.comment,
        anonymous: data.anonymous,
      },
      include: this.includeWithReview(user.id),
    });

    // Update the cache
    const avgRatings = await this.calculateAvgRating(review.postedToId);
    await this.cache.set(
      `avg-ratings-${review.postedToId}`,
      JSON.stringify(avgRatings),
    );

    return this.transformReview(review, user.id);
  }

  async getReviewByUserForUser(
    currentUserId: string,
    userId: string,
  ): Promise<ReviewDto | undefined> {
    const review = await this.prisma.review.findFirst({
      where: {
        postedById: currentUserId,
        postedToId: userId,
      },
      include: this.includeWithReview(currentUserId),
    });

    if (!review) {
      return undefined;
    }

    return this.transformReview(review, currentUserId);
  }

  async getReviewPostedBy(currentUserId: User['id']): Promise<ReviewDto[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        postedById: currentUserId,
      },
      include: this.includeWithReview(currentUserId),
    });

    return reviews.map((r) => this.transformReview(r, currentUserId));
  }
}
