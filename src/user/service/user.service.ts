import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SocialAccountType, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CLIENT } from '../../provider/s3.provider';
import { REDIS_CLIENT } from '../../provider/redis.provider';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { getMimeType } from '../../utils/image';
import { UpdateUserSettingsDto } from '../dto/update-user-settings.dto';

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

    const key = `profile-pictures/${user.id}-${v4()}`;
    const putObjectRequest = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,

      Body: buf,
      ContentType: type,
    });

    try {
      await this.s3.send(putObjectRequest);
      this.logger.log('Profile picture uploaded');

      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          profilePictureUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to upload profile picture',
      );
    }
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
    const email = emails[0].value.toLowerCase();

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
        this.prisma.review.updateMany({
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

  updateSettings(id: string, data: UpdateUserSettingsDto) {
    return this.prisma.userSettings.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  getSettings(id: string) {
    return this.prisma.userSettings.findUniqueOrThrow({
      where: {
        userId: id,
      },
    });
  }

  async deleteUser(id: string) {
    await this.prisma.userSettings.delete({ where: { userId: id } });
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

}
