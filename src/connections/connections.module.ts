import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { NotificationsService } from '../../src/notifications/notifications.service';

@Module({
  providers: [ConnectionsService, NotificationsService],
  controllers: [ConnectionsController],
})
export class ConnectionsModule {}
