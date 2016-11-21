const _          = require('lodash');
const chalk      = require('chalk');
const generators = require('yeoman-generator');
const mkdirp     = require('mkdirp');
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

const atLeastOne = function(arr) {
  return !_.isEmpty(arr);
};

const c66AvailableEnviroments = [
  {
    name: 'development',
    checked: true,
  },
  {
    name: 'staging',
    checked: true,
  },
  {
    name: 'production',
    checked: true,
  },
];

const c66ServerAvailableVendors = ['aws', 'digitalocean'];
const commonQuestions = [
  {
    name: 'c66ServerKeyName',
    message: 'Cloud66 - Server - Key Name',
    type: 'input',
    validate: notEmpty,
  }, {
    name: 'c66ServerVendor',
    message: 'Cloud66 - Server - Vendor',
    type: 'list',
    validate: atLeastOne,
    choices: c66ServerAvailableVendors,
  },
];

const awsRegions = [
  'us-east-1', 'us-west-1', 'us-west-2', 'sa-east-1', 'eu-central-1',
  'eu-west-1', 'ap-southeast-1', 'ap-northeast-1', 'ap-southeast-2',
  'ap-northeast-2',
];

const awsSizes = [
  'c1.medium', 'c1.xlarge', 'c3.large', 'c3.xlarge',
  'c3.2xlarge', 'c3.4xlarge', 'c3.8xlarge', 'c4.large', 'c4.xlarge',
  'c4.2xlarge', 'c4.4xlarge', 'c4.8xlarge', 'cc2.8xlarge', 'cg1.4xlarge',
  'cr1.8xlarge', 'd2.xlarge', 'd2.2xlarge', 'd2.4xlarge', 'd2.8xlarge',
  'g2.2xlarge', 'g2.8xlarge', 'hi1.4xlarge', 'hs1.8xlarge', 'i2.xlarge',
  'i2.2xlarge', 'i2.4xlarge', 'i2.8xlarge', 'm1.small', 'm1.medium', 'm1.large',
  'm1.xlarge', 'm2.xlarge', 'm2.2xlarge', 'm2.4xlarge', 'm3.medium', 'm3.large',
  'm3.xlarge', 'm3.2xlarge ', 'm4.large', 'm4.xlarge', 'm4.2xlarge',
  'm4.4xlarge', 'm4.10xlarge', 'r3.large', 'r3.xlarge', 'r3.2xlarge',
  'r3.4xlarge', 'r3.8xlarge', 't1.micro', 't2.nano', 't2.micro', 't2.small',
  't2.medium', 't2.large', 'x1.32xlarge',
];

const digitalOceanRegions =[
  'ams2', 'ams3', 'fra1', 'lon1', 'nyc1', 'nyc2', 'nyc3', 'sfo1', 'sgp1',
  'tor1',
];
const digitalOceanSizes = [
  '512mb', '1gb', '2gb', '4gb', '8gb', '16gb', '32gb', '48gb', '64gb', 'm-16gb',
  'm-32gb', 'm-64gb', 'm-128gb', 'm-224gb',
];

const awsQuestions = [
  {
    name: 'c66ServerSize',
    type: 'list',
    message: 'Cloud66 - Server - Size',
    default: 0,
    validate: atLeastOne,
    choices: awsSizes,
  }, {
    name: 'c66ServerRegion',
    type: 'list',
    message: 'Cloud66 - Server - Region',
    validate: atLeastOne,
    choices: awsRegions,
    default: 0,
  }, {
    name: 'c66ServerSubnetId',
    type: 'input',
    message: 'Cloud66 - Server - Subnet ID',
    default: null,
  }, {
    name: 'c66VpcId',
    type: 'input',
    message: 'Cloud66 - Configuration - VPC Id',
    default: null,
  },
];

const digitalOceanQuestions = [
  {
    name: 'c66ServerSize',
    type: 'list',
    message: 'Cloud66 - Server - Size',
    default: 0,
    validate: atLeastOne,
    choices: digitalOceanSizes,
  }, {
    name: 'c66ServerRegion',
    type: 'list',
    message: 'Cloud66 - Server - Region',
    default: 0,
    validate: atLeastOne,
    choices: digitalOceanRegions,
  },
];

const vendorsQuestions = {
  aws: awsQuestions,
  digitalocean: digitalOceanQuestions,
};


module.exports = generators.Base.extend({
  constructor: function(...parameters) {
    generators.Base.apply(this, parameters);
    this.option('repoUrl');
    this.option('serviceName');
  },

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
        name: 'c66NamingPrefix',
        type: 'input',
        message: 'Cloud66 - Name prefix:',
        default: 'acme',
        store: true,
      }, {
        name: 'c66ServerName',
        type: 'input',
        message: 'Cloud66 - Server name:',
        default: randomWord,
      }, {
        name: 'c66Environments',
        type: 'checkbox',
        message: 'Cloud66 - Environment:',
        choices: c66AvailableEnviroments,
        validate: atLeastOne,
      },
    ]).then(function(props) {
      this.props = props;
      this.props.environments = {};
      props.c66Environments.forEach((env) => {
        this.props.environments[env] = {};
      });
      return props.c66Environments;
    }.bind(this)).then(this._setupEnvironments.bind(this));
  },

  _setupEnvironments: function(environments) {
    const [currentEnv, ...remainingEnvs] = environments;
    if (currentEnv) {
      this.log(chalk.bold('Configuration for environment: ' + currentEnv));
      return this.prompt(commonQuestions).then((props) => {
        this.props.environments[currentEnv] = props;
        return vendorsQuestions[props.c66ServerVendor];
      }).then((questions) => {
        return this.prompt(questions);
      }).then((props) => {
        Object.assign(this.props.environments[currentEnv], props);
        return this._setupEnvironments(remainingEnvs);
      });
    }
  },

  write: function() {
    mkdirp('.cloud66');
    const oldDestinationRoot = this.destinationRoot();
    this.destinationRoot(this.destinationPath('.cloud66'));
    this.props.c66Environments.forEach((env) => {
      const context = _.assign({}, this.props, this.props.environments[env],
        this.options);
      this.log(context);
      this.fs.copyTpl(
        this.templatePath('manifest.yml'),
        this.destinationPath('manifest.' + env + '.yml'),
        context
      );
      this.fs.copyTpl(
        this.templatePath('service.yml'),
        this.destinationPath('service.' + env + '.yml'),
        context
      );
    });
    this.destinationRoot(oldDestinationRoot);
  },

  cloud66Scripts: function() {
    const scripts = this.props.c66Environments
      .reduce((scripts, env) => {
        const org = `--org "${this.props.c66OrganizationName}"`;
        const name = `--name "${this.props.c66NamingPrefix}-${env.slice(0, 4)}-${this.options.serviceName}"`;
        const serviceYaml = `--service_yaml "./.cloud66/service.${env}.yml"`;
        const manifestYaml = `--manifest_yaml "./.cloud66/manifest.${env}.yml"`;

        scripts[`cloud66:${env}`] = `cx ${org} stacks create ${name} ` +
          `--environment "${env}" ${serviceYaml} ${manifestYaml}`;

        return scripts;
      }, {});

    this.fs.extendJSON(this.destinationPath('package.json'), {scripts: scripts});
  },

  debug: function() {
    console.log(this.props);
  },
});
