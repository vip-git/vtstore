(function() {
    'use strict';
    // the storeController contains two objects:
    // - store: contains the product list
    // - cart: the shopping cart object
    // - productDetails: contains the details product
    window['storeApp'].controller('ProductController', ['$scope', '$routeParams', 'CartService', 'ProductService', function ($scope, $routeParams, CartService,ProductService) {

        $scope.cart = CartService;


        $scope.getNewProducts = function(){
            ProductService.getProducts().then(function(response) {
                $scope.products = response.result.data;
            });
        };

        if(typeof window['products'] === "undefined") {  $scope.getNewProducts(); }else{ $scope.products = window['products']; }

        $scope.$watch('products', function(response){
            if ($routeParams.productCode !== null) {
                $scope.product = ProductService.getProduct($routeParams.productCode,$scope.products);
            }
        });
    }]);

})();