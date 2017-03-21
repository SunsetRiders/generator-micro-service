const logger = require('./logger').default;

/**
 * Every error throw by any route method on the API will be parsed
 * by this middlware function
 *
 * @param {Error} err when we receive an exception
 * @param {Request} req The ExpressJS request object
 * @param {Response} res The ExpressJS response object
 * @param {Next} next The ExpressJS next object
 *
 * @return {null} nothing important
 */
module.exports = function(err, req, res, next) {
  let status = err.status || 500;

  let printData = 'genericErrorHandler ... \n';

  printData += '\n --- Request --- \n';
  printData += JSON.stringify({
    httpVersion: req.httpVersion,
    method:      req.method,
    url:         req.url,
    originalUrl: req.originalUrl,
    headers:     req.headers,
    query:       req.query,
    params:      req.params,
    body:        req.body
  }, null, 2);

  printData += '\n --- Error --- \n';
  printData += JSON.stringify(err, null, 2) + '\n';

  logger.debug(printData);

  if (err.errors) {
    return res.status(status).json({
      errors: err.errors
    });
  }

  return res.status(status).json({
    errors: [
      {
        message: err.message
      }
    ]
  });
};
