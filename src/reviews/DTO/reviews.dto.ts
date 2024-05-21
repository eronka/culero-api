import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, ValidateNested } from 'class-validator';

export class PostedByDTO {
  name?: string;

  profilePictureUrl?: string;
  isEmailVerified?: boolean;
  id: string;
}

export class ReviewDto {
  id: number;
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

  @Type(() => PostedByDTO)
  @ValidateNested()
  postedBy?: PostedByDTO;
}
