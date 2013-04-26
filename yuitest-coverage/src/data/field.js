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
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\" ;","","    var DEFAULTS = {","        STATES: {","            FILTERED: 'filtered'","            , UNFILTERED: 'unfiltered'","        }","    }","","    /**","     * A Field represent a single value of an ActiveRecord model.","     *","     *     var username = new Field({ type: 'TEXT', key: 'username', friendlyName: 'User name' }) ;","     *","     * Or if it the field holds data which should be encrypted and compressed","     *","     *     var accountInfo = new Field( { type: 'BLOB', key: 'accountInfo', friendLyName: 'Account info'}, [encryptFilter, compressFilter] ) ;","     *","     * @class Sway.data.Field","     * @param {Array} [filters] list of filters","     * @param {Object} [options] configuration","     *      @param {Boolean} [keepValues=false] keep a reference to both original and filtered value (requires more memory)","     */","        , f = function (filterList, options) {","            this.filterList = filterList ;","","            Object.defineProperty(this, '_filteredValue',","                {","                    value: null","                    , enumerable: false // hide it","                    , writable: true","                }","            ) ;","            Object.defineProperty(this, '_value',","                {","                    value: null","                    , enumerable: false // hide it","                    , writable: true","                }","            ) ;","","            this.state = ns.Field.STATES.UNFILTERED ;","        } ;","","    f.STATES = DEFAULTS.STATES ;","","    f.prototype = {","        /**","         * @method getValue","         * @param {Function} callback","         * @returns {*}","         */","        getValue: function(callback) {","            if ( this.state === ns.Field.STATES.FILTERED ) {","                // TODO get filtered value or return _filteredValue","            }","            else {","                // TODO get unfiltered value or return _value","            }","            return this._value ;","        }","","        /**","         * @method getKey","         * @param {Boolean} [filtered=false] return the","         * @return {String}","         */","        , getKey: function() {","            return this.key ;","        }","        /**","         * @method setValue","         * @chainable","         * @param {*} input Currently only a 'String' is accepted as unfiltered value!","         * @param {Boolean} [filtered=false]","         */","        , setValue: function(input, filtered) {","            this[(filtered ? '_filteredValue' : '_value')] = input ;","            this[(filtered ? '_value' : '_filteredValue')] = null ;     // cleanup","            this.state = ns.Field.STATES[ (filtered ? '' : 'UN') + 'FILTERED'] ;","            return this ;","        }","        ,setState: function(state) {","            this.state = state ;","        }","        /**","         * Returns the size of","         * @method size","         */","        , getSize: function() {","            return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","        }","    } ;","","    ns.Field = f ;","","})(window.Sway.data) ;","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"29":0,"31":0,"38":0,"46":0,"49":0,"51":0,"58":0,"64":0,"73":0,"82":0,"83":0,"84":0,"85":0,"88":0,"95":0,"99":0};
_yuitest_coverage["./src/data/field.js"].functions = {"f:28":0,"getValue:57":0,"getKey:72":0,"setValue:81":0,"setState:87":0,"getSize:94":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 21;
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
     * A Field represent a single value of an ActiveRecord model.
     *
     *     var username = new Field({ type: 'TEXT', key: 'username', friendlyName: 'User name' }) ;
     *
     * Or if it the field holds data which should be encrypted and compressed
     *
     *     var accountInfo = new Field( { type: 'BLOB', key: 'accountInfo', friendLyName: 'Account info'}, [encryptFilter, compressFilter] ) ;
     *
     * @class Sway.data.Field
     * @param {Array} [filters] list of filters
     * @param {Object} [options] configuration
     *      @param {Boolean} [keepValues=false] keep a reference to both original and filtered value (requires more memory)
     */
        , f = function (filterList, options) {
            _yuitest_coverfunc("./src/data/field.js", "f", 28);
_yuitest_coverline("./src/data/field.js", 29);
this.filterList = filterList ;

            _yuitest_coverline("./src/data/field.js", 31);
Object.defineProperty(this, '_filteredValue',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;
            _yuitest_coverline("./src/data/field.js", 38);
Object.defineProperty(this, '_value',
                {
                    value: null
                    , enumerable: false // hide it
                    , writable: true
                }
            ) ;

            _yuitest_coverline("./src/data/field.js", 46);
this.state = ns.Field.STATES.UNFILTERED ;
        } ;

    _yuitest_coverline("./src/data/field.js", 49);
f.STATES = DEFAULTS.STATES ;

    _yuitest_coverline("./src/data/field.js", 51);
f.prototype = {
        /**
         * @method getValue
         * @param {Function} callback
         * @returns {*}
         */
        getValue: function(callback) {
            _yuitest_coverfunc("./src/data/field.js", "getValue", 57);
_yuitest_coverline("./src/data/field.js", 58);
if ( this.state === ns.Field.STATES.FILTERED ) {
                // TODO get filtered value or return _filteredValue
            }
            else {
                // TODO get unfiltered value or return _value
            }
            _yuitest_coverline("./src/data/field.js", 64);
return this._value ;
        }

        /**
         * @method getKey
         * @param {Boolean} [filtered=false] return the
         * @return {String}
         */
        , getKey: function() {
            _yuitest_coverfunc("./src/data/field.js", "getKey", 72);
_yuitest_coverline("./src/data/field.js", 73);
return this.key ;
        }
        /**
         * @method setValue
         * @chainable
         * @param {*} input Currently only a 'String' is accepted as unfiltered value!
         * @param {Boolean} [filtered=false]
         */
        , setValue: function(input, filtered) {
            _yuitest_coverfunc("./src/data/field.js", "setValue", 81);
_yuitest_coverline("./src/data/field.js", 82);
this[(filtered ? '_filteredValue' : '_value')] = input ;
            _yuitest_coverline("./src/data/field.js", 83);
this[(filtered ? '_value' : '_filteredValue')] = null ;     // cleanup
            _yuitest_coverline("./src/data/field.js", 84);
this.state = ns.Field.STATES[ (filtered ? '' : 'UN') + 'FILTERED'] ;
            _yuitest_coverline("./src/data/field.js", 85);
return this ;
        }
        ,setState: function(state) {
            _yuitest_coverfunc("./src/data/field.js", "setState", 87);
_yuitest_coverline("./src/data/field.js", 88);
this.state = state ;
        }
        /**
         * Returns the size of
         * @method size
         */
        , getSize: function() {
            _yuitest_coverfunc("./src/data/field.js", "getSize", 94);
_yuitest_coverline("./src/data/field.js", 95);
return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
        }
    } ;

    _yuitest_coverline("./src/data/field.js", 99);
ns.Field = f ;

})(window.Sway.data) ;


