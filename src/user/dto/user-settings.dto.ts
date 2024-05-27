import { IsBoolean } from 'class-validator';

export class UserSettingsDto {
  @IsBoolean()
  anonymous: boolean;

  @IsBoolean()
  reviewsVisible: boolean;
}
