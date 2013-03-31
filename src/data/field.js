window.Sway = window.Sway || {} ; // make sure it exists
window.Sway.data = window.Sway.data || {} ;

(function(Ns) {

    var defaults = {
    } ;

    /**
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filter
     */
    var f = function( filterList ) {
        Object.defineProperty(this, '_value',
            {
                value: null
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, 'value',
            {
                enumerable: true
                , set: setValue
                , get: getValue
            }
        ) ;
        Object.defineProperty(this, '_filtered',
            {
                value:null          // no filtered state defined yet
                , enumerable:false
            }
        ) ;
        Object.defineProperty(this, 'filtered',
            {
                enumerable: true
                , set: setFiltered
                , get: getFiltered
            }
        ) ;
    } ;

    f.prototype = {
        size: function() {
            return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
        , clear: function() {}
    } ;

    function getFiltered() {
        return this._filtered ;
    }
    function setFiltered(filtered, callback) {
        if ( this._filtered !== filtered ) {
           // apply filters
           if ( this._filtered !== null ){
               this._filters.reverse() ; // reverse the order of filters
           }
           applyFilters.call(this, 0, (filtered === true ? 'do' : 'undo'), callback) ;
           this._filtered = filtered ;
        }
        else {
            callback() ;
        }
    }

    function getValue(filtered, callback) {
       setFiltered.call(this, filtered, function() {
          callback(this._value) ;
       }) ;
    }

    /*
     * Private function
     * This function is called recursively, while incrementing the 'index'
     */
    function applyFilters(index, mtype, callback) {
       var filter = this._filters[index] ;
       if ( !filter )  { // done - no filter defined
           callback() ;
       }
       else {
           // apply filter
           if ( filter[mtype]) { // check if method is available
                filter[mtype](this._value, applyFilters.bind(this))
           }
           else { // skip this filter
                applyFilters.call(this, index + 1, mtype, callback) ;
           }
       }
    }

    Ns.Field = f ;

})(window.Sway.data) ;


