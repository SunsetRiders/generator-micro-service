const config = require('getconfig');

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

/**
 * It register a new functional test to be run, within a test file.
 *
 * @param {object} testData An object representing a functional test
 * @param {string} testData.testName The test name
 * @param {string} testData.httpMethod The HTTP method. 'GET', 'POST', 'HEAD', 'PATCH', 'PUT' and so on
 * @param {string} testData.routePath The crude route path, without the api/version stuff. DON'T put / in the beginnin
 * @param {object} testData.extraHeaders An object where each key = Header name and value = Header value. Can be null
 * @param {object} testData.body A javascript object to sent in the body. Can be null
 * @param {number} testData.expectedStatusCode A number, like 200
 * @param {function} testData.bodyValidator A funct that returns a Promise or throws an error when something is wrong
 */
framework.addNewFunctionalTest = function(testData) {
  // Sanity
  // TODO

  framework.testsData.push(testData);
};

/**
 * Store data globally in the framework, so each test file can share some information.
 *
 * @param {string | number} key The key to retrieve the value
 * @param {string | number | object | null | undefined} value The value to store
 */
framework.storeData = function(key, value) {
  framework.dataStorage.add(key, value);
};

/**
 * Retrieve global data saved in the framework.
 *
 * @param {string | number} key The value key you wanna retrieve
 * @return {string | number | object | null | undefined} value
 */
framework.getData = function(key) {
  return framework.dataStorage.get(key);
};

framework.generateCurl = function(request) {
  return curlGenerator(request.method, request.headers, request.body, request.uri);
};

framework.verifyStatusCode = function(retrievedStatusCode, expectedStatusCode) {
  if (retrievedStatusCode === expectedStatusCode) {
    return Promise.resolve();
  }

  const error = new Error('Expecting ' + expectedStatusCode + ' but got ' + retrievedStatusCode);
  return Promise.reject(error);
};

framework.prettifyError = function(
  expectedStatusCode,
  request,
  response,
  error
) {
  let newErrorMsg = '--- Test Error Details --- \n\n';

  newErrorMsg += '\t Request details: \n';
  newErrorMsg += '\t\t' + util.inspect(request) + '\n\n';

  newErrorMsg += '\t Received response: \n';
  newErrorMsg += '\t\t' + util.inspect(response) + '\n\n';

  newErrorMsg += '\t Used CURL: \n';
  newErrorMsg += '\t\t' + framework.generateCurl(request) + '\n\n';

  newErrorMsg += '\t Expecting Status Code: ' + expectedStatusCode + '\n';
  newErrorMsg += '\t Retrieved Status Code: ' + response.statusCode + '\n\n';

  newErrorMsg += '\t Error: \n';
  newErrorMsg += '\t\t' + error + '\n\n';

  newErrorMsg += '-------------------------- \n';

  const newError = new Error(newErrorMsg);
  return Promise.reject(newError);
};

module.exports = framework;
