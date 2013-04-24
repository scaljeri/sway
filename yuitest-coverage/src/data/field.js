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
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (Ns) {","    \"use strict\" ;","","    /**","     *","     * @class Sway.data.Field","     * @param {Array} [filters] list of filters","     */","     var f = function (filterList) {","        this.filterList = filterList ;","","        Object.defineProperty(this, '_value',","            {","                value: null","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, 'value',","            {","                value: null","                , set: this.setValue","                , get: this.getValue","            }","        ) ;","    } ;","","    f.prototype = {","        /**","         * @method getValue","         * @returns {*}","         */","        getValue: function() {","            return this._value ;","        }","        /**","         * @method getFilteredValue","         */","        , getFilteredValue: function() {","            return this._value ;","","        }","        /**","         * @method setValue","         * @param {Object|String|Blob|Array} value the value of the field instance","         */","        , setValue: function(input) {","            this._value = input ;","","        }","        /**","         * @method setFilteredValue","         * @param {Object|String|Blob|Array} value the filtered value of the field instance","         */","        , setFilteredValue: function(input) {","            this._value = input ;","","        }","        /**","         * @method size","         */","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","    } ;","","    Ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"12":0,"13":0,"15":0,"21":0,"30":0,"36":0,"42":0,"50":0,"58":0,"65":0,"69":0};
_yuitest_coverage["./src/data/field.js"].functions = {"f:12":0,"getValue:35":0,"getFilteredValue:41":0,"setValue:49":0,"setFilteredValue:57":0,"getSize:64":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 15;
_yuitest_coverage["./src/data/field.js"].coveredFunctions = 7;
_yuitest_coverline("./src/data/field.js", 1);
window.Sway = window.Sway || {}; // make sure it exists
_yuitest_coverline("./src/data/field.js", 2);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/field.js", 4);
(function (Ns) {
    _yuitest_coverfunc("./src/data/field.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/field.js", 5);
"use strict" ;

    /**
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filters
     */
     _yuitest_coverline("./src/data/field.js", 12);
var f = function (filterList) {
        _yuitest_coverfunc("./src/data/field.js", "f", 12);
_yuitest_coverline("./src/data/field.js", 13);
this.filterList = filterList ;

        _yuitest_coverline("./src/data/field.js", 15);
Object.defineProperty(this, '_value',
            {
                value: null
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/field.js", 21);
Object.defineProperty(this, 'value',
            {
                value: null
                , set: this.setValue
                , get: this.getValue
            }
        ) ;
    } ;

    _yuitest_coverline("./src/data/field.js", 30);
f.prototype = {
        /**
         * @method getValue
         * @returns {*}
         */
        getValue: function() {
            _yuitest_coverfunc("./src/data/field.js", "getValue", 35);
_yuitest_coverline("./src/data/field.js", 36);
return this._value ;
        }
        /**
         * @method getFilteredValue
         */
        , getFilteredValue: function() {
            _yuitest_coverfunc("./src/data/field.js", "getFilteredValue", 41);
_yuitest_coverline("./src/data/field.js", 42);
return this._value ;

        }
        /**
         * @method setValue
         * @param {Object|String|Blob|Array} value the value of the field instance
         */
        , setValue: function(input) {
            _yuitest_coverfunc("./src/data/field.js", "setValue", 49);
_yuitest_coverline("./src/data/field.js", 50);
this._value = input ;

        }
        /**
         * @method setFilteredValue
         * @param {Object|String|Blob|Array} value the filtered value of the field instance
         */
        , setFilteredValue: function(input) {
            _yuitest_coverfunc("./src/data/field.js", "setFilteredValue", 57);
_yuitest_coverline("./src/data/field.js", 58);
this._value = input ;

        }
        /**
         * @method size
         */
        , getSize: function() {
            _yuitest_coverfunc("./src/data/field.js", "getSize", 64);
_yuitest_coverline("./src/data/field.js", 65);
return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    _yuitest_coverline("./src/data/field.js", 69);
Ns.Field = f ;

})(window.Sway.data) ;


