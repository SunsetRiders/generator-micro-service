const Promise = require('bluebird');

const framework  = require('./functional-framework');
const runnerConfigs = require('./runner-configs');

const logger = require('../../lib/logger').default;
const rp = require('request-promise');

const Api = require('../../lib/api');
const api = Api.instance();

describe('Funcional Tests', () => {
  before(done => {
    api.start(done);
  });

  after(done => {
    api.stop(done);
  });

  // Import tests, as specified on the config file...
  runnerConfigs.testFilesToRun.forEach(testFileToAdd => {
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
            'This request is being sent and we expect a ' + testData.expectedStatusCode + ':',
            '\n\n\t',
            framework.generateCurl(request),
            '\n'
          );

          return Promise.resolve(request)
            .then(rp)
            .catch(errorResponse => errorResponse)
            .tap(response => {
              framework.lastResponse = response;
              return framework.verifyStatusCode(response.statusCode, testData.expectedStatusCode);
            })
            .then(response => {
              if (testData.bodyValidator) {
                try {
                  let body = response.body || response.error;

                  // Try to parse
                  try {
                    body = JSON.parse(body);
                  } catch (error) {
                    // It's probably already parsed
                  }

                  return testData.bodyValidator(body);
                } catch (error) {
                  return Promise.reject(error);
                }
              }
            })
            .catch(
              error => framework.prettifyError(
                testData.expectedStatusCode,
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
