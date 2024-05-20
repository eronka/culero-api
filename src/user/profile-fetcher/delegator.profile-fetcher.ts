import { ProfileFetcher } from './base.profile-fetcher';
import { ProfileFetcherFactory } from './profile-fetcher.factory';

export class ProfileFetcherDelegator {
  private readonly profileFetcher: ProfileFetcher;

  constructor(profileUrl: string) {
    this.profileFetcher = new ProfileFetcherFactory().generateProfileFetcher(
      profileUrl,
    );
  }

  async getProfileDetails() {
    return this.profileFetcher.getProfileDetails();
  }
}
