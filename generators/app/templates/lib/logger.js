const appConfig = require('getconfig');
const config    = appConfig.logs;

// Creates the log folder programmatically
if (config.transports.includes('file') || config.transports.includes('logrotate')) {
  const fs = require('fs');
  try {
    fs.mkdirSync(config.logPath);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

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
