const path = require('path');

const eslintrc = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['react', 'jsx-a11y', 'import'],
  settings: {
    'import/core-modules': [
      'react',
      'react-dom',
      'react-router-dom',
      'config',
      'react-helmet',
      // 'prop-types',
    ],
    parserOptions: {
      parser: 'babel-eslint'
    }
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'no-shadow': 'warn',
    'no-console': 0,
    'no-plusplus': 0,
    'max-len': ["error", 200, { "ignoreComments": true }],
    'linebreak-style': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'import/extensions': [
      2,
      'never',
      { 'web.js': 'never', json: 'never', css: 'always' },
    ],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/no-unresolved': [2, { ignore: ['antd'] }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  env: {
    browser: true,
  },
};

module.exports = eslintrc;
