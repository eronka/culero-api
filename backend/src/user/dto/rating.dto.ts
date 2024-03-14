import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RatingDto {
  @IsNumber()
  professionalism: number;

  @IsNumber()
  reliability: number;

  @IsNumber()
  communication: number;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsBoolean()
  anonymous: boolean;
}
