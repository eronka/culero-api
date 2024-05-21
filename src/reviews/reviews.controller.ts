import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewDto } from './DTO/reviews.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateReviewBodyDTO } from './DTO/create-review.dto';
import { RatingDto } from './DTO/rating.dto';

@Controller('reviews')
@ApiBearerAuth()
@ApiTags('Reviews controller')
export class ReviewsController {
  private logger: Logger;
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/:userId')
  @ApiOperation({ summary: `Get reviews for user with ID userID` })
  async getReviews(
    @CurrentUser() user: User,
    @Param('userId') postedToId: string,
  ): Promise<Array<ReviewDto>> {
    return this.reviewsService.getUserReviews(user, postedToId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review.' })
  async createReview(
    @CurrentUser() user: User,
    @Body() { postedToId, review }: CreateReviewBodyDTO,
  ): Promise<ReviewDto> {
    return this.reviewsService.createReview(user, postedToId, review);
  }

  @Get('avg-rating/:userId')
  @ApiOperation({
    summary: 'Get user average rating',
    description: 'Get average rating of another user',
  })
  async getUserRatings(@Param('userId') userId: string): Promise<RatingDto> {
    return this.reviewsService.getAvgUserRatings(userId);
  }

  /**
   * Like a review
   */
  @Post('/:reviewId/like')
  async likeReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ): Promise<ReviewDto> {
    return this.reviewsService.likeReview(user, reviewId);
  }

  /**
   * Unlike a review
   */
  @Delete('/:reviewId/like')
  async unlikeReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ): Promise<ReviewDto> {
    return this.reviewsService.unlikeReview(user, reviewId);
  }
}
