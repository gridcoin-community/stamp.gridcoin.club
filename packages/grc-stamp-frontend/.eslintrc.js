module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'next/core-web-vitals',
  ],
  rules: {
    // 'import/extensions': 0,
    'react/jsx-props-no-spreading': 0,
    'comma-dangle': ["error", "always-multiline"],
    'import/prefer-default-export': 0,
    'no-case-declarations': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-plusplus': 0
  },
};
