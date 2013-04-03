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
_yuitest_coverage["./src/data/activerecord.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/activerecord.js",
    code: []
};
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(Ns) {","    \"use strict\" ;","","    /**","     * This class stores a string in memory. If a persistance dependency is defined, it will use this dependency to store","     * the data. Filters are used to perform some action on the data before persisting it and on retrieval.","     * As an example, a persistance dependency could be WebSQL storage. A filter could be encryption and/or compression.","     * Note that for an encryption filter, it will perform an action on the data before persisting it, and on retrieval.","     *","     * @class Sway.data.ActiveRecord.","     * @param {Object}[persistence] dependency which can persist the data","     * @param {Array} [fieldList] list of filters. Depending on the filter type its a before and/or after filter.","     */","     var ActiveRecord = function(persistance ) {","","        /*","        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these","        function independent of this BLESSED mechanism the blow variables is used within each function","         */","        Object.defineProperty(this, '_ar',          // use this._ar instead of this","            {","                value:this","                , configurable: false","                , writable: false","                , enumerable: false // hide it","            }","        ) ;","","        Object.defineProperty(this, '_persist',","            {","                value: persistance","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_field',","            {","                value: []","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_fieldLookup',","            {","                value: {}","                , enumerable: false // hide it","            }","        ) ;","    } ;","","	ActiveRecord.prototype = {","        /**","         * @method bless","         * @chainable","         * @param {Object} model instance to be blessed","         */","        bless: function(model) {","            var i","                , setup ;","","            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance","                {","                    value: this","                    , enumerable: false // hide it","                }","            ) ;","","            // copy methods","            model.save = this.save ;","","            // clone the fields","            if ( !model._field ) {","                Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance","                    {","                        value: []","                        , enumerable: false // hide it","                    }","                ) ;","                Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance","                    {","                        value:{}","                        , enumerable: false // hide it","                    }","                ) ;","","                for( i = 0; i < this._field.length; i++ ){","                    setup = this._field[i] ;","                    model._fieldLookup[setup.key] = model._field.length ;","                    model._field.push(clone(this._field[i])) ;","                }","            }","            return this ;","        }","        /**","         * @method getField","         * @param {String} key","         * @return {Object} Field instance","         */","        , getField: function(key) {","            return this._field[this._fieldLookup[key]].field ;","        }","        , setField: function(key, field) {","           this._fieldLookup[key] = this._field.length ;","            this._field.push({ key: key, field: field}) ;","        }","        /**","         * @method getSize","         * @param {String} key","         * @returns {Number}","         */","        , getSize: function(key) {","            var self = this._ar","                , size = 0","                , i ;","","            if ( key ) {","                return self._field[self._fieldLookup[key]].field.getSize() ;","            }","            else {","                for( i = 0; i < self._field.length; i++ ) {","                    size += self._field[i].field.getSize() ;","                }","            }","            return size ;","            /*","            return (this.state == \"uncompressed\" ?","                        new Blob([this._inputStr], { type: \"text/plain\"}) : this._zippedBlob","                   ).size ;","            */","        },","        save: function() {","        }","    } ;","","    function clone (obj){","        var key","            , temp ;","","        if(obj === null || typeof(obj) !== 'object') {","            return obj;","        }","","        temp = obj.constructor();                           // changed","","        for(key in obj) {                                   // copy every attribute","            temp[key] = obj[key] ;","        }","        return temp;","    }","","	Ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"18":0,"24":0,"33":0,"39":0,"45":0,"53":0,"60":0,"63":0,"71":0,"74":0,"75":0,"81":0,"88":0,"89":0,"90":0,"91":0,"94":0,"102":0,"105":0,"106":0,"114":0,"118":0,"119":0,"122":0,"123":0,"126":0,"137":0,"138":0,"141":0,"142":0,"145":0,"147":0,"148":0,"150":0,"153":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:18":0,"bless:59":0,"getField:101":0,"setField:104":0,"getSize:113":0,"clone:137":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 39;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 7;
_yuitest_coverline("./src/data/activerecord.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/activerecord.js", 3);
window.Sway.data = window.Sway.data || {} ;

_yuitest_coverline("./src/data/activerecord.js", 5);
(function(Ns) {
    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/activerecord.js", 6);
"use strict" ;

    /**
     * This class stores a string in memory. If a persistance dependency is defined, it will use this dependency to store
     * the data. Filters are used to perform some action on the data before persisting it and on retrieval.
     * As an example, a persistance dependency could be WebSQL storage. A filter could be encryption and/or compression.
     * Note that for an encryption filter, it will perform an action on the data before persisting it, and on retrieval.
     *
     * @class Sway.data.ActiveRecord.
     * @param {Object}[persistence] dependency which can persist the data
     * @param {Array} [fieldList] list of filters. Depending on the filter type its a before and/or after filter.
     */
     _yuitest_coverline("./src/data/activerecord.js", 18);
var ActiveRecord = function(persistance ) {

        /*
        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these
        function independent of this BLESSED mechanism the blow variables is used within each function
         */
        _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 18);
_yuitest_coverline("./src/data/activerecord.js", 24);
Object.defineProperty(this, '_ar',          // use this._ar instead of this
            {
                value:this
                , configurable: false
                , writable: false
                , enumerable: false // hide it
            }
        ) ;

        _yuitest_coverline("./src/data/activerecord.js", 33);
Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 39);
Object.defineProperty(this, '_field',
            {
                value: []
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 45);
Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

	_yuitest_coverline("./src/data/activerecord.js", 53);
ActiveRecord.prototype = {
        /**
         * @method bless
         * @chainable
         * @param {Object} model instance to be blessed
         */
        bless: function(model) {
            _yuitest_coverfunc("./src/data/activerecord.js", "bless", 59);
_yuitest_coverline("./src/data/activerecord.js", 60);
var i
                , setup ;

            _yuitest_coverline("./src/data/activerecord.js", 63);
Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            // copy methods
            _yuitest_coverline("./src/data/activerecord.js", 71);
model.save = this.save ;

            // clone the fields
            _yuitest_coverline("./src/data/activerecord.js", 74);
if ( !model._field ) {
                _yuitest_coverline("./src/data/activerecord.js", 75);
Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance
                    {
                        value: []
                        , enumerable: false // hide it
                    }
                ) ;
                _yuitest_coverline("./src/data/activerecord.js", 81);
Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance
                    {
                        value:{}
                        , enumerable: false // hide it
                    }
                ) ;

                _yuitest_coverline("./src/data/activerecord.js", 88);
for( i = 0; i < this._field.length; i++ ){
                    _yuitest_coverline("./src/data/activerecord.js", 89);
setup = this._field[i] ;
                    _yuitest_coverline("./src/data/activerecord.js", 90);
model._fieldLookup[setup.key] = model._field.length ;
                    _yuitest_coverline("./src/data/activerecord.js", 91);
model._field.push(clone(this._field[i])) ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 94);
return this ;
        }
        /**
         * @method getField
         * @param {String} key
         * @return {Object} Field instance
         */
        , getField: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getField", 101);
_yuitest_coverline("./src/data/activerecord.js", 102);
return this._field[this._fieldLookup[key]].field ;
        }
        , setField: function(key, field) {
           _yuitest_coverfunc("./src/data/activerecord.js", "setField", 104);
_yuitest_coverline("./src/data/activerecord.js", 105);
this._fieldLookup[key] = this._field.length ;
            _yuitest_coverline("./src/data/activerecord.js", 106);
this._field.push({ key: key, field: field}) ;
        }
        /**
         * @method getSize
         * @param {String} key
         * @returns {Number}
         */
        , getSize: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getSize", 113);
_yuitest_coverline("./src/data/activerecord.js", 114);
var self = this._ar
                , size = 0
                , i ;

            _yuitest_coverline("./src/data/activerecord.js", 118);
if ( key ) {
                _yuitest_coverline("./src/data/activerecord.js", 119);
return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                _yuitest_coverline("./src/data/activerecord.js", 122);
for( i = 0; i < self._field.length; i++ ) {
                    _yuitest_coverline("./src/data/activerecord.js", 123);
size += self._field[i].field.getSize() ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 126);
return size ;
            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
        },
        save: function() {
        }
    } ;

    _yuitest_coverline("./src/data/activerecord.js", 137);
function clone (obj){
        _yuitest_coverfunc("./src/data/activerecord.js", "clone", 137);
_yuitest_coverline("./src/data/activerecord.js", 138);
var key
            , temp ;

        _yuitest_coverline("./src/data/activerecord.js", 141);
if(obj === null || typeof(obj) !== 'object') {
            _yuitest_coverline("./src/data/activerecord.js", 142);
return obj;
        }

        _yuitest_coverline("./src/data/activerecord.js", 145);
temp = obj.constructor();                           // changed

        _yuitest_coverline("./src/data/activerecord.js", 147);
for(key in obj) {                                   // copy every attribute
            _yuitest_coverline("./src/data/activerecord.js", 148);
temp[key] = obj[key] ;
        }
        _yuitest_coverline("./src/data/activerecord.js", 150);
return temp;
    }

	_yuitest_coverline("./src/data/activerecord.js", 153);
Ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
