const commonExtends = ['plugin:prettier/recommended'];

const commonRules = {};

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', ...commonExtends],
  rules: {
    ...commonRules,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        ...commonExtends,
      ],
      rules: {
        ...commonRules,
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/build/**',
    '**/dist/**',
    '**/lib/**',
    '**/out/**',
  ],
};
