const fs   = require('fs');
const env  = require('getenv');

try {
  fs.accessSync('.env', fs.F_OK);
  require('dotenv').config({silent: false});
} catch (e) {
  console.log('Not using dotenv');
}

const rethinkConfig = {
  authKey: env.string('RETHINKDB_AUTHKEY', ''),
  bufferSize: env.int('RETHINKDB_BUFFER_SIZE', ''),
  db: env.string('RETHINKDB_DATABASE'),
  host: env.string('RETHINKDB_HOST'),
  max: env.int('RETHINKDB_MAX', null),
  min: env.int('RETHINKDB_MIN', null),
  password: env.string('RETHINKDB_USER_PASSWORD', ''),
  port: env.int('RETHINKDB_PORT'),
  ssl: {
    ca: env.string('RETHINKDB_SSL_CA', '').split('\\n').join('\n')
  },
  timeout: env.int('RETHINKDB_TIMEOUT', 300),
  timeoutError: env.int('RETHINKDB_TIMEOUT_ERROR', 5000),
  timeoutGb: env.int('RETHINKDB_TIMEOUT_GB', null),
  user: env.string('RETHINKDB_USER', ''),
  tableNames: {
    // write your tables config here
  }
};

let configs = Object.keys(rethinkConfig).reduce((obj, key) => {
  if (rethinkConfig[key]) {
    switch (key) {
      case 'authKey':
      case 'user':
        if (rethinkConfig[key] === '') {
          return obj;
        }
        break;
      case 'password':
        if (rethinkConfig.user === '') {
          return obj;
        }
        break;
      case 'ssl':
        if (rethinkConfig[key] && rethinkConfig[key].ca && rethinkConfig[key].ca !== '') {
          obj[key] = rethinkConfig[key];
          // console.log(rethinkConfig.ssl.ca);
          return obj;
        }
        break;
      default:
    }
  } else {
    return obj;
  }

  obj[key] = rethinkConfig[key];
  return obj;
}, {});

module.exports = {rethinkdb: configs};
