const path = require('path');

const commonExtends = [
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'plugin:jsx-a11y/recommended',
  'plugin:@next/next/recommended',
];

const commonRules = {
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'jsx-a11y/anchor-is-valid': 'off',
  '@next/next/no-html-link-for-pages': [
    'warn',
    path.join(__dirname, 'src/pages'),
  ],
};

module.exports = {
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['../../.eslintrc.js', ...commonExtends],
  rules: {
    ...commonRules,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [...commonExtends],
      rules: {
        ...commonRules,
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
