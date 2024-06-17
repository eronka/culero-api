import { InternalServerErrorException } from '@nestjs/common';
import { ProfileDetails, ProfileFetcher } from './base.profile-fetcher';
import { SocialAccountType } from '@prisma/client';

export class LinkedInProfileFetcher extends ProfileFetcher {
  async getProfileDetails(): Promise<ProfileDetails> {
    const host = process.env.LINKEDIN_PROFILE_FETCHER_HOST;
    const apiKey = process.env.LINKEDIN_PROFILE_FETCHER_API_KEY;

    const response = await fetch(
      `https://${host}/get-linkedin-profile?linkedin_url=${this.profileUrl}&include_skills=false`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': host,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.data.full_name,
        socialAccountType: SocialAccountType.LINKEDIN,
        profileUrl: this.profileUrl,
        headline: data.data.job_title,
        socialId: data.data.profile_id,
        profilePictureUrl: data.data.profile_image_url,
      };
    } else {
      throw new InternalServerErrorException(
        'Failed to fetch LinkedIn profile',
      );
    }
  }
}
