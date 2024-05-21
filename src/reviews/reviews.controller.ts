import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewDto } from './DTO/reviews.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateReviewBodyDTO } from './DTO/create-review.dto';
import { RatingDto } from './DTO/rating.dto';
import { UpdateReviewDto } from './DTO/update-review.dto';

@Controller('reviews')
@ApiBearerAuth()
@ApiTags('Reviews controller')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   *  Get reviews for user with ID userID
   */
  @Get('/:userId')
  async getReviews(
    @CurrentUser() user: User,
    @Param('userId') postedToId: string,
  ): Promise<Array<ReviewDto>> {
    return this.reviewsService.getUserReviews(user, postedToId);
  }

  /**
   *
   * Create a review
   */
  @Post()
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
    console.log('here:)');
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

  /**
   *
   * Delete a review. Only the user that posted the review can do this.
   * @param reviewId
   */
  @Delete('/:reviewId')
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  async deleteReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ) {
    await this.reviewsService.canUserModifyReview(user.id, reviewId);
    await this.reviewsService.deleteReview(reviewId);
    return { ok: true };
  }

  /**
   * Update a review. Only the user that posted the review can do this.
   */

  @Put('/:reviewId')
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  async updateReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() data: UpdateReviewDto,
  ) {
    await this.reviewsService.canUserModifyReview(user.id, reviewId);

    return this.updateReview(user, reviewId, data);
  }
}