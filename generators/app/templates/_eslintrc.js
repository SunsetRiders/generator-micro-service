const OFF   = 0;
const WARN  = 1;
const ERROR = 2;

module.exports = {
  "extends": "google",

  "env": {
    "mocha": true,
    "node": true,
    "es6": true
  },

  "globals": {},

  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },

  "rules": {
    "key-spacing": 0,
    "no-multi-spaces": 0,
    "strict": [ERROR, "global"],
    "max-len": [ERROR, 120, 2],
    "no-unused-expressions": 0,
    "arrow-parens": [OFF, "as-needed"],
    "dot-location": [OFF, "property"]
  }
};
