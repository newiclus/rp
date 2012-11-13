// Avoid `console` errors in browsers that lack a console.
(function() {
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }
}());


/* PLUGIN DIRECTORY

What you can find in this file [listed in order they appear] 

    1.) Animate Background Position - http://plugins.jquery.com/project/backgroundPosition-Effect

    2.) jQuery Easing Plugin - http://gsgd.co.uk/sandbox/jquery/easing/

    3.) jQuery Ajax Form plugin - http://jquery.malsup.com/form/#download           

    4.) jQuery validation plugin (form validation) - http://docs.jquery.com/Plugins/Validation  -password strength

    5.) Styled Selects (lightweight) - http://code.google.com/p/lnet/wiki/jQueryStyledSelectOverview
*/


/**
    * 1.) Animate Background Position - http://plugins.jquery.com/project/backgroundPosition-Effect
    * @author Alexander Farkas
    * v. 1.21
*/

(function($) {
    if(!document.defaultView || !document.defaultView.getComputedStyle){ // IE6-IE8
    //SNIPPED
    };
})(jQuery);


/**
    * 2.) jQuery Easing Plugin (we're not using jQuery UI as of yet) - http://gsgd.co.uk/sandbox/jquery/easing/
*/


// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];


jQuery.extend(jQuery.easing, {
    //SNIPPED
});


/**
    * 3.) jQuery Ajax Form plugin - http://jquery.malsup.com/form/#download  
*/

;(function($) {
    $.fn.ajaxSubmit = function(options) {
    //SNIPPED
    }
})(jQuery);

 

/*
* jQuery Styled Select Boxes
* version: 1.1 (2009/03/24)
* @requires jQuery v1.2.6 or later
*
* Examples and documentation at: http://code.google.com/p/lnet/wiki/jQueryStyledSelectOverview
*
*/ 

jQuery.fn.styledSelect = function(settings) {
    //SNIPPED
    return this;
};