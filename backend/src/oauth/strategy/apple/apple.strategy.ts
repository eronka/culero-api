import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from '@arendajaelu/nestjs-passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    clientID: string,
    teamID: string,
    keyID: string,
    key: string,
    callbackURL: string,
  ) {
    super({
      clientID,
      teamID,
      keyID,
      key,
      callbackURL,
      passReqToCallback: false,
      scope: ['email', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<Profile> {
    return profile;
  }
}
