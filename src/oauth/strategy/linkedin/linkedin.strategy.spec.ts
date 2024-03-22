import { LinkedInStrategy } from './linkedin.strategy';

describe('LinkedInStrategy', () => {
  let strategy: LinkedInStrategy;

  beforeEach(() => {
    strategy = new LinkedInStrategy('clientID', 'clientSecret', 'callbackURL');
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should have a validate method', () => {
    expect(strategy.validate).toBeDefined();
  });
});
