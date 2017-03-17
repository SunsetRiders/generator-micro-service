const ff     = require('./functional-framework');
const config = require('getconfig');
const expect = require('chai').expect;

ff.addNewFunctionalTest({
  testName: 'Retrieve the API Docs',
  httpMethod: 'GET',
  routePath: 'api-docs',
  extraHeaders: {
    api_key: config.api.key // eslint-disable-line camelcase
  },
  body: null,
  expectedStatusCode: 200,
  responseValidator: response => {
    expect(response.info.version).to.equal('1.0.0');
  }
});
