import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  providers: [ReviewsService, NotificationsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
