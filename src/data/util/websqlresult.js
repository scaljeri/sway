window.Sway = window.Sway || {} ; // make sure it exists
window.Sway.data = window.Sway.data || {} ; // make sure it exists
window.Sway.data.util = window.Sway.data.util || {} ; // make sure it exists

(function(ns){
    var WebSqlResult = function(result) {
        this.result = result ;
        this.length = result.rows.length ;

    } ;
    WebSqlResult.prototype = {
        get: function(i) {
            return this.result.rows.item(i) ;
        }
    } ;

    ns.WebSqlResult = WebSqlResult ;
})(window.Sway.data.util) ;
