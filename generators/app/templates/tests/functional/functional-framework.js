const Api    = require('../../lib/api');
const api    = Api.instance();

const config     = require('getconfig');
const fmwConfigs = require('./framework-configs');

const rp = require('request-promise');

const logger        = require('../../lib/logger').default;
const curlGenerator = require('../../lib/generate-curl');
const util          = require('util');

require('collections/shim-array');
require('collections/listen/array-changes');

const Dict = require('collections/dict');

// Framework
let framework = {
  apiBase: `http://${config.api.host}:${config.api.port}/${config.api.version}`,
  lastResponse: null,

  testFilesToRun: [],
  testsData: [],

  dataStorage: new Dict()
};

// Public Methods
framework.addNewFunctionalTest = function(
  testName,
  httpMethod,
  routePath,
  extraHeaders,
  body,
  expectedStatusCode,
  bodyValidator
) {
  // Sanity
  // TODO

  testsData.push({
    testName,
    httpMethod,
    routePath,
    extraHeaders,
    body,
    expectedStatusCode,
    bodyValidator
  });
};

framework.storeData = function(key, value) {
  dataStorage.add(key, value);
};

framework.getData = function(key) {
  dataStorage.get(key);
};

// Private Methods
const generateCurl = function(request) {
  return curlGenerator(request.mesthod, request.headers, request.body, request.uri);
};

const verifyStatusCode = function(retrievedStatusCode, expectedStatusCode) {
  if (retrievedStatusCode === expectedStatusCode) {
    return Promise.resolve();
  }

  const error = new Error('Expecting', expectedStatusCode, 'but got', retrievedStatusCode);
  return Promise.reject(error);
};

const prettifyError = function(
  expectedStatusCode,
  request,
  response,
  error
) {
  let newErrorMsg = '--- Test Error Details --- \n\n';

  newErrorMsg += 'Expecting Status Code: ' + expectedStatusCode + '\n';
  newErrorMsg += 'Retrieved Status Code: ' + response.statusCode + '\n\n';

  newErrorMsg += 'Request details: \n';
  newErrorMsg += '\t' + util.inspect(request) + '\n\n';

  newErrorMsg += 'Received response: \n';
  newErrorMsg += '\t' + util.inspect(response) + '\n\n';

  newErrorMsg += 'Used CURL: \n';
  newErrorMsg += '\t' + generateCurl(request) + '\n\n';

  newErrorMsg += 'Error: \n';
  newErrorMsg += '\t' + error + '\n\n';

  newErrorMsg += '-------------------------- \n';

  const newError = new Error(newErrorMsg);
  return Promise.reject(newError);
};

// Mocha will run this
describe('Funcional Tests', () => {
  before(done => {
    api.start(done);
  });

  after(done => {
    api.stop(done);
  });

  // Import tests, as specified on the config file...
  fmwConfigs.testFilesToRun.forEach(testFileToAdd => {
    require('./' + testFileToAdd);

    // Dinamically construct the tests
    describe(testFileToAdd, () => {
      while (framework.testsData.length > 0) {
        let testData = framework.testsData.shift();

        it(testData.testName, function() {
          let request = {
            uri: framework.apiBase + '/' + testData.routePath,
            method: testData.httpMethod,
            resolveWithFullResponse: true
          };

          if (testData.extraHeaders) {
            request.headers = testData.extraHeaders;
          }

          if (testData.body) {
            request.body = testData.body;
            request.json = true;
          }

          logger.info('\n\t',
            'This request is being sent and we expect a ' + expectedStatusCode + ':',
            '\n\n\t',
            generateCurl(request),
            '\n'
          );

          return rp(request)
            .tap(
              response => verifyStatusCode(response.statusCode, expectedStatusCode)
            )
            .tap(
              response => framework.lastResponse = response
            )
            .then(response => {
              if (bodyValidator) {
                try {
                  return bodyValidator(response.body || response.error);
                } catch (error) {
                  return Promise.reject(error);
                }
              }
            })
            .catch(
              error => prettifyError(
                expectedStatusCode,
                request,
                framework.lastResponse,
                error
              )
            );
        });
      }
    });
  });
});

module.exports = framework;
