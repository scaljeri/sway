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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(Ns) {","    \"use strict\" ;","","    /**","     * The ActiveRecord class represents data-structures, like a database table. An instance represent a single record.","     *","     *      var User = new ActiveRecord( webSqlPersistance ) ; // create a new model class with WebSQL persistance","     *      User.addField( new Field({type: 'TEXT', key: 'username', friendlyName: 'User name'}) ) // addField is chainable","     *          .addField( new Field([encryptFilter], {type: 'TEXT', key: 'password', friendlyName: 'Password'}) ) ;","     *          .addField( new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'}) ) ;","     *","     *      var user = User.find( {","     *             'username':   'John'","     *             , 'password': 'Secret'","     *         }) ;","     *      alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;","     *      user.birthDay = new Date() ;    // change birthday","     *      user.save() ;","     *","     * @class Sway.data.ActiveRecord","     * @param {Object}[persistence] dependency which can persist the data","     * @param {Array} [fieldList] list of filters. Depending on the filter type its a before and/or after filter.","     */","     var ActiveRecord = function(persistance ) {","","        /*","        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these","        function independent of this BLESSED mechanism the blow variables is used within each function","         */","        Object.defineProperty(this, '_ar',          // use this._ar instead of this","            {","                value:this","                , configurable: false","                , writable: false","                , enumerable: false // hide it","            }","        ) ;","","        Object.defineProperty(this, '_persist',","            {","                value: persistance","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_field',","            {","                value: []","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_fieldLookup',","            {","                value: {}","                , enumerable: false // hide it","            }","        ) ;","    } ;","","	ActiveRecord.prototype = {","        /**","         * @method bless","         * @chainable","         * @param {Object} model instance to be blessed","         */","        bless: function(model) {","            var i","                , setup ;","","            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance","                {","                    value: this","                    , enumerable: false // hide it","                }","            ) ;","","            // copy methods","            model.save = this.save ;","","            // clone the fields","            if ( !model._field ) {","                Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance","                    {","                        value: []","                        , enumerable: false // hide it","                    }","                ) ;","                Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance","                    {","                        value:{}","                        , enumerable: false // hide it","                    }","                ) ;","","                for( i = 0; i < this._field.length; i++ ){","                    setup = this._field[i] ;","                    model._fieldLookup[setup.key] = model._field.length ;","                    model._field.push(clone(this._field[i])) ;","                }","            }","            return this ;","        }","        /**","         * @method getField","         * @param {String} key","         * @return {Object} Field instance","         */","        , getField: function(key) {","            return this._field[this._fieldLookup[key]].field ;","        }","        /**","         * @method setFile","         * @param {String} key","         * @param {Object} field Field instance","         */","        , setField: function(key, field) {","           this._fieldLookup[key] = this._field.length ;","            this._field.push({ key: key, field: field}) ;","        }","        /**","         * @method getSize","         * @param {String} key","         * @returns {Number}","         */","        , getSize: function(key) {","            var self = this._ar","                , size = 0","                , i ;","","            if ( key ) {","                return self._field[self._fieldLookup[key]].field.getSize() ;","            }","            else {","                for( i = 0; i < self._field.length; i++ ) {","                    size += self._field[i].field.getSize() ;","                }","            }","            return size ;","            /*","            return (this.state == \"uncompressed\" ?","                        new Blob([this._inputStr], { type: \"text/plain\"}) : this._zippedBlob","                   ).size ;","            */","        },","        save: function() {","        }","    } ;","","    function clone (obj){","        var key","            , temp ;","","        if(obj === null || typeof(obj) !== 'object') {","            return obj;","        }","","        temp = obj.constructor();                           // changed","","        for(key in obj) {                                   // copy every attribute","            temp[key] = obj[key] ;","        }","        return temp;","    }","","	Ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"28":0,"34":0,"43":0,"49":0,"55":0,"63":0,"70":0,"73":0,"81":0,"84":0,"85":0,"91":0,"98":0,"99":0,"100":0,"101":0,"104":0,"112":0,"120":0,"121":0,"129":0,"133":0,"134":0,"137":0,"138":0,"141":0,"152":0,"153":0,"156":0,"157":0,"160":0,"162":0,"163":0,"165":0,"168":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:28":0,"bless:69":0,"getField:111":0,"setField:119":0,"getSize:128":0,"clone:152":0,"(anonymous 1):5":0};
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
     * The ActiveRecord class represents data-structures, like a database table. An instance represent a single record.
     *
     *      var User = new ActiveRecord( webSqlPersistance ) ; // create a new model class with WebSQL persistance
     *      User.addField( new Field({type: 'TEXT', key: 'username', friendlyName: 'User name'}) ) // addField is chainable
     *          .addField( new Field([encryptFilter], {type: 'TEXT', key: 'password', friendlyName: 'Password'}) ) ;
     *          .addField( new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'}) ) ;
     *
     *      var user = User.find( {
     *             'username':   'John'
     *             , 'password': 'Secret'
     *         }) ;
     *      alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
     *      user.birthDay = new Date() ;    // change birthday
     *      user.save() ;
     *
     * @class Sway.data.ActiveRecord
     * @param {Object}[persistence] dependency which can persist the data
     * @param {Array} [fieldList] list of filters. Depending on the filter type its a before and/or after filter.
     */
     _yuitest_coverline("./src/data/activerecord.js", 28);
var ActiveRecord = function(persistance ) {

        /*
        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these
        function independent of this BLESSED mechanism the blow variables is used within each function
         */
        _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 28);
_yuitest_coverline("./src/data/activerecord.js", 34);
Object.defineProperty(this, '_ar',          // use this._ar instead of this
            {
                value:this
                , configurable: false
                , writable: false
                , enumerable: false // hide it
            }
        ) ;

        _yuitest_coverline("./src/data/activerecord.js", 43);
Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 49);
Object.defineProperty(this, '_field',
            {
                value: []
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 55);
Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

	_yuitest_coverline("./src/data/activerecord.js", 63);
ActiveRecord.prototype = {
        /**
         * @method bless
         * @chainable
         * @param {Object} model instance to be blessed
         */
        bless: function(model) {
            _yuitest_coverfunc("./src/data/activerecord.js", "bless", 69);
_yuitest_coverline("./src/data/activerecord.js", 70);
var i
                , setup ;

            _yuitest_coverline("./src/data/activerecord.js", 73);
Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            // copy methods
            _yuitest_coverline("./src/data/activerecord.js", 81);
model.save = this.save ;

            // clone the fields
            _yuitest_coverline("./src/data/activerecord.js", 84);
if ( !model._field ) {
                _yuitest_coverline("./src/data/activerecord.js", 85);
Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance
                    {
                        value: []
                        , enumerable: false // hide it
                    }
                ) ;
                _yuitest_coverline("./src/data/activerecord.js", 91);
Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance
                    {
                        value:{}
                        , enumerable: false // hide it
                    }
                ) ;

                _yuitest_coverline("./src/data/activerecord.js", 98);
for( i = 0; i < this._field.length; i++ ){
                    _yuitest_coverline("./src/data/activerecord.js", 99);
setup = this._field[i] ;
                    _yuitest_coverline("./src/data/activerecord.js", 100);
model._fieldLookup[setup.key] = model._field.length ;
                    _yuitest_coverline("./src/data/activerecord.js", 101);
model._field.push(clone(this._field[i])) ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 104);
return this ;
        }
        /**
         * @method getField
         * @param {String} key
         * @return {Object} Field instance
         */
        , getField: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getField", 111);
_yuitest_coverline("./src/data/activerecord.js", 112);
return this._field[this._fieldLookup[key]].field ;
        }
        /**
         * @method setFile
         * @param {String} key
         * @param {Object} field Field instance
         */
        , setField: function(key, field) {
           _yuitest_coverfunc("./src/data/activerecord.js", "setField", 119);
_yuitest_coverline("./src/data/activerecord.js", 120);
this._fieldLookup[key] = this._field.length ;
            _yuitest_coverline("./src/data/activerecord.js", 121);
this._field.push({ key: key, field: field}) ;
        }
        /**
         * @method getSize
         * @param {String} key
         * @returns {Number}
         */
        , getSize: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getSize", 128);
_yuitest_coverline("./src/data/activerecord.js", 129);
var self = this._ar
                , size = 0
                , i ;

            _yuitest_coverline("./src/data/activerecord.js", 133);
if ( key ) {
                _yuitest_coverline("./src/data/activerecord.js", 134);
return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                _yuitest_coverline("./src/data/activerecord.js", 137);
for( i = 0; i < self._field.length; i++ ) {
                    _yuitest_coverline("./src/data/activerecord.js", 138);
size += self._field[i].field.getSize() ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 141);
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

    _yuitest_coverline("./src/data/activerecord.js", 152);
function clone (obj){
        _yuitest_coverfunc("./src/data/activerecord.js", "clone", 152);
_yuitest_coverline("./src/data/activerecord.js", 153);
var key
            , temp ;

        _yuitest_coverline("./src/data/activerecord.js", 156);
if(obj === null || typeof(obj) !== 'object') {
            _yuitest_coverline("./src/data/activerecord.js", 157);
return obj;
        }

        _yuitest_coverline("./src/data/activerecord.js", 160);
temp = obj.constructor();                           // changed

        _yuitest_coverline("./src/data/activerecord.js", 162);
for(key in obj) {                                   // copy every attribute
            _yuitest_coverline("./src/data/activerecord.js", 163);
temp[key] = obj[key] ;
        }
        _yuitest_coverline("./src/data/activerecord.js", 165);
return temp;
    }

	_yuitest_coverline("./src/data/activerecord.js", 168);
Ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
