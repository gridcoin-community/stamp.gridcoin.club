module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
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
    'no-plusplus': 0,
    'import/extensions': 0
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'next.config.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  ],
};
