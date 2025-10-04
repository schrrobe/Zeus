module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:n/recommended', 'plugin:promise/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'import/no-unresolved': 'off'
  }
};
