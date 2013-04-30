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
     * A Field represents a single value of an ActiveRecord model.
     *
     *     var username = new Field({ type: 'TEXT', key: 'username', friendlyName: 'User name' }) ;
     *
     * Or if it the field holds data which should be encrypted and compressed
     *
     *     var accountInfo = new Field( { type: 'BLOB', key: 'accountInfo', friendLyName: 'Account info'}, [encryptFilter, compressFilter] ) ;
     *
     * See {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}} to understand how it fits into the bigger picture.
     *
     * @class Sway.data.Field
     * @constructor
     * @param {Object} definition definition of this field
     *      @param {String} definition.key
     *      @param {String} [definition.type=TEXT]
     *      @param {String} [definition.friendlyName]
     *      @param {Boolean} [definition.PK=false] primary key field
     *      @param {Boolean} [definition.required=false]
     * @param {Array} [transformers] list of transformer objects. A transformer object can transform the data into a new form and also back
     * into its original form. Think of, zipping and unzipping or encrypting and decrypting
     * @param {Array} [validators] list of validation functions
     */
        , f = function (definition, filterList, validators) {
            this.filterList = filterList ;
            this.key = definition.key ;
            this.friendlyName = definition.friendlyName ;
            this.type = definition.type ;

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


