import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { GithubStrategy } from '../../strategy/github/github.strategy';

@Injectable()
export class GithubOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly clientID: string;
  private readonly clientSecret: string;
  private readonly callbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.get<string>('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');
    this.callbackURL = this.configService.get<string>('GITHUB_CALLBACK_URL');
  }

  public isOAuthEnabled(): boolean {
    return Boolean(this.clientID && this.clientSecret && this.callbackURL);
  }

  public isSocialAccountLinkEnabled(): boolean {
    return false;
  }

  public createOAuthStrategy<GithubStrategy>(): GithubStrategy | null {
    if (this.isOAuthEnabled()) {
      return new GithubStrategy(
        this.clientID,
        this.clientSecret,
        this.callbackURL,
      ) as GithubStrategy;
    } else {
      Logger.warn('Github Auth is not enabled in this environment.');
      return null;
    }
  }

  public createSocialAccountLinkStrategy<
    GithubStrategy,
  >(): GithubStrategy | null {
    return null;
  }
}
