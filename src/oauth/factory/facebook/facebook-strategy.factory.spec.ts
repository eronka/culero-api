import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FacebookStrategy } from '../../strategy/facebook/facebook.strategy';
import { FacebookOAuthStrategyFactory } from './facebook-strategy.factory';

describe('FacebookOAuthStrategyFactory', () => {
  let factory: FacebookOAuthStrategyFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('disable OAuth when credentials are not present', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(false);
  });

  it('disable social account link when credentials are not present', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isSocialAccountLinkEnabled()).toBe(false);
  });

  it('return null when OAuth disabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeNull();
  });

  it('return null when social account link disabled', () => {
    const strategy = factory.createSocialAccountLinkStrategy();
    expect(strategy).toBeNull();
  });

  it('enable OAuth when credentials present', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'FACEBOOK_OAUTH_CLIENT_ID' ||
        key === 'FACEBOOK_OAUTH_CLIENT_SECRET' ||
        key === 'FACEBOOK_OAUTH_CALLBACK_URL'
          ? 'test'
          : '',
      );
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(true);
  });

  it('enable social account link when credentials present', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_ID' ||
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_SECRET' ||
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CALLBACK_URL'
          ? 'test'
          : '',
      );
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isSocialAccountLinkEnabled()).toBe(true);
  });

  it('create OAuth strategy when enabled', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'FACEBOOK_OAUTH_CLIENT_ID' ||
        key === 'FACEBOOK_OAUTH_CLIENT_SECRET' ||
        key === 'FACEBOOK_OAUTH_CALLBACK_URL'
          ? 'test'
          : '',
      );
    const strategy = new FacebookOAuthStrategyFactory(
      configService,
    ).createOAuthStrategy();
    expect(strategy).toBeInstanceOf(FacebookStrategy);
  });

  it('create social account link strategy when enabled', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_ID' ||
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CLIENT_SECRET' ||
        key === 'FACEBOOK_SOCIAL_ACCOUNT_LINK_CALLBACK_URL'
          ? 'test'
          : '',
      );
    const strategy = new FacebookOAuthStrategyFactory(
      configService,
    ).createSocialAccountLinkStrategy();
    expect(strategy).toBeInstanceOf(FacebookStrategy);
  });
});
