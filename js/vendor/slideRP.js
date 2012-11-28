/*
 *  Royal Pioneers Slider 1.0 - jQuery plugin
 *  written by Junihor Moran    
 *  http://tecnicazorro.com
 *
 *  Copyright (c) 2012 Junihor Moran (http://tecnicazorro.com)
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */
 
/*
 *  markup example for $("#slider").slideRP();
 *  
 *  <div id="slider">
 *      <ul>
 *          <li>...</li>
 *          <li>...</li>
 *          <li>...</li>.
 *      </ul>
 *  </div>
 *
 */
(function($) {
    $.fn.slideRP = function(options){     
        //default configuration properties
        var defaults = {
            prevId: 'btn-Top',
            nextId: 'btn-Down',
            simulator: 0,
            continuous: false,
            controlsFade: true,
            speed: 700,
            startSlide: 0
        }; 
        
        var options = $.extend(defaults, options);  
                
        this.each(function() {
            var obj = $(this);
            var father = $(this).attr('data-id');
            var s = $("ul > li", obj).length;                        
            var clickable = true;
            var h = $('ul > li', obj).height();
            var ts = s-1;
            var t = options.startSlide;
            var simulador = options.simulator;
            
            $('ul > li', obj).each(function(i) {
                $(this).attr('data-slide', i);
                $(this).attr('data-height', h);
            });

            if (s > 1) {
                //show arrows                
                if(t===ts) {
                    $("button.btn-Down",obj).css('visibility', 'hidden');
                } else {
                    $("button.btn-Down",obj).css('visibility', 'visible');     
                }

                if (t===0) {
                    $("button.btn-Top",obj).css('visibility', 'hidden');
                } else {
                    $("button.btn-Top",obj).css('visibility', 'visible');
                }

                $("ul", obj).css({'height':s*h, 'margin-top':t*-h});
                $("ul", obj).wrap('<div class="content-slider" />');
                $('.content-slider', obj).height(h);
            }
            
            //Button Down animation
            $('dd[data-id="'+father+'"] button.btn-Down').click(function() { /*dd[data-id="'+father+'"] */                                          
                animate("next",true);
            });

            //Button Up animation
            $('dd[data-id="'+father+'"] button.btn-Top').click(function() {                
                animate("prev",true);
            });
                        
            //Asignacion de la animacion actual
            function setCurrent(i) {
                i = parseInt(i);
                $("ul > li", obj).removeClass("current");
                $("ul > li:eq("+i+")", obj).addClass("current");
            };

            //Ajuste del efecto alide
            function adjust() {
                if(t>ts) t=0;
                if(t<0) t=ts;
                $('ul', obj).css("margin-top",(t*h*-1));
                clickable = true;

                //set Current
                //setCurrent(t);
            };
            

            function animate(dir,clicked) {
                if (clickable) {
                    clickable = false;
                    var ot = t;
                    switch(dir) {
                        case "next":
                            t = (ot>=ts) ? ts : t+1;                                              
                            break; 
                        case "prev":
                            t = (t<=0) ? 0 : t-1;         
                            break;
                        default:
                            t = dir;
                            break;
                    }

                    var diff = Math.abs(ot-t);
                    var speed = diff*options.speed;                     
                    
                    p = (t*h*-1);

                    $('ul', obj).animate(
                        {marginTop: p}, 
                        {queue:false, duration:speed, complete:adjust}
                    )
                    
                    if (!options.continuous && options.controlsFade) {                    
                        if(t===ts) {
                            $("button.btn-Down",obj).css('visibility', 'hidden');
                        } else {
                            $("button.btn-Down",obj).css('visibility', 'visible');                  
                        }

                        if(t===0) {
                            $("button.btn-Top",obj).css('visibility', 'hidden');
                        } else {
                            $("button.btn-Top",obj).css('visibility', 'visible');
                        }               
                    }
                    
                    if(clicked) clearTimeout(timeout);  
                }              
            }

            // init
            var timeout;                            
        
            if(!options.continuous && !options.controlsFade) {                   
                $("button.btn-Top",obj).css('visibility', 'hidden');
                $("button.btn-Down",obj).css('visibility', 'hidden');               
            };                          
        });
      
    };

})(jQuery);