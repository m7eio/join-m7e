module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'react',
    'jest',
    'unicorn',
    'react-hooks',
    'simple-import-sort',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**.tsx', '**.ts'],
      rules: {
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        '@typescript-eslint/no-var-requires': 0,
        'operator-assignment': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': 'off',
    'import/prefer-default-export': ['warn'],
    'react/prop-types': 'off',
    'header/header': 'off',
    'consistent-return': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'prefer-object-spread': 'warn',
  },
};
