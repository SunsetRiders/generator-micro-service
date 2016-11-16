const logger = require('./logger-default');

const convertToString = function(something) {
  try {
    return JSON.parse(JSON.stringify(something, Object.getOwnPropertyNames(something)));
  } catch (e) {
    return String(something);
  }
};

const logThen = function(result, api, params) {
  params = params || {};
  logger.info({
    api: api,
    params: params,
    result: convertToString(result),
    end: false
  });
  return result;
};

const logCatch = function(err, api, params) {
  params = params || {};
  logger.error({
    api: api,
    params: params,
    error: convertToString(err),
    end: false
  });
  throw err;
};

const logFinally = function(result, api, params) {
  params = params || {};
  result = result || {};
  logger.info({
    api: api,
    result: convertToString(result),
    params: params,
    end: true
  });
};

const promiseLogger = function(api, params) {
  return {
    return: function(result) {
      return logThen(result, api, params);
    },
    throw: function(err) {
      return logCatch(err, api, params);
    },
    final: function(result) {
      return logFinally(result, api, params);
    }
  };
};

module.exports = {
  logThen: logThen,
  logCatch: logCatch,
  logFinally: logFinally,
  promiseLogger: promiseLogger
};
