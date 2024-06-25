import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { UserDetailsDto } from '../dto/user-details.dto';
import { EmailVerificationDto } from '../dto/email-verification.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userProperties } from '../../schemas/user.properties';
import { LowercasePipe } from '../../common/pipes/lowercase.pipe';
import { GithubOAuthStrategyFactory } from '../../oauth/factory/github/github-strategy.factory';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { SocialAccountType, User } from '@prisma/client';
import { BypassOnboardingCheck } from '../../decorators/bypass-onboarding.decorator';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuthStrategyFactory: GoogleOAuthStrategyFactory,
    private facebookOAuthStrategyFactory: FacebookOAuthStrategyFactory,
    private linkedinOAuthStrategyFactory: LinkedInOAuthStrategyFactory,
    private appleOAuthStrategyFactory: AppleOAuthStrategyFactory,
    private githubOAuthStrategyFactory: GithubOAuthStrategyFactory,
  ) {}

  @Public()
  @Get('google')
  @ApiOperation({
    summary: 'Google auth',
    description: 'Sign in or sign up with Google',
  })
  async googleOAuthLogin(@Res() res, @Query() query, @Req() req) {
    if (!this.googleOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Google Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }
    req.session.app_url = query.app_url;

    res.status(302).redirect('/api/auth/google/callback');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOAuthCallback(@Req() req, @Res() res) {
    const user = await this.authService.handleGoogleOAuthLogin(req);
    const host = req.session.app_url;

    res.send(
      `<script>window.location.replace("${host}?token=${user.token}")</script>`,
    );
  }

  @Public()
  @Get('facebook')
  @ApiOperation({
    summary: 'Facebook auth',
    description: 'Sign in or sign up with Facebook',
  })
  async facebookOAuthLogin(@Res() res, @Query() query, @Req() req) {
    if (!this.facebookOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Facebook Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }
    req.session.app_url = query.app_url;

    res.status(302).redirect('/api/auth/facebook/callback');
  }

  @Public()
  @Get('facebook/connect')
  @ApiOperation({
    summary: 'Facebook Social Account connect',
    description: 'Connect account with Facebook profile',
  })
  async facebookSocialConnect(@Res() res, @Query() query, @Req() req) {
    if (!this.facebookOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Facebook Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.session.app_url = query.app_url;

    const token = query.token;
    const user = await this.authService.getUserFromToken(token);
    req.session.intent = { facebook: 'connect' };
    req.session.userId = user.id;

    res.status(302).redirect('/api/auth/facebook/callback');
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookOAuthCallback(@Req() req, @Res() res) {
    const host = req.session.app_url;

    if (req.session.intent?.facebook == 'connect') {
      await this.authService.connectSocialPlatform(
        SocialAccountType.FACEBOOK,
        req.session.userId,
        req,
      );

      res.send(`<script>window.location.replace("${host}")</script>`);
    } else {
      const user = await this.authService.handleFacebookOAuthLogin(req);
      res.send(
        `<script>window.location.replace("${host}?token=${user.token}")</script>`,
      );
    }
  }

  @Public()
  @Get('linkedin')
  @ApiOperation({
    summary: 'LinkedIn auth',
    description: 'Sign in or sign up with LinkedIn',
  })
  async linkedinOAuthLogin(@Res() res, @Query() query, @Req() req) {
    if (!this.linkedinOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'LinkedIn Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }
    req.session.app_url = query.app_url;

    res.status(302).redirect('/api/auth/linkedin/callback');
  }

  @Public()
  @Get('linkedin/connect')
  @ApiOperation({
    summary: 'LinkedIn Social Account connect',
    description: 'Sign in or sign up with LinkedIn',
  })
  async linkedinSocialConnect(@Res() res, @Query() query, @Req() req) {
    if (!this.linkedinOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'LinkedIn Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = query.token;
    const user = await this.authService.getUserFromToken(token);
    req.session.app_url = query.app_url;
    req.session.intent = { linkedin: 'connect' };
    req.session.userId = user.id;
    res.status(302).redirect('/api/auth/linkedin/callback');
  }

  @Public()
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinOAuthCallback(@Req() req, @Res() res) {
    const host = req.session.app_url;

    if (req.session.intent?.linkedin == 'connect') {
      await this.authService.connectSocialPlatform(
        SocialAccountType.LINKEDIN,
        req.session.userId,
        req,
      );
      res.send(`<script>window.location.replace("${host}")</script>`);
    } else {
      const user = await this.authService.handleLinkedInOAuthLogin(req);
      res.send(
        `<script>window.location.replace("${host}?token=${user.token}")</script>`,
      );
    }
  }

  @Public()
  @Get('apple')
  @ApiOperation({
    summary: 'Apple auth',
    description: 'Sign in or sign up with Apple',
  })
  async appleOAuthLogin(@Res() res, @Query() query, @Req() req) {
    if (!this.appleOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Apple Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.session.app_url = query.app_url;

    res.status(302).redirect('/api/auth/apple/callback');
  }

  @Public()
  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleOAuthCallback(@Req() req, @Res() res) {
    const user = await this.authService.handleAppleOAuthLogin(req);
    const host = req.session.app_url;

    res.send(
      `<script>window.location.replace("${host}?token=${user.token}")</script>`,
    );
  }

  @Public()
  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleOAuthCallback2(@Req() req, @Res() res) {
    const user = await this.authService.handleAppleOAuthLogin(req);
    const host = req.session.app_url;

    res.send(
      `<script>window.location.replace("${host}?token=${user.token}")</script>`,
    );
  }

  @Public()
  @Get('github')
  @ApiOperation({
    summary: 'Github auth',
    description: 'Sign in or sign up with Github',
  })
  async githubOauthLogin(@Res() res, @Query() query, @Req() req) {
    if (!this.githubOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Github Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.session.app_url = query.app_url;

    res.status(302).redirect('/api/auth/github/callback');
  }

  @Public()
  @Get('github/connect')
  @ApiOperation({
    summary: 'Github Social Account connect',
    description: 'Connect account with Github profile',
  })
  async githubSocialConnect(@Res() res, @Query() query, @Req() req) {
    if (!this.githubOAuthStrategyFactory.isOAuthEnabled()) {
      throw new HttpException(
        'Github Auth is not enabled in this environment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.session.app_url = query.app_url;

    const token = query.token;
    const user = await this.authService.getUserFromToken(token);
    req.session.intent = { github: 'connect' };
    req.session.userId = user.id;

    res.status(302).redirect('/api/auth/github/callback');
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubOAuthCallback(@Req() req, @Res() res) {
    const host = req.session.app_url;

    if (req.session.intent?.github == 'connect') {
      await this.authService.connectSocialPlatform(
        SocialAccountType.GITHUB,
        req.session.userId,
        req,
      );

      res.send(`<script>window.location.replace("${host}")</script>`);
    } else {
      const user = await this.authService.handleGithubOAuthLogin(req);
      res.send(
        `<script>window.location.replace("${host}?token=${user.token}")</script>`,
      );
    }
  }

  @Public()
  @Post('email')
  @ApiOperation({
    summary: 'Sign in or sign up with email',
    description: 'Sign in or sign up with email',
  })
  @ApiCreatedResponse({
    description: 'User signed in successfully',
    schema: {
      type: 'object',
      properties: {
        isEmailVerified: userProperties.isEmailVerified,
        email: userProperties.email,
      },
    },
  })
  async sendVerificationCode(@Body() dto: UserDetailsDto) {
    return await this.authService.sendVerificationCode(dto);
  }

  @Public()
  @Put('regenerate-code/:email')
  @ApiOperation({
    summary: 'Resend email verification code',
    description: 'Resend email verification code to the user',
  })
  @ApiNoContentResponse({
    description: 'Email verification code sent successfully',
  })
  @ApiBadRequestResponse({
    description: 'Email already verified',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmailVerificationCode(
    @Param('email', LowercasePipe) email: string,
  ) {
    return await this.authService.resendEmailVerificationCode(email);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify email with the verification code',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid verification code',
  })
  @ApiCreatedResponse({
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        ...userProperties,
        token: { type: 'string' },
      },
    },
  })
  async verifyEmail(@Body() dto: EmailVerificationDto) {
    return await this.authService.verifyEmail(dto);
  }

  @BypassOnboardingCheck()
  @Get('/social-accounts')
  async getSocialAccounts(@CurrentUser() user: User) {
    return this.authService.getSocialAccounts(user.id);
  }
}
