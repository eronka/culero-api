import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserService } from '../service/user.service';
import { SocialAccountType, User } from '@prisma/client';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userExtraProps, userProperties } from '../../schemas/user.properties';
import {
  reviewProperties,
  reviewPropertiesWithComment,
} from '../../schemas/review.properties';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { Public } from '../../decorators/public.decorator';
import { Request, Response } from 'express';
import { LinkedInOAuthStrategyFactory } from '../../oauth/factory/linkedin/linkedin-strategy.factory';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User Controller')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private linkedinOAuthStrategyFactory: LinkedInOAuthStrategyFactory,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the currently logged in user',
  })
  @ApiOkResponse({
    description: 'Current user found',
    schema: {
      type: 'object',
      properties: userProperties,
    },
  })
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getSelf(user);
  }

  @Put()
  @ApiOperation({
    summary: 'Update current user',
    description: 'Update the currently logged in user',
  })
  @ApiOkResponse({
    description: 'User updated',
    schema: {
      type: 'object',
      properties: userProperties,
    },
  })
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateSelf(user, dto);
  }

  @Put('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload profile picture',
    description: 'Upload a new profile picture',
  })
  @ApiOkResponse({
    description: 'Profile picture uploaded',
    schema: {
      type: 'object',
      properties: userProperties,
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to upload profile picture',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfilePicture(user, file);
  }

  @Post('rate/:userId')
  @ApiOperation({
    summary: 'Rate user',
    description: 'Rate another user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid rating',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiCreatedResponse({
    description: 'User rated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        postedToId: { type: 'string' },
        raterUserId: { type: 'string' },
        professionalism: { type: 'number' },
        reliability: { type: 'number' },
        communication: { type: 'number' },
        comment: { type: 'string' },
        anonymous: { type: 'boolean' },
      },
    },
  })
  async rateUser(
    @CurrentUser() user: User,
    @Param('userId') postedToId: string,
    @Body() rating: RatingDto,
  ) {
    return this.userService.rateUser(user, postedToId, rating);
  }

  @Get('ratings/self')
  @ApiOperation({
    summary: 'Get self reviews',
    description: 'Get reviews of the currently logged in user',
  })
  @ApiOkResponse({
    description: 'Self reviews found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: reviewProperties,
      },
    },
  })
  async getSelfReviews(@CurrentUser() user: User) {
    return this.userService.getUserRatings(user, true);
  }

  @Get('ratings/:userId')
  @ApiOperation({
    summary: 'Get user reviews',
    description: 'Get reviews of another user',
  })
  @ApiOkResponse({
    description: 'User reviews found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: reviewPropertiesWithComment,
      },
    },
  })
  async getUserReviews(
    @CurrentUser() user: User,
    @Param('userId') revieweeUserId: string,
  ) {
    return this.userService.getUserRatings(user, false, revieweeUserId);
  }

  @Get('link-social/linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  @Public()
  async facebookOAuthCallback(@Req() req: Request) {
    return await this.userService.linkSocialAccount(
      req,
      SocialAccountType.LINKEDIN,
    );
  }

  @Get('link-social/linkedin')
  async linkedinOAuthLogin(@Res() res: Response) {
    if (!this.linkedinOAuthStrategyFactory.isSocialAccountLinkEnabled()) {
      throw new BadRequestException(
        'LinkedIn Social Account Link is not enabled in this environment.',
      );
    }

    res.status(302).redirect('/api/user/link-social/linkedin/callback');
  }

  @Get('avg-rating/self')
  @ApiOperation({
    summary: 'Get self average rating',
    description: 'Get average rating of the currently logged in user',
  })
  @ApiOkResponse({
    description: 'Average Rating calculated',
    schema: {
      type: 'object',
      properties: {
        professionalism: { type: 'number' },
        reliability: { type: 'number' },
        communication: { type: 'number' },
        overall: { type: 'number' },
      },
    },
  })
  async getSelfRatings(@CurrentUser() user: User) {
    return this.userService.getAvgUserRatings(user, true);
  }

  @Get('avg-rating/:userId')
  @ApiOperation({
    summary: 'Get user average rating',
    description: 'Get average rating of another user',
  })
  @ApiOkResponse({
    description: 'Average Rating calculated',
    schema: {
      type: 'object',
      properties: {
        professionalism: { type: 'number' },
        reliability: { type: 'number' },
        communication: { type: 'number' },
        overall: { type: 'number' },
      },
    },
  })
  async getUserRatings(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.getAvgUserRatings(user, false, userId);
  }

  @Get('search/:query')
  @ApiOperation({
    summary: 'Search users',
    description: 'Search for users',
  })
  @ApiOkResponse({
    description: 'Users found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: { ...userExtraProps, ...userProperties },
      },
    },
  })
  async searchUsers(@CurrentUser() user: User, @Param('query') query: string) {
    return this.userService.searchUsers(user, query);
  }

  @Public()
  @Get('search-by-external-profile/:profileUrl')
  @ApiOperation({
    summary: 'Search users by external profile',
    description: 'Search for users by external profile URL',
  })
  @ApiOkResponse({
    description: 'Users found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: userProperties,
      },
    },
  })
  async searchUsersByExternalProfile(
    @Param('profileUrl') profileUrlBase64: string,
  ) {
    return this.userService.searchUserByExternalProfile(profileUrlBase64);
  }
}
