import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async handleGoogleOAuthLogin(req: any) {
    const { emails, displayName: name, photos } = req.user;
    const email = emails[0].value;
    const profilePictureUrl = photos[0].value;

    const user = await this.createUserIfNotExists(
      email,
      name,
      profilePictureUrl,
      AuthType.GOOGLE,
    );

    const token = await this.generateToken(user.id);

    return {
      ...user,
      token,
    };
  }

  async handleFacebookOAuthLogin(req: any) {
    const { emails, name, photos } = req.user;
    const email = emails[0].value;
    const displayName = name.givenName + ' ' + name.familyName;
    const profilePictureUrl = photos[0].value;

    const user = await this.createUserIfNotExists(
      email,
      displayName,
      profilePictureUrl,
      AuthType.FACEBOOK,
    );

    const token = await this.generateToken(user.id);

    return {
      ...user,
      token,
    };
  }

  async handleLinkedInOAuthLogin(req: any) {
    const { emails, name, photos } = req.user;
    const email = emails[0].value;
    const displayName = name.givenName + ' ' + name.familyName;
    const profilePictureUrl = photos[0].value;

    const user = await this.createUserIfNotExists(
      email,
      displayName,
      profilePictureUrl,
      AuthType.LINKEDIN,
    );

    const token = await this.generateToken(user.id);

    return {
      ...user,
      token,
    };
  }

  async handleAppleOAuthLogin(req: any) {
    const { email, name } = req.user;
    const displayName = name.firstName + ' ' + name.lastName;
    const user = await this.createUserIfNotExists(
      email,
      displayName,
      null,
      AuthType.APPLE,
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

  async linkSocialAccount(userId: string, provider: string, accessToken: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let email: string | undefined;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
      throw new HttpException('Social account already linked to a different user', HttpStatus.CONFLICT);
    }

    user.socialAccounts = user.socialAccounts || [];
    user.socialAccounts.push({ provider, accessToken });

    await this.updateUser(user);

    return user;
  }

  private async findUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  private async updateUser(user: any) {
    return await this.prisma.user.update({ where: { id: user.id }, data: user });
  }
}