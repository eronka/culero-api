import { NotificationType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum } from 'class-validator';

export class NotificationDto {
  extraData: any;
  body: string;
  title: string;
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @IsEnum(NotificationType)
  type: NotificationType;
}
