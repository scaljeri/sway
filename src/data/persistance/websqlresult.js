window.Sway = window.Sway || {} ; // make sure it exists
window.Sway.data = window.Sway.data || {} ;
window.Sway.data.persistance = window.Sway.data.persistance || {} ;

(function(ns){
    /**
     * @class Sway.data.persistance.WebSqlResult
     */
    var WebSqlResult = function(result, model) {
        this.result = result ;
        this.model  = model ;
        this.length = result.rows.length ;

    } ;
    WebSqlResult.prototype = {
        /**
         * @method forEach
         * @param {Function} callback
         */
        forEach: function(callback) {
            for( var i = 0; i < this.result.rows.length; i++) {
                callback(new this.model(this.result.rows.item(i)), i) ;
            }
        }
    } ;

    ns.WebSqlResult = WebSqlResult ;
})(window.Sway.data.util) ;
