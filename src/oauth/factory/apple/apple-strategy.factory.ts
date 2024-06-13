import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategyFactory } from '../oauth-strategy.factory';
import { AppleStrategy } from '../../strategy/apple/apple.strategy';

@Injectable()
export class AppleOAuthStrategyFactory implements OAuthStrategyFactory {
  private readonly clientID: string;
  private readonly teamID: string;
  private readonly keyID: string;
  private readonly key: string;
  private readonly callbackURL: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.get<string>('APPLE_CLIENT_ID');
    this.teamID = this.configService.get<string>('APPLE_TEAM_ID');
    this.keyID = this.configService.get<string>('APPLE_KEY_ID');
    this.key = this.configService
      .get<string>('APPLE_KEY')
      ?.replace(/\\n/gm, '\n');
    this.callbackURL = this.configService.get<string>('APPLE_CALLBACK_URL');
  }

  public isOAuthEnabled(): boolean {
    return Boolean(
      this.clientID &&
        this.callbackURL &&
        this.keyID &&
        this.key &&
        this.teamID,
    );
  }

  public isSocialAccountLinkEnabled(): boolean {
    return false;
  }

  public createOAuthStrategy<AppleStrategy>(): AppleStrategy | null {
    if (this.isOAuthEnabled()) {
      return new AppleStrategy(
        this.clientID,
        this.teamID,
        this.keyID,
        this.key,
        this.callbackURL,
      ) as AppleStrategy;
    } else {
      Logger.warn('Apple Auth is not enabled in this environment.');
      return null;
    }
  }

  public createSocialAccountLinkStrategy<
    AppleStrategy,
  >(): AppleStrategy | null {
    return null;
  }
}
