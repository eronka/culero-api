import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [PrismaService, NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
