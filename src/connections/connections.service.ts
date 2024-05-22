import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectionDto } from './DTO/Connection.dto';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('Connections controller')
export class ConnectionsService {
  constructor(private readonly prisma: PrismaService) {}

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
  private transformUserConnection(
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

      joinedAt: user.joinedAt,

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

    return this.transformUserConnection(user);
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

    return connections.map((c) => this.transformUserConnection(c.following));
  }

  async connectWithUser(currentUserId: User['id'], userId: User['id']) {
    await this.prisma.connection.upsert({
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
    });

    return this.getConnection(userId, currentUserId);
  }

  async unconnectWithUser(currentUserId: User['id'], userId: User['id']) {
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

    return users.map((u) => this.transformUserConnection(u));
  }
}
