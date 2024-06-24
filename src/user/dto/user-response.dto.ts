import { AuthType } from '@prisma/client';
import { Exclude } from 'class-transformer';

@Exclude()
export default class UserResponseDto {
  email: string;
  name: string;
  location: string;
  onboarded: boolean;
  profilePictureUrl: string;
  authType: AuthType;
  isEmailVerified: boolean;
  headline: string;
}
