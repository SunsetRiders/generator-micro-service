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
      'lib/rethinkdb.js',
      'config/rethinkdb.js'
    ]);
    const errMessage = chalk.bgRed('RethinkDB environment variables could not be appended in .env.example file, ' +
      'please do it yourself.');
    // getting the environment variables from template file
    appendFileIntoAnotherIfExists(this)('env.rethinkdb')('.env.example')(errMessage);
    appendFileIntoAnotherIfExists(this)('docker-compose.yml')('docker-compose.yml')(
      chalk.bgRed('Cannot set up rethinkdb service in docker-compose.yml')
    );
  }

  install() {
    this.npmInstall(['rethinkdbdash'], {'save': true});
  }
};
