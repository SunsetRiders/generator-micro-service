const ff     = require('./functional-framework');
const config = require('getconfig');

ff.addNewFunctionalTest({
  testName: 'It returns 200',
  httpMethod: 'GET',
  routePath: 'health',
  extraHeaders: {
    api_key: config.api.key // eslint-disable-line camelcase
  },
  expectedStatusCode: 200
});
