window.Sway = window.Sway || {} ; // make sure it exists
window.Sway.data = window.Sway.data || {} ; // make sure it exists
window.Sway.data.persistance = window.Sway.data.persistance || {} ; // make sure it exists

(function(ns){
    /**
     * @class Sway.data.persistance.IndexedDbResult
     */
    var IndexedDbResult = function(result, model) {
        this.result = result ;
        this.model  = model ;
        this.length = 0 ; //TODO
    } ;
    IndexedDbResult.prototype = {
        /**
         * @method forEach
         * @param {Function} callback
         */
        forEach: function(callback) {
            // TODO
        }
    } ;

    ns.IndexedDbResult =  IndexedDbResult;
})(window.Sway.data.persistance) ;
