module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-inner-declarations': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'no-else-return': 'off',
  },
};
