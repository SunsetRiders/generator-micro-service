const Promise = require('bluebird');
const YAML    = require('json2yaml');
const fs      = require('fs');
const config  = require('getconfig');
const path    = require('path');
const rp      = require('request-promise');

const projectRoot = path.resolve(path.dirname(__dirname));
const apiPath     = path.resolve(projectRoot, 'lib', 'api.js');
const api         = require(apiPath).instance();

const host            = 'http://' + config.api.host + ':' + config.api.port + '/';
const swaggerFilePath = path.resolve(projectRoot, 'swagger.yaml');
const version         = config.api.version;
const writeFile       = Promise.promisify(fs.writeFile);

const options     = {
  uri: host + version + '/api-docs',
  headers: {
    api_key: config.api.key // eslint-disable-line camelcase
  },
  json: false
};

console.log('Generating the swagger.yaml docs');

Promise.try(() => api.start())
  .then(()       => rp(options))
  .then((response) => YAML.stringify(JSON.parse(response)))
  .then((yaml)     => writeFile(swaggerFilePath, yaml, 'utf8'))
  .then(()       => console.log('swagger.yaml updated.'))
  .then(()       => api.stop())
  .catch((err)     => {
    console.log(err);
    process.exit(1);
  });
