import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingDto } from '../dto/rating.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getSelf(user: User) {
    return user;
  }

  async rateUser(user: User, ratedUserId: User['id'], rating: RatingDto) {
    const ratedUser = await this.prisma.user.findUnique({
      where: { id: ratedUserId },
    });

    // Check if the user exists
    if (!ratedUser) {
      throw new Error('User not found');
    }

    // Check if the user is trying to rate himself
    if (user.id === ratedUserId) {
      throw new Error('You cannot rate yourself');
    }

    // Rate the user
    await this.prisma.rating.create({
      data: {
        ratedUserId: ratedUserId,
        raterUserId: rating.anonymous ? null : user.id,
        professionalism: rating.professionalism,
        reliability: rating.reliability,
        communication: rating.communication,
        comment: rating.comment,
        anonymous: rating.anonymous,
      },
    });
  }

  async getUserReviews(user: User, self: boolean, revieweeUserId?: User['id']) {
    if (self) revieweeUserId = user.id;
    const revieweeUser = await this.prisma.user.findUnique({
      where: { id: revieweeUserId },
      include: {
        receivedReviews: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!revieweeUser) {
      throw new Error('User not found');
    }

    if (self)
      return revieweeUser.receivedReviews.map((review) => ({
        userName: review.author.name,
        profilePictureUrl: review.author.profilePictureUrl ?? '',
        professionalism: review.professionalism,
        reliability: review.reliability,
        communication: review.communication,
        createdOn: review.createdAt.toISOString(),
      }));
    return revieweeUser.receivedReviews.map((review) => ({
      userName: review.author.name,
      profilePictureUrl: review.author.profilePictureUrl ?? '',
      professionalism: review.professionalism,
      reliability: review.reliability,
      communication: review.communication,
      createdOn: review.createdAt.toISOString(),
      comment: review.comment,
    }));
  }
}
