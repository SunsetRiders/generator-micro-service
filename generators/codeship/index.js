const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('nodeVersion');
  }

  initializing() {
    this.props = {};
  }

  copyConfigurationFiles() {
    [
      'codeship-services.yml',
      'codeship-steps.yml',
      'Dockerfile.test'
    ].forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.options
      );
    });
  }
};
