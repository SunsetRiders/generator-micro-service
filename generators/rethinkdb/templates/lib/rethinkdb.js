/**
 * It's a simple wrapper for the default javascript driver from Rethink DB.
 * It exposes this default driver on attribute 'r' and can be used without problems.
 *
 * @see https://www.rethinkdb.com/api/javascript
 * @module
 */
require('collections/shim-array');
require('collections/listen/array-changes');
const logger = require('./logger-default');
const Promise = require('bluebird');
const rethinkdbDash = require('rethinkdbdash');

const rethinkDbService = {};
rethinkDbService.r = null;

rethinkDbService.connect = function(options) {
  const self = this;
  rethinkDbService.r = rethinkdbDash(options);

  // It already has default values, so we just don't care
  return Promise.resolve(self);
};

rethinkDbService.disconnect = function() {
  const self = this;

  if (rethinkDbService.r === null) {
    return Promise.resolve(self);
  }

  return rethinkDbService.r.getPoolMaster().drain()
    .then(() => self)
    .catch((err) => {
      logger.error('Rethink DB cannot close its connections', err);
      return Promise.reject(err);
    });
};

rethinkDbService.checkDatabaseExists = function(databaseName) {
  const self = this;

  if (!databaseName) {
    const error = new Error('You must provided a database name:', databaseName);
    return Promise.reject(error);
  }

  if (!this.r) {
    const error = new Error('Rethink DB seems to be disconnected');
    return Promise.reject(error);
  }

  return self.r.dbList().then((databases) => {
    const dbExists = databases.has(databaseName);
    return dbExists;
  });
};

rethinkDbService.createDatabase = function(databaseName) {
  const self = this;

  return this.checkDatabaseExists(databaseName).then((dbExists) => {
    if (dbExists) {
      return;
    }

    return self.r.dbCreate(databaseName);
  }).then(() => {
    return;
  }).catch((err) => {
    logger.error(`Cannot create database ${databaseName}`, err);
    return Promise.reject(err);
  });
};

rethinkDbService.checkTableExists = function(databaseName, tableName) {
  const self = this;

  if (!tableName) {
    const error = new Error('You must provided a table name:', tableName);
    return Promise.reject(error);
  }

  return this.checkDatabaseExists(databaseName).then((dbExists) => {
    if (!dbExists) {
      return Promise.reject(false);
    }

    return self.r.db(databaseName).tableList().then((tables) => {
      const tableExists = tables.has(tableName);
      return tableExists;
    });
  });
};

rethinkDbService.createTable = function(databaseName, tableName, primaryKey = 'id') {
  const self = this;

  return this.checkTableExists(databaseName, tableName).then((tableExists) => {
    if (tableExists) {
      return;
    }

    return self.r.db(databaseName).tableCreate(tableName, {
      primaryKey: primaryKey
    }).then((result) => {
      return;
    }).catch((err) => {
      logger.error(`Cannot create table ${tableName} on database ${databaseName}`, err);
      return Promise.reject(err);
    });
  });
};

// May have changed the signature
rethinkDbService.get = function(databaseName, tableName, filters) {
  const self = this;

  return this.checkTableExists(databaseName, tableName).then((tableExists) => {
    if (!tableExists) {
      const error = new Error(`Table ${tableName} were not found`);
      return Promise.reject(error);
    }

    return self.r.db(databaseName).table(tableName).filter(filters);
  }).catch((err) => {
    logger.error(`Cannot get data from ${databaseName}.${tableName}`, err);
  });
};

rethinkDbService.set = function(databaseName, tableName, objectToStore) {
  const self = this;

  if (!objectToStore) {
    const error = new Error('You must provide an object to be stored!');
    return Promise.reject(error);
  }

  return this.checkTableExists(databaseName, tableName).then((tableExists) => {
    if (!tableExists) {
      const error = new Error(`Table ${tableName} were not found`);
      return Promise.reject(error);
    }

    return self.r.db(databaseName).table(tableName).insert(objectToStore, {
      conflict: 'update'
    }).catch((err) => {
      logger.error(`Cannot insert into ${databaseName}.${tableName}`, objectToStore, err);
      return Promise.reject(err);
    });
  });
};

module.exports = rethinkDbService;
