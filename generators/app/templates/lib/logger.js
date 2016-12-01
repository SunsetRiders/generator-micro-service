const appConfig = require('getconfig');
const config    = appConfig.logs;

if (config.transports.includes('logentries') && config.logentriesToken === '') {
  throw new Error('Missing LOGS_LOGENTRIES_TOKEN environment variable');
}

const loggers         = {};
loggers.errorLogger   = require('./logger-error');
loggers.error         = loggers.errorLogger;
loggers.requestLogger = require('./logger-request');
loggers.request       = loggers.requestLogger;
loggers.defaultLogger = require('./logger-default');
loggers.default       = loggers.defaultLogger;
loggers.promise       = require('./logger-promise');
loggers.logReturn     = loggers.promise.logThen;
loggers.logThrow      = loggers.promise.logCatch;
loggers.logEnd        = loggers.promise.logFinally;
loggers.promiseLogger = loggers.promise.promiseLogger;

module.exports = loggers;
