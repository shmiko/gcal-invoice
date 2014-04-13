describe('Invoice Controller', function() {
    var scope;
    var controller;

    beforeEach(angular.mock.module('gcalInvoice'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('InvoiceController', { $scope: scope });
    }));

    it("should define the invoice's hourly rate", function() {
        assert.isDefined(scope.invoice);
        assert.isNotNull(scope.invoice.hourlyRate);
    });
});
