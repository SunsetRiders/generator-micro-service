let frameworkConfigs = {};

// Tests are ran in serie, in the specified order you provide here
frameworkConfigs.testFilesToRun = [
  'get-api-docs-tests.js',
  'get-not-found-tests.js',
  'get-health-tests.js'
];

module.exports = frameworkConfigs;
