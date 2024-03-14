import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  headline: string;
}
