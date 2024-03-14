import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getSelf(user: User) {
    return user;
  }

  async findUsers(user: User, search: string) {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            name: {
              contains: search,
            },
          },
        ],
      },
    });
  }
}
