/* Name: Royal Pioneers
   Author: Team RP 
   RP namespace
*/

var storage, 
    session;
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
                
        }
    },
    

    //Consulta al API del clima de Yahoo Wheater
    liveWeather : {
        init : function() {
            this.parameters = {};
            this.parameters.op = 'clima';
            this.parameters.localidad_id = "PEXX0012"; // Lobitos, Piura
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

            //Activar Plugin Slider RP para desplazamiento
            require(['vendor/slideRP'], function() {
                $('.product-item').slideRP();
            });        

            //Mostrar detalles de item-productos al hacer un hover
            $('.content-product-item li').hover(
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

            //Constructor del preview del producto
            var buildPreview = function(iq, title, description, url, img, price) {
                this.iq = iq;
                this.title = title;
                this.description = description;
                this.url = url;
                this.img = img;
                this.price = price;
            };

            
            //Metodo para crear el preview de cada producto
            buildPreview.prototype.htmlBuild = function() {
                var img_preview = '<div class="side-left img-preview"><img alt="'+this.title+'" src="'+this.img+'" width="220" height="220"></div>',
                    text_preview = '<div class="side-left content-preview"><h3>'+this.title+'</h3><div class="text-preview"><p class="preview-price absolute-TopRight">'+this.price+'</p><p>'+this.description+'</p></div><a class="btn-moreDetails" href="'+this.url+'">More Details [+]</a></div>',
                    data = img_preview + text_preview;

                $('#preview-product ul').append('<li><div class="content">'+data+'</div></li>'); 
            };            

            //Subir Box Preview
            var upBox  = function() {
                session.setItem('boxOpen','false');
                $('#preview-product').slideUp('normal', function() {
                    $('#preview-product').remove();
                });                           
            };

            //Bajar Box Preview
            var downBox = function() {
                session.setItem('boxOpen','true');         
                $('.preview-product').slideDown();                
            };

            //Comprobar Box Preview abiertas y cerrar antes de abrir otra
            var closeSibling = function() {
                $('button.marcado').trigger('click');           
            };

            //Construir esqueleto del preview
            var contentBuild = function(eq, slide) {
                var arrow = '<span class="arrow-here"> ^ </span>',
                    btnClose = '<button id="preview-close" class="absolute-TopRight">X close</button>',
                    btnUp = '<button class="simulator-Top">Up</button>',
                    btnDown = '<button class="simulator-Down">Down</button>';
                $('#content-product dl dd:eq('+eq+')').after('<dd id="preview-product" class="preview-product hidden" data-id="'+slide+'">'+arrow+btnClose+btnUp+'<ul></ul>'+btnDown+'</dd>');
            };
            
            //Abrir/Cerrar Preview de lista de Productos
            $('.product-item .btn-review').toggle(
                function() {
                    var title = $(this).parents('.product-item').find('h2').text(),
                        father = $(this).parents('.content-product-item').children('li'),
                        child = $(this).parents('.content-product-item').children('li').length, //Calcular cantidad de Presentaciones
                        slideId = parseInt($(this).parents('.li-item').attr('data-slide')), //Numero de Slide
                        slide = $(this).parents('.product-item').attr('data-id'), //Capturar el data-id
                        
                        //Variables de Posicion de BOX PREVIEW
                        fatherId = $(this).parents('.product-item').index(), //Capturar el ID del ancestro (DD)
                        column = 4,                        
                        nRow = (Math.ceil(fatherId/column) * column), //Determinar a que fila pertenece y posicionarlo despues de está
                        liCount = $('#content-product dl > dd').length - 1, //Cantidad de Items                        
                        currentId; //capturar ID donde posteriormente se agregara la data

                    //Comprobar la ubicacion del BOX PREVIEW
                    if (liCount < column) {//Si el número de item es menor que la fila
                        currentId = liCount;
                    } else if (fatherId === liCount) {//Si este es el ultimo LI
                        currentId = (session.boxOpen === 'true') ?  fatherId-1 : fatherId; //Pero si hay un Box Preview abierto
                    } else {
                        currentId = nRow;
                    }

                    Cajita = null; //Eliminar Objeto anterior                    
                    
                    //Crear un preview
                    var createPrev = function() {
                        contentBuild(currentId, slide);

                        father.each(function(i) {
                            var title = $('h2', this).text(),                                
                                description = 'Esta es una prueba',
                                url = '#main',
                                image = 'images/test.jpg',                                
                                price = $('.price', this).html();

                            //Crear un nuevo Objeto
                            Cajita = new buildPreview(currentId, title, description, url, image, price);

                            //Insertar data en BOX PREVIEW             
                            Cajita.htmlBuild();
                        });

                        if (child > 1) {
                            $('#preview-product').slideRP({
                                startSlide: slideId
                            });
                        }

                        downBox();
                    };                                       
                                        
                    //Abrir BOX Preview
                    if (session.boxOpen === 'true') {
                        closeSibling();
                        var timeoutID = window.setTimeout(createPrev, 700); 
                        $(this).addClass('marcado');

                    } else {
                        createPrev();                     
                        $(this).addClass('marcado');
                    }            
                },

                function() {
                    upBox();
                    $(this).removeClass('marcado');
                }
            );

            //Cerrar Preview
            $('#preview-close').live('click', function() {
                $('button.marcado').trigger('click');
            });

            //Simulator of btn-Top in BOX-PREVIEW
            $(".simulator-Top").live("click", function() {
                fatherId = $(this).parent().attr('data-id');
                 $('dd[data-id="'+fatherId+'"] button.btn-Top').trigger('click');
            });

            //Simulator of btn-Down in BOX-PREVIEW
            $(".simulator-Down").live("click", function() {
                fatherId = $(this).parent().attr('data-id');
                 $('dd[data-id="'+fatherId+'"] button.btn-Down').trigger('click');
            });

            //Invocar
            RP.container.init();

            //Invocar metodo hermano        
            this.modal();
        },

        private: function() {
        },

        group: function() {
        },

        //Implementacion del Modal del detalle completo del producto
        modal: function() {
            $('#content-product').on('click', '.btn-moreDetails', function(e) {
                e.preventDefault();
                $('#preview-close').trigger('click');             
                $('#modal-producto').fadeIn();
            });

            $('#btn-closeModal').on('click', function() {
                $('#modal-producto').fadeOut();
            });

            $('#modal-content').load(url, function() {
                $('#nivo-slider').nivoSlider(
                    {
                        effect: 'fade',
                        controlNavThumbs: true,
                        manualAdvance: true,
                        prevText: '',
                        nextText: '',
                        beforeChange: function() {
                            $('.zoomImg').css('z-index', '0');
                        },
                        afterChange: function() {
                            $('.zoomImg').css('z-index', '10');
                            $('.zoomImg').attr('src', $('.nivo-main-image').attr('src'));
                        }
                    }
                );
                
                //Zoom Start
                $('#nivo-slider').zoom(
                    {
                        url: $('.nivo-main-image').attr('src'),
                        grab: true
                    }
                );

                $('#nivo-slider img').load(function() {
                    $('.loading').fadeOut();
                });

            });

            require(['vendor/nivoslider'], function() {});
        }
    },

    //Canvas Container
    container : {
        init: function() {
            //Transfer image to cart effect.
            var imageTransfer = function(container_block,image_block,ratio) {
                var productX = $(image_block).offset().left;
                var productY = $(image_block).offset().top;
                var cartX = $(".container-list").offset().left;
                var cartY = $(".container-list").offset().top;
                var gotoX = cartX - productX;
                var gotoY = cartY - productY;

                if (ratio==0) {
                    $(image_block)
                    .clone()
                    .addClass('img-transition')
                    .prependTo(container_block)
                    .css({'position' : 'absolute','z-index':9999,'left':productX,'top':productY})
                    .animate({ marginLeft: gotoX+90, marginTop: gotoY+30, width: '-=7%',  height: '-=14%', opacity: 0.3}, 1200, 'easeInOutBack', function() {
                        $(this).remove();                        
                    });                                  
                }                    
            };

            //Effect change color for a moment in container
            var addEffect = function() {
                $('.container-list').addClass('encestar');                
                var timeEffect = setTimeout(function() {
                    $('.container-list').removeClass('encestar');
                }, 300);
            };

            //Add item to Container.
            var addContainer = function(id) {
                var li = $('#container-canvas ol #cont_'+id).length;
                if (li < 1) {
                    var title = $('#'+id+' .title').text(), //Capturar titulo
                        url = $('#'+id+' figure a').attr('href'), //capturar URL
                        img = $('#'+id+' figure img').attr('src'), //capturar imagen
                        img_obj = $('#'+id+' figure img'); //Capturar el objeto imagen
                        obj = $('body');

                    imageTransfer(obj, img_obj, 0);
                    var timeID = window.setTimeout(function() {
                        addEffect();                      
                        $('.container-list').append('<li id="cont_'+id+'"><a href="'+url+'" data-product-id="'+id+'" rel="modal"><img src="'+img+'" alt="" width="80" height="73" ><span class="title-product">'+title+'</span></a></li>');                        
                    }, 1200);                    
                }   
            };

            require(['vendor/jquery.easing'], function() {
                $('.add-cart').on('click', function(e) {
                    var it = $(this).parents('.li-item').attr('id');
                    //pos = $(this).offset();                
                    //alert('Left: '+e.pageX+' - Top: '+e.pageY);
                    //alert('Left: '+pos.left+' - Top: '+pos.top);
                    addContainer(it);
                });
            });
        }
    }
};

//Ejecutador de metodos segun vista
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