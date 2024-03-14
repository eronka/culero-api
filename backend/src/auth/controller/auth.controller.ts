import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { AppleOAuthStrategyFactory } from '../../oauth/factory/apple/apple-strategy.factory';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { EmailVerificationDto } from '../dto/email-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuthStrategyFactory: GoogleOAuthStrategyFactory,
    private facebookOAuthStrategyFactory: FacebookOAuthStrategyFactory,
    private linkedinOAuthStrategyFactory: LinkedInOAuthStrategyFactory,
    private appleOAuthStrategyFactory: AppleOAuthStrategyFactory,
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
    return await this.authService.handleGoogleOAuthLogin(req);
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
    return await this.authService.handleFacebookOAuthLogin(req);
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
    return await this.authService.handleLinkedInOAuthLogin(req);
  }

  @Public()
  @Get('apple')
  async appleOAuthLogin(@Res() res) {
    if (!this.appleOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Apple Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.status(302).redirect('/api/auth/apple/callback');
  }

  @Public()
  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleOAuthCallback(@Req() req) {
    return await this.authService.handleAppleOAuthLogin(req);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() dto: SignupDto) {
    return await this.authService.signUp(dto);
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() dto: SigninDto) {
    return await this.authService.signIn(dto);
  }

  @Public()
  @Get('regenerate-code/:email')
  async resendEmailVerificationCode(@Param('email') email: string) {
    return await this.authService.resendEmailVerificationCode(email);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() dto: EmailVerificationDto) {
    return await this.authService.verifyEmail(dto.email, dto.code);
  }

  @Public()
  @Get('search')
  async searchUsers(@Query('searchTerm') searchTerm: string) {
    if (!searchTerm) {
      throw new HttpException(
        'Search term is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const users = await this.authService.searchUsers(searchTerm);
    return users;
  }
}
