import { FacebookStrategy } from './facebook.strategy';

describe('FacebookStrategy', () => {
  let strategy: FacebookStrategy;

  beforeEach(() => {
    strategy = new FacebookStrategy('clientID', 'clientSecret', 'callbackURL');
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should have a validate method', () => {
    expect(strategy.validate).toBeDefined();
  });
});
