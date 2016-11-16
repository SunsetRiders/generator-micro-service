const winston    = require('winston');
const config     = require('getconfig').logs;
const transports = require('./logger-transports');

const mode      = 'default';
const logConfig = {
  exitOnError:  false,
  level:        config.log,
  colorStatus:  config.color,
  transports:   transports.map(transport => transport.call({}, mode))
};

const constructor = winston.Logger;

module.exports = new constructor(logConfig);
