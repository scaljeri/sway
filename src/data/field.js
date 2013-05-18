window.Sway = window.Sway || {}; // make sure it exists
window.Sway.data = window.Sway.data || {};

(function (ns) {
    "use strict" ;

    /**
     * A Field represents a single value of an {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}} model.
     *
     *     var username   = new Field('username', { friendlyName: 'User name' })
     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })
     *         , address  = new Field('address',  { FK: {model: Sway.data.Address}, friendlyName: 'Address' }) ;
     *
     * Or if a field holds data which should be encrypted and compressed before persisted
     *
     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;
     *
     * The constructor's <tt>options</tt> parameter has many sub-options, however, it depends on the storage engine used which are used or ignored.
     * Checkout the storage engine classes to find out which parameter are user/required.
     *
     * @class Sway.data.Field
     * @constructor
     * @param {String} key name of the field
     * @param {Object} [options] definition of this field
     *      @param {String}  [options.type=TEXT] type of the field
     *      @param {String}  [options.friendlyName] description of the field
     *      @param {Boolean} [options.PK=false] primary key field (there can only be one primary key field)
     *      @param {Boolean} [options.autoIncrement=true] Primary key field is auto-incremented (auto generated key)

     *      @param {Boolean} [options.index=false]
     *      @param {Boolean} [options.unique=false] unique field
     *      @param {Array}   [options.compoundIndex] names of the compound index it is part of.
     *      @param {Boolean} [options.required=false] a required field
     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back
     * into its original form. Think of, zipping and unzipping or encrypting and decrypting
     *      @param {Array}   [options.validators] list of validation functions
     */
     var Field = function (key, options) {
            if ( !options ) {
                options = {};
            }
            for ( var i in options ) {
                this[i] = options[i] ;
            }
            this.key = key ;
            this.type = options.type||'text' ;  // define default type
            return Object.freeze(this) ;
        } ;

    Field.prototype = {
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function(value, callback) {
            if ( this.transformers ) {
                transform(0, this.transformers, callback, value) ;
            }
            else {
                callback(value) ;
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */
        , validate: function(value) {
            var i
                , ok = true ;

            if ( this.validators ) {
                for( i = 0; i < this.validators.length; i++ ) {
                    if ( !this.validators[i].validate(value) ) {
                        ok = false ;
                        break ;
                    }
                }
            }
            return ok ;
        }

        , isField: function() {
            return true ;
        }
        /*
         * Returns the size of
         * @method size
         */
        /*
        , getSize: function() {
            return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
        */
    } ;

    function transform(index, transformers, callback, value) {
        if ( transformers[index] ) {
            transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;
        }
        else {
           callback(value) ;
        }
    }

    ns.Field = Field ;

})(window.Sway.data) ;


