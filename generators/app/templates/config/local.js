const path = require('path');
const fs   = require('fs');
const env  = require('getenv');

/**
 * The following snipet is checks if an .env file exists.
 * If it does, dotenv is used to load env vars from it.
 * Otherwise, it is ignored.
 */
try {
  fs.accessSync('.env', fs.F_OK);
  require('dotenv').config({silent: false});
} catch (e) {
  console.log('Not using dotenv');
}

const appRoot = path.dirname(__dirname);
const projectRoot = appRoot;

module.exports = {
  api: {
    host: env.string('API_HOST'),
    key: env.string('API_KEY'),
    port: env.int('API_PORT'),
    version: env.string('API_VERSION')
  },
  configName: path.basename(__filename),
  logs: {
    blackList: [],
    color: env.bool('LOGS_COLOR', false),
    level: env.string('LOG_LEVEL', 'info'),
    logentriesToken: env.string('LOGS_LOGENTRIES_TOKEN', null),
    logPath: path.resolve(appRoot, './log'),
    transports: env.array('LOGS_TRANSPORTS', 'string', ['console'])
  },
  projectRoot: projectRoot
};
