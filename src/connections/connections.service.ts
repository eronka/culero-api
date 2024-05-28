import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthType, NotificationType, User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConnectionDto } from './dto/Connection.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProfileFetcherDelegator } from '../../src/user/profile-fetcher/delegator.profile-fetcher';
import { v4 } from 'uuid';
import { NotificationsService } from '../../src/notifications/notifications.service';

@Injectable()
@ApiTags('Connections service')
export class ConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // retuns an object to be used with prisma's include
  private includeWithUserConnection(currentUserId?: User['id']) {
    return {
      _count: {
        select: {
          followings: true,
          reviewsReceived: true,
        },
      },
      followers: currentUserId
        ? {
            where: {
              followerId: currentUserId,
            },
          }
        : false,
    };
  }

  // transforms an user from db to a Connection DTO
  private convertConnectionToDto(
    user: User & { _count: { followings: number; reviewsReceived: number } } & {
      followers?: { id: number; followerId: string; followingId: string }[];
    },
  ): ConnectionDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      headline: user.headline,
      profilePictureUrl: user.profilePictureUrl,
      isEmailVerified: user.isEmailVerified,
      joinedAt: user.joinedAt,
      authType: user.authType,
      reviewsCount: user._count.reviewsReceived,
      connectionsCount: user._count.followings,
      isConnection: user.followers && user.followers.length !== 0,
    };
  }

  async getConnection(connectionId: User['id'], currentUserId: User['id']) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: connectionId,
      },
      include: this.includeWithUserConnection(currentUserId),
    });

    if (!user) {
      throw new NotFoundException(`User with ${connectionId} not found`);
    }

    return this.convertConnectionToDto(user);
  }

  async getUserConnections(userId: User['id']) {
    const connections = await this.prisma.connection.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          include: this.includeWithUserConnection(userId),
        },
      },
    });

    return connections.map((c) => this.convertConnectionToDto(c.following));
  }

  async addConnection(currentUserId: User['id'], userId: User['id']) {
    const connection = await this.prisma.connection.upsert({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
      update: {},
      create: {
        followerId: currentUserId,
        followingId: userId,
      },
      include: {
        following: {
          include: this.includeWithUserConnection(currentUserId),
        },
      },
    });

    await this.notificationsService.sendNotificationToUser(
      userId,
      NotificationType.CONNECTION,
      `You have a new connection.`,
      'New Culero connection',
      { followerId: currentUserId, followingId: userId },
    );

    return this.convertConnectionToDto(connection.following);
  }

  async removeConnection(currentUserId: User['id'], userId: User['id']) {
    await this.prisma.connection.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });
    return this.getConnection(userId, currentUserId);
  }

  async searchUsers(userId?: User['id'], searchTerm?: string) {
    if (!searchTerm || searchTerm === '') {
      throw new BadRequestException('Search term is required');
    }
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { name: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: this.includeWithUserConnection(userId),
    });

    return users.map((u) => this.convertConnectionToDto(u));
  }

  async searchUserByExternalProfile(profileUrlBase64: string) {
    // Check if the profile by url exists
    // If the account exists, we just return the user associated with it.
    const profileUrl = Buffer.from(profileUrlBase64, 'base64').toString();

    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: { profileUrl },
      include: {
        user: { include: this.includeWithUserConnection() },
      },
    });
    if (socialAccount) return this.convertConnectionToDto(socialAccount.user);

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
          headline: profileData.headline,
          profilePictureUrl: profileData.profilePictureUrl,
        },
        include: this.includeWithUserConnection(),
      }),
      this.prisma.socialAccount.create({
        data: {
          platform: profileData.socialAccountType,
          profileUrl,
          userId: newUserId,
        },
      }),
    ]);
    return this.convertConnectionToDto(newUser);
  }
}
