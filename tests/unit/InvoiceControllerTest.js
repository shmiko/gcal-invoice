/* global angular inject assert moment sinon */
describe('Invoice Controller', function() {
  var scope;
  var controller;

  beforeEach(angular.mock.module('gcalInvoice'));
  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller('InvoiceController', {$scope: scope});
  }));
  
  /**
   * @see [Use Case](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-logins-and-sees-calendar-selection)
   */
  it('shows Google login when route is for login', inject(function($location, $window, $controller) {
    sinon.spy($window, 'setTimeout');
    $location.path('/login/');
    scope.$apply();
    controller = $controller('InvoiceController', {$scope: scope});
    assert.ok($window.setTimeout.calledOnce);
    $window.setTimeout.restore();
  }));

  it('should define the invoice object, its update method and selected events',
  function() {
    assert.isObject(scope.invoice);
    assert.isFunction(scope.updateInvoice);
    assert.isArray(scope.selectedEvents);
  });

  it('should set the default invoice hourly rate between 0.00 and 1000.00',
  function() {
    assert.isNotNull(scope.invoice.hourlyRate);
    assert.isTrue(0.00 <= scope.invoice.hourlyRate &&
      scope.invoice.hourlyRate <= 1000.00);
  });

  it('should convert Google Calendar event dates into moment' +
  ' objects', function() {
    var momentObj = scope.getMomentFromGCalDateTime('2014-04-11T01:00:00.921Z');
    var otherMomentObj;
    var duration;
    assert.equal(momentObj.year(), 2014, 'years should be equal');
    assert.equal(momentObj.month(), 3,
      'months should be equal (they are zero-indexed)');
    assert.equal(momentObj.date(), 11, 'days should be equal');
    assert.equal(momentObj.hour(), 1,
      'hours should be equal (they are zero-indexed)');
    assert.equal(momentObj.minutes(), 0, 'minutes should be equal');
    assert.equal(momentObj.seconds(), 0, 'second should be equal');
    assert.equal(momentObj.milliseconds(), 0,
      'milliseconds should not be parsed');

    otherMomentObj = scope.getMomentFromGCalDateTime(
      '2014-04-11T02:00:00.921Z');
    assert.equal(otherMomentObj.hour(), 2,
      'hours should be equal (they are zero-indexed)');

    duration = moment.duration(otherMomentObj.diff(momentObj));
    assert.equal(duration.asHours(), 1, 'should calculate hour difference');
  });

  /**
   * @see [Use Case](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-can-select-calendar-events-and-see-them-displayed-as-a-table)
   */
  it('lists all event ids that were used in creating the invoice', function() {
    var eventId = '12938kajsda90w8deqw2e';
    var event = {
      id: eventId,
      summary: 'work',
      description: 'stuff',
      start: {dateTime: '2014-04-11T01:00:00.921Z'},
      end: {dateTime: '2014-04-11T02:00:00.921Z'}
    };
    scope.selectedEvents = [event];
    assert.property(scope.invoice, 'eventIds');
    assert.lengthOf(scope.invoice.eventIds, 0);
    scope.updateInvoice();
    assert.lengthOf(scope.invoice.eventIds, 1);
    assert.equal(scope.invoice.eventIds[0], eventId);
  });

  it('does not add events that are already in the invoice', function() {
    var event = {
      id: '12938kajsda90w8deqw2e',
      summary: 'work',
      description: 'stuff',
      start: {dateTime: '2014-04-11T01:00:00.921Z'},
      end: {dateTime: '2014-04-11T02:00:00.921Z'}
    };
    scope.selectedEvents = [];
    scope.updateInvoice();
    assert.lengthOf(scope.invoice.eventIds, 0);

    scope.addEventToSelected(event);
    assert.lengthOf(scope.invoice.eventIds, 1);

    scope.addEventToSelected(event);
    assert.lengthOf(scope.invoice.eventIds, 1);
  });

  /**
   * @see [Use Case](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-can-select-calendar-events-and-see-them-displayed-as-a-table)
   */
  it('removes events from the events list when they are selected', function() {
    var event = {
      summary: 'work',
      description: 'stuff',
      start: {dateTime: '2014-04-11T01:00:00.921Z'},
      end: {dateTime: '2014-04-11T02:00:00.921Z'}
    };
    scope.events = [event];
    scope.selectedEvents = [];
    assert.lengthOf(scope.events, 1, 'one event should exist');
    assert.lengthOf(scope.selectedEvents, 0, 'no events have been selected');

    scope.addEventToSelected(event);
    assert.lengthOf(scope.events, 0, 'no more events to select from');
    assert.lengthOf(scope.selectedEvents, 1, 'one selected event');
  });

  /**
   * @see [Use Case](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-can-select-calendar-events-and-see-them-displayed-as-a-table)
   */
  it('updates each invoice line item\'s total when the line item\'s discount' +
  ' or hourly rate changes', function() {
    scope.selectedEvents = [{
      summary: 'work',
      description: 'stuff',
      start: {dateTime: '2014-04-11T01:00:00.921Z'},
      end: {dateTime: '2014-04-11T02:00:00.921Z'}
    }];
    scope.updateInvoice();
    scope.invoice.lineItems[0].hourlyRate = 20.0;
    scope.invoice.lineItems[0].discount = 5;
    scope.updateInvoiceAmounts();
    assert.equal(scope.invoice.lineItems[0].hoursWorked, 1.0);
    assert.equal(scope.invoice.lineItems[0].hourlyRate, 20.0);
    assert.equal(scope.invoice.lineItems[0].discount, 5);
    assert.equal(scope.invoice.lineItems[0].total,
      1.0 * 20.0 * (1.0 - (5 / 100.0)));
  });

  it('has no invoice line items when there are no selected events', function() {
    scope.selectedEvents = [];
    scope.updateInvoice();
    assert.lengthOf(scope.selectedEvents, 0);
    assert.isArray(scope.invoice.lineItems);
    assert.lengthOf(scope.invoice.lineItems, 0);
  });

  it('has 1 invoice line item when there is 1 selected event', function() {
    scope.selectedEvents = [{
      summary: 'work',
      description: 'stuff',
      start: {dateTime: '2014-04-11T01:00:00.921Z'},
      end: {dateTime: '2014-04-11T02:15:00.921Z'}
    }];
    scope.updateInvoice();
    assert.lengthOf(scope.selectedEvents, 1);
    assert.lengthOf(scope.invoice.lineItems, 1);
    var lineItem = scope.invoice.lineItems[0];
    assert.propertyVal(lineItem, 'date', '2014-04-11');
    assert.propertyVal(lineItem, 'description', 'stuff');
    assert.propertyVal(lineItem, 'hoursWorked', 1.25);
    assert.propertyVal(lineItem, 'hourlyRate', scope.invoice.hourlyRate);
    assert.propertyVal(lineItem, 'discount', 0.0);
    assert.propertyVal(lineItem, 'total', 1.25 * scope.invoice.hourlyRate);
  });

  it('has 1 invoice line item when there are 2 selected events that happen on' +
  ' the same day', function() {
    scope.selectedEvents = [
      {
        summary: 'work',
        description: 'stuff',
        start: {dateTime: '2014-02-24T01:00:00.921Z'},
        end: {dateTime: '2014-02-24T02:15:00.921Z'}
      },
      {
        summary: 'work',
        description: 'stuff',
        start: {dateTime: '2014-02-24T13:00:00.921Z'},
        end: {dateTime: '2014-02-24T13:15:00.921Z'}
      }
    ];

    scope.updateInvoice();
    assert.lengthOf(scope.selectedEvents, 2);
    assert.lengthOf(scope.invoice.lineItems, 1);

    var lineItem = scope.invoice.lineItems[0];
    assert.propertyVal(lineItem, 'date', '2014-02-24');
    assert.propertyVal(lineItem, 'description', 'stuff');
    assert.propertyVal(lineItem, 'hoursWorked', 1.25 + 0.25);
    assert.propertyVal(lineItem, 'hourlyRate', scope.invoice.hourlyRate);
    assert.propertyVal(lineItem, 'discount', 0.0);
    assert.propertyVal(lineItem, 'total',
      scope.invoice.hourlyRate * (1.25 + 0.25));
  });

  it('has 2 invoice line items when there are 3 selected events and 2 of them' +
  ' occur on the same day', function() {
    scope.selectedEvents = [
      {
        summary: 'same day',
        description: 'stuff',
        start: {dateTime: '2014-02-24T01:00:00.921Z'},
        end: {dateTime: '2014-02-24T02:15:00.921Z'}
      },
      {
        summary: 'same day',
        description: 'stuff',
        start: {dateTime: '2014-02-24T13:00:00.921Z'},
        end: {dateTime: '2014-02-24T13:15:00.921Z'}
      },
      {
        summary: 'another day',
        description: 'other stuff',
        start: {dateTime: '2015-01-01T01:01:00.111Z'},
        end: {dateTime: '2015-01-01T08:01:00.111Z'}
      }
    ];
    scope.updateInvoice();
    assert.lengthOf(scope.selectedEvents, 3);
    assert.lengthOf(scope.invoice.lineItems, 2);
  });

  it.skip('splits a selected event that takes place over 3 days into 3 invoice ' +
  'line items', function() {
    // TODO
    assert.lengthOf(scope.selectedEvents, 3);
    assert.lengthOf(scope.invoice.lineItems, 3);
  });
  
  /**
   * @see [Use Case: select calendar](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-selects-a-calendar-and-sees-event-listing)
   * @see [Use Case: filter events](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-can-filter-event-listing-by-two-dates-start-date-and-end-date)
   */
  describe('select calendar and filter events', function() {
    it('sets the end date filter to the start date filter', function() {
      scope.startYear = 2009;
      scope.startMonth = 'December';
      scope.selectCalendarAndFilterEvents();
      assert.equal(scope.endYear, 2009);
      assert.equal(scope.endMonth, 'December');
    });

    it('does nothing when the end date filter is set', function() {
      scope.startYear = 2015;
      scope.startMonth = 'February';
      scope.endYear = 2016;
      scope.endMonth = 'April';
      scope.selectCalendarAndFilterEvents();
      assert.equal(scope.startYear, 2015);
      assert.equal(scope.startMonth, 'February');
      assert.equal(scope.endYear, 2016);
      assert.equal(scope.endMonth, 'April');
    });
    
    it('sets the end year only if it is earlier than the start ' +
    'year or when end year is null', function() {
      scope.startYear = 2015;
      scope.endYear = 2014;
      scope.selectCalendarAndFilterEvents();
      assert.equal(scope.startYear, 2015);
      assert.equal(scope.endYear, 2015);
      
      scope.startYear = 2015;
      scope.endYear = null;
      scope.selectCalendarAndFilterEvents();
      assert.equal(scope.startYear, 2015);
      assert.equal(scope.endYear, 2015);
    });
    
    it('sets the end month to the start month when end month and year are ' +
    'earlier then the start month and year', function() {
      scope.startYear = 2015;
      scope.startMonth = 'January';
      scope.endYear = 2014;
      scope.endMonth = 'December';
      scope.selectCalendarAndFilterEvents();
      assert.equal(scope.startYear, 2015);
      assert.equal(scope.startMonth, 'January');
      assert.equal(scope.endYear, 2015);
      assert.equal(scope.endMonth, 'January');
    });
    
    it('calls the Google API for listing events',
    inject(function($q, googleCalendar) {
      googleCalendar.listEvents = sinon.stub();
      googleCalendar.listEvents.returns($q.when(null));
      scope.startYear = 2015;
      scope.startMonth = 'January';
      scope.endYear = 2016;
      scope.endMonth = 'December';
      scope.selectedCalendar = {id:999};
      scope.selectCalendarAndFilterEvents();
      assert.ok(googleCalendar.listEvents.calledOnce);
      googleCalendar.listEvents = undefined;
    }));
  });
  
  /**
   * @see [Use Case](https://github.com/omouse/gcal-invoice/wiki/Software-Requirements-Specification#user-logins-and-sees-calendar-selection)
   */
  it('lists all calendars after google calendar is loaded',
  inject(function($q, googleCalendar) {
    googleCalendar.listCalendars = sinon.stub();
    googleCalendar.listCalendars.returns($q.when(null));
    scope.$broadcast('googleCalendar:loaded');
    scope.$apply();
    assert.ok(googleCalendar.listCalendars.calledOnce);
    googleCalendar.listCalendars = undefined;
  }));
});
