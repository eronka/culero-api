import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
}
