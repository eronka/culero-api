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
  jobTitle: { type: 'string' },
  joinedAt: { type: 'string', format: 'date-time' },
};

export const userExtraProps = {
  connections: { type: 'number' },
  ratings: { type: 'number' },
};
