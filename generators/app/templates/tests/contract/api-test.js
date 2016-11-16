const Api     = require('../../lib/api');
const api     = Api.instance();
const config  = require('getconfig');
const expect  = require('chai').expect;
const rp      = require('request-promise');
const apiBase = `http://${config.api.host}:${config.api.port}/${config.api.version}`;

let response;

const requestSuccess = function(request) {
  return function(done) {
    rp(request).then(_result => {
      response = _result;
    }).then(done).catch(err => {
      done(err);
    });
  };
};

const requestFail = function(request) {
  return function(done) {
    rp(request).catch(_result => {
      response = _result;
    }).then(done);
  };
};

describe('API', () => {
  before(done => {
    api.start(done);
  });
  after(done => {
    api.stop(done);
  });
  describe('GET /api-docs', () => {
    const request = {
      uri: `${apiBase}/api-docs`,
      method: 'GET',
      headers: {
        api_key: config.api.key // eslint-disable-line camelcase
      },
      json: true
    };
    before(requestSuccess(request));
    it('Retrieve the API documentation', function() {
      expect(response.info.version).to.equal('1.0.0');
    });
  });
  describe('GET /not-found-route', () => {
    const request = {
      uri: `${apiBase}/not-found`,
      method: 'GET',
      headers: {
        api_key: config.api_key // eslint-disable-line camelcase
      },
      json: true,
      resolveWithFullResponse: true
    };
    before(requestFail(request));
    it('Returns 404', function() {
      expect(response.statusCode).to.equal(404);
    });
  });
});
