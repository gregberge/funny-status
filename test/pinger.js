var expect = require('chai').expect;
var sinon = require('sinon');
var Pinger = require('../lib/pinger');

require('chai').use(require('sinon-chai'));

describe('Pinger', function () {
  var pinger;

  beforeEach(function () {
    pinger = new Pinger();
  });

  describe('#add', function () {
    it('should add service and history entries', function () {
      pinger.add('github', function () {});

      expect(pinger.services).to.have.property('github');
      expect(pinger.history).to.have.property('github');
    });
  });

  describe('#ping', function () {
    var github, npm;

    beforeEach(function () {
      github = sinon.stub().yields();
      npm = sinon.stub().yields(true);
      pinger.add('github', github);
      pinger.add('npm', npm);
      sinon.stub(pinger, 'purge');
    });

    it('should ping each services', function (done) {
      pinger.ping(function () {
        expect(github).to.be.called;
        expect(npm).to.be.called;
        expect(pinger.history.github).to.deep.equal([ 'up' ]);
        expect(pinger.history.npm).to.deep.equal([ 'down' ]);
        expect(pinger.purge).to.be.called;
        done();
      });
    });
  });

  describe('#purge', function () {
    beforeEach(function () {
      pinger.history = {};
      pinger.history.github = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    });

    it('should keep 10 first items', function () {
      pinger.purge();
      expect(pinger.history.github).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });
});