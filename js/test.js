test function(e, t) {
    var n = e.module("checkout:tabs");
    return n.createBase({el: "#tabs",events: {"click .cart": "checkout"},_moveToCart: function(t) {
        var n = this.$el, r = t.el, i = this;                
        clearTimeout(this.cartTimeout);                
        var s = t.coords;
            _pos = this.$(".amt").offset(), 
            color = t.product.get("details").color.spec.hex, 
            bezier_params = {start: {x: s.x,y: s.y,angle: -40},
            end: {
                x: _pos.left + 13,
                y: _pos.top + 6,
                angle: 40,length: .4
            }
    };

    var o = $("<img/>").css(
        {
            border: "2px solid rgba(0,0,0,0.2)",
            height: r.height(),
            left: s.x,
            position: "absolute",
            top: s.y,
            width: r.width(),
            zIndex: "10000"
        }
    ).attr("src", r.attr("src"))
    .appendTo("body")
    .animate(
        {
            height: 5,
            path: new $.path.bezier(bezier_params),
            width: 5
        }, 600)
    .addClass("rc3").animate(
        {
            height: "30",
            left: "-=15",
            opacity: 0,
            top: "-=10",
            width: "30"}, 80, function() {
                o.remove(), 
                i.updateCartTotal(), 
                e.trigger("notification", "YEAH! Item added to cart.")
            });
            this.cartTimeout = setTimeout(function() {
                    n.find(".cart").removeClass("addedToCart")
            }, 1900)
        },_animateAddItem: function(e) {
                var t = this;
                this.$(".cart").addClass("addedToCart"), setTimeout(function() {
                    t._moveToCart(e)
                }, 200)
            },_toggleFixed: function(e) {
                var t = $(document).scrollTop();
                this.$el.toggleClass("fixed", t >= 690)
            }