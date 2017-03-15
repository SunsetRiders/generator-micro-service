/**
 * Route that always returns 200
 *
 * @param {Request} req - Express.js request object
 * @param {Response} res - Express.js response object
 */
function health(req, res) {
  res.status(200).end();
}

health.apiDoc = {
  summary: 'System Health Check',
  description: 'This route always returns 200 OK with no body. Used to provided a ping like service to confirm that ' +
    'this service is running.',
  security: [],
  responses: {
    200: {
      schema: {},
      description: 'Success'
    }
  }
};

module.exports = {
  GET: health
};
