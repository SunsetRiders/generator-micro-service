const expect = require('chai').expect;

describe('config', () => {
  describe('.configName', () => {
    it('loads the local.js file', () => {
      const config = require('getconfig');
      expect(config.configName).to.equal('local.js');
    });
  });
});
