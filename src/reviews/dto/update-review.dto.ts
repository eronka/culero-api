import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsOptional()
  professionalism?: number;
  @IsNumber()
  @IsOptional()
  reliability?: number;
  @IsNumber()
  @IsOptional()
  communication?: number;
  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;
}
