import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LinkedInStrategy } from '../../strategy/linkedin/linkedin.strategy';
import { LinkedInOAuthStrategyFactory } from './linkedin-strategy.factory';

describe('LinkedInOAuthStrategyFactory', () => {
  let factory: LinkedInOAuthStrategyFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('disable when credentials are not present', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');
    factory = new LinkedInOAuthStrategyFactory(configService);
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
        key === 'LINKEDIN_CLIENT_ID' ||
        key === 'LINKEDIN_CLIENT_SECRET' ||
        key === 'LINKEDIN_CALLBACK_URL'
          ? 'test'
          : '',
      );
    factory = new LinkedInOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(true);
  });

  it('create OAuth strategy when enabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeInstanceOf(LinkedInStrategy);
  });
});
