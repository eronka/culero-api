import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserService } from '../service/user.service';
import { SocialAccountType, User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userProperties } from '../../schemas/user.properties';

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
  @ApiOperation({
    summary: 'Upload profile picture encoded in base64',
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
        },
      },
    },
  })
  async uploadFile(@CurrentUser() user: User, @Body('file') file: string) {
    return this.userService.updateProfilePicture(user, file);
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
