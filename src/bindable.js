window.Sway = window.Sway || {} ; // make sure it exists

(function(ns) {
   var Bindable = function() {};

   Bindable.prototype = {
      bind: function(object, property, callback){}
      , bindDOM: function(dom) {}
   } ;

   ns.Bindable = Bindable ;
})(window.Sway) ;