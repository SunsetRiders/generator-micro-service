const chalk     = require('chalk');
const Generator = require('yeoman-generator');
const mkdirp    = require('mkdirp');
const path      = require('path');
const extend    = require('deep-extend');

const formatServiceName   = require('./lib/format-service-name');
const validateServiceName = require('./lib/validate-service-name');
const validateGitUri      = require('./lib/validate-git-uri');
const formatProjectTags   = require('./lib/format-tags');
const nodeVersionList     = require('./node-versions');

const choicesDatabases = [
  {
    name: 'Postgres',
    checked: false,
  },
  {
    name: 'Redis',
    checked: false,
  },
  {
    name: 'RethinkDB',
    checked: false,
  },
];

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
        name: 'projectDescription',
        type: 'input',
        message: 'This project description:',
        default: '',
      }, {
        name: 'nodeVersion',
        type: 'list',
        message: 'Node Version: ',
        default: 0,
        choices: nodeVersionList,
      }, {
        name: 'projectTags',
        type: 'input',
        message: 'This project tags:',
        default: 'service',
        filter: formatProjectTags,
      },
      {
        name: 'databases',
        type: 'checkbox',
        message: 'Which databases are going to be used?',
        choices: choicesDatabases,
      },
      {
        name: 'github',
        type: 'confirm',
        message: 'Should we start a Github repository?',
      },
      {
        when: function(response) {
          return response.github;
        },
        name: 'gitURI',
        type: 'input',
        message: 'Github URI:',
        default: 'https://github.com/',
        validate: validateGitUri,
      },
      {
        name: 'cloud66',
        type: 'confirm',
        message: 'Should we start Cloud66 stacks?',
      },
      {
        name: 'Codeship',
        type: 'confirm',
        message: 'Should we start a Codeship project?',
      },
    ]).then(function(props) {
      if (!props.github) {
        props.gitURI = '';
      }
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
      'package.json',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  /**
   *  Add the chosen tags to package.json tags session
   */
  extendingPackageJSON() {
    this.log('Adding chosen tags in package.json - session "keywords"');
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
    const _this = this;
    if (this.props.databases.length) {
      this.props.databases.forEach(function(database) {
        switch(database) {
          case 'Postgres':
            _this.composeWith(
              'micro-service:postgres',
              {}
            );
            break;
          case 'Redis':
            _this.composeWith(
              'micro-service:redis',
              {}
            );
            break;
          case 'RethinkDB':
            _this.composeWith(
              'micro-service:rethinkdb',
              {}
            );
            break;
          default:
            _this.log('\n' + chalk.bgRed(database + ' is not an option for databases! Doing nothing with it.'));
        }
      });
    }
    if (this.props.github) {
      this.composeWith('git-init', {
        options: {commit: 'Initial commit: ' + this.props.userviceName + ' barebones created.'},
      }, {
        local: require.resolve('generator-git-init'),
      });
      if (this.props.cloud66) {
        this.composeWith(
          'micro-service:cloud66',
          {
            options: {
              repoUrl: this.props.gitURI,
              serviceName: this.props.userviceName,
            },
          }
        );
      }
      if (this.props.codeship) {
        this.composeWith(
          'micro-service:codeship',
          {
            options: {
              nodeVersion: this.props.nodeVersion,
            },
          }
        );
      }
    }
    // giving latest warnings in the console
    if (!this.props.databases.length) {
      this.log('\n' + chalk.bold('No databases to set and configure.'));
    }
    this.log('\n' +
      chalk.underline.bold('Without a github repository it is not possible to start Cloud66 and Codeship.') +
      '\nending...'
    );
  }

  end() {
    this.installDependencies({bower: false});
  }
};
