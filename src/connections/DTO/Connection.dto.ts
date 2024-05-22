import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class ConnectionDto {
  name?: string;
  headline?: string;
  profilePictureUrl?: string;
  id: string;
  email: string;
  @Type(() => Date)
  @IsDate()
  joinedAt: Date;

  reviewsCount: number;
  connectionsCount: number;
  isConnection: boolean;
}
