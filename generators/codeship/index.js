const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function(...parameters) {
    generators.Base.apply(this, parameters);
    this.option('nodeVersion');
  },

  initializing: function() {
    this.props = {};
  },

  copyConfigurationFiles: function() {
    [
      'codeship-services.yml',
      'codeship-steps.yml',
      'Dockerfile.test',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.options
      );
    });
  },
});
