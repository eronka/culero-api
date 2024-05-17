import { BadRequestException } from '@nestjs/common';
import { LinkedInProfileFetcher } from './linkedin.profile-fetcher';

export class ProfileFetcherFactory {
  generateProfileFetcher(profileUrl: string) {
    if (profileUrl.startsWith('https://www.linkedin.com')) {
      return new LinkedInProfileFetcher();
    }
    throw new BadRequestException('Unsupported profile URL');
  }
}
