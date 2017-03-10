const config  = require('getconfig');
const logger  = require('../../lib/logger').default;

const templateService = {};

templateService.printAppConfigs = function() {
  logger.info('App Configs:', config);
};

module.exports = templateService;
