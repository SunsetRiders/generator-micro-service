const winston = require('winston');
require('winston-logentries');
const config = require('getconfig').logs;
const path = require('path');

const availableTransports = {
  console: function() {
    return new winston.transports.Console({
      colorize: config.color,
      timestamp: true
    });
  },
  file: function(name) {
    return new winston.transports.File({
      filename: path.resolve(config.logPath + '/' + name + '.log'),
      json: true,
      colorize: config.color,
      timestamp: true
    });
  },
  logrotate: function(name) {
    return new winston.transports.File({
      filename: path.resolve(config.logPath + '/' + name + '.log'),
      colorize: config.color,
      timestamp: true,
      json: true,
      maxsize: 400 * 1024 * 1024,
      maxFiles: 5
    });
  },
  logentries: function() {
    return new winston.transports.Logentries({
      token: config.logentriesToken
    });
  }
};

module.exports = config.transports
  .map(transport => availableTransports[transport])
  .filter(transport => transport);
