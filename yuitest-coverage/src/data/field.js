if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["./src/data/field.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/field.js",
    code: []
};
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\" ;","","    /**","     * A Field represents a single value of an {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}} model.","     *","     *     var username   = new Field('username', { friendlyName: 'User name' })","     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })","     *         , address  = new Field('address',  { FK: {model: Sway.data.Address}, friendlyName: 'Address' }) ;","     *","     * Or if a field holds data which should be encrypted and compressed before persisted","     *","     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;","     *","     * The constructor's <tt>options</tt> parameter has many sub-options, however, it depends on the storage engine used which are used or ignored.","     * Checkout the storage engine classes to find out which parameter are user/required.","     *","     * @class Sway.data.Field","     * @constructor","     * @param {String} key name of the field","     * @param {Object} [options] definition of this field","     *      @param {String}  [options.type=TEXT] type of the field","     *      @param {String}  [options.friendlyName] description of the field","     *      @param {Boolean} [options.PK=false] primary key field (there can only be one primary key field)","     *      @param {Boolean} [options.autoIncrement=true] Primary key field is auto-incremented (auto generated key)","","     *      @param {Boolean} [options.index=false]","     *      @param {Boolean} [options.unique=false] unique field","     *      @param {Array}   [options.compoundIndex] names of the compound index it is part of.","     *      @param {Boolean} [options.required=false] a required field","     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back","     * into its original form. Think of, zipping and unzipping or encrypting and decrypting","     *      @param {Array}   [options.validators] list of validation functions","     */","     var Field = function (key, options) {","            if ( !options ) {","                options = {};","            }","            for ( var i in options ) {","                this[i] = options[i] ;","            }","            this.key = key ;","            this.type = options.type||'text' ;  // define default type","            return Object.freeze(this) ;","        } ;","","    Field.prototype = {","        /**","         * @method transform","         * @param {*} value value to be transformed","         * @param {Function} callback function called with the transformed data","         */","        transform: function(value, callback) {","            if ( this.transformers ) {","                transform(0, this.transformers, callback, value) ;","            }","            else {","                callback(value) ;","            }","        }","        /**","         * @method validate","         * @param {*} value value to be validated","         * @return {Boolean}","         */","        , validate: function(value) {","            var i","                , ok = true ;","","            if ( this.validators ) {","                for( i = 0; i < this.validators.length; i++ ) {","                    if ( !this.validators[i].validate(value) ) {","                        ok = false ;","                        break ;","                    }","                }","            }","            return ok ;","        }","","        , isField: function() {","            return true ;","        }","        /*","         * Returns the size of","         * @method size","         */","        /*","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","        */","    } ;","","    function transform(index, transformers, callback, value) {","        if ( transformers[index] ) {","            transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;","        }","        else {","           callback(value) ;","        }","    }","","    ns.Field = Field ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"38":0,"39":0,"40":0,"42":0,"43":0,"45":0,"46":0,"47":0,"50":0,"57":0,"58":0,"61":0,"70":0,"73":0,"74":0,"75":0,"76":0,"77":0,"81":0,"85":0,"98":0,"99":0,"100":0,"103":0,"107":0};
_yuitest_coverage["./src/data/field.js"].functions = {"Field:38":0,"transform:56":0,"validate:69":0,"isField:84":0,"transform:98":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 29;
_yuitest_coverage["./src/data/field.js"].coveredFunctions = 6;
_yuitest_coverline("./src/data/field.js", 1);
window.Sway = window.Sway || {}; // make sure it exists
_yuitest_coverline("./src/data/field.js", 2);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/field.js", 4);
(function (ns) {
    _yuitest_coverfunc("./src/data/field.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/field.js", 5);
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
     _yuitest_coverline("./src/data/field.js", 38);
var Field = function (key, options) {
            _yuitest_coverfunc("./src/data/field.js", "Field", 38);
_yuitest_coverline("./src/data/field.js", 39);
if ( !options ) {
                _yuitest_coverline("./src/data/field.js", 40);
options = {};
            }
            _yuitest_coverline("./src/data/field.js", 42);
for ( var i in options ) {
                _yuitest_coverline("./src/data/field.js", 43);
this[i] = options[i] ;
            }
            _yuitest_coverline("./src/data/field.js", 45);
this.key = key ;
            _yuitest_coverline("./src/data/field.js", 46);
this.type = options.type||'text' ;  // define default type
            _yuitest_coverline("./src/data/field.js", 47);
return Object.freeze(this) ;
        } ;

    _yuitest_coverline("./src/data/field.js", 50);
Field.prototype = {
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function(value, callback) {
            _yuitest_coverfunc("./src/data/field.js", "transform", 56);
_yuitest_coverline("./src/data/field.js", 57);
if ( this.transformers ) {
                _yuitest_coverline("./src/data/field.js", 58);
transform(0, this.transformers, callback, value) ;
            }
            else {
                _yuitest_coverline("./src/data/field.js", 61);
callback(value) ;
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */
        , validate: function(value) {
            _yuitest_coverfunc("./src/data/field.js", "validate", 69);
_yuitest_coverline("./src/data/field.js", 70);
var i
                , ok = true ;

            _yuitest_coverline("./src/data/field.js", 73);
if ( this.validators ) {
                _yuitest_coverline("./src/data/field.js", 74);
for( i = 0; i < this.validators.length; i++ ) {
                    _yuitest_coverline("./src/data/field.js", 75);
if ( !this.validators[i].validate(value) ) {
                        _yuitest_coverline("./src/data/field.js", 76);
ok = false ;
                        _yuitest_coverline("./src/data/field.js", 77);
break ;
                    }
                }
            }
            _yuitest_coverline("./src/data/field.js", 81);
return ok ;
        }

        , isField: function() {
            _yuitest_coverfunc("./src/data/field.js", "isField", 84);
_yuitest_coverline("./src/data/field.js", 85);
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

    _yuitest_coverline("./src/data/field.js", 98);
function transform(index, transformers, callback, value) {
        _yuitest_coverfunc("./src/data/field.js", "transform", 98);
_yuitest_coverline("./src/data/field.js", 99);
if ( transformers[index] ) {
            _yuitest_coverline("./src/data/field.js", 100);
transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;
        }
        else {
           _yuitest_coverline("./src/data/field.js", 103);
callback(value) ;
        }
    }

    _yuitest_coverline("./src/data/field.js", 107);
ns.Field = Field ;

})(window.Sway.data) ;


