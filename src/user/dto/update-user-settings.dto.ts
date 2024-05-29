import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;

  @IsBoolean()
  @IsOptional()
  reviewsVisible?: boolean;
}
