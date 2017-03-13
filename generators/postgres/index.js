const chalk                         = require('chalk');
const Generator                     = require('yeoman-generator');
const importTemplateFiles           = require('../lib/import-template-files');
const appendFileIntoAnotherIfExists = require('../lib/append-file-into-another-if-exists');

const importTemplateFilesDefault  = importTemplateFiles(filename => filename)(filename => filename);

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.props = {};
  }

  write() {
    importTemplateFilesDefault([
      'lib/pg-schemes.js',
      'config/postgres.js'
    ]);
    const errMessage = '\n' +
      chalk.bgRed('Postgres environment variables could not be appended in .env.example file, ' +
      'please do it yourself.');
    appendFileIntoAnotherIfExists(this)('env.postgres')('.env.example')(errMessage);
    appendFileIntoAnotherIfExists(this)('docker-compose.yml')('docker-compose.yml')(
      chalk.bgRed('Cannot set up postgres service in docker-compose.yml')
    );
  }

  install() {
    this.npmInstall(['knex'], {'save': true});
  }
};
