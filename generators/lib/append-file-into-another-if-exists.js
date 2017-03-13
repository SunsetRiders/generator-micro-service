const fs = require('fs');

const appendFileIntoIfExists = that => fromFile => destinationFile => errMessage => {
  fs.readFile(that.templatePath(fromFile), 'utf8', (err, fileContents) => {
    if (err) {
      that.log(err);
      that.log(errMessage);
      return;
    }
    // appending it into destinationFile
    fs.appendFile(that.destinationPath(destinationFile), fileContents, err => {
      if (err) {
        that.log(err);
        that.log(errMessage);
        return;
      }
    });
  });
};

module.exports = appendFileIntoIfExists;
