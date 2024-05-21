import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../decorators/public.decorator';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

const X_E2E_USER_EMAIL = 'x-e2e-user-email';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the kind of route. Routes marked with the @Public() decorator are public.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // We don't want to check for authentication if the route is public.
    if (isPublic) {
      return true;
    }

    let user: User | null = null;
    const request = context.switchToHttp().getRequest();

    // In case the environment is e2e, we want to authenticate the user using the email
    // else we want to authenticate the user using the JWT token.
    if (process.env.NODE_ENV === 'e2e') {
      const email = request.headers[X_E2E_USER_EMAIL];
      if (!email) {
        throw new ForbiddenException();
      }

      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } else {
      const token = this.extractToken(request);
      if (!token) {
        throw new ForbiddenException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

        user = await this.prisma.user.findUnique({
          where: {
            id: payload['id'],
          },
        });
      } catch {
        throw new ForbiddenException();
      }

      // Check if the user's email is verified.
      if (!user.isEmailVerified) {
        throw new ForbiddenException('Email not verified');
      }
    }

    // We attach the user to the request object.
    request['user'] = user;
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const tokenFromHeader = request.headers.authorization;
    const tokenFromParams = request.query.token;

    let type: string;
    let token: string;

    if (tokenFromHeader) {
      [type, token] = request.headers.authorization?.split(' ') ?? [];
    } else if (tokenFromParams) {
      type = 'Bearer';
      token = tokenFromParams as string;
    } else {
      return undefined;
    }

    return type === 'Bearer' ? token : undefined;
  }
}
