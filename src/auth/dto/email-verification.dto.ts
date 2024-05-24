import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';

export class EmailVerificationDto {
  @IsEmail()
  @ApiProperty({
    name: 'email',
    description: 'User email. Must be a valid email address.',
    required: true,
    type: String,
    example: 'johndoe@example.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @Matches(/^[0-9]{6}$/, {
    message: 'Code must be a 6 digit number',
  })
  @ApiProperty({
    name: 'code',
    description: 'Verification code. Must be a 6 digit number.',
    required: true,
    type: String,
    example: '123456',
  })
  code: string;
}
