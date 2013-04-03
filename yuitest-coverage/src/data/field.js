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
_yuitest_coverage["./src/data/Field.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/Field.js",
    code: []
};
_yuitest_coverage["./src/data/Field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (Ns) {","    \"use strict\" ;","","    var defaults = {}","","    /**","     *","     * @class Sway.data.Field","     * @param {Array} [filters] list of filter","     */","     //, f = function (filterList) {","     , f = function () {","	defaults.x = 10 ;","        Object.defineProperty(this, '_value',","            {","                value: null","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, 'value',","            {","                value: null","                , set: this.setValue","                , get: this.getValue","            }","        ) ;","    } ;","","    f.prototype = {","        /**","         * @method getValue","         * @returns {*}","         */","        getValue: function() {","            return this._value ;","        }","        /**","         * @method getFilteredValue","         */","        , getFilteredValue: function() {","            return this._value ;","","        }","        /**","         * @method setValue","         * @param {Object|String|Blob|Array} value the value of the field instance","         */","        , setValue: function(input) {","            this._value = input ;","","        }","        /**","         * @method setFilteredValue","         * @param {Object|String|Blob|Array} value the filtered value of the field instance","         */","        , setFilteredValue: function(input) {","            this._value = input ;","","        }","        /**","         * @method size","         */","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","    } ;","","    Ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/Field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"16":0,"17":0,"23":0,"32":0,"38":0,"44":0,"52":0,"60":0,"67":0,"71":0};
_yuitest_coverage["./src/data/Field.js"].functions = {"f:15":0,"getValue:37":0,"getFilteredValue:43":0,"setValue:51":0,"setFilteredValue:59":0,"getSize:66":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/Field.js"].coveredLines = 15;
_yuitest_coverage["./src/data/Field.js"].coveredFunctions = 7;
_yuitest_coverline("./src/data/Field.js", 1);
window.Sway = window.Sway || {}; // make sure it exists
_yuitest_coverline("./src/data/Field.js", 2);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/Field.js", 4);
(function (Ns) {
    _yuitest_coverfunc("./src/data/Field.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/Field.js", 5);
"use strict" ;

    _yuitest_coverline("./src/data/Field.js", 7);
var defaults = {}

    /**
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filter
     */
     //, f = function (filterList) {
     , f = function () {
	_yuitest_coverfunc("./src/data/Field.js", "f", 15);
_yuitest_coverline("./src/data/Field.js", 16);
defaults.x = 10 ;
        _yuitest_coverline("./src/data/Field.js", 17);
Object.defineProperty(this, '_value',
            {
                value: null
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/Field.js", 23);
Object.defineProperty(this, 'value',
            {
                value: null
                , set: this.setValue
                , get: this.getValue
            }
        ) ;
    } ;

    _yuitest_coverline("./src/data/Field.js", 32);
f.prototype = {
        /**
         * @method getValue
         * @returns {*}
         */
        getValue: function() {
            _yuitest_coverfunc("./src/data/Field.js", "getValue", 37);
_yuitest_coverline("./src/data/Field.js", 38);
return this._value ;
        }
        /**
         * @method getFilteredValue
         */
        , getFilteredValue: function() {
            _yuitest_coverfunc("./src/data/Field.js", "getFilteredValue", 43);
_yuitest_coverline("./src/data/Field.js", 44);
return this._value ;

        }
        /**
         * @method setValue
         * @param {Object|String|Blob|Array} value the value of the field instance
         */
        , setValue: function(input) {
            _yuitest_coverfunc("./src/data/Field.js", "setValue", 51);
_yuitest_coverline("./src/data/Field.js", 52);
this._value = input ;

        }
        /**
         * @method setFilteredValue
         * @param {Object|String|Blob|Array} value the filtered value of the field instance
         */
        , setFilteredValue: function(input) {
            _yuitest_coverfunc("./src/data/Field.js", "setFilteredValue", 59);
_yuitest_coverline("./src/data/Field.js", 60);
this._value = input ;

        }
        /**
         * @method size
         */
        , getSize: function() {
            _yuitest_coverfunc("./src/data/Field.js", "getSize", 66);
_yuitest_coverline("./src/data/Field.js", 67);
return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    _yuitest_coverline("./src/data/Field.js", 71);
Ns.Field = f ;

})(window.Sway.data) ;


