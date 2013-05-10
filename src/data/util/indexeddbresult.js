window.Sway = window.Sway || {} ; // make sure it exists
window.Sway.utils = window.Sway.utils || {} ; // make sure it exists

(function(ns){
    var IndexedDbResult = function(result) {
        this.result = result ;
        this.length = result.rows.length ;

    } ;
    IndexedDbResult.prototype = {
        get: function(i) {
            return this.result.rows.item(i) ;
        }
    } ;

    ns.IndexedDbResult =  IndexedDbResult;
})(window.Sway.utils) ;
