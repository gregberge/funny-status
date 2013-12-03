var expect = require('chai').expect;
var nock = require('nock');
var github = require('../../lib/services/github');

describe('GitHub', function () {
  describe('#up', function () {
    var endpoint = 'https://status.github.com';

    it('should ping service', function (done) {
      nock(endpoint).get('/api/status.json').reply(200, { status: 'good' });
      github.up(function (up) {
        expect(up).to.be.true;
        done();
      });
    });

    it('should return an error if status is not 200', function (done) {
      nock(endpoint).get('/api/status.json').reply(500);
      github.up(function (up) {
        expect(up).to.be.false;
        done();
      });
    });
  });
});