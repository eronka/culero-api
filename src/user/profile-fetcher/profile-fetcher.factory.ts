import { BadRequestException } from '@nestjs/common';
import { LinkedInProfileFetcher } from './linkedin.profile-fetcher';
import { GitHubProfileFetcher } from './github.profile-fetcher';

export class ProfileFetcherFactory {
  generateProfileFetcher(profileUrl: string) {
    if (profileUrl.startsWith('https://www.linkedin.com')) {
      return new LinkedInProfileFetcher(profileUrl);
    } else if (profileUrl.startsWith('https://github.com')) {
      return new GitHubProfileFetcher(profileUrl);
    }
    throw new BadRequestException('Unsupported profile URL');
  }
}
