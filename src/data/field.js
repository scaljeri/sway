window.Sway = window.Sway || {}; // make sure it exists
window.Sway.data = window.Sway.data || {};

(function (ns) {
    "use strict" ;

    var DEFAULTS = {
        STATES: {
            FILTERED: 'filtered'
            , UNFILTERED: 'unfiltered'
        }
    }

    /**
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filters
     * @param {Object} [options] configuration
     *      @param {Boolean} [keepValues=false] keep a reference to both original and filtered value (requires more memory)
     */
        , f = function (filterList, options) {
            this.filterList = filterList ;

            Object.defineProperty(this, '_filteredValue',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;
            Object.defineProperty(this, '_value',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;

            this.state = ns.Field.STATES.UNFILTERED ;
        } ;

    f.STATES = DEFAULTS.STATES ;

    f.prototype = {
        /**
         * @method getValue
         * @param {Function} callback
         * @returns {*}
         */
        getValue: function(callback) {
            if ( this.state === ns.Field.STATES.FILTERED ) {
                // TODO get filtered value or return _filteredValue
            }
            else {
                // TODO get unfiltered value or return _value
            }
            return this._value ;
        }

        /**
         * @method getKey
         * @param {Boolean} [filtered=false] return the
         * @return {String}
         */
        , getKey: function() {
            return this.key ;
        }
        /**
         * @method setValue
         * @chainable
         * @param {*} input Currently only a 'String' is accepted as unfiltered value!
         * @param {Boolean} [filtered=false]
         */
        , setValue: function(input, filtered) {
            this[(filtered ? '_filteredValue' : '_value')] = input ;
            this[(filtered ? '_value' : '_filteredValue')] = null ;     // cleanup
            this.state = ns.Field.STATES[ (filtered ? '' : 'UN') + 'FILTERED'] ;
            return this ;
        }
        ,setState: function(state) {
            this.state = state ;
        }
        /**
         * Returns the size of
         * @method size
         */
        , getSize: function() {
            return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    ns.Field = f ;

})(window.Sway.data) ;


