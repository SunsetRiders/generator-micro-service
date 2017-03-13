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
    "key-spacing": OFF,
    "no-multi-spaces": OFF,
    "strict": [ERROR, "global"],
    "max-len": [ERROR, 120, 2],
    "no-unused-expressions": OFF,
    "arrow-parens": [OFF, "as-needed"],
    "dot-location": [OFF, "property"]
  }
};
