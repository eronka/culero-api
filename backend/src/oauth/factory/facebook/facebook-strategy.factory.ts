import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { FacebookStrategy } from '../../strategy/facebook/facebook.strategy';

@Injectable()
export class FacebookOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly clientID: string;
  private readonly clientSecret: string;
  private readonly callbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    this.clientSecret = this.configService.get<string>(
      'FACEBOOK_CLIENT_SECRET',
    );
    this.callbackURL = this.configService.get<string>('FACEBOOK_CALLBACK_URL');
  }

  public isOAuthEnabled(): boolean {
    return Boolean(this.clientID && this.clientSecret && this.callbackURL);
  }

  public createOAuthStrategy<FacebookStrategy>(): FacebookStrategy | null {
    if (this.isOAuthEnabled()) {
      return new FacebookStrategy(
        this.clientID,
        this.clientSecret,
        this.callbackURL,
      ) as FacebookStrategy;
    } else {
      Logger.warn('Facebook Auth is not enabled in this environment.');
      return null;
    }
  }
}
