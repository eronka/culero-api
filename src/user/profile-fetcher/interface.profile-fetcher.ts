import { SocialAccountType } from '@prisma/client';

export interface ProfileFetcher {
  getProfileDetails(): Promise<ProfileDetails>;
}

export interface ProfileDetails {
  profileUrl: string;
  socialAccountType: SocialAccountType;
  name?: string;
}
