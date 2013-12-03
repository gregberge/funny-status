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
    });

    afterEach(function () {
      github.up.restore();
      npm.up.restore();
      status.stop();
    });

    it('should ping each services', function () {
      sinon.stub(github, 'up').yields();
      sinon.stub(npm, 'up').yields();

      status.ping();

      expect(github.up).to.be.called;
      expect(npm.up).to.be.called;
    });

    it('should play sound once if status is up, then down', function () {
      sinon.stub(github, 'up').yields(true);
      sinon.stub(npm, 'up').yields(true);

      status.ping();

      github.up.restore();
      sinon.stub(github, 'up').yields(false);

      status.ping();

      expect(play).to.be.calledOnce;
      expect(play).to.be.calledWithMatch(sinon.match(/mario-die.mp3/));
    });

    it('should play sound once if status is down, then up', function () {
      sinon.stub(github, 'up').yields(false);
      sinon.stub(npm, 'up').yields(true);

      status.ping();

      github.up.restore();
      sinon.stub(github, 'up').yields(true);

      status.ping();

      expect(play).to.be.calledOnce;
      expect(play).to.be.calledWithMatch(sinon.match(/mario-stage-cleared.mp3/));
    });
  });
});