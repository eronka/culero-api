export const userProperties = {
  id: { type: 'number' },
  email: { type: 'string' },
  name: { type: 'string' },
  profilePictureUrl: { type: 'string' },
  authType: {
    type: 'enum',
    enum: ['EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'LINKEDIN'],
  },
  isEmailVerified: { type: 'boolean' },
  headline: { type: 'string' },
  joinedAt: { type: 'string', format: 'date-time' },
  location: { type: 'string' },
};

export const userExtraProps = {
  connectionsCount: { type: 'number' },
  ratingsCount: { type: 'number' },
  isConnection: { type: 'boolean' },
};
