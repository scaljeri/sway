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
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\" ;","","    var DEFAULTS = {","    }","","    /**","     * A Field represents a single value of an {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}} model.","     *","     *     var username   = new Field('username', { friendlyName: 'User name' })","     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })","     *         , address  = new Field('address',  { FK: {model: Sway.data.Address}, friendlyName: 'Address' }) ;","     *","     * Or if a field holds data which should be encrypted and compressed before persisted","     *","     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;","     *","     * @class Sway.data.Field","     * @constructor","     * @param {String} key name of the field","     * @param {Object} [options] definition of this field","     *      @param {String}  [options.type=TEXT] type of the field","     *      @param {String}  [options.friendlyName] description of the field","     *      @param {Boolean} [options.PK=false] primary key field","     *      @param {Object} [options.FK] foreign key configuration object","     *          @param {Model} options.FK.model Model reference","     *          @param {String} [options.FK.key=id] the key of the model it is referencing","     *      @param {Boolean} [options.required=false] a required field","     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back","     * into its original form. Think of, zipping and unzipping or encrypting and decrypting","     *      @param {Array}   [options.validators] list of validation functions","     */","        , f = function (key, options) {","            if ( !options ) {","                options = {};","            }","            this.key = key ;","            this.type = options.type||'text' ;","            this.friendlyName = options.friendlyName ;","            this.transformers = options.transformers ;","            this.validators = options.validators ;","            return Object.freeze(this) ;","        } ;","","    f.prototype = {","        /**","         * @method transform","         * @param {*} value value to be transformed","         * @param {Function} callback function called with the transformed data","         */","        transform: function(value, callback) {","            if ( this.transformers ) {","                transform(0, this.transformers, callback, value) ;","            }","            else {","                callback(value) ;","            }","        }","        /**","         * @method validate","         * @param {*} value value to be validated","         * @return {Boolean}","         */","        , validate: function(value) {","            var i","                , ok = true ;","","            if ( this.validators ) {","                for( i = 0; i < this.validators.length; i++ ) {","                    if ( !this.validators[i].validate(value) ) {","                        ok = false ;","                        break ;","                    }","                }","            }","            return ok ;","        }","        /*","         * Returns the size of","         * @method size","         */","        /*","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","        */","    } ;","","    function transform(index, transformers, callback, value) {","        if ( transformers[index] ) {","            transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;","        }","        else {","           callback(value) ;","        }","    }","","    ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"37":0,"38":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"48":0,"55":0,"56":0,"59":0,"68":0,"71":0,"72":0,"73":0,"74":0,"75":0,"79":0,"92":0,"93":0,"94":0,"97":0,"101":0};
_yuitest_coverage["./src/data/field.js"].functions = {"f:36":0,"transform:54":0,"validate:67":0,"transform:92":0,"(anonymous 1):4":0};
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
     * @class Sway.data.Field
     * @constructor
     * @param {String} key name of the field
     * @param {Object} [options] definition of this field
     *      @param {String}  [options.type=TEXT] type of the field
     *      @param {String}  [options.friendlyName] description of the field
     *      @param {Boolean} [options.PK=false] primary key field
     *      @param {Object} [options.FK] foreign key configuration object
     *          @param {Model} options.FK.model Model reference
     *          @param {String} [options.FK.key=id] the key of the model it is referencing
     *      @param {Boolean} [options.required=false] a required field
     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back
     * into its original form. Think of, zipping and unzipping or encrypting and decrypting
     *      @param {Array}   [options.validators] list of validation functions
     */
        , f = function (key, options) {
            _yuitest_coverfunc("./src/data/field.js", "f", 36);
_yuitest_coverline("./src/data/field.js", 37);
if ( !options ) {
                _yuitest_coverline("./src/data/field.js", 38);
options = {};
            }
            _yuitest_coverline("./src/data/field.js", 40);
this.key = key ;
            _yuitest_coverline("./src/data/field.js", 41);
this.type = options.type||'text' ;
            _yuitest_coverline("./src/data/field.js", 42);
this.friendlyName = options.friendlyName ;
            _yuitest_coverline("./src/data/field.js", 43);
this.transformers = options.transformers ;
            _yuitest_coverline("./src/data/field.js", 44);
this.validators = options.validators ;
            _yuitest_coverline("./src/data/field.js", 45);
return Object.freeze(this) ;
        } ;

    _yuitest_coverline("./src/data/field.js", 48);
f.prototype = {
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function(value, callback) {
            _yuitest_coverfunc("./src/data/field.js", "transform", 54);
_yuitest_coverline("./src/data/field.js", 55);
if ( this.transformers ) {
                _yuitest_coverline("./src/data/field.js", 56);
transform(0, this.transformers, callback, value) ;
            }
            else {
                _yuitest_coverline("./src/data/field.js", 59);
callback(value) ;
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */
        , validate: function(value) {
            _yuitest_coverfunc("./src/data/field.js", "validate", 67);
_yuitest_coverline("./src/data/field.js", 68);
var i
                , ok = true ;

            _yuitest_coverline("./src/data/field.js", 71);
if ( this.validators ) {
                _yuitest_coverline("./src/data/field.js", 72);
for( i = 0; i < this.validators.length; i++ ) {
                    _yuitest_coverline("./src/data/field.js", 73);
if ( !this.validators[i].validate(value) ) {
                        _yuitest_coverline("./src/data/field.js", 74);
ok = false ;
                        _yuitest_coverline("./src/data/field.js", 75);
break ;
                    }
                }
            }
            _yuitest_coverline("./src/data/field.js", 79);
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

    _yuitest_coverline("./src/data/field.js", 92);
function transform(index, transformers, callback, value) {
        _yuitest_coverfunc("./src/data/field.js", "transform", 92);
_yuitest_coverline("./src/data/field.js", 93);
if ( transformers[index] ) {
            _yuitest_coverline("./src/data/field.js", 94);
transformers[index].transform(value, transform.bind(null, ++index, transformers,callback) ) ;
        }
        else {
           _yuitest_coverline("./src/data/field.js", 97);
callback(value) ;
        }
    }

    _yuitest_coverline("./src/data/field.js", 101);
ns.Field = f ;

})(window.Sway.data) ;


