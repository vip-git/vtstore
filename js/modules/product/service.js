// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
window['storeApp'].service("ProductService",["$http", function ($http) {
    var thisService = {
        getProducts : function(t) {
            return $http.get('data/products.json').then(function(response) {
                window['products'] = response.data;
                return {
                    "result": response,
                    "error": false
                };
            }, function() {
                return {
                    "result": {},
                    "error": true
                };
            });
        },
        getProduct : function(code,products){
            if(typeof products !== "undefined"){
                for (var i = 0; i < products.length; i++) {
                    if (products[i].code === code){ return products[i]; }
                }
            }
            return null;
        }
    };

    return thisService;
}]);
