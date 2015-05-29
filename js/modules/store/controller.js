(function() {
    'use strict';
    window['storeApp'].controller('StoreController',['$scope', '$filter','CartService', 'ProductService','$location', function ($scope, $filter,CartService,ProductService,$location) {
        $scope.isActive = false;
        $scope.date = new Date();
        $scope.selected = 'cbp-vm-grid';
        $scope.sections = [
            { name: 'Grid View', class: "cbp-vm-grid" },
            {name: 'List View', class: "cbp-vm-list"}];

        $scope.setMaster = function (section) {
            $scope.selected = section.class;
            $scope.isActive = !$scope.isActive;
        };

        $scope.go = function ( path ) {
            $location.path( path );
        };

        $scope.getNewProducts = function(){
            ProductService.getProducts().then(function(response) {
                $scope.products = response.result.data;
            });
        };

        $scope.isSelected = function (section) {
            return $scope.selected === section;
        };

        if(typeof window['products'] === "undefined") { $scope.products = []; $scope.getNewProducts(); }else{
            $scope.products = window['products'];
        }

        $scope.cart = CartService;

        $scope.currentPage = 0;
        $scope.pageSize = 9;
        $scope.numberOfPages = Math.ceil($scope.products.length / $scope.pageSize);

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.pagedItems = [];

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        $scope.search = function (name) {
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[name], $scope.query)){ return true; }
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.myFilter = function (column, category) {
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[column], category)){ return true; }
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.pageSize === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)].push($scope.filteredItems[i]);
                }
            }
        };


        $scope.$watch('products', function(response){

            $scope.numberOfPages = Math.ceil($scope.products.length / $scope.pageSize);
            // functions have been describe process the data for display
            $scope.myFilter();
            $scope.search();
        });

    }]);
})();