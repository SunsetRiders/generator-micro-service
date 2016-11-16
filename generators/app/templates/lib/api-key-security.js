const config = require('getconfig');

module.exports = function(req, scopes, definition, cb) {
  let apiKey = req.headers[definition.name];

  if (apiKey &&  apiKey === config.api.key) {
    return cb(null, true);
  }
  const error = new Error('Invalid api_key');
  error.status = 401;
  throw error;
};
