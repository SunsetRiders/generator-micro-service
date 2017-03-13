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
  summary: 'System health',
  description: "This route always returns 200, empty. Used by the load balancer",
  security: [],
  responses: {
    200: {
      schema: {},
      description: "Success"
    }
  }
};

module.exports = {
  GET: health
};
