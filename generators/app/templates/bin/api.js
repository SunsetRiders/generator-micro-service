const path    = require('path');
const fs      = require('fs');
const apiPath = path.resolve(path.dirname(__dirname), 'lib', 'api.js');

fs.stat(apiPath, function(err, stat) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }

  require(apiPath).instance().start();
});
