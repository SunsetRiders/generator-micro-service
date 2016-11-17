/**
 * @module Migrate
 * This will create the current database set up on the config file for rethinkdb
 * with all the tables in tablesToCreateDuringMigration variable.
 **/

const Promise = require('bluebird');
const config = require('getconfig').rethinkdb;
const rethinkdbdash = require('rethinkdbdash');

const tablesToCreateDuringMigration = [
  // insert the tables names here
]

const createDatabase = function(database, r) {
  return r.dbCreate(database)
    .then(result => result.dbs_created === 1);
};

const createDatabaseIfNotExists = function(database, r) {
  return r.dbList()
    .then(dbs => dbs.includes(database))
    .then(dbExists => {
      if (dbExists) {
        return true;
      }
      return createDatabase(database, r);
    });
};

const createTable = function(tableOptions, r) {
  return r.tableCreate(tableOptions.name, {primaryKey: tableOptions.pk})
    .then(result => result.tables_created === 1);
};

const createTableIfNotExists = function(tableOptions, r) {
  return r.tableList()
    .then(tables => tables.includes(tableOptions.name))
    .then(tableExists => {
      if (tableExists) {
        return true;
      }
      return createTable(tableOptions, r);
    });
};

const createTables = function(tableList, r) {
  return Promise.map(tableList, table => createTableIfNotExists(table, r));
};

const migrate = function() {
  return createDatabaseIfNotExists(config.db, rethinkdbdash(config))
    .then(dbCreated => {
      if (dbCreated) {
        const tableNames = tablesToCreateDuringMigration;

        const tableList = tableNames.map(table => {
          return {pk: 'id', name: table};
        });

        return createTables(tableList, rethinkdbdash(config).db(config.db));
      }
      const failedToCreateDB = new Error(`Failed to create DB: ${config.db}`);
      throw failedToCreateDB;
    });
};

module.exports = migrate;
