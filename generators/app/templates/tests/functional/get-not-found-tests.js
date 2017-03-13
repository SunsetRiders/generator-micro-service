const ff     = require('./functional-framework');
const config = require('getconfig');

ff.addNewFunctionalTest({
  testName: 'Returns 404',
  httpMethod: 'GET',
  routePath: 'not-found',
  extraHeaders: {
    api_key: config.api.key // eslint-disable-line camelcase
  },
  body: null,
  expectedStatusCode: 404,
  bodyValidator: null
});
