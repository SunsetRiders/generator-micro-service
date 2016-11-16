/**
 * Normalize the error object returned from dropboxService.js
 * @param {Object} error That javascript Error object with our touch
 * @return {Object} to be returned to our exposed API
 */
module.exports = function(error) {
  let errors;
  let status = error.status;
  switch (status) {
    case 401:
      errors = [{
        message: 'Invalid authorization token',
        field: 'api_key'
      }];
      break;
    case 400:
    case 404:
    case 409:
      errors = [{
        message: error.message
      }];
      break;
    default: // 500
      errors = [{
        message: 'An unexpected condition prevented the service from fulfilling the request: ' + error.message
      }];
      // ensure we have the 500 in error status
      status = 500;
  }
  const normalizedError = {
    status: status,
    errors: errors
  };
  return normalizedError;
};
