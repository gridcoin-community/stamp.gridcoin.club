module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    'no-plusplus': 0,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
    'no-bitwise': 0,
    // Typed-error modules legitimately declare several small Error subclasses
    // in one file; one-class-per-file would only scatter them.
    'max-classes-per-file': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    // nodenext ESM requires explicit .js extensions on relative imports; the
    // airbnb rule would flag them, so it is disabled family-wide.
    'import/extensions': 0,
    'func-names': 0,
    'no-console': 0,
    'no-await-in-loop': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-useless-constructor': 0,
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-empty-function': 0,
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/no-explicit-any': ['warn'],
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.test.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-unused-expressions': 'off',
        // Tool results come back loosely typed from the MCP client; tests
        // narrow them by assertion, so explicit any is acceptable here.
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', '*.cjs'],
};
