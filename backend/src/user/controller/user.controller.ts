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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getSelf(user);
  }

  @Put()
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateSelf(user, dto);
  }

  @Put('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfilePicture(user, file);
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

  @Get('ratings/self')
  async getSelfRatings(@CurrentUser() user: User) {
    return this.userService.getUserRatings(user, true);
  }

  @Get('ratings/:userId')
  async getUserRatings(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.getUserRatings(user, false, userId);
  }
}
