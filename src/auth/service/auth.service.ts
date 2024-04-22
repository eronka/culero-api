import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthType, User } from '@prisma/client';
import { SignupDto } from '../dto/signup.dto';
import { SHA256 } from 'crypto-js';
import { MailService } from '../../mail/mail.service';
import { SigninDto } from '../dto/signin.dto';

function hashPassword(password: string) {
  return SHA256(password).toString();
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(dto: SignupDto) {
    const user = await this.createUserIfNotExists(
      dto.email,
      AuthType.EMAIL,
      null,
      null,
      hashPassword(dto.password),
      true,
    );

    const token = await this.generateToken(user);
    return { ...user, token };
  }

  async signIn(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    user.password = undefined;

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

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

    const token = await this.generateToken(user);

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
      AuthType.FACEBOOK,
      displayName,
      profilePictureUrl,
    );

    const token = await this.generateToken(user);

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
      AuthType.LINKEDIN,
      displayName,
      profilePictureUrl,
    );

    const token = await this.generateToken(user);

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
      AuthType.APPLE,
      displayName,
      null,
    );

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

  async resendEmailVerificationCode(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.sendEmailVerificationCode(email);
  }

  async verifyEmail(email: string, code: string) {
    const verificationCode = await this.prisma.verificationCode.findUnique({
      where: {
        email,
      },
    });

    if (!verificationCode) {
      throw new NotFoundException('Code not found');
    }

    if (verificationCode.code !== code) {
      throw new BadRequestException('Invalid code');
    }

    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Code expired');
    }

    const user = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        isEmailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePictureUrl: true,
        authType: true,
        isEmailVerified: true,
      },
    });

    await this.prisma.verificationCode.delete({
      where: {
        email,
      },
    });

    await this.mailService.sendEmailVerifiedEmail(email);

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

  private async createUserIfNotExists(
    email: string,
    authType: AuthType,
    name?: string,
    profilePictureUrl?: string,
    password?: string,
    throwErrorIfUserExists?: boolean,
  ) {
    let user = await this.findUserByEmail(email);
    if (user && throwErrorIfUserExists) {
      throw new ConflictException('User already exists');
    }
    // We need to create the user if it doesn't exist yet
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email,
          name: name,
          profilePictureUrl: profilePictureUrl,
          authType,
          password,
        },
        select: {
          id: true,
          email: true,
          name: true,
          profilePictureUrl: true,
          authType: true,
          isEmailVerified: true,
        },
      });

      await this.sendEmailVerificationCode(email);
    } else if (!user.isEmailVerified) {
      await this.sendEmailVerificationCode(email);
    }
    return user;
  }

  private async generateToken(user: Partial<User>) {
    // We send the token only if the email is verified
    if (!user.isEmailVerified) {
      return;
    }

    return await this.jwt.signAsync({ id: user.id });
  }

  private async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePictureUrl: true,
        authType: true,
        isEmailVerified: true,
      },
    });
  }

  private async sendEmailVerificationCode(email: string) {
    // Generate the code
    let code: string;

    // Generate a random 6-digit code. It needs to be unique
    while (true) {
      code = Math.floor(100000 + Math.random() * 900000).toString();

      // Check if the code is already in use
      const existingCode = await this.prisma.verificationCode.findUnique({
        where: {
          code,
        },
      });

      if (!existingCode) {
        break;
      }
    }

    // Set the expiration date to 10 minutes from now
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // Save in DB
    await this.prisma.verificationCode.upsert({
      where: {
        email,
      },
      update: {
        code,
        expiresAt,
      },
      create: {
        email,
        code,
        expiresAt,
      },
    });
    await this.mailService.sendEmailVerificationCode(email, code);
  }
}
