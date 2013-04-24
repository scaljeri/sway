// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(Ns) {
    "use strict" ;

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
     var ActiveRecord = function(persistance ) {

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
                value: []
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

	ActiveRecord.prototype = {
        /**
         * @method bless
         * @chainable
         * @param {Object} model instance to be blessed
         */
        bless: function(model) {
            var i
                , setup ;

            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            // copy methods
            model.save = this.save ;

            // clone the fields
            if ( !model._field ) {
                Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance
                    {
                        value: []
                        , enumerable: false // hide it
                    }
                ) ;
                Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance
                    {
                        value:{}
                        , enumerable: false // hide it
                    }
                ) ;

                for( i = 0; i < this._field.length; i++ ){
                    setup = this._field[i] ;
                    model._fieldLookup[setup.key] = model._field.length ;
                    model._field.push(clone(this._field[i])) ;
                }
            }
            return this ;
        }
        /**
         * @method getField
         * @param {String} key
         * @return {Object} Field instance
         */
        , getField: function(key) {
            return this._field[this._fieldLookup[key]].field ;
        }
        , setField: function(key, field) {
           this._fieldLookup[key] = this._field.length ;
            this._field.push({ key: key, field: field}) ;
        }
        /**
         * @method getSize
         * @param {String} key
         * @returns {Number}
         */
        , getSize: function(key) {
            var self = this._ar
                , size = 0
                , i ;

            if ( key ) {
                return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                for( i = 0; i < self._field.length; i++ ) {
                    size += self._field[i].field.getSize() ;
                }
            }
            return size ;
            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
        },
        save: function() {
        }
    } ;

    function clone (obj){
        var key
            , temp ;

        if(obj === null || typeof(obj) !== 'object') {
            return obj;
        }

        temp = obj.constructor();                           // changed

        for(key in obj) {                                   // copy every attribute
            temp[key] = obj[key] ;
        }
        return temp;
    }

	Ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
