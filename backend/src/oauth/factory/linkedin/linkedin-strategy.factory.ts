import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { LinkedInStrategy } from '../../strategy/linkedin/linkedin.strategy';

@Injectable()
export class LinkedInOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly clientID: string;
  private readonly clientSecret: string;
  private readonly callbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    this.clientSecret = this.configService.get<string>(
      'LINKEDIN_CLIENT_SECRET',
    );
    this.callbackURL = this.configService.get<string>('LINKEDIN_CALLBACK_URL');
  }

  public isOAuthEnabled(): boolean {
    return Boolean(this.clientID && this.clientSecret && this.callbackURL);
  }

  public createOAuthStrategy<LinkedInStrategy>(): LinkedInStrategy | null {
    if (this.isOAuthEnabled()) {
      return new LinkedInStrategy(
        this.clientID,
        this.clientSecret,
        this.callbackURL,
      ) as LinkedInStrategy;
    } else {
      Logger.warn('LinkedIn Auth is not enabled in this environment.');
      return null;
    }
  }
}
