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
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\" ;","","    var DEFAULTS = {","    }","    /**","     * A Field represents a single value of an {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}} model.","     *","     *     var username   = new Field('username', { friendlyName: 'User name' })","     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })","     *         , address  = new Field('address',  { FK: {model: Sway.data.Address}, friendlyName: 'Address' }) ;","     *","     * Or if a field holds data which should be encrypted and compressed before persisted","     *","     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;","     *","     * The constructor's <tt>options</tt> parameter has many sub-options, however, it depends on the storage engine used which are used or ignored.","     * Checkout the storage engine classes to find out which parameter are user/required.","     *","     * @class Sway.data.Field","     * @constructor","     * @param {String} key name of the field","     * @param {Object} [options] definition of this field","     *      @param {String}  [options.type=TEXT] type of the field","     *      @param {String}  [options.friendlyName] description of the field","     *      @param {Object}  [options.PK] primary key field (there can only be one primary key field)","     *          @param {Boolean} [options.PK.auto=true] Primary key field is auto-incremented (auto generated key)","","     *      @param {Object}  [options.index]","     *         @param {Boolean} [options.index.unique=false] unique field","     *         @param {Array}  [options.index.compound] names of the compound ?composite? index it is part of.","     *      @param {Boolean} [options.required=false] a required field","     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back","     * into its original form. Think of, zipping and unzipping or encrypting and decrypting","     *      @param {Array}   [options.validators] list of validation functions","     */","        , f = function (key, options) {","            if ( !options ) {","                options = {};","            }","            this.key = key ;","            this.type = options.type||'text' ;","            this.friendlyName = options.friendlyName ;","            this.transformers = options.transformers ;","            this.validators = options.validators ;","            return Object.freeze(this) ;","        } ;","","    f.prototype = {","        /**","         * @method transform","         * @param {*} value value to be transformed","         * @param {Function} callback function called with the transformed data","         */","        transform: function(value, callback) {","            if ( this.transformers ) {","                transform(0, this.transformers, callback, value) ;","            }","            else {","                callback(value) ;","            }","        }","        /**","         * @method validate","         * @param {*} value value to be validated","         * @return {Boolean}","         */","        , validate: function(value) {","            var i","                , ok = true ;","","            if ( this.validators ) {","                for( i = 0; i < this.validators.length; i++ ) {","                    if ( !this.validators[i].validate(value) ) {","                        ok = false ;","                        break ;","                    }","                }","            }","            return ok ;","        }","        /*","         * Returns the size of","         * @method size","         */","        /*","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","        */","    } ;","","    function transform(index, transformers, callback, value) {","        if ( transformers[index] ) {","            transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;","        }","        else {","           callback(value) ;","        }","    }","","    ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"41":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"52":0,"59":0,"60":0,"63":0,"72":0,"75":0,"76":0,"77":0,"78":0,"79":0,"83":0,"96":0,"97":0,"98":0,"101":0,"105":0};
_yuitest_coverage["./src/data/field.js"].functions = {"f:40":0,"transform:58":0,"validate:71":0,"transform:96":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 29;
_yuitest_coverage["./src/data/field.js"].coveredFunctions = 5;
_yuitest_coverline("./src/data/field.js", 1);
window.Sway = window.Sway || {}; // make sure it exists
_yuitest_coverline("./src/data/field.js", 2);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/field.js", 4);
(function (ns) {
    _yuitest_coverfunc("./src/data/field.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/field.js", 5);
"use strict" ;

    _yuitest_coverline("./src/data/field.js", 7);
var DEFAULTS = {
    }
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
     *      @param {Object}  [options.PK] primary key field (there can only be one primary key field)
     *          @param {Boolean} [options.PK.auto=true] Primary key field is auto-incremented (auto generated key)

     *      @param {Object}  [options.index]
     *         @param {Boolean} [options.index.unique=false] unique field
     *         @param {Array}  [options.index.compound] names of the compound ?composite? index it is part of.
     *      @param {Boolean} [options.required=false] a required field
     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back
     * into its original form. Think of, zipping and unzipping or encrypting and decrypting
     *      @param {Array}   [options.validators] list of validation functions
     */
        , f = function (key, options) {
            _yuitest_coverfunc("./src/data/field.js", "f", 40);
_yuitest_coverline("./src/data/field.js", 41);
if ( !options ) {
                _yuitest_coverline("./src/data/field.js", 42);
options = {};
            }
            _yuitest_coverline("./src/data/field.js", 44);
this.key = key ;
            _yuitest_coverline("./src/data/field.js", 45);
this.type = options.type||'text' ;
            _yuitest_coverline("./src/data/field.js", 46);
this.friendlyName = options.friendlyName ;
            _yuitest_coverline("./src/data/field.js", 47);
this.transformers = options.transformers ;
            _yuitest_coverline("./src/data/field.js", 48);
this.validators = options.validators ;
            _yuitest_coverline("./src/data/field.js", 49);
return Object.freeze(this) ;
        } ;

    _yuitest_coverline("./src/data/field.js", 52);
f.prototype = {
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function(value, callback) {
            _yuitest_coverfunc("./src/data/field.js", "transform", 58);
_yuitest_coverline("./src/data/field.js", 59);
if ( this.transformers ) {
                _yuitest_coverline("./src/data/field.js", 60);
transform(0, this.transformers, callback, value) ;
            }
            else {
                _yuitest_coverline("./src/data/field.js", 63);
callback(value) ;
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */
        , validate: function(value) {
            _yuitest_coverfunc("./src/data/field.js", "validate", 71);
_yuitest_coverline("./src/data/field.js", 72);
var i
                , ok = true ;

            _yuitest_coverline("./src/data/field.js", 75);
if ( this.validators ) {
                _yuitest_coverline("./src/data/field.js", 76);
for( i = 0; i < this.validators.length; i++ ) {
                    _yuitest_coverline("./src/data/field.js", 77);
if ( !this.validators[i].validate(value) ) {
                        _yuitest_coverline("./src/data/field.js", 78);
ok = false ;
                        _yuitest_coverline("./src/data/field.js", 79);
break ;
                    }
                }
            }
            _yuitest_coverline("./src/data/field.js", 83);
return ok ;
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

    _yuitest_coverline("./src/data/field.js", 96);
function transform(index, transformers, callback, value) {
        _yuitest_coverfunc("./src/data/field.js", "transform", 96);
_yuitest_coverline("./src/data/field.js", 97);
if ( transformers[index] ) {
            _yuitest_coverline("./src/data/field.js", 98);
transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;
        }
        else {
           _yuitest_coverline("./src/data/field.js", 101);
callback(value) ;
        }
    }

    _yuitest_coverline("./src/data/field.js", 105);
ns.Field = f ;

})(window.Sway.data) ;


