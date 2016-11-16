const Promise   = require('bluebird');
const YAML      = require('json2yaml');
const fs        = require('fs');
const getconfig = require('getconfig');
const path      = require('path');
const rp        = require('request-promise');

const projectRoot = path.resolve(path.dirname(__dirname));
const apiPath     = path.resolve(projectRoot, 'lib', 'api.js');
const api         = require(apiPath).instance();

const host            = 'http://' + getconfig.api.host + ':' + getconfig.api.port + '/';
const swaggerFilePath = path.resolve(projectRoot, 'swagger.yaml');
const version         = getconfig.api.version;
const writeFile       = Promise.promisify(fs.writeFile);

const options     = {
  uri: host + version + '/api-docs',
  json: false
};

Promise.try(function() {
  console.log('Generating the swagger.yaml docs');
  return api.start();
}).then(()         => rp(options))
  .then(response => YAML.stringify(JSON.parse(response)))
  .then(yaml     => writeFile(swaggerFilePath, yaml, 'utf8'))
  .then(function() {
    console.log('swagger.yaml updated.');
    api.stop();
  }).catch(() => process.exit(1));
