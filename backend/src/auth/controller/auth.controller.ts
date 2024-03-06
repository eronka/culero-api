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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuthStrategyFactory: GoogleOAuthStrategyFactory,
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
    );
  }
}
