describe('Invoice Controller', function() {
    var scope;
    var controller;

    beforeEach(angular.mock.module('gcalInvoice'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('InvoiceController', { $scope: scope });
    }));

    it('the invoice and its update method should be defined', function() {
        assert.isObject(scope.invoice);
        assert.isFunction(scope.updateInvoice);
    });

    it("the invoice hourly rate should be between 0.00 and 1000.00", function() {
        assert.isNotNull(scope.invoice.hourlyRate);
        assert(0.00 <= scope.invoice.hourlyRate && scope.invoice.hourlyRate <= 1000.00);
    });

    it('the invoice has no line items when there are no selected events', function() {
        scope.selectedEvents = [];
        scope.updateInvoice();
        assert.lengthOf(scope.selectedEvents, 0);
        assert.isArray(scope.invoice.lineItems);
        assert.lengthOf(scope.invoice.lineItems, 0);
    });
});
