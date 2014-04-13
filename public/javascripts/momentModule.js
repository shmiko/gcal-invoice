angular.module('momentjs', [])
    .filter('momentUtc', function () {
        return function(obj, format) {
            // {{ '2014-04-12T08:15:30Z' | moment:'MMM D, YYYY' }}
            if (angular.isString(obj)) {
                return moment(obj, 'YYYY-MM-DDTHH:mm:ssZ').format(format);
            }
        };
    })
    .filter('moment', function() {
        return function(obj) {
            // {{ '2014-04-12' | moment:'YYYY-MM-DD' }}
            // {{ '2014-04-12' | moment:'YYYY-MM-DD':'MMM D, YYYY' }}
            if (angular.isString(obj)) {
                if (arguments.length === 2) {
                    return moment(obj, arguments[1]).format();
                }
                return moment(obj, arguments[1]).format(arguments[2]);
            }
            // {{ dateObject | moment:'YYYY-MM-DD' }}
            // {{ object | moment:'YYYY-MM-DD' }}
            // {{ array | moment:'YYYY-MM-DD' }}
            if (angular.isDate(obj) || angular.isArray(obj) || angular.isObject(array)) {
                return moment(obj).format(arguments[1]);
            }
        };
    });
