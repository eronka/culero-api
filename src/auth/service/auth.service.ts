import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthType, SocialAccountType, User } from '@prisma/client';
import { SignupDto } from '../dto/signup.dto';
import { MailService } from '../../mail/mail.service';
import { SigninDto } from '../dto/signin.dto';

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
      true,
    );

    return user;
  }

  async signIn(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        isEmailVerified: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.sendEmailVerificationCode(dto.email);
    return user;
  }

  async handleGoogleOAuthLogin(req: any) {
    const { emails, displayName: name, photos } = req.user;
    const email = emails[0].value;
    const profilePictureUrl = photos[0].value;

    const user = await this.createUserIfNotExists(
      email,
      AuthType.GOOGLE,
      name,
      profilePictureUrl,
      false,
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

    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        socialId: req.user.socialId,
        platform: SocialAccountType.FACEBOOK,
      },
      include: {
        user: true,
      },
    });

    let user;

    if (socialAccount) {
      user = socialAccount.user;
    } else {
      user = await this.createUserIfNotExists(
        email,
        AuthType.FACEBOOK,
        displayName,
        profilePictureUrl,
        false,
      );
      await this.connectSocialPlatform(
        SocialAccountType.FACEBOOK,
        user.id,
        req,
      );
    }

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

  async handleLinkedInOAuthLogin(req: any) {
    const { email, displayName, picture } = req.user;
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        socialId: req.user.id,
        platform: SocialAccountType.LINKEDIN,
      },
      include: {
        user: true,
      },
    });

    let user;

    if (socialAccount) {
      user = socialAccount.user;
    } else {
      user = await this.createUserIfNotExists(
        email,
        AuthType.LINKEDIN,
        displayName,
        picture,
        false,
      );
      await this.connectSocialPlatform(
        SocialAccountType.LINKEDIN,
        user.id,
        req,
      );
    }

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

  async handleAppleOAuthLogin(req: any) {
    const { email, displayName } = req.user;
    const user = await this.createUserIfNotExists(
      email,
      AuthType.APPLE,
      displayName,
      null,
      false,
    );

    const token = await this.generateToken(user);

    return {
      ...user,
      token,
    };
  }

  async handleGithubOAuthLogin(req: any) {
    const { email, name, login, avatar_url } = req.user._json;
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        socialId: req.user.id,
        platform: SocialAccountType.GITHUB,
      },
      include: {
        user: true,
      },
    });

    let user;

    if (socialAccount) {
      user = socialAccount.user;
    } else {
      user = await this.createUserIfNotExists(
        email || login,
        AuthType.GITHUB,
        name,
        avatar_url,
        false,
      );
      await this.connectSocialPlatform(SocialAccountType.GITHUB, user.id, req);
    }

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
    throwErrorIfUserExists?: boolean,
  ) {
    email = email.toLowerCase();

    let user = await this.findUserByEmail(email);
    if (user && throwErrorIfUserExists) {
      throw new ConflictException('User already exists');
    }
    // We need to create the user if it doesn't exist yet
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name,
          profilePictureUrl: profilePictureUrl,
          authType,
          isEmailVerified: authType !== AuthType.EMAIL,
          settings: {
            create: {},
          },
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
    email = email.toLowerCase();
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

  async connectSocialPlatform(
    platform: SocialAccountType,
    userId: string,
    req: any,
  ) {
    const socialAcc = await this.prisma.socialAccount.findMany({
      where: { socialId: req.user.id, platform },
    });

    if (socialAcc.length !== 0) {
      throw new BadRequestException(
        'Social Account Already conected with another account',
      );
    }

    return this.prisma.socialAccount.create({
      data: {
        platform,
        displayName:
          req.user.displayName ||
          (req.user._json.first_name
            ? `${req.user._json.first_name} ${req.user._json.last_name}`
            : req.user._json.login),
        email: req.user.emails?.[0]?.value || req.user._json.email,
        socialId: req.user.id || req.user._json.sub,
        profileUrl: req.user.profileUrl,
        pictureUrl: req.user.photos?.[0]?.value || req.user.picture,
        userId,
      },
    });
  }

  async getSocialAccounts(userId: string) {
    return this.prisma.socialAccount.findMany({ where: { userId } });
  }

  async getUserFromToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return await this.prisma.user.findUnique({
        where: {
          id: payload['id'],
        },
      });
    } catch {
      throw new ForbiddenException();
    }
  }
}
