/* Name: Royal Pioneers
   Author: Team RP 
   RP namespace
*/

var storage, 
    session;
//var dataLang = {};
//localStorage.clear();
//sessionStorage.clear();

//Comprobar si el navegador soporta WebStorage
try {
    if (localStorage.getItem && sessionStorage.getItem) {
        storage = localStorage;
        session = sessionStorage;
    }
} catch(e) {
    storage = {};
    session = {};
}


RP = {
    common : {
        init : function() {

            //Button config for Modality Buy
            $('#btn-config').on('click', function() {
                $('#config-buy').slideToggle(350);
            });

            //Show it Search
            var showSearch = function() {
                $('.btn-showSearch').on('click', function(e) {
                    e.preventDefault();
                    $('#search').fadeToggle();
                });

                $('#btn-closeSearch').on('click', function() {
                    $('#search').fadeOut();
                });
            };
            showSearch();
                
        },

        finalize : function() {
            //finalize
        }
    },

    lightbox : {
        init : function() {

            require(['vendor/lightbox'], function() {//Requiero de la libreria lightbox
                $('.pic a').lightBox({      
                    imageLoading: 'js/lightbox/images/loading.gif',
                    imageBtnClose: 'js/lightbox/images/close.gif',
                    imageBtnPrev: 'js/lightbox/images/prev.gif',
                    imageBtnNext: 'js/lightbox/images/next.gif'
                });
            }); 
                
        },

        finalize : function() {
            //finalize
        }
    },

    //Consulta al API del clima de Yahoo Wheater
    liveWeather : {
        init : function() {
            this.parameters = {};
            this.parameters.op = 'clima';
            this.parameters.localidad_id = "PEXX0012"; // Lobitos,Piura
            this.getData(this.parameters);
        },

        getData : function(options) {
            $.ajax({
                url : "getWeather.php",
                data : options,
                dataType: 'json',
                success: function(response){
                    var clima = response.clima;
                    $('#live-weather-temperature').html(clima.temperatura+'&deg; C');
                    //$('#live-weather-location').html(clima.lugar);
                    $('#live-weather-img').html('<img src="images/iconos-clima/'+clima.codigo+'.png" id="weather-img"  width="42"  height="42" title="'+clima.estado+'" alt="'+clima.estado+'">');
                }
            });
        }
    },


    //Modality Buy
    buy : {
        init: function() {
            //estado de capa del Preview = cerrada
            session.setItem('boxOpen','false');

            //Mostrar detalles de item-productos al hacer un hover
            $('#content-product dl dd').hover(
                function() {
                    $('.name-product', this).fadeIn();
                    $('.options-item', this).fadeIn();
                    $('.minislide-product', this).fadeIn();
                },
                function() {
                    $('.name-product', this).fadeOut();
                    $('.options-item', this).fadeOut();
                    $('.minislide-product', this).fadeOut();
                }
            );

            //Subir Box Preview
            var upBox  = function() {
                session.setItem('boxOpen','false');
                $('.preview-product').slideUp();                
            };

            //Bajar Box Preview
            var downBox = function() {
                session.setItem('boxOpen','true');
                $('.preview-product').slideDown();                
            };

            //Comprobar Box Preview abiertas y cerrar antes de abrir otra
            var closeSibling = function() {
                $('button.marcado').trigger('click');
                var timeoutID = window.setTimeout(downBox, 600);
                              
            };
            
            //Abrir/Cerrar Preview de lista de Productos
            $('.product-item .btn-review').toggle(
                function() {
                    if (session.boxOpen === 'true') {
                        closeSibling();
                        $(this).addClass('marcado');
                    } else {
                        downBox();
                        $(this).addClass('marcado');
                    }
                },

                function() {
                    upBox();
                    $(this).removeClass('marcado');
                }
            );

            //Cerrar Preview
            $('#preview-close').on('click', function() {
                $('button.marcado').trigger('click');
            });
        },

        private: function() {
        },

        group: function() {
        }

    }
};

UTIL = {
    exec: function(controller, action) {
        var ns = RP,
            action = (action === undefined) ? "init" : action;
 
        if (controller !== "" && ns[controller] && typeof ns[controller][action] == "function") {
            ns[controller][action]();
        }
    },
 
    init: function() {
        var body = document.body,
            controller = body.getAttribute("data-controller"),
            action = body.getAttribute("data-action");
 
        UTIL.exec("common");
        UTIL.exec(controller);
        UTIL.exec(controller, action);
    }
};
 
$(document).on('ready', UTIL.init);





//Tutorial

/*

For instance if your code was architected in an object literal such as:

FOO = {
  common : {
    init     : function(){ ... },
    finalize : function(){ ... }
  },
  shopping : {
    init     : function(){ ... },
    cart     : function(){ ... },
    category : function(){ ... }
  }
}

//
A page with this body tag:

<body id="cart" class="shopping">


//
would load these functions sequentially:

UTIL.fire is calling: FOO.common.init()
UTIL.fire is calling: FOO.shopping.init()
UTIL.fire is calling: FOO.shopping.cart()
UTIL.fire is calling: FOO.common.finalize()


In addition, using these classes and IDs on the body tag provides some excellent specific hooks for your CSS.

UTIL = {
 
  fire : function(func,funcname, args){
 
    var namespace = FOO;  // indicate your obj literal namespace here
 
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    } 
 
  }, 
 
  loadEvents : function(){
 
    var bodyId = document.body.id;
 
    // hit up common first.
    UTIL.fire('common');
 
    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
      UTIL.fire(classnm,bodyId);
    });
 
    UTIL.fire('common','finalize');
 
  } 
 
}; 
 
// kick it all off here 
$(document).ready(UTIL.loadEvents);



This system worked very well and keeps you in serious control of the execution order.

In the end, I used this plus a custom event to bind super low priority script.
For example:

$(document).bind('finalized',function(){ ... }); // placed within a FOO.shopping.category()


And I'd trigger that:

$(document).trigger('finalized');

at the very end of UTIL.loadEvents(). This allows you to keep similar code together, but delay portions responsibly without any setTimeout ugliness.

but, It's essentially using data-attributes instead of classes to trigger this action.. So..

 <body data-controller="users" data-action="show">


*/