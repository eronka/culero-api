import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';
import { RatingDto } from '../dto/rating.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userProperties } from '../../schemas/user.properties';
import {
  reviewProperties,
  reviewPropertiesWithComment,
} from '../../schemas/review.properties';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { Public } from '../../decorators/public.decorator';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User Controller')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
        ratedUserId: { type: 'string' },
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
    @Param('userId') ratedUserId: string,
    @Body() rating: RatingDto,
  ) {
    return this.userService.rateUser(user, ratedUserId, rating);
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

  @Public()
  @Post('/link-social')
  @ApiOperation({
    summary: 'Link social account',
    description: 'Link a social account to the currently logged in user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid social account',
  })
  @ApiConflictResponse({
    description: 'Social account already linked',
  })
  @ApiCreatedResponse({
    description: 'Social account linked successfully',
  })
  async linkSocialAccount(
    @Body()
    {
      userId,
      provider,
      accessToken,
    }: {
      userId: string;
      provider: string;
      accessToken: string;
    },
  ) {
    await this.userService.linkSocialAccount(userId, provider, accessToken);
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

  @Public()
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
        properties: userProperties,
      },
    },
  })
  async searchUsers(@Param('query') query: string) {
    return this.userService.searchUsers(query);
  }
}
