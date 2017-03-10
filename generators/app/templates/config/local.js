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

/**
 Load env vars from .env file
 */
let rethinkConfig = {
  authKey: env.string('RETHINKDB_AUTHKEY', ''),
  bufferSize: env.int('RETHINKDB_BUFFER_SIZE', null),
  db: env.string('RETHINKDB_DATABASE'),
  host: env.string('RETHINKDB_HOST'),
  max: env.int('RETHINKDB_MAX', null),
  min: env.int('RETHINKDB_MIN', null),
  password: env.string('RETHINKDB_USER_PASSWORD', ''),
  port: env.int('RETHINKDB_PORT'),
  ssl: {
    ca: env.string('RETHINKDB_SSL_CA', '')
  },
  timeoutError: env.int('RETHINKDB_TIMEOUT_ERROR', 5000),
  timeoutGb: env.int('RETHINKDB_TIMEOUT_GB', null),
  user: env.string('RETHINKDB_USER', ''),
  usersTable: env.string('RETHINKDB_USERS_TABLE', ''),
  credentialsTable: env.string('RETHINKDB_CREDENTIALS_TABLE', ''),
  invitationsTable: env.string('RETHINKDB_INVITATIONS_TABLE', 'invitations'),
  invitationsTableOrderingIndex: env.string('RETHINKDB_INVITATIONS_TABLE_ORDERING_INDEX', 'invitations_ordering_index'),
  chartsTable: env.string('RETHINKDB_CHARTS_TABLE', '')
};

if (rethinkConfig.authKey === '') {
  delete rethinkConfig.authKey;
}
if (rethinkConfig.user === '') {
  delete rethinkConfig.user;
  delete rethinkConfig.password;
}
if (rethinkConfig.ssl.ca === '') {
  delete rethinkConfig.ssl;
}

rethinkConfig = Object.keys(rethinkConfig).reduce((obj, key) => {
  if (rethinkConfig[key]) {
    obj[key] = rethinkConfig[key];
  }
  return obj;
}, {});

module.exports = {
  api: {
    host: env.string('API_HOST'),
    key: env.string('API_KEY'),
    port: env.int('API_PORT'),
    version: env.string('API_VERSION')
  },
  app: {
    password: env.string('APP_PASSWORD', 'password'),
    user: env.string('APP_USER', 'user')
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
  postgres: {
    client: 'postgres',
    connection: {
      host: env.string('POSTGRES_HOST'),
      user: env.string('POSTGRES_USER'),
      password: env.string('POSTGRES_PASSWORD'),
      database: env.string('POSTGRES_DB'),
      ssl: env.bool('POSTGRES_SSL', false)
    },
    pool: {
      min: 1,
      max: 7
    }
  }
};
