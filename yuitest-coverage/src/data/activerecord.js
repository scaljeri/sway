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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(Ns) {","    \"use strict\" ;","","    /**","     * The ActiveRecord class represents data-structures, like a database table. An instance represents a single record.","     * It is a blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks","     *","     * For example, to create a User model, do","     *","     *      var User = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [","     *                new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'}) )","     *              , new Field( [encryptFilter], {type: 'TEXT', key: 'password', friendlyName: 'Password'}) )","     *              , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'} )","     *          ]) ;","     *","     *      ) ; // create a new model class with WebSQL persistance and three fields","     *","     *      User.find( // asynchronious call","     *         {","     *               'username':   'John'","     *             , 'password': 'Secret'","     *         }, function(user) {","     *             alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;","     *             var cloneUser = new User(user) ;","     *             cloneUser.birthDay = new Date() ;","     *             newUser.save() ;","     *         }","     *      ) ;","     *","     * @class Sway.data.ActiveRecord","     * @constructor","     * @param {String} modelName name of the model","     * @param {Object}[persistence] object used for data persistance and lookups","     * @param {Array} [fieldList] list of fields","     */","     var ActiveRecord = function(modelName, persistance, fieldList ) {","","        /*","        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these","        function independent of this BLESSED mechanism the blow variables is used within each function","         */","        Object.defineProperty(this, '_ar',          // use this._ar instead of this","            {","                value:this","                , configurable: false","                , writable: false","                , enumerable: false // hide it","            }","        ) ;","","        Object.defineProperty(this, '_persist',","            {","                value: persistance","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_field',","            {","                value: []","                , enumerable: false // hide it","            }","        ) ;","        Object.defineProperty(this, '_fieldLookup',","            {","                value: {}","                , enumerable: false // hide it","            }","        ) ;","    } ;","","	ActiveRecord.prototype = {","        /**","         * @chainable","         * @param {Object} model instance to be blessed","         */","        bless: function(model) {","            var i","                , setup ;","","            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance","                {","                    value: this","                    , enumerable: false // hide it","                }","            ) ;","","            // copy methods","            model.save = this.save ;","","            // clone the fields","            if ( !model._field ) {","                Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance","                    {","                        value: []","                        , enumerable: false // hide it","                    }","                ) ;","                Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance","                    {","                        value:{}","                        , enumerable: false // hide it","                    }","                ) ;","","                for( i = 0; i < this._field.length; i++ ){","                    setup = this._field[i] ;","                    model._fieldLookup[setup.key] = model._field.length ;","                    model._field.push(clone(this._field[i])) ;","                }","            }","            return this ;","        }","        /**","         * @param {String} key","         * @return {Object} Field instance","         */","        , getField: function(key) {","            return this._field[this._fieldLookup[key]].field ;","        }","        /**","         * @param {String} key","         * @param {Object} field Field instance","         */","        , setField: function(key, field) {","           this._fieldLookup[key] = this._field.length ;","            this._field.push({ key: key, field: field}) ;","        }","        /**","         * @param {String} key","         * @returns {Number}","         */","        , getSize: function(key) {","            var self = this._ar","                , size = 0","                , i ;","","            if ( key ) {","                return self._field[self._fieldLookup[key]].field.getSize() ;","            }","            else {","                for( i = 0; i < self._field.length; i++ ) {","                    size += self._field[i].field.getSize() ;","                }","            }","            return size ;","            /*","            return (this.state == \"uncompressed\" ?","                        new Blob([this._inputStr], { type: \"text/plain\"}) : this._zippedBlob","                   ).size ;","            */","        },","        save: function() {","        }","    } ;","","    function clone (obj){","        var key","            , temp ;","","        if(obj === null || typeof(obj) !== 'object') {","            return obj;","        }","","        temp = obj.constructor();                           // changed","","        for(key in obj) {                                   // copy every attribute","            temp[key] = obj[key] ;","        }","        return temp;","    }","","	Ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"40":0,"46":0,"55":0,"61":0,"67":0,"75":0,"81":0,"84":0,"92":0,"95":0,"96":0,"102":0,"109":0,"110":0,"111":0,"112":0,"115":0,"122":0,"129":0,"130":0,"137":0,"141":0,"142":0,"145":0,"146":0,"149":0,"160":0,"161":0,"164":0,"165":0,"168":0,"170":0,"171":0,"173":0,"176":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:40":0,"bless:80":0,"getField:121":0,"setField:128":0,"getSize:136":0,"clone:160":0,"(anonymous 1):5":0};
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
     * The ActiveRecord class represents data-structures, like a database table. An instance represents a single record.
     * It is a blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks
     *
     * For example, to create a User model, do
     *
     *      var User = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [
     *                new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'}) )
     *              , new Field( [encryptFilter], {type: 'TEXT', key: 'password', friendlyName: 'Password'}) )
     *              , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'} )
     *          ]) ;
     *
     *      ) ; // create a new model class with WebSQL persistance and three fields
     *
     *      User.find( // asynchronious call
     *         {
     *               'username':   'John'
     *             , 'password': 'Secret'
     *         }, function(user) {
     *             alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
     *             var cloneUser = new User(user) ;
     *             cloneUser.birthDay = new Date() ;
     *             newUser.save() ;
     *         }
     *      ) ;
     *
     * @class Sway.data.ActiveRecord
     * @constructor
     * @param {String} modelName name of the model
     * @param {Object}[persistence] object used for data persistance and lookups
     * @param {Array} [fieldList] list of fields
     */
     _yuitest_coverline("./src/data/activerecord.js", 40);
var ActiveRecord = function(modelName, persistance, fieldList ) {

        /*
        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these
        function independent of this BLESSED mechanism the blow variables is used within each function
         */
        _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 40);
_yuitest_coverline("./src/data/activerecord.js", 46);
Object.defineProperty(this, '_ar',          // use this._ar instead of this
            {
                value:this
                , configurable: false
                , writable: false
                , enumerable: false // hide it
            }
        ) ;

        _yuitest_coverline("./src/data/activerecord.js", 55);
Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 61);
Object.defineProperty(this, '_field',
            {
                value: []
                , enumerable: false // hide it
            }
        ) ;
        _yuitest_coverline("./src/data/activerecord.js", 67);
Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

	_yuitest_coverline("./src/data/activerecord.js", 75);
ActiveRecord.prototype = {
        /**
         * @chainable
         * @param {Object} model instance to be blessed
         */
        bless: function(model) {
            _yuitest_coverfunc("./src/data/activerecord.js", "bless", 80);
_yuitest_coverline("./src/data/activerecord.js", 81);
var i
                , setup ;

            _yuitest_coverline("./src/data/activerecord.js", 84);
Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            // copy methods
            _yuitest_coverline("./src/data/activerecord.js", 92);
model.save = this.save ;

            // clone the fields
            _yuitest_coverline("./src/data/activerecord.js", 95);
if ( !model._field ) {
                _yuitest_coverline("./src/data/activerecord.js", 96);
Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance
                    {
                        value: []
                        , enumerable: false // hide it
                    }
                ) ;
                _yuitest_coverline("./src/data/activerecord.js", 102);
Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance
                    {
                        value:{}
                        , enumerable: false // hide it
                    }
                ) ;

                _yuitest_coverline("./src/data/activerecord.js", 109);
for( i = 0; i < this._field.length; i++ ){
                    _yuitest_coverline("./src/data/activerecord.js", 110);
setup = this._field[i] ;
                    _yuitest_coverline("./src/data/activerecord.js", 111);
model._fieldLookup[setup.key] = model._field.length ;
                    _yuitest_coverline("./src/data/activerecord.js", 112);
model._field.push(clone(this._field[i])) ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 115);
return this ;
        }
        /**
         * @param {String} key
         * @return {Object} Field instance
         */
        , getField: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getField", 121);
_yuitest_coverline("./src/data/activerecord.js", 122);
return this._field[this._fieldLookup[key]].field ;
        }
        /**
         * @param {String} key
         * @param {Object} field Field instance
         */
        , setField: function(key, field) {
           _yuitest_coverfunc("./src/data/activerecord.js", "setField", 128);
_yuitest_coverline("./src/data/activerecord.js", 129);
this._fieldLookup[key] = this._field.length ;
            _yuitest_coverline("./src/data/activerecord.js", 130);
this._field.push({ key: key, field: field}) ;
        }
        /**
         * @param {String} key
         * @returns {Number}
         */
        , getSize: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getSize", 136);
_yuitest_coverline("./src/data/activerecord.js", 137);
var self = this._ar
                , size = 0
                , i ;

            _yuitest_coverline("./src/data/activerecord.js", 141);
if ( key ) {
                _yuitest_coverline("./src/data/activerecord.js", 142);
return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                _yuitest_coverline("./src/data/activerecord.js", 145);
for( i = 0; i < self._field.length; i++ ) {
                    _yuitest_coverline("./src/data/activerecord.js", 146);
size += self._field[i].field.getSize() ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 149);
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

    _yuitest_coverline("./src/data/activerecord.js", 160);
function clone (obj){
        _yuitest_coverfunc("./src/data/activerecord.js", "clone", 160);
_yuitest_coverline("./src/data/activerecord.js", 161);
var key
            , temp ;

        _yuitest_coverline("./src/data/activerecord.js", 164);
if(obj === null || typeof(obj) !== 'object') {
            _yuitest_coverline("./src/data/activerecord.js", 165);
return obj;
        }

        _yuitest_coverline("./src/data/activerecord.js", 168);
temp = obj.constructor();                           // changed

        _yuitest_coverline("./src/data/activerecord.js", 170);
for(key in obj) {                                   // copy every attribute
            _yuitest_coverline("./src/data/activerecord.js", 171);
temp[key] = obj[key] ;
        }
        _yuitest_coverline("./src/data/activerecord.js", 173);
return temp;
    }

	_yuitest_coverline("./src/data/activerecord.js", 176);
Ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
