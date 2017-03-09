const extend     = require('deep-extend');
const Generator = require('yeoman-generator');

const validateGitUri = require('./lib/validate-git-uri');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.props = {};
  }

  prompting() {
    this.log('Repo generator initiated!');
    return this.prompt([
      {
        name: 'gitURI',
        type: 'input',
        message: 'git URI:',
        default: 'https://github.com/',
        validate: validateGitUri,
      },
    ]).then(function(props) {
      this.props = props;
    }.bind(this));
  }

  projectFiles() {
    [
      'package.json',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
  }

  extendingPackageJSON() {
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

  install() {
    this.composeWith('git-init', {
      options: {commit: 'Initial commit: ' + this.props.userviceName + ' barebones created.'},
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
      }
    );
    this.composeWith(
      'generic-service:codeship',
      {
        options: {
          nodeVersion: this.props.nodeVersion,
        },
      }
    );
  }
};
