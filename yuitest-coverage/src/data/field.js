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
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\" ;","","    var DEFAULTS = {","        STATES: {","            FILTERED: 'filtered'","            , UNFILTERED: 'unfiltered'","        }","    }","","    /**","     * A Field represents a single value of an ActiveRecord model.","     *","     *     var username = new Field({ type: 'TEXT', key: 'username', friendlyName: 'User name' }) ;","     *","     * Or if it the field holds data which should be encrypted and compressed","     *","     *     var accountInfo = new Field( { type: 'BLOB', key: 'accountInfo', friendLyName: 'Account info'}, [encryptFilter, compressFilter] ) ;","     *","     * See {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}} to understand how it fits into the bigger picture.","     *","     * @class Sway.data.Field","     * @constructor","     * @param {Object} definition definition of this field","     *      @param {String} definition.key","     *      @param {String} [definition.type=TEXT]","     *      @param {String} [definition.friendlyName]","     *      @param {Boolean} [definition.PK=false] primary key field","     *      @param {Boolean} [definition.required=false]","     * @param {Array} [transformers] list of transformer objects. A transformer object can transform the data into a new form and also back","     * into its original form. Think of, zipping and unzipping or encrypting and decrypting","     * @param {Array} [validators] list of validation functions","     */","        , f = function (definition, filterList, validators) {","            this.filterList = filterList ;","            this.key = definition.key ;","            this.friendlyName = definition.friendlyName ;","            this.type = definition.type ;","","            Object.defineProperty(this, '_filteredValue',","                {","                    value: null","                    , enumerable: false // hide it","                    , writable: true","                }","            ) ;","            Object.defineProperty(this, '_value',","                {","                    value: null","                    , enumerable: false // hide it","                    , writable: true","                }","            ) ;","","            this.state = ns.Field.STATES.UNFILTERED ;","        } ;","","    f.STATES = DEFAULTS.STATES ;","","    f.prototype = {","        /**","         * @method getValue","         * @param {Function} callback","         * @returns {*}","         */","        getValue: function(callback) {","            if ( this.state === ns.Field.STATES.FILTERED ) {","                // TODO get filtered value or return _filteredValue","            }","            else {","                // TODO get unfiltered value or return _value","            }","            return this._value ;","        }","","        /**","         * @method getKey","         * @param {Boolean} [filtered=false] return the","         * @return {String}","         */","        , getKey: function() {","            return this.key ;","        }","        /**","         * @method setValue","         * @chainable","         * @param {*} input Currently only a 'String' is accepted as unfiltered value!","         * @param {Boolean} [filtered=false]","         */","        , setValue: function(input, filtered) {","            this[(filtered ? '_filteredValue' : '_value')] = input ;","            this[(filtered ? '_value' : '_filteredValue')] = null ;     // cleanup","            this.state = ns.Field.STATES[ (filtered ? '' : 'UN') + 'FILTERED'] ;","            return this ;","        }","        ,setState: function(state) {","            this.state = state ;","        }","        /**","         * Returns the size of","         * @method size","         */","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","    } ;","","    ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"38":0,"39":0,"40":0,"41":0,"43":0,"50":0,"58":0,"61":0,"63":0,"70":0,"76":0,"85":0,"94":0,"95":0,"96":0,"97":0,"100":0,"107":0,"111":0};
_yuitest_coverage["./src/data/field.js"].functions = {"f:37":0,"getValue:69":0,"getKey:84":0,"setValue:93":0,"setState:99":0,"getSize:106":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 24;
_yuitest_coverage["./src/data/field.js"].coveredFunctions = 7;
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
            _yuitest_coverfunc("./src/data/field.js", "f", 37);
_yuitest_coverline("./src/data/field.js", 38);
this.filterList = filterList ;
            _yuitest_coverline("./src/data/field.js", 39);
this.key = definition.key ;
            _yuitest_coverline("./src/data/field.js", 40);
this.friendlyName = definition.friendlyName ;
            _yuitest_coverline("./src/data/field.js", 41);
this.type = definition.type ;

            _yuitest_coverline("./src/data/field.js", 43);
Object.defineProperty(this, '_filteredValue',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;
            _yuitest_coverline("./src/data/field.js", 50);
Object.defineProperty(this, '_value',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;

            _yuitest_coverline("./src/data/field.js", 58);
this.state = ns.Field.STATES.UNFILTERED ;
        } ;

    _yuitest_coverline("./src/data/field.js", 61);
f.STATES = DEFAULTS.STATES ;

    _yuitest_coverline("./src/data/field.js", 63);
f.prototype = {
        /**
         * @method getValue
         * @param {Function} callback
         * @returns {*}
         */
        getValue: function(callback) {
            _yuitest_coverfunc("./src/data/field.js", "getValue", 69);
_yuitest_coverline("./src/data/field.js", 70);
if ( this.state === ns.Field.STATES.FILTERED ) {
                // TODO get filtered value or return _filteredValue
            }
            else {
                // TODO get unfiltered value or return _value
            }
            _yuitest_coverline("./src/data/field.js", 76);
return this._value ;
        }

        /**
         * @method getKey
         * @param {Boolean} [filtered=false] return the
         * @return {String}
         */
        , getKey: function() {
            _yuitest_coverfunc("./src/data/field.js", "getKey", 84);
_yuitest_coverline("./src/data/field.js", 85);
return this.key ;
        }
        /**
         * @method setValue
         * @chainable
         * @param {*} input Currently only a 'String' is accepted as unfiltered value!
         * @param {Boolean} [filtered=false]
         */
        , setValue: function(input, filtered) {
            _yuitest_coverfunc("./src/data/field.js", "setValue", 93);
_yuitest_coverline("./src/data/field.js", 94);
this[(filtered ? '_filteredValue' : '_value')] = input ;
            _yuitest_coverline("./src/data/field.js", 95);
this[(filtered ? '_value' : '_filteredValue')] = null ;     // cleanup
            _yuitest_coverline("./src/data/field.js", 96);
this.state = ns.Field.STATES[ (filtered ? '' : 'UN') + 'FILTERED'] ;
            _yuitest_coverline("./src/data/field.js", 97);
return this ;
        }
        ,setState: function(state) {
            _yuitest_coverfunc("./src/data/field.js", "setState", 99);
_yuitest_coverline("./src/data/field.js", 100);
this.state = state ;
        }
        /**
         * Returns the size of
         * @method size
         */
        , getSize: function() {
            _yuitest_coverfunc("./src/data/field.js", "getSize", 106);
_yuitest_coverline("./src/data/field.js", 107);
return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    _yuitest_coverline("./src/data/field.js", 111);
ns.Field = f ;

})(window.Sway.data) ;


