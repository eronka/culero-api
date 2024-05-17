import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { FacebookStrategy } from '../../strategy/facebook/facebook.strategy';

@Injectable()
export class FacebookOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly oAuthClientID: string;
  private readonly oAuthClientSecret: string;
  private readonly oAuthCallbackURL: string;
  private readonly socialAccountLinkClientID: string;
  private readonly socialAccountLinkClientSecret: string;
  private readonly socialAccountLinkCallbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.oAuthClientID = this.configService.get<string>(
      'FACEBOOK_OAUTH_CLIENT_ID',
    );
    this.oAuthClientSecret = this.configService.get<string>(
      'FACEBOOK_OAUTH_CLIENT_SECRET',
    );
    this.oAuthCallbackURL = this.configService.get<string>(
      'FACEBOOK_OAUTH_CALLBACK_URL',
    );
    this.socialAccountLinkClientID = this.configService.get<string>(
      'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_ID',
    );
    this.socialAccountLinkClientSecret = this.configService.get<string>(
      'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_SECRET',
    );
    this.socialAccountLinkCallbackURL = this.configService.get<string>(
      'FACEBOOK_SOCIAL_ACCOUNT_LINK_CALLBACK_URL',
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

  public createOAuthStrategy<FacebookStrategy>(): FacebookStrategy | null {
    if (this.isOAuthEnabled()) {
      return new FacebookStrategy(
        this.oAuthClientID,
        this.oAuthClientSecret,
        this.oAuthCallbackURL,
      ) as FacebookStrategy;
    } else {
      Logger.warn('Facebook Auth is not enabled in this environment.');
      return null;
    }
  }

  public createSocialAccountLinkStrategy<
    FacebookStrategy,
  >(): FacebookStrategy | null {
    if (this.isSocialAccountLinkEnabled()) {
      return new FacebookStrategy(
        this.socialAccountLinkClientID,
        this.socialAccountLinkClientSecret,
        this.socialAccountLinkCallbackURL,
      ) as FacebookStrategy;
    } else {
      Logger.warn(
        'Facebook Social Account Link is not enabled in this environment.',
      );
      return null;
    }
  }
}
