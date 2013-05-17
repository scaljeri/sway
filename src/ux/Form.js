// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.ux = window.Sway.ux || {} ;

(function(ns){
    /**
     * Form generator. This class provides a Fluent API to construct forms.
     *
     *      new Form(json)
     *          .fieldset()
     *          .label('username').text()
     *          .label('password').password()
     *          .submit(callback)
     *          .clear() ;
     *
     * @class Sway.ux.Form
     * @constructor
     */
    var Form = function(){

   } ;

   ns.Form = Form ;
})(window.Sway.ux) ;