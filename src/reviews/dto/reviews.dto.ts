import { ApiProperty } from '@nestjs/swagger';
import { ReviewState } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, ValidateNested } from 'class-validator';

export class PostedByDTO {
  name?: string;

  profilePictureUrl?: string;
  isEmailVerified?: boolean;
  id: string;
}

export class ReviewDto {
  id: string;
  comment: string;
  professionalism: number;
  reliability: number;
  communication: number;
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  postedToId: string;

  @ApiProperty({
    description: 'True if the review was posted by the current user.',
  })
  isOwnReview: boolean;

  isAnonymous: boolean;
  isFavorite: boolean;

  @Type(() => PostedByDTO)
  @IsOptional()
  @ValidateNested()
  postedBy?: PostedByDTO;

  @IsEnum(ReviewState)
  state: ReviewState;
}
