import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';
import { RatingDto } from '../dto/rating.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getSelf(user);
  }

  @Post('rate/:userId')
  async rateUser(
    @CurrentUser() user: User,
    @Param('userId') ratedUserId: string,
    @Body() rating: RatingDto,
  ) {
    return this.userService.rateUser(user, ratedUserId, rating);
  }

  @Get('reviews/self')
  async getSelfReviews(@CurrentUser() user: User) {
    return this.userService.getUserReviews(user, true);
  }

  @Get('reviews/:userId')
  async getUserReviews(
    @CurrentUser() user: User,
    @Param('revieweeUserId') revieweeUserId: string,
  ) {
    return this.userService.getUserReviews(user, false, revieweeUserId);
  }
}
