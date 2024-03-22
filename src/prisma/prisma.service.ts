import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async searchUsers(searchTerm: string) {
    return await this.user.findMany({
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
  }
}
