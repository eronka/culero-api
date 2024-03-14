import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { S3 } from 'aws-sdk';

@Injectable()
export class UserService {
  private readonly s3 = new S3();
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

  async updateProfilePicture(user: User, file: Express.Multer.File) {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `profile-pictures/${user.id}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        profilePictureUrl: uploadResult.Location,
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

  private async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserRatings(user: User, self: boolean, userId?: User['id']) {
    if (self) userId = user.id;

    const UserData = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!UserData) {
      throw new Error('User not found');
    }
    
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
      overall: (
        (result._avg.professionalism ?? 0) +
        (result._avg.reliability ?? 0) +
        (result._avg.communication ?? 0)
      ) / 3,
    }; 
  }  
}
