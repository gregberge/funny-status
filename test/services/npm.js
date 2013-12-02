var expect = require('chai').expect;
var nock = require('nock');
var npm = require('../../lib/services/npm');

describe('Npm', function () {
  describe('#up', function () {
    var endpoint = 'http://registry.npmjs.org';

    it('should ping service', function (done) {
      nock(endpoint).get('/').reply(200, { db_name: 'registry' });
      npm.up(function (err) {
        if (err) return done(err);
        expect(npm.status).to.equal('up');
        done();
      });
    });

    it('should return an error if status is not 200', function (done) {
      nock(endpoint).get('/').reply(500);
      npm.up(function (err) {
        if (err) return done(err);
        expect(npm.status).to.equal('down');
        done();
      });
    });
  });
});