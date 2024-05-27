import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../src/decorators/current-user.decorator';
import { ConnectionsService } from './connections.service';
import { ConnectionDto } from './dto/Connection.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Public } from '../../src/decorators/public.decorator';

@ApiBearerAuth()
@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}
  /**
   *
   * Get all of the current user's connections
   */
  @Get()
  async getAllConnections(@CurrentUser() user: User): Promise<ConnectionDto[]> {
    return this.connectionsService.getUserConnections(user.id);
  }

  /**
   * Get "suggested for review" connections.
   */
  @Get('/suggested')
  async getSuggestedConnections(
    @CurrentUser() user: User,
  ): Promise<ConnectionDto[]> {
    return this.connectionsService.getUserConnections(user.id);
  }

  /**
   * Search an user by query.
   */
  @Get('/search/:query')
  @Public()
  @ApiBadRequestResponse()
  async searchUser(
    @Param('query') query: string,
    @CurrentUser() user?: User,
  ): Promise<ConnectionDto[]> {
    return this.connectionsService.searchUsers(user?.id, query);
  }

  /**
   * Create a connection between current User and another user.
   */
  @Post('/connect/:userId')
  async connectWithUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ): Promise<ConnectionDto> {
    return this.connectionsService.addConnection(user.id, userId);
  }
  /**
   *
   * Remove connection between current user and another user.
   */
  @Delete('/connect/:userId')
  async unconnectWithUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ): Promise<ConnectionDto> {
    return this.connectionsService.removeConnection(user.id, userId);
  }

  /**
   * Search for users by external profile URL
   * @param profileUrlBase64
   */

  @Public()
  @Get('search-by-external-profile/:profileUrl')
  async searchUsersByExternalProfile(
    @Param('profileUrl') profileUrlBase64: string,
  ) {
    return this.connectionsService.searchUserByExternalProfile(
      profileUrlBase64,
    );
  }

  /**
   * Get logged in user reviewed users
   */

  @Get('/reviewed')
  async getReviewedConnections(
    @CurrentUser() user: User,
  ): Promise<ConnectionDto[]> {
    return this.connectionsService.getReviewedConnections(user.id);
  }
  /**
   * Get a connection.
   */
  @Get('/:userId')
  @ApiNotFoundResponse()
  async getUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ): Promise<ConnectionDto> {
    return this.connectionsService.getConnection(userId, user.id);
  }
}
