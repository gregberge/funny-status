var expect = require('chai').expect;
var st = require('../lib/status');

describe('Status', function () {
  describe('#getChange', function () {
    it('should return up if only the last entry is down', function () {
      var history = ['up', 'up', 'up', 'up', 'up', 'down'];
      var change = st.getChange(history);
      expect(change).to.equal('up');
    });

    it('should return down if only the last entry is up', function () {
      var history = ['down', 'down', 'down', 'down', 'down', 'up'];
      var change = st.getChange(history);
      expect(change).to.equal('down');
    });

    it('should return false else', function () {
      var history = ['down', 'down', 'down', 'down', 'up', 'up'];
      var change = st.getChange(history);
      expect(change).to.be.false;
    });
  });
});