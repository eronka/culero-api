import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
