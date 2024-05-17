import { ProfileFetcher } from './interface.profile-fetcher';
import { ProfileFetcherFactory } from './profile-fetcher.factory';

export class ProfileFetcherDelegator {
  private readonly profileFetcher: ProfileFetcher;

  constructor(profileUrl: string) {
    new ProfileFetcherFactory().generateProfileFetcher(profileUrl);
  }

  async getProfileDetails() {
    return this.profileFetcher.getProfileDetails();
  }
}
