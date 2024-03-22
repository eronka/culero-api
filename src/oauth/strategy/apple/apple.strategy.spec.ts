import { AppleStrategy } from './apple.strategy';

describe('AppleStrategy', () => {
  let strategy: AppleStrategy;

  beforeEach(() => {
    strategy = new AppleStrategy(
      'clientID',
      'teamID',
      'keyID',
      'key',
      'callbackURL',
    );
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should have a validate method', () => {
    expect(strategy.validate).toBeDefined();
  });
});
