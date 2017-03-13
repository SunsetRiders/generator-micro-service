const fs   = require('fs');
const env  = require('getenv');

try {
  fs.accessSync('.env', fs.F_OK);
  require('dotenv').config({silent: false});
} catch (e) {
  console.log('Not using dotenv');
}

const postgresConfig = {
  client: 'postgres',
  connection: {
    host: env.string('POSTGRES_HOST'),
    user: env.string('POSTGRES_USER'),
    password: env.string('POSTGRES_PASSWORD'),
    database: env.string('POSTGRES_DB'),
    ssl: env.bool('POSTGRES_SSL', false)
  },
  pool: {
    min: env.int('POSTGRES_POOL_MIN', 10),
    max: env.int('POSTGRES_POOL_MAX', 20)
  },
  // how long a client can remain idle before being closed
  idleTimeoutMillis: env.int('POSTGRES_IDLE_TIMEOUT_MILLIS', 30000)
};

module.exports = {postgres: postgresConfig};
