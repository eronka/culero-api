import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GoogleOAuthStrategyFactory } from '../../oauth/factory/google/google-strategy.factory';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../decorators/public.decorator';
import { FacebookOAuthStrategyFactory } from '../../oauth/factory/facebook/facebook-strategy.factory';
import { LinkedInOAuthStrategyFactory } from '../../oauth/factory/linkedin/linkedin-strategy.factory';
import { AuthType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuthStrategyFactory: GoogleOAuthStrategyFactory,
    private facebookOAuthStrategyFactory: FacebookOAuthStrategyFactory,
    private linkedinOAuthStrategyFactory: LinkedInOAuthStrategyFactory,
  ) {}

  @Public()
  @Get('google')
  async googleOAuthLogin(@Res() res) {
    if (!this.googleOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Google Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.status(302).redirect('/api/auth/google/callback');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOAuthCallback(@Req() req) {
    const { emails, displayName: name, photos } = req.user;
    const email = emails[0].value;
    const profilePictureUrl = photos[0].value;
    return await this.authService.handleOAuthLogin(
      email,
      name,
      profilePictureUrl,
      AuthType.GOOGLE,
    );
  }

  @Public()
  @Get('facebook')
  async facebookOAuthLogin(@Res() res) {
    if (!this.facebookOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Facebook Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.status(302).redirect('/api/auth/facebook/callback');
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookOAuthCallback(@Req() req) {
    const { emails, name, photos } = req.user;
    const email = emails[0].value;
    const displayName = name.givenName + ' ' + name.familyName;
    const profilePictureUrl = photos[0].value;
    console.log(req.user);
    return await this.authService.handleOAuthLogin(
      email,
      displayName,
      profilePictureUrl,
      AuthType.FACEBOOK,
    );
  }

  @Public()
  @Get('linkedin')
  async linkedinOAuthLogin(@Res() res) {
    if (!this.linkedinOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'LinkedIn Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.status(302).redirect('/api/auth/linkedin/callback');
  }

  @Public()
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinOAuthCallback(@Req() req) {
    console.log(req.user);
    const { emails, displayName: name, photos } = req.user;
    const email = emails[0].value;
    const profilePictureUrl = photos[0].value;
    return await this.authService.handleOAuthLogin(
      email,
      name,
      profilePictureUrl,
      AuthType.LINKEDIN,
    );
  }
}
