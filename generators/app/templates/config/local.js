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

// Check if RethinkDB is integrated
let rethinkConfig = '';
fs.exists('./rethinkdb.js', (exists) => {
  if (exists) {
    rethinkConfig = require('./rethinkdb');
  }
});

/**
 Load env vars from .env file
 */
module.exports = {
  api: {
    host: env.string('API_HOST'),
    key: env.string('API_KEY'),
    port: env.int('API_PORT'),
    version: env.string('API_VERSION')
  },
  configName: path.basename(__filename),
  logs: {
    transports: env.array('LOGS_TRANSPORTS', 'string', ['console']),
    log: env.string('LOG_LEVEL'),
    color: env.string('LOGS_COLOR'),
    logentriesToken: env.string('LOGS_LOGENTRIES_TOKEN'),
    blackList: [],
    logPath: path.resolve(appRoot, './log')
  },
  projectRoot: projectRoot,
  rethinkdb: rethinkConfig,
};
