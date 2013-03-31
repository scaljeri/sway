// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(Ns) {

    defaults = {
        //
    } ;

    /**
     * This class stores a string in memory. If a persistance dependency is defined, it will use this dependency to store
     * the data. Filters are used to perform some action on the data before persisting it and on retrieval.
     * As an example, a persistance dependency could be WebSQL storage. A filter could be encryption and/or compression.
     * Note that for an encryption filter, it will perform an action on the data before persisting it, and on retrieval.
     *
     * @class Sway.data.ActiveRecord.
     * @param {Object}[persistence] dependency which can persist the data
     * @param {Array} [fieldList] list of filters. Depending on the filter type its a before and/or after filter.
     */
	var ar = function(persistance, fieldList ) {

        /*
        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these
        function independent of this BLESSED mechanism the blow variables is used within each function
         */
        Object.defineProperty(this, '_ar',          // use this._ar instead of this
            {
                value:this
                , configurable: false
                , writable: false
                , enumerable: false // hide it
            }
        ) ;

        Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_field',
            {
                value: fieldList || []
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
        this._fields.forEach(function(c) {
           this._fieldLookup[c.getKey()] = c ;
        }.bind(this)) ;
    } ;

	ar.prototype = {
        bless: function(model) {
            var i ;

            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            for ( i in this.prototype ) {                   // add prototype functions to model, like 'save'
                if ( !model.prototype[i] ) {                // but only if it does not exist already!
                    model.prototype = this.prototype[i] ;
                }
            }

        }
        , setField: function(key, field) {
            var self = this._ar ;

            if ( typeof(field) === "string" ) {             // all AR fields should an instance of Sway.Field
               field = new Ns.Field(field) ;
            }
            self._fieldLookup[key] = self._fields.length ;
            self._field.push({key: key, field: field});
        }
        , getField: function(key) {
            return this._ar._fields[this._ar._fieldLookup[key]].value ;
        },

        getSize: function(key) {
            var self = this._ar
                , arLength = 0
                , i ;

            if ( key ) {
                return self._field[self._fieldLookup[key]].size() ;
            }
            else {
                for( i = 0; i < self._field.length; i++ ) {
                    arLength += self._field[self._fieldLookup[key]].size() ;
                }
            }
            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
        }
    } ;

    function setStr(str) {
        //  persist the data
        applyPreFilters.call(this, str, 0, function(filteredStr){
            if ( this._persist ) {
                this.persist.set(filteredStr) ;
            }
            else {
                this._str = filteredStr ;
            }
        }.bind(this)) ;
    }
    function getStr (callback) {
        // load the data
        if ( this._persist ) {
           this._persist.get(function(data) {
               applyPostFilters.call(this, data, this.filters.length, callback  )
           }.bind(this)) ;
        }
        else {
            applyPostFilters.call(this, this._str, this.filters.length, callback ) ;
        }
    }

    function applyPostFilers(data, index, callback) {
        var self = this ;
        // loop through all filters (NOTE that filters are asynchronous
        if ( this.filters[index] ) { // out of bounds ?
            if ( this.filters[index].pre ) { // is the filter a PRE filter
                this.filters[index].pre(str, function(fstr) {
                    applyPostFilters.call(self, fstr, --index, callback ) ;
                }) ;
            }
            else {
                applyPostFilters.call(this, --index, callback ) ;
            }
        }
        callback(str) ; // done

    }

    function applyPreFilters(str, index, callback) {
        var self = this ;
        // loop through all filters (NOTE that filters are asynchronous
        if ( this.filters[index] ) { // out of bounds ?
            if ( this.filters[index].pre ) { // is the filter a PRE filter
                this.filters[index].pre(str, function(fstr) {
                  applyPreFilters.call(self, fstr, ++index, callback ) ;
                }) ;
            }
            else {
               applyPreFilters.call(this, ++index, callback ) ;
            }
        }
        callback(str) ; // done
    }

	Ns.ActiveRecord = ar ;

})(window.Sway.data) ;
