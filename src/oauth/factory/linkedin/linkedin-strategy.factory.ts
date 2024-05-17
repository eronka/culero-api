import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { LinkedInStrategy } from '../../strategy/linkedin/linkedin.strategy';

@Injectable()
export class LinkedInOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly oAuthClientID: string;
  private readonly oAuthClientSecret: string;
  private readonly oAuthCallbackURL: string;
  private readonly socialAccountLinkClientID: string;
  private readonly socialAccountLinkClientSecret: string;
  private readonly socialAccountLinkCallbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.oAuthClientID = this.configService.get<string>(
      'LINKEDIN_OAUTH_CLIENT_ID',
    );
    this.oAuthClientSecret = this.configService.get<string>(
      'LINKEDIN_OAUTH_CLIENT_SECRET',
    );
    this.oAuthCallbackURL = this.configService.get<string>(
      'LINKEDIN_OAUTH_CALLBACK_URL',
    );
    this.socialAccountLinkClientID = this.configService.get<string>(
      'LINKEDIN_SOCIAL_ACCOUNT_LINK_CLIENT_ID',
    );
    this.socialAccountLinkClientSecret = this.configService.get<string>(
      'LINKEDIN_SOCIAL_ACCOUNT_LINK_CLIENT_SECRET',
    );
    this.socialAccountLinkCallbackURL = this.configService.get<string>(
      'LINKEDIN_SOCIAL_ACCOUNT_LINK_CALLBACK_URL',
    );
  }

  public isOAuthEnabled(): boolean {
    return Boolean(
      this.oAuthClientID && this.oAuthClientSecret && this.oAuthCallbackURL,
    );
  }

  public isSocialAccountLinkEnabled(): boolean {
    return Boolean(
      this.socialAccountLinkClientID &&
        this.socialAccountLinkClientSecret &&
        this.socialAccountLinkCallbackURL,
    );
  }

  public createOAuthStrategy<LinkedInStrategy>(): LinkedInStrategy | null {
    if (this.isOAuthEnabled()) {
      return new LinkedInStrategy(
        this.oAuthClientID,
        this.oAuthClientSecret,
        this.oAuthCallbackURL,
      ) as LinkedInStrategy;
    } else {
      Logger.warn('LinkedIn Auth is not enabled in this environment.');
      return null;
    }
  }

  public createSocialAccountLinkStrategy<
    LinkedInStrategy,
  >(): LinkedInStrategy | null {
    if (this.isSocialAccountLinkEnabled()) {
      return new LinkedInStrategy(
        this.socialAccountLinkClientID,
        this.socialAccountLinkClientSecret,
        this.socialAccountLinkCallbackURL,
      ) as LinkedInStrategy;
    } else {
      Logger.warn(
        'LinkedIn Social Account Link is not enabled in this environment.',
      );
      return null;
    }
  }
}
