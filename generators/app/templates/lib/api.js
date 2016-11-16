/**
 * @module api
 */
const config = require('getconfig');
const logger = require('./logger').defaultLogger;
const app    = require('./app');

const apiStopCallbackWrapper = function(callback) {
  return function(e) {
    if (e) {
      logger.error({
        api: 'Api#stop',
        params: {},
        error: e,
        end: false
      });
      callback(e);
    } else {
      logger.info({
        api: 'Api#stop',
        params: {},
        result: {},
        end: false
      });
      callback();
    }
  };
};

const apiStartCallbackWrapper = function(callback) {
  return function(e) {
    if (e) {
      logger.error({
        api: 'Api#start',
        params: {
          PORT: config.api.port
        },
        error: e,
        end: false
      });
      callback(e);
    } else {
      logger.info({
        api: 'Api#start',
        params: {
          PORT: config.api.port
        },
        result: {},
        end: false
      });
      callback();
    }
  };
};

/**
 * Api constructor
 * @param {Object} params default params
 */
function Api(params) {}

/*
 * Api#start()
 */
Api.prototype.start = function(callback) {
  callback = callback || (function(e) { });

  /*
   * Finally starts the server
   */
  const callbackWrapper = apiStartCallbackWrapper(callback);

  this.server = app.listen(config.api.port, callbackWrapper);
  return this.server;
};

/*
 * Api#stop()
 */
Api.prototype.stop = function(callback) {
  callback = callback || (function() {
    process.exit(0);
  });

  const callbackWrapper = apiStopCallbackWrapper(callback);
  this.server.close(callbackWrapper);
};

/**
 * Api.instance
 * @return {Api} Instance of Api class
 */
Api.instance = function() {
  return new Api();
};

/**
 This module can be used with the following:

const Api = require('path/to/Api.js');

const api = Api.instance();
api.start();
*/
module.exports = Api;
