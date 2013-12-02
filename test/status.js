var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var status = rewire('../lib/status');
var github = require('../lib/services/github');
var npm = require('../lib/services/npm');

require('chai').use(require('sinon-chai'));

describe('Status', function () {
  describe('#ping', function () {
    var play;

    beforeEach(function () {
      play = sinon.stub();
      status.__set__('play', play);
      sinon.stub(github, 'up').yields();
      sinon.stub(npm, 'up').yields();
    });

    afterEach(function () {
      github.up.restore();
      npm.up.restore();
      status.stop();
    });

    it('should ping each services', function () {
      status.ping();

      expect(github.up).to.be.called;
      expect(npm.up).to.be.called;
    });

    it('should play sound once if status is up, then down', function () {
      github.status = 'up';
      status.ping();

      github.status = 'down';
      status.ping();

      expect(play).to.be.calledOnce;
      expect(play).to.be.calledWithMatch(sinon.match(/mario-die.mp3/));
    });

    it('should play sound once if status is down, then up', function () {
      github.status = 'down';
      status.ping();

      github.status = 'up';
      status.ping();

      expect(play).to.be.calledOnce;
      expect(play).to.be.calledWithMatch(sinon.match(/mario-stage-cleared.mp3/));
    });
  });
});