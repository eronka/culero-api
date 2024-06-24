import { AuthType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  onboarded: boolean;

  @Expose()
  profilePictureUrl: string;

  @Expose()
  authType: AuthType;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  headline: string;
}
