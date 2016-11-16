const expressWinston = require('express-winston');
const config         = require('getconfig').logs;
const transports     = require('./logger-transports');

const mode      = 'error';
const logConfig = {
  colorStatus:  config.color,
  transports:   transports.map(transport => transport.call({}, mode))
};

const constructor = expressWinston.errorLogger;

module.exports = new constructor(logConfig);
