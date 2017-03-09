const chalk      = require('chalk');
const Generator = require('yeoman-generator');
const mkdirp     = require('mkdirp');
const path       = require('path');

const formatServiceName   = require('./lib/format-service-name');
const validateServiceName = require('./lib/validate-service-name');
const formatProjectTags   = require('./lib/format-tags');
const nodeVersionList     = require('./node-versions');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.props = {};
  }

  prompting() {
    let _this = this;
    return this.prompt([
      {
        name: 'userviceName',
        type: 'input',
        message: 'Micro-service name:',
        default: formatServiceName(path.basename(process.cwd())),
        filter: formatServiceName,
        validate: validateServiceName,
      }, {
        name: 'nodeVersion',
        type: 'list',
        message: 'Node Version: ',
        default: 0,
        choices: nodeVersionList,
      }, {
        name: 'projectDescription',
        type: 'input',
        message: 'This project description:',
        default: '',
      }, {
        name: 'projectTags',
        type: 'input',
        message: 'This project tags:',
        default: 'service',
        filter: formatProjectTags,
      },
    ]).then(function(props) {
      _this.props = props;
    });
  }

  createServiceDir() {
    if (path.basename(this.destinationPath()) !== this.props.userviceName) {
      this.log(
        'Your generator must be inside a folder named ' +
        chalk.underline.bold(this.props.userviceName )+ '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.userviceName);
      this.destinationRoot(this.destinationPath(this.props.userviceName));
    }
  }

  projectFiles() {
    [
      'Dockerfile',
      'docker-compose.yml',
      'README.md',
      'ARCHITECTURE.md',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  dotFiles() {
    [
      ['_dockerignore', '.dockerignore'],
      ['_env.example', '.env.example'],
      ['_eslintignore', '.eslintignore'],
      ['_eslintrc.js', '.eslintrc.js'],
      ['_gitignore', '.gitignore'],
      ['_github/PULL_REQUEST_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md'],
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file[0]),
        this.destinationPath(file[1]),
        this.props
      );
    });
  }

  binFolder() {
    [
      'bin/api.js',
      'bin/docs.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  testsFolder() {
    [
      'tests/mocha.opts',
      'tests/contract/api-test.js',
      'tests/unit/config-test.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  configFolder() {
    [
      'config/local.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  libFolder() {
    [
      'lib/api-key-security.js',
      'lib/app.js',
      'lib/api.js',
      'lib/error-normalizer.js',
      'lib/generic-error-handler.js',
      'lib/logger-default.js',
      'lib/logger-error.js',
      'lib/logger-promise.js',
      'lib/logger-request.js',
      'lib/logger-transports.js',
      'lib/logger.js',
      'lib/openapi-generator.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  srcFolder() {
    [
      'src/service.js',
      'src/doc.json',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  srcRoutesFolder() {
    [
      'src/routes/api-docs.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  install() {
    this.installDependencies({bower: false});
  }

  // end() {
  //   this.composeWith(
  //     'generic-service:repo'
  //   );
  // }
};
