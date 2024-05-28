import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../src/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { NotificationDto } from './dto/notification.dto';
import { PushTokenDto } from './dto/add-token.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  /**
   * Get current user's notifications
   */
  @Get()
  public async getNotifications(
    @CurrentUser() user: User,
  ): Promise<NotificationDto[]> {
    return this.notificationsService.getUserNotifications(user.id);
  }

  /**
   * Add a notification token
   */
  @Post('/token')
  public async addPushToken(
    @CurrentUser() user: User,
    @Body() data: PushTokenDto,
  ) {
    await this.notificationsService.addPushToken(user.id, data.token);
    return { ok: true };
  }
}
