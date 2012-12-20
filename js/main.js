/* 
    Name: Royal Pioneers
    Author: Junihor Moran - Team RP
    Namespace: RP
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
            var buildPreview = function(iq, id, title, description, url, img, price, percentage) {
                this.iq = iq;
                this.id = id;
                this.title = title;
                this.description = description;
                this.url = url;
                this.img = img;
                this.price = price;
                this.percentage = percentage;
            };

            
            //Metodo para crear el preview de cada producto
            buildPreview.prototype.htmlBuild = function() {
                $('#preview-product ul').append(
                    //Construir estructura HTML
                    '<li data-preview-id="'+this.id+'">\
                        <div class="content">\
                            <div class="side-left img-preview">\
                                <img alt="'+this.title+'" src="'+this.img+'" width="220" height="220">\
                            </div>\
                            <div class="side-left content-preview">\
                                <h3>'+this.title+'</h3>\
                                <div class="text-preview">\
                                    <p class="preview-price absolute-TopRight">'+this.price+'</p>\
                                    <p>'+this.description+'</p>\
                                    <p>'+this.percentage+'</p>\
                                </div>\
                                <a class="btn-moreDetails" href="'+this.url+'">More Details [+]</a>\
                            </div>\
                        </div>\
                    </li>'
                ); 
            };            
            
            //Funcion para construir esqueleto del preview
            var contentBuild = function(eq, slide) {
                $('#content-product dl dd:eq('+eq+')').after(
                    //Construir estructura HTML
                    '<dd id="preview-product" class="preview-product hidden" data-id="'+slide+'">\
                        <span class="arrow-here"> ^ </span>\
                        <button id="preview-close" class="absolute-TopRight">X close</button>\
                        <button class="simulator-Top">Up</button>\
                        <ul></ul>\
                        <button class="simulator-Down">Down</button>\
                    </dd>'
                );
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
            
            //Abrir/Cerrar Preview de lista de Productos
            $('.product-item .btn-review').toggle(
                function() {
                    var axioma  = $(this).parents('.product-item'),
                        title   = axioma.find('h2').text(),
                        father  = $(this).parents('.content-product-item').children('li'),
                        child   = $(this).parents('.content-product-item').children('li').length, //Calcular cantidad de Presentaciones
                        slideId = parseInt(axioma.attr('data-slide')), //Numero de Slide                        
                        slide   = axioma.attr('data-id'), //Capturar el data-id para interactuar con el plugin slideRP
                        percentage = axioma.find('');
                        
                        //Variables de Posicion de BOX PREVIEW
                        fatherId = axioma.index(), //Capturar el Index del ancestro (DD)
                        column = 4,                        
                        nRow = (Math.ceil(fatherId/column) * column), //Determinar a que fila pertenece y posicionarlo despues de está
                        liCount = $('#content-product dl > dd').length - 1, //Cantidad de Items                        
                        currentId; //capturar Index donde posteriormente se agregara la data

                    //Comprobar la ubicacion del BOX PREVIEW
                    if (liCount < column) {//Si el número de item es menor que la fila
                        currentId = liCount;
                    } else if (fatherId === liCount) {//Si este es el ultimo LI
                        currentId = (session.boxOpen === 'true') ?  fatherId-1 : fatherId; //Pero si hay un BOX PREVIEW abierto
                    } else {
                        currentId = nRow;
                    }

                    Cajita = null; //Eliminar Objeto anterior                    
                    
                    //Crear un preview
                    var createPrev = function() {
                        contentBuild(currentId, slide);

                        father.each(function(i) {
                            var nId = $(this).attr('id'), //Capturar el ID del producto
                                title = $('h2', this).text(),                                
                                description = 'Esta es una prueba',
                                url = $('figure a', this).attr('href'),
                                image = 'images/test.jpg',                                
                                price = $('.price', this).text();

                            //Crear un nuevo Objeto
                            Cajita = new buildPreview(currentId, nId, title, description, url, image, price);

                            //Insertar data en BOX PREVIEW             
                            Cajita.htmlBuild();
                        });

                        if (child > 1) { //Si hay mas de una presentacion
                            $('#preview-product').slideRP({ //Activar slider RP
                                startSlide: slideId
                            });
                        }

                        downBox();
                    };                                       
                                        
                    //Abrir BOX Preview
                    if (session.boxOpen === 'true') { //Si hay un BOX PREVIEW abierto
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

            //Invocar al metodo container
            RP.container.init();

            //Invocar metodo hermano        
            this.modal();


            //Precargar los estilos del jQuery UI y Nivo-slider
            RP.loadCss.init("css/jquery-ui.min.css");
            RP.loadCss.init("css/nivo-slider.css");

            require(['vendor/jquery.zoom']); //Request plugin Zoom
            require(['vendor/nivoslider']); //Request plugin Nivoslider
            require(['vendor/jquery-ui.min']); //Request plugin jQuery UI

            //Callback al Modal
            $('#content-product').on('click', '.btn-moreDetails', function(e) {
                e.preventDefault();//Cancelar comportamiento

                var cId = $(this).parents('li').attr('data-preview-id'), //Capturar el ID del producto
                    url = $('#'+cId+' figure a').attr('href'), 
                    title = $('#'+cId+' h2.title').text(), 
                    priceUnit = parseInt($('#'+cId+' .price').text());

                $('#preview-close').trigger('click');

                RP.buy.showModal(cId, url, title, priceUnit, 'false');
            });
        },

        private: function() {
        },

        group: function() {
        },

        //Implementacion del Modal del detalle completo del producto
        modal: function() {
            //close full-detail modal of product
            $('#btn-closeModal').on('click', function() {
                $('#modal-product').fadeOut();
            });

            //Slide-Down/Up detail-buy
            $('#add-product').on('click', function() {
                $('#modal-buyDetail').slideToggle();
            });

            //Slide-Up detail buy
            $('#btn-closeBuy').on('click', function() {
                $('#modal-buyDetail').slideUp();
            });

            //Agregar Producto modal al container
            $('#btn-done').on('click', function() {
                var mid = $(this).parents('#modal-product').attr('data-id-product'),
                    price = parseInt( $(this).parents('#full-info-product').find('.price-product').text() ), //Capturar el precio
                    quantity = $(this).parents('#modal-buyDetail').find('#quantity-product').val(); //Capturar la cantidad


                //Callback at method
                RP.addItemContainer.init(mid, 'modal', 30, quantity, price);

                //Activar Opciones de container
                setTimeout(function() {
                    RP.container.tooltip(".container-list li#cont_"+mid,"tooltipM");
                }, 1200);

                $('#btn-closeBuy').trigger('click');
                $('#btn-closeModal').trigger('click');
                //$('#add-product').addClass('hidden');
                //$('#remove-product').show(0);
            });           
        },

        //Call Modal
        showModal : function(id, url, title, price, edit) {
            /*requirejs.config({
                paths: {
                    'jquery-ui': '//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'
                }
            });            
            require(['jquery-ui']);*/            

            $('#modal-product').attr({
                'data-id-product': id, //Asignar ID al data-id-product
                'rel': url //Asignar la URL   
            });

            $('#modal-product h1.title').text(title);
                                   
            $('#modal-product').fadeIn();

            $('#modal-product .price-product').text(price);

            $('#slider-modal').nivoSlider({
                effect: 'sliceDown',
                controlNavThumbs: false,
                directionNav: true,
                manualAdvance: true,
                prevText: 'Prev',
                nextText: 'Next',
                beforeChange: function() {
                    $('.zoomImg').css('z-index', '0');
                },
                afterChange: function() {
                    $('.zoomImg').css('z-index', '10');
                    $('.zoomImg').attr('src', $('.nivo-main-image').attr('src'));
                }
            });

            //Zoom Start
            $('#slider-modal').zoom({
                url: $('.nivo-main-image').attr('src'),
                grab: true
            });

            //Implementar slider-range
            $("#price-range-min").slider({
                range: "min",
                value: 30,
                min: 25,
                max: 85,
                slide: function( event, ui ) {
                    $( "#quantity-product" ).val(ui.value);
                    $('.price-total span').text(ui.value * price);
                }
            });

            $("#quantity-product").val( $("#price-range-min").slider("value") );

            if (edit === 'true')  {
                $('#modal-buyDetail').delay(300).slideDown();
            }                           
        }
    },


    //Canvas Container
    container : {
        init : function() {
            require(['vendor/jquery.easing']);            

            $('.add-cart').on('click', function(e) {
                var it = $(this).parents('.li-item').attr('id');
                RP.addItemContainer.init(it, 'list', 10);

                setTimeout(function() {
                    RP.container.tooltip(".container-list li#cont_"+it,"tooltipM");
                }, 1200);
            });

            //Callback a método OptionItem
            this.optionItem();

            //Llamar al efecto dial
            require(['vendor/jquery.knob.min'], function() {
                $('#dial-container').knob();
            });
            
        },

        // Funcion para el Tooltip de cada producto
        tooltip : function(target_items, name) {
            var obj = $(target_items),
                title = $('.title-product', obj).text(),
                i = obj.index(),
                my_tooltip;

            $("body").append(
                "<div class='"+name+"' id='"+name+i+"'><h4>"+title+"</h4> <ul><li>Adquiridos: 17</li> <li>Porcentaje: 7%</li> <li>Total/Orden Mínimo: 75/100</li></ul> </div>"
            );                


            $('.container-list li').hover(
                function(e) {
                    e.stopPropagation();
                    var indice = $(this).index();

                    my_tooltip = $("#"+name+indice);
                    my_tooltip.css({opacity:0.9, display:"none"}).delay(400).fadeIn(400);
                },
                function() {
                    my_tooltip.hide(0);
                }
            );
           
            $('.container-list li').mousemove(function(kmouse) {
                my_tooltip.css({left:kmouse.pageX+15, top:kmouse.pageY+15});
            });
        },

        // Funcion para habilitar las opciones de items en el container 
        optionItem : function() {
            var hideOptions = function() {
                $('#fill-unhover').hide(0);
                $('#option-item-container').hide(0);
            };

            $('.container-list').on('click', 'li', function(e) {
                e.stopPropagation();
                var coorX = $(this).offset().left,
                    coorY = $(this).offset().top,
                    dataID = $(this).attr('id');

                $('#option-item-container').attr('data-item', dataID);
                $('#option-item-container').css({'top': coorY+73+'px', 'left': coorX+'px'}).fadeIn();
                $('#fill-unhover').css({'top': coorY+'px', 'left': coorX+'px'}).fadeIn();
            });

            //
            $('#opt-delete').on('click', function() {
                var itemID = $(this).parents('#option-item-container').attr('data-item');
                $('#'+itemID).remove();
                hideOptions();
                RP.container.messageItem('Item Eliminado');
                RP.container.details();
            });

            //Option "view" of the item 
            $('#opt-view').on('click', function() {
                var cId = $(this).parents('#option-item-container').attr('data-item').split('cont_').join().replace(',',''), //Capturar el ID del producto
                    url = $('#'+cId+' figure a').attr('href'), 
                    title = $('#'+cId+' h2.title').text(), 
                    priceUnit = parseInt($('#'+cId+' .price').text());
                
                RP.buy.showModal(cId, url, title, priceUnit);
            });

            //Option "Edit" of the item 
            $('#opt-edit').on('click', function() {
                var cId = $(this).parents('#option-item-container').attr('data-item').split('cont_').join().replace(',',''), //Capturar el ID del producto
                    url = $('#'+cId+' figure a').attr('href'), 
                    title = $('#'+cId+' h2.title').text(), 
                    priceUnit = parseInt($('#'+cId+' .price').text());
                
                RP.buy.showModal(cId, url, title, priceUnit, 'true');
            });


            $('#btn-close-message').on('click', function() {
                $('#message-top').hide();
            });

            $('body').on('click', function() {
                hideOptions();
            });
        },

        //genera un mensaje
        messageItem : function(message) {
            $('#message-top cite').text(message);
            $('#message-top').delay(100).slideDown().delay(3000).slideUp();
        },

        details : function() {
            var costTotal = function() {
                var costFull = 0;

                $('.container-list li').each(function() {
                    costItem = parseInt( $('.total', this).text() );
                    costFull += costItem;             
                });
                $('.header-container .price-total').text(costFull);
            };
            costTotal();

            $('#dial-container').val(27).trigger('change');
        }
    },


    //Transfer image to container effect.
    imageTransfer : {
        init: function(container_block, image_block, ratio, reduce) {            
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
                .animate({ marginLeft: gotoX+90, marginTop: gotoY+30, width: '-='+(reduce/2)+'%',  height: '-='+reduce+'%', opacity: 0.3}, 1200, 'easeInOutBack', function() {
                    $(this).remove();                        
                });                                 
            }
        }                   
    },


    //Add item to Container.
    addItemContainer : {
        init: function(id, typeTag, reduce, cant, price) {
            var li = $('#container-canvas ol #cont_'+id).length;
            var title, url, img, img_obj; //Variables de objeto
            var obj = $('body');

            //Effect change color for a moment in container
            var addEffect = function() {
                $('.container-list').addClass('encestar');           
                var timeEffect = setTimeout(function() {
                    $('.container-list').removeClass('encestar');
                }, 300);
            }; 

            if (li < 1) { 
                if (typeTag === 'list') { //Preguntar si es un producto de la lista

                    title = $('#'+id+' .title').text(), //Capturar titulo
                    url = $('#'+id+' figure a').attr('href'), //capturar URL
                    img = $('#'+id+' figure img').attr('src'), //capturar imagen
                    img_obj = $('#'+id+' figure img'); //Capturar el objeto imagen

                } else { //Oh si es un Modal
                    title = $('#full-info-product h1.title').text(), //Capturar titulo
                    url = $('#modal-product').attr('rel'), //capturar URL
                    img = $('#slider-modal img.nivo-main-image').attr('src'), //capturar imagen
                    img_obj = $('#slider-modal img.nivo-main-image'); //Capturar el objeto imagen
                }

                RP.imageTransfer.init(obj, img_obj, 0, reduce); //Lamar al metodo imageTransfer(aplica el efecto fly-to-basket)

                var timeID = window.setTimeout(function() {
                    addEffect();                      
                    $('.container-list').append(
                        '<li id="cont_'+id+'">\
                            <a href="'+url+'">\
                                <img src="'+img+'" alt="" width="80" height="73" >\
                                <div class="hidden">\
                                    <span class="title-product">'+title+'</span> <span class="price">'+price+'</span> <span class="quantity">'+cant+'</span> <span class="total">'+cant*price+'</span>\
                                </div>\
                            </a>\
                        </li>'
                    );

                    //Detalle del container
                    RP.container.details();
                }, 1200);                   
            }

        }     
    },


    //Load aditional CSS 
    loadCss : {
        init: function(url) {
            var newCSS = document.createElement("link");
                newCSS.type = "text/css";
                newCSS.rel = "stylesheet";
                newCSS.href = encodeURI(url);

            document.getElementsByTagName("head")[0].appendChild(newCSS);
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