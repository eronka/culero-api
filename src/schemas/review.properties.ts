const base = {
  userName: {
    type: 'string',
    example: 'John Doe',
  },
  profilePictureUrl: {
    type: 'string',
    example: 'https://example.com/profile.jpg',
  },
  professionalism: {
    type: 'number',
    example: 5,
  },
  reliability: {
    type: 'number',
    example: 5,
  },
  communication: {
    type: 'number',
    example: 5,
  },
  createdOn: {
    type: 'string',
    format: 'date-time',
    example: '2021-07-01T00:00:00.000Z',
  },
};

export const reviewProperties = base;

export const reviewPropertiesWithComment = {
  ...base,
  comment: {
    type: 'string',
    example: 'Great service!',
  },
};
