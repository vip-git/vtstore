(function() {
    'use strict';

    // You need to use require js to get this working properly
    /*********************************************
     * Things to do : *
     * ------------------------------------------
     * Add require js integration to the project.
     * Add grunt/gulp/npm support to the project.
     * Change folder structure to follow as below :
     *    - App.js (to have main app related info)
     *    - Controller.js (to have controller related info)
     *    - Services.js (to have services related info)
     *    - Directives.js (to have directives related info)
     * * */

    // App Module: the name vtstore matches the ng-app attribute in the main <html> tag
    // the route provides parses the URL and injects the appropriate partial page
    window['storeApp'] = angular.module('vtstore', ['ngRoute', 'ngAnimate']).
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/store', {
                    templateUrl: 'partials/store.htm',
                    controller: 'StoreController'
                }).
                when('/products/:productCode', {
                    templateUrl: 'partials/product.htm',
                    controller: 'ProductController'
                }).
                when('/cart', {
                    templateUrl: 'partials/cart.htm',
                    controller: 'CartController'
                }).
                otherwise({
                    redirectTo: '/store'
                });
        }]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
    window['storeApp'].filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };
    });
})();