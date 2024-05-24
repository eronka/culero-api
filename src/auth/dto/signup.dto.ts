import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    name: 'email',
    description: 'User email. Must be a valid email address.',
    required: true,
    type: String,
    example: 'johndoe@example.com',
  })
  email: string;
}
