import { InternalServerErrorException } from '@nestjs/common';
import { ProfileDetails, ProfileFetcher } from './base.profile-fetcher';
import { SocialAccountType } from '@prisma/client';

export class GitHubProfileFetcher extends ProfileFetcher {
  async getProfileDetails(): Promise<ProfileDetails> {
    const apiKey = process.env.GITHUB_PROFILE_FETCHER_API_KEY;

    const username = this.profileUrl.split('https://github.com/')[1];

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name,
        socialAccountType: SocialAccountType.GITHUB,
        profileUrl: data.html_url,
        headline: data.bio,
        socialId: data.login,
        profilePictureUrl: data.avatar_url,
      };
    } else {
      throw new InternalServerErrorException('Failed to fetch GitHub profile');
    }
  }
}
