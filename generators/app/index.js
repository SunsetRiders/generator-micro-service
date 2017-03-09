const chalk      = require('chalk');
const extend     = require('deep-extend');
const generators = require('yeoman-generator');
const mkdirp     = require('mkdirp');
const path       = require('path');

const formatServiceName   = require('./lib/format-service-name');
const validateServiceName = require('./lib/validate-service-name');
const formatProjectTags   = require('./lib/format-tags');
const nodeVersionList     = require('./node-versions');

module.exports = generators.Base.extend({
  initializing: function() {
    this.props = {};
  },

  prompting: function() {
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
      this.props = props;
    }.bind(this));
  },

  createServiceDir: function() {
    if (path.basename(this.destinationPath()) !== this.props.userviceName) {
      this.log(
        'Your generator must be inside a folder named ' +
        chalk.underline.bold(this.props.userviceName )+ '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.userviceName);
      this.destinationRoot(this.destinationPath(this.props.userviceName));
    }
  },

  projectFiles: function() {
    [
      'Dockerfile',
      'docker-compose.yml',
      'package.json',
      'README.md',
      'ARCHITECTURE.md',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  },

  dotFiles: function() {
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
  },

  binFolder: function() {
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
  },

  testsFolder: function() {
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
  },

  configFolder: function() {
    [
      'config/local.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  },

  libFolder: function() {
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
  },

  srcFolder: function() {
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
  },

  srcRoutesFolder: function() {
    [
      'src/routes/api-docs.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  },


  extendingPackageJSON: function() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    extend(pkg, {
      dependencies: {
        // Add production dependencies
      },
      devDependencies: {
        // Add development dependencies
      },
    });
    pkg.keywords = (pkg.keywords || []).concat(this.props.projectTags);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  },

  install: function() {
    this.composeWith('git-init', {
      options: {commit: '[init]' + this.props.userviceName + ' barebones - created.'},
    }, {
      local: require.resolve('generator-git-init'),
    });
    this.composeWith(
      'generic-service:cloud66',
      {
        options: {
          repoUrl: this.props.gitURI,
          serviceName: this.props.userviceName,
        },
      },
      {}
    );
    this.composeWith(
      'generic-service:codeship',
      {
        options: {
          nodeVersion: this.props.nodeVersion,
        },
      },
      {}
    );
    this.installDependencies({bower: false});
  },
});
