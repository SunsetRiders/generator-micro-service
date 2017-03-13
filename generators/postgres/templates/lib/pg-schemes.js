/**
 * @module PgSchemes
 * Prepares PgSchemes to be used in the app.
 */
const config = require('getconfig');
const knex   = require('knex');

const PgSchemes = {};

const db = knex({
  client: config.postgres.client,
  connection: {
    database: config.postgres.connection.database,
    user: config.postgres.connection.user,
    password: config.postgres.connection.password,
    host: config.postgres.connection.host,
    port: config.postgres.connection.port,
    ssl: config.postgres.connection.ssl
  },
  pool: {
    min: config.postgres.pool.min,
    max: config.postgres.pool.max
  },
  acquireConnectionTimeout: config.postgres.idleTimeoutMillis
});

PgSchemes.db = db;

/*
 * Methods
 * =========
 */

/**
 * Retrieves all the User data from DB, given his ID.
 *
 * @param {String} userId The user ID
 * @return {Promise.< Array.<Object>, Error >} Returns a promise containing the results
 */
PgSchemes.findUserById = function(userId) {
  if (!userId) {
    return Promise.resolve([]);
  }

  return this.db.select('*').from('users').where({id: userId}).whereNull('deleted_at');
};

module.exports = PgSchemes;
