/**
 * @param {Request} req express request
 * @param {Response} res express response
 * @return {Object} the api documentation
 */
function getApiDocumentation(req, res) {
  return res.json(req.apiDoc);
}

getApiDocumentation.apiDoc = {
  operationId: 'getApiDocumentation',
  description: 'Returns the api documentation',
  parameters: [],
  responses: {
    200: {
      description: 'api documentation',
      schema: {
        type: 'object'
      }
    },
    401: {
      $ref: '#/responses/Unauthorized'
    },
    500: {
      $ref: '#/responses/InternalServerError'
    }
  }
};

module.exports = {
  GET: getApiDocumentation
};
