window.Sway = window.Sway || {}; // make sure it exists
window.Sway.data = window.Sway.data || {};

(function (Ns) {
    "use strict" ;

    var defaults = {}

    /**
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filter
     */
     //, f = function (filterList) {
     , f = function () {
	defaults.x = 10 ;
        Object.defineProperty(this, '_value',
            {
                value: null
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, 'value',
            {
                value: null
                , set: this.setValue
                , get: this.getValue
            }
        ) ;
    } ;

    f.prototype = {
        /**
         * @method getValue
         * @returns {*}
         */
        getValue: function() {
            return this._value ;
        }
        /**
         * @method getFilteredValue
         */
        , getFilteredValue: function() {
            return this._value ;

        }
        /**
         * @method setValue
         * @param {Object|String|Blob|Array} value the value of the field instance
         */
        , setValue: function(input) {
            this._value = input ;

        }
        /**
         * @method setFilteredValue
         * @param {Object|String|Blob|Array} value the filtered value of the field instance
         */
        , setFilteredValue: function(input) {
            this._value = input ;

        }
        /**
         * @method size
         */
        , getSize: function() {
            return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    Ns.Field = f ;

})(window.Sway.data) ;


