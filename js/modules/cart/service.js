// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
window['storeApp'].service("CartService",["$http", function ($http) {
    var thisService = {
        ShoppingCart: function(t) {
            this.cartName = t;
            this.clearCart = !1;
            this.checkoutParameters = {};
            this.items = []; 
            this.loadItems();
            var e = this;
            $(window).unload(function() {
                if(e.clearCart){e.clearItems();}
                e.saveItems();
                e.clearCart = !1;
            });
        },
        fcheckoutParameters: function(t, e, a) {
            this.serviceName = t;
            this.merchantID = e;
            this.options = a;
            return this;
        },
        loadItems: function() {
            var t = null != window['localStorage'] ? window['localStorage'][this.cartName + "_items"] : null;
            this.items = [];
            if (null != t && null != JSON){
                try {
                    t = JSON.parse(t);
                    for (var e = 0; e < t.length; e++) {
                        var a = t[e];
                        if(null != a.code && null != a.name && null != a.price && null != a.stock && null != a.quantity)
                        {
                            this.items.push(a);
                        }
                    }
                } catch (i) { }
            }
        },
        saveItems : function() {
            if(null != window['localStorage'] && null != JSON){
                window['localStorage'][this.cartName + "_items"] = JSON.stringify(this.items);
                this.resetDiscount();
                this.applyDefaultVouchers();
            }
        },
        addItem: function(code, category, name, price, stock, quantity) {
            if (quantity = this.toNumber(quantity), 0 !== quantity) {
                for (var r = !1, o = 0; o < this.items.length && !r; o++) {
                    var s = this.items[o];
                    if(s.code === code){
                        r = !0;
                        s.quantity = this.toNumber(s.quantity + quantity);
                        if(s.quantity <= 0) {
                            this.items.splice(o, 1);
                        }
                    }
                }
                if (!r) {
                    var item = {};
                    item.code = code;
                    item.category = category;
                    item.name = name;
                    item.price = 1 * price;
                    item.stock = stock;
                    item.quantity = 1 * quantity;

                    this.items.push(item);
                }
                this.saveItems();
            }
        },
        checkCartHasItem : function(search,type){
            var validCheck = false;
            for (var a = 0; a < this.items.length; a++) {
                var i = this.items[a];
                if(i[type] === search){
                    validCheck = true;
                }
            }
            return validCheck;
        },
        getTotalPrice: function(t) {
            var e = 0;
            for (var a = 0; a < this.items.length; a++) {
                var i = this.items[a];
                if("undefined" === typeof t || i.code === t) {
                    e += this.toNumber(i.quantity * i.price);
                }
            }
            return e;
        },
        getTotalCount: function(t) {
            var e = 0;
            for (var a = 0; a < this.items.length; a++) {
                var i = this.items[a];
                if("undefined" === typeof t || i.code === t){
                    e += this.toNumber(i.quantity);
                }
            }
            return e;
        },
        clearItems : function() {
            this.items = [];
            this.saveItems();
        },
        addCheckoutParameters : function(t, e, a) {
            if ("PayPal" !== t) {
                throw "serviceName must be 'PayPal'.";
            }
            if (null === e) {
                throw "A merchantID is required in order to checkout.";
            }
            this.checkoutParameters[t] = thisService.fcheckoutParameters(t, e, a);
        },
        checkout : function(t, e) {
            if (null == t) {
                var a = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
                t = a.serviceName;
            }
            if (null == t) {
                throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
            }
            var i = this.checkoutParameters[t];
            if (null == i) {
                throw "Cannot get checkout parameters for '" + t + "'.";
            }
            switch (i.serviceName) {
                case "PayPal":
                    this.checkoutPayPal(i, e);
                    break;
                default:
                    throw "Unknown checkout service: " + i.serviceName;
            }
        },
        checkoutPayPal : function(t, e) {
            for (var a = {
                cmd: "_cart",
                business: t.merchantID,
                upload: "1",
                rm: "2",
                charset: "utf-8"
            }, i = 0; i < this.items.length; i++) {
                var r = this.items[i],
                    o = i + 1;
                a["item_number_" + o] = r.code;
                a["item_name_" + o] = r.name;
                a["quantity_" + o] = r.quantity;
                a["amount_" + o] = r.price.toFixed(2);
                a.currency_code = "GBP";
                a.shipping_1 = 1.75;
                a.tax_cart = 15 * Math.round(100 * this.getTotalPrice() / 100) / 100;
            }
            var s = $("<form/></form>");
            s.attr("action", "https://www.sandbox.paypal.com/us/cgi-bin/webscr");
            s.attr("method", "POST");
            s.attr("style", "display:none;");
            this.addFormFields(s, a);
            this.addFormFields(s, t.options);
            $("body").append(s);
            this.clearCart = null == e || e;
            s.submit();
            s.remove();
        },
        addFormFields : function(t, e) {
            if(null != e) {
                $.each(e, function(e, a) {
                    if (null != a) {
                        var i = $("<input></input>").attr("type", "hidden").attr(
                            "name", e).val(a);
                        t.append(i);
                    }
                });
            }
        },
        toNumber : function(t) {
            return t = 1 * t, isNaN(t) ? 0 : t;
        },
        getVouchers : function(t) {
            return $http.get('data/vouchers.json').then(function(response) {
                window['vouchers'] = response.data;
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
        resetDiscount : function(){
            if(null != window['localStorage'] && null != JSON) {
                window['localStorage'][thisService.cartName + "_discount"] = 0;
            }
        },
        applyVoucher : function(t) {
            if(null != window['localStorage'] && null != JSON) {
                var v = null != window['localStorage'] ? window['localStorage'][thisService.cartName + "_discount"] : null;
                window['localStorage'][this.cartName + "_discount"] = JSON.parse(v)+t;
            }
        },
        getTotalDiscount : function() {
            if(null != window['localStorage'] && null != JSON) {
                var v = null != window['localStorage'] ? window['localStorage'][thisService.cartName + "_discount"] : null;
                return JSON.parse(v);
            }
        },
        applyDefaultVouchers : function(){

            /*** Voucher Logic :
             * £5.00 off your order
             • £10.00 off when you spend over £50.00
             • £15.00 off when you have bought at least one footwear item and spent over £75.00
             * @type {boolean}
             */
            if(thisService.getTotalPrice() >= 50){
                thisService.applyVoucher(10);
            }

            if(thisService.getTotalPrice() >= 75 && (thisService.checkCartHasItem('mfootwear','category') === true || thisService.checkCartHasItem('wfootwear','category') === true) ){
                thisService.applyVoucher(15);
            }
        },
        authDiscountCode : function(voucher,vouchers){
            var validCheck = false;
            angular.forEach(vouchers, function(value, key) {
                if(value.code === voucher){
                    thisService.resetDiscount();
                    thisService.applyDefaultVouchers();
                    thisService.applyVoucher(value.discount);
                    validCheck = true;
                }else if(key === vouchers.length-1 && validCheck === false){
                    thisService.resetDiscount();
                    thisService.applyDefaultVouchers();
                }
            });
            return validCheck;
        }
    };

    if(typeof window['localStorage']['vtstore_items'] === "undefined" && typeof window['localStorage']['vtstore_discount'] === "undefined"){
        thisService.ShoppingCart('vtstore');
        window['localStorage'][thisService.cartName + "_discount"] = 0;
    }else{
        thisService.cartName = 'vtstore';
        thisService.checkoutParameters = {};
        thisService.loadItems();
        window['localStorage'][thisService.cartName + "_discount"] = 0;

    }

    return thisService;
}]);