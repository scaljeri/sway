window.Sway = window.Sway || {} ; // make sure it exists

(function(ns) {
    /**
     * @class Sway.Bindable
     * @constructor
     */
   var Bindable = function() {};

   Bindable.prototype = {
       /**
        * @method bind
        * @param object
        * @param property
        * @param callback
        */
      bind: function(object, property, callback){}
       /**
        * @method bind2DOM
        */
      , bind2DOM: function(dom) {}
       /**
        * @method bind2Storage
        */
       , bind2Storage: function(dom) {}
   } ;

   ns.Bindable = Bindable ;
})(window.Sway) ;