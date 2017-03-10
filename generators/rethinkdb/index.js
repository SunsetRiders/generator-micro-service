const fs        = require('fs');
const chalk     = require('chalk');
const Generator = require('yeoman-generator');
const importTemplateFiles = require('../lib/import-template-files');
const importTemplateFilesDefault  = importTemplateFiles((filename) => filename)((filename) => filename);

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
    const errMessage = '\n' +
      chalk.bgRed('RethinkDB environment variables could not be appended in .env.example file, ' +
      'please do it yourself.');
    // getting the environment variables from template file
    fs.readFile(this.templatePath('env.rethinkdb'), 'utf8', (err, fileContents) => {
      if (err) {
        this.log(err);
        this.log(errMessage);
        return;
      }
      // appending it to .env.example
      fs.appendFile(this.destinationPath('.env.example'), fileContents, (err) => {
        if (err) {
          this.log(err);
          this.log(errMessage);
          return;
        }
      });
    });
  }

  install() {
    this.npmInstall(['rethinkdbdash'], {'save': true});
  }
};
