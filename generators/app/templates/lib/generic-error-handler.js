const logger = require('./logger').defaultLogger;

/**
 * Every error throw by any route method on the API will be parsed
 * by this middlware function
 * @param {Error} err when we receive an exception
 * @param {Request} req The ExpressJS request object
 * @param {Response} res The ExpressJS response object
 * @param {Next} next The ExpressJS next object
 */
module.exports = function(err, req, res, next) {
  let status = err.status || 500;

  logger.info('genericErrorHandler', JSON.stringify({
    request: {
      url: req.url,
      headers: req.headers,
      method: req.method,
      httpVersion: req.httpVersion,
      originalUrl: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body
    },
    error: {
      message: err.message || JSON.stringify(err)
    }
  }));

  if (err.errors) {
    res.status(status).json({errors: err.errors});
    return;
  }

  res.status(status).json(
    {errors: [
      {message: err.message}]}
  );
};
