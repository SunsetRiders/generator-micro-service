const winston    = require('winston');
const config     = require('getconfig').logs;
const transports = require('./logger-transports');

// Ensure log folder exists, if it's required
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

const mode      = 'default';
const logConfig = {
  exitOnError:  false,
  level:        config.log,
  colorStatus:  config.color,
  transports:   transports.map(transport => transport.call({}, mode))
};

const constructor = winston.Logger;

module.exports = new constructor(logConfig);
