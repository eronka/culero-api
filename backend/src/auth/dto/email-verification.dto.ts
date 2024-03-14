import { IsEmail, Matches } from 'class-validator';

export class EmailVerificationDto {
  @IsEmail()
  email: string;
  @Matches(/^[0-9]{6}$/, {
    message: 'Code must be a 6 digit number',
  })
  code: string;
}
