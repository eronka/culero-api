import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @ApiProperty({
    name: 'email',
    description: 'User email. Must be a valid email address.',
    required: true,
    type: String,
    example: 'johndoe@example.com',
  })
  email: string;
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/, {
    message:
      'Password must contain at least 1 letter, 1 number and be at least 9 characters long',
  })
  @ApiProperty({
    name: 'password',
    description:
      'User password. Must contain at least 1 letter, 1 number and be at least 9 characters long.',
    required: true,
    type: String,
    example: 'password123',
  })
  password: string;
}
