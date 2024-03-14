import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiNoContentResponse,
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
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @ApiNoContentResponse({
    description: 'User rated successfully',
  })
  async rateUser(
    @CurrentUser() user: User,
    @Param('userId') ratedUserId: string,
    @Body() rating: RatingDto,
  ) {
    return this.userService.rateUser(user, ratedUserId, rating);
  }

  @Get('reviews/self')
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
    return this.userService.getUserReviews(user, true);
  }

  @Get('reviews/:userId')
  @ApiOperation({
    summary: 'Get user reviews',
    description: 'Get reviews of another user',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
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
    @Param('revieweeUserId') revieweeUserId: string,
  ) {
    return this.userService.getUserReviews(user, false, revieweeUserId);
  }
}
