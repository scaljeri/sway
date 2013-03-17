window.Sway = window.Sway || {filter: {}} ; // make sure it exists

(function(Ns){

    var c = function(filters) {
        // setup the filter chain
        Object.defineProperty(this, '_chain',
            {
                value: filters||[]
                , enumerable: false // hide it
            }
        ) ;
    } ;

    c.prototype = {
        add: function(filter, index) {

        },
        remove: function(index) {

        },
        apply: function(data, callback) {
            this.
        },

        undo: function(data, callback) {

        }
    } ;
})(window.Sway.filter) ;