window.Sway = window.Sway || {data: {}} ; // make sure it exists

(function(Ns) {

    defaults = {
        //
    }

    /**
     * This class stores a string in memory. If a persistance dependency is defined, it will use this dependency to store
     * the data. Filters are used to perform some action on the data before persisting it and on retrieval.
     * As an example, a persistance dependency could be WebSQL storage. A filter could be encryption and/or compression.
     * Note that for an encryption filter, it will perform an action on the data before persisting it, and on retrieval.
     *
     * @class Sway.data.Record
     * @param {Object}[persistence] dependency which can persist the data
     * @param {Array} [filterList] list of filters. Depending on the filter type its a before and/or after filter.
     */
	var d = function(persistance, fieldList ) {

        Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_fields',
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
        this._fields.forEach(function(c, i) {
           this._fieldLookup[c.getKey()] = c ;
        }.bind(this)) ;
    } ;

	d.prototype = {
        setField: function(key, value) {

        },

        setValue: function(key, value) {

        },

        getSize: function() {
            return this.state == "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;

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
    function getStr(callback) {
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

	Ns.Data = d ;

})(window.Sway.data) ;
