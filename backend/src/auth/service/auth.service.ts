import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async handleOAuthLogin(
    email: string,
    name: string,
    profilePictureUrl: string,
    authType: AuthType,
  ) {
    // We need to create the user if it doesn't exist yet
    const user = await this.createUserIfNotExists(
      email,
      name,
      profilePictureUrl,
      authType,
    );

    const token = await this.generateToken(user.id);

    return {
      ...user,
      token,
    };
  }

  private async createUserIfNotExists(
    email: string,
    name?: string,
    profilePictureUrl?: string,
    authType?: AuthType,
  ) {
    let user = await this.findUserByEmail(email);
    // We need to create the user if it doesn't exist yet
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email,
          name: name,
          profilePictureUrl: profilePictureUrl,
          authType,
        },
      });
    }
    return user;
  }

  private async generateToken(id: string) {
    return await this.jwt.signAsync({ id });
  }

  private async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
