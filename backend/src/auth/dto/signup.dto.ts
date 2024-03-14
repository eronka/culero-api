import { IsEmail, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/, {
    message:
      'Password must contain at least 1 letter, 1 number and be at least 9 characters long',
  })
  password: string;
}
