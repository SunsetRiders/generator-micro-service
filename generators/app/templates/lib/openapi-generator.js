const config              = require('getconfig');
const path                = require('path');
const apiKeySecurity      = require('./api-key-security');
const genericErrorHandler = require('./generic-error-handler');

const projectPath = config.projectRoot;
const apiPath     = path.resolve(projectPath, 'src');
const routesPath  = path.resolve(apiPath, 'routes');

const apiDoc = require(path.resolve(apiPath, 'doc.json'));

module.exports = function(app) {
  return {
    apiDoc: apiDoc,
    app:    app,
    routes: routesPath,
    securityHandlers: {
      ApiKeySecurity: apiKeySecurity
    },
    pathSecurity: [
      [/^.*/, [{ApiKeySecurity: []}]]
    ],
    errorMiddleware: genericErrorHandler
  };
};

