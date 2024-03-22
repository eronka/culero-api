import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @ApiProperty({
    name: 'email',
    description: 'User email. Must be a valid email address.',
    required: true,
    type: String,
    example: 'johndoe@example.com',
  })
  email: string;
  @IsString()
  @ApiProperty({
    name: 'password',
    description: 'User password. Must be a string.',
    required: true,
    type: String,
    example: 'password123',
  })
  password: string;
}
