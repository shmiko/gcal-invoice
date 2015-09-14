/* global angular inject assert */
describe('Moment Module', function() {
  beforeEach(angular.mock.module('momentjs'));

  describe('momentUtc', function() {
    var momentUtc;
    beforeEach(inject(function(_momentUtcFilter_) {
      momentUtc = _momentUtcFilter_;
    }));
    it('handles UTC timestamp format including timezone', function() {
      assert.equal(momentUtc('2014-04-12T08:15:30Z', 'MMM D, YYYY'),
        'Apr 12, 2014');
    });
  });
  
  describe('moment', function() {
    var moment;
    beforeEach(inject(function(_momentFilter_) {
      moment = _momentFilter_;
    }));
    it('parses a string correctly', function() {
      assert.equal(moment('2014-04-12', 'YYYY-MM-DD'),
        '2014-04-12T00:00:00+00:00');
    });
    it('parses a string and transforms correctly', function() {
      assert.equal(moment('2014-04-12', 'YYYY-MM-DD', 'MMM D, YYYY'),
        'Apr 12, 2014');
    });
    it('can accept a Date object', function() {
      var date = new Date(2014, 2, 9);
      assert.equal(moment(date, 'YYYY-MM-DD'), '2014-03-09');
    });
    it('can accept an object', function() {
      var date = {day: 10, month: 3, year: 2007};
      assert.equal(moment(date, 'YYYY-MM-DD'), '2007-04-10');
    });
    it('can accept an array', function() {
      var date = [2008, 0, 12];
      assert.equal(moment(date, 'YYYY-MM-DD'), '2008-01-12');
    });
  });
});