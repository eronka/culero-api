module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'style', 'test', 'build', 'chore'],
    ],
    'subject-full-stop': [0, 'never'],
  },
};
