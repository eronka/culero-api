import { ProfileDetails, ProfileFetcher } from './interface.profile-fetcher';

export class LinkedInProfileFetcher implements ProfileFetcher {
  async getProfileDetails(): Promise<ProfileDetails> {
    throw new Error('Method not implemented.');
  }
}
