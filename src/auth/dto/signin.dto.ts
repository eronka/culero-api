import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

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
}
