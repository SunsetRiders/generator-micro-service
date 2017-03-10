const fs        = require('fs');
const chalk     = require('chalk');
const Generator = require('yeoman-generator');
const mkdirp    = require('mkdirp');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.props = {};
  }

  write() {
    [
      'src/services/rethinkdb.js',
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
    // fs.open(this.templatePath('env.rethinkdb'), 'r', (err, fd) => {
    //   if (err) {
    //     this.log(err);
    //     this.log(errMessage);
    //     return;
    //   }
    //   let buffer;
    //   fs.readFile(fd, buffer, (err, fileContents) => {
    //     if (err) {
    //       this.log(err);
    //       this.log(errMessage);
    //       return;
    //     }
    //     // appending it to .env.example
    //     fs.appendFile(this.destinationPath('.env.example'), fileContents, (err) => {
    //       if (err) {
    //         this.log(err);
    //         this.log(errMessage);
    //         return;
    //       }
    //     });
    //   });
    // });
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
