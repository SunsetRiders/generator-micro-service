const fs        = require('fs');
const chalk     = require('chalk');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.props = {};
  }

  write() {
    [
      'lib/rethinkdb.js',
      'config/rethinkdb.js',
    ].forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    });
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
