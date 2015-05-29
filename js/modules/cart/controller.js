(function() {
    'use strict';
    // the storeController contains two objects:
    // - store: contains the product list
    // - cart: the shopping cart object
    // - detailsprod: contains the details product
    window['storeApp'].controller('CartController', ['$scope', '$routeParams', 'CartService','ProductService', function ($scope, $routeParams, CartService,ProductService) {
        // get store and cart from service
        $scope.products = [];
        $scope.store = [];
        $scope.cart = CartService;
        $scope.vouchers = [];
        $scope.voucher = 'fiveoff';

        var getNewVouchers = function(){
            CartService.getVouchers().then(function(response) {
                $scope.vouchers = response.result.data;
                $scope.checkCode($scope.voucher);
                window['vouchers'] = $scope.vouchers;
            });
        };

        if(typeof window['vouchers'] === "undefined") {  getNewVouchers(); }else{ $scope.vouchers = window['vouchers']; }

        $scope.checkCode = function(voucher){
            if(CartService.getTotalPrice() === 0){
                alert(' Cart Empty ! Please Apply the discount after purchase.');
                CartService.resetDiscount();
            }else{
                var authenticateVoucher = CartService.authDiscountCode(voucher,$scope.vouchers);
                if(authenticateVoucher === true){
                    $scope.resultClass = { 'mainDiv' : 'has-success', 'span' : 'glyphicon-ok' };
                }else{
                    alert('Invalid Code Please Try Again !');
                    $scope.resultClass = { 'mainDiv' : 'has-error', 'span' : 'glyphicon-remove' };
                }
            }
        };

        // enable PayPal checkout
        // note: the second parameter identifies the merchant; in order to use the
        // shopping cart with PayPal, you have to create a merchant account with
        // PayPal. You can do that here:
        // https://www.paypal.com/webapps/mpp/merchant
        CartService.addCheckoutParameters("PayPal", "contact@vipintanna.com");
    }]);
})();