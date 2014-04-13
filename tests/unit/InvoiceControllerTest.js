describe('Invoice Controller', function() {
    var scope;
    var controller;

    beforeEach(angular.mock.module('gcalInvoice'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('InvoiceController', { $scope: scope });
    }));

    it('should define the invoice object, its update method and selected events', function() {
        assert.isObject(scope.invoice);
        assert.isFunction(scope.updateInvoice);
        assert.isArray(scope.selectedEvents);
    });

    it("should set the default invoice hourly rate between 0.00 and 1000.00", function() {
        assert.isNotNull(scope.invoice.hourlyRate);
        assert(0.00 <= scope.invoice.hourlyRate && scope.invoice.hourlyRate <= 1000.00);
    });

    it('has no invoice line items when there are no selected events', function() {
        scope.selectedEvents = [];
        scope.updateInvoice();
        assert.lengthOf(scope.selectedEvents, 0);
        assert.isArray(scope.invoice.lineItems);
        assert.lengthOf(scope.invoice.lineItems, 0);
    });

    it('has 1 invoice line item when there is 1 selected event', function() {
        assert.lengthOf(scope.selectedEvents, 1);
        assert.lengthOf(scope.invoice.lineItems, 1);
    });

    it('has 1 invoice line item when there are 2 selected events that happen on the same day', function() {
        assert.lengthOf(scope.selectedEvents, 2);
        assert.lengthOf(scope.invoice.lineItems, 1);
    });

    it('has 2 invoice line items when there are 3 selected events and 2 of them occur on the same day', function() {
        assert.lengthOf(scope.selectedEvents, 3);
        assert.lengthOf(scope.invoice.lineItems, 2);
    });

    it('splits a selected event that takes place over 3 days into 3 invoice line items', function() {
        assert.lengthOf(scope.selectedEvents, 3);
        assert.lengthOf(scope.invoice.lineItems, 3);
    });
});
