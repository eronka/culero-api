import { SocialAccountType } from '@prisma/client';

export abstract class ProfileFetcher {
  constructor(protected profileUrl: string) {}

  abstract getProfileDetails(): Promise<ProfileDetails>;
}

export interface ProfileDetails {
  profileUrl: string;
  socialAccountType: SocialAccountType;
  name?: string;
  headline?: string;
  profilePictureUrl?: string;
}
