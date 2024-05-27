import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateReviewDto {
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

export class CreateReviewBodyDTO {
  @IsString()
  @ApiProperty({
    name: 'postedToId',
    description: 'The Id of the reviewed user.',
    example: 'asdjas20',
    required: true,
  })
  postedToId: string;

  @Type(() => CreateReviewDto)
  @ValidateNested()
  @ApiProperty({
    name: 'review',
    description: 'Review data',
  })
  review: CreateReviewDto;
}
