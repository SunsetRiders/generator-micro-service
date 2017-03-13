const chalk     = require('chalk');
const Generator = require('yeoman-generator');
const mkdirp    = require('mkdirp');
const path      = require('path');
const extend    = require('deep-extend');

const formatProjectTags   = require('./lib/format-tags');
const formatServiceName   = require('./lib/format-service-name');
const importTemplateFiles = require('./lib/import-template-files');
const nodeVersionList     = require('./node-versions');
const validateGitUri      = require('./lib/validate-git-uri');
const validateServiceName = require('./lib/validate-service-name');

const importTemplateFilesDefault  = importTemplateFiles(filename => filename)(filename => filename);
const importTemplateFilesDotfiles = importTemplateFiles(filenames => filenames[0])(filenames => filenames[1]);

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
    importTemplateFilesDefault(this)([
      'README.md',
      'ARCHITECTURE.md',
      'package.json',
    ])
  }

  dockerFiles() {
    importTemplateFilesDefault(this)([
      'Dockerfile',
      'docker-compose.yml',
    ]);
    importTemplateFilesDotfiles(this)([
      ['_dockerignore', '.dockerignore']
    ]);
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
    importTemplateFilesDotfiles(this)([
      ['_env.example', '.env.example'],
      ['_eslintignore', '.eslintignore'],
      ['_eslintrc.js', '.eslintrc.js'],
      ['_gitignore', '.gitignore'],
      ['_github/PULL_REQUEST_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md'],
    ])
  }

  binFolder() {
    importTemplateFilesDefault(this)([
      'bin/api.js',
      'bin/docs.js',
    ])
  }

  testsFolder() {
    importTemplateFilesDefault(this)([
      'tests/mocha.opts',
      'tests/mocha-debug.opts',
      'tests/unit/config-test.js',
      'tests/functional/functional-framework.js',
      'tests/functional/runner-configs.js',
      'tests/functional/framework-runner.js',
      'tests/functional/get-api-docs-tests.js',
      'tests/functional/get-not-found-tests.js',
      'tests/functional/README'
    ]);
  }

  configFolder() {
    importTemplateFilesDefault(this)([
      'config/local.js'
    ]);
  }

  libFolder() {
    importTemplateFilesDefault(this)([
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
      'lib/generate-curl.js',
      'lib/openapi-generator.js'
    ]);
  }

  srcFolder() {
    importTemplateFilesDefault(this)([
      'src/services/template-service.js',
      'src/doc.json'
    ]);
  }

  srcRoutesFolder() {
    importTemplateFilesDefault(this)([
      'src/routes/api-docs.js'
    ]);
  }

  install() {
    if (this.options.github) {
      this.composeWith('git-init', {
        options: {commit: 'Initial commit: ' + this.props.userviceName + ' barebones created.'}
      }, {
        local: require.resolve('generator-git-init')
      });
      if (this.options.cloud66) {
        this.composeWith(
          'micro-service:cloud66',
          {
            options: {
              repoUrl: this.props.gitURI,
              serviceName: this.props.userviceName
            }
          }
        );
      }
      if (this.options.codeship) {
        this.composeWith(
          'micro-service:codeship',
          {
            options: {
              nodeVersion: this.props.nodeVersion
            }
          }
        );
      }
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
