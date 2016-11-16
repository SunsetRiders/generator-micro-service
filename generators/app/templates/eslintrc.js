module.exports = {
  'extends': 'google',
  'env': {
    mocha: true,
    node: true,
  },
  'globals': {},
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'rules': {
    'key-spacing': 0,
    'no-multi-spaces': 0,
    'strict': [2, 'global'],
    'max-len': [2, 120, 2],
    'no-unused-expressions': 0,
  },
};
