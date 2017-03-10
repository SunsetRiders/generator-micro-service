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
  console.log('DOTENV: Not using');
}

const thisFilename = path.basename(__filename);
const appRoot = path.dirname(__dirname);
const projectRoot = appRoot;

const defaultProjectConfig = {
  api: {
    host: env.string('API_HOST'),
    key: env.string('API_KEY'),
    port: env.int('API_PORT'),
    version: env.string('API_VERSION')
  },
  configName: path.basename(__filename),
  logs: {
    blackList: [],
    level: env.string('LOG_LEVEL', 'info'),
    logentriesToken: env.string('LOGS_LOGENTRIES_TOKEN', null),
    logPath: path.resolve(appRoot, './log'),
    transports: env.array('LOGS_TRANSPORTS', 'string', ['console'])
  },
  projectRoot: projectRoot
};

const isFile = (dirname) => (filename) =>
  fs.statSync(`${dirname}/${filename}`).isFile();

const isNotCurrentFile = (currentFile) => (filename) => `${currentFile}` !== filename;

const isJSorJSON = (filename) => ['js', 'json'].
  map((allowedExt) => filename.split('.').pop() === allowedExt).
  reduce((allow, allowedExt) => allow || allowedExt, false);

const configFiles = (currentFile) => (dirname) =>
  fs.readdirSync(dirname)
    .filter(isFile(dirname))
    .filter(isNotCurrentFile(currentFile))
    .filter(isJSorJSON)
    .map((filename) => require(`${dirname}/${filename}`));

const mergedConfigs = configFiles(thisFilename)(__dirname).
  reduce((newConfig, config) => Object.assign(newConfig, config), defaultProjectConfig);

module.exports = mergedConfigs;
