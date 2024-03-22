import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RatingDto {
  @IsNumber({}, { message: 'Quality must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @ApiProperty({
    name: 'professionalism',
    description: 'Professionalism rating',
    minimum: 1,
    maximum: 5,
    required: true,
    example: 5,
  })
  professionalism: number;

  @IsNumber({}, { message: 'Reliability must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @ApiProperty({
    name: 'reliability',
    description: 'Reliability rating',
    minimum: 1,
    maximum: 5,
    required: true,
    example: 5,
  })
  reliability: number;

  @IsNumber({}, { message: 'Communication must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @ApiProperty({
    name: 'communication',
    description: 'Communication rating',
    minimum: 1,
    maximum: 5,
    required: true,
    example: 5,
  })
  communication: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'comment',
    description: 'Review comment',
    required: false,
    example: 'Great service!',
  })
  comment?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'anonymous',
    description: 'Make the review anonymously',
    required: false,
    example: false,
  })
  anonymous?: boolean;
}
