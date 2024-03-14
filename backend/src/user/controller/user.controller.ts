import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getSelf(user);
  }

  @Get('search')
  async searchUsers(@CurrentUser() user: User, @Query('query') query: string) {
    return this.userService.findUsers(user, query);
  }
}
