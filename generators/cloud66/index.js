const generators = require('yeoman-generator');
const randomWord = require('random-word');

const emptyString = function(str) {
  if (typeof str == 'undefined' ||
      !str ||
      str.length === 0 ||
      str === '' || !/[^\s]/.test(str) ||
      /^\s*$/.test(str) ||
      str.replace(/\s/g, '') === '') {
    return true;
  }
  return false;
};

const notEmpty = function(str) {
  return typeof str === 'string' && !emptyString(str);
};

module.exports = generators.Base.extend({
  initializing: function() {
    this.props = {};
  },

  prompting: function() {
    return this.prompt([
      {
        name: 'c66OrganizationName',
        type: 'input',
        message: 'Cloud66 - Organization name:',
        default: 'acme',
        validate: notEmpty,
        store: true,
      }, {
        name: 'c66serverName',
        type: 'input',
        message: 'Cloud66 - Server name:',
        default: randomWord,
      },
    ]).then(function(props) {
      this.props = props;
    }.bind(this));
  },

  debuggingThisThing: function() {
    this.log(this.props);
  },
});
