import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'name',
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'headline',
    description: 'User headline',
    required: false,
    example: 'Software Engineer',
  })
  headline: string;
}
