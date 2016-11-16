const expressWinston = require('express-winston');
const config         = require('getconfig').logs;
const transports     = require('./logger-transports');

const mode      = 'request';
const logConfig = {
  bodyBlacklist:  config.blackList,
  colorStatus:    config.color,
  expressFormat:  false,
  level:          config.log,
  meta:           true,
  mode:           'request',
  statusLevels:   true,
  transports:     transports.map(transport => transport.call({}, mode))
};

const constructor = expressWinston.logger;

module.exports = new constructor(logConfig);
