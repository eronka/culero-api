import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppleStrategy } from '../../strategy/apple/apple.strategy';
import { AppleOAuthStrategyFactory } from './apple-strategy.factory';

describe('AppleOAuthStrategyFactory', () => {
  let factory: AppleOAuthStrategyFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('disable when credentials are not present', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');
    factory = new AppleOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(false);
  });

  it('return null when OAuth disabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeNull();
  });

  it('enable OAuth when credentials present', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'APPLE_CLIENT_ID' ||
        key === 'APPLE_TEAM_ID' ||
        key === 'APPLE_KEY_ID' ||
        key === 'APPLE_KEY' ||
        key === 'APPLE_CALLBACK_URL'
          ? 'test'
          : '',
      );
    factory = new AppleOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(true);
  });

  it('create OAuth strategy when enabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeInstanceOf(AppleStrategy);
  });
});
