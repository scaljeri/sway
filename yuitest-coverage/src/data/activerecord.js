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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","    var DEFAULTS = {","            STATE: {","                /*","                 * @property STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /*","                 * @property STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , statics = {","            /*","            * TODO","            * @method find","            * @static","            * @param {Object} options","            */","            find: function(options) {","","            }","            /*","            * @method save","            * @static","            * @param {Object} options","            */","            , save: function(options) {","            }","        }","        /**","         * The ActiveRecord class represents data-structures, like a database table. However, ActiveRecord is a special class, instead of","         * creating instances of itself, is create a new class of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}. ActiveRecord is a","         * blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks","         *","         *      var UserModel = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                      ]) ;","         *","         *","         * The ActiveRecord class is a bit special, because it doesn't create an instance of itself, but instead","         * it creates a new class,  {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}. This class is has configured the","         * fields provided to the ActiveRecord's constructor.","         *","         * ActiveRecord needs the name of the model to be created, a object used to persist the data and finally a list of field","         * definitions.","         * A model is almost identical to the ActiveRecord interface, except that its constructor accepts two parameters,","         *     1) data      - json object: { username: 'John', password: 'Secret' }","         *     2) options   - options object","         * A data record is created as follows","         *","         *      User.find( // asynchronious call","         *         {","         *               'username':   'John'","         *             , 'password': 'Secret'","         *         }, function(user) {","         *             alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;","         *             var cloneUser = new User(user) ;","         *             cloneUser.birthDay = new Date() ;","         *             newUser.save() ;","         *         }","         *      ) ;","         *","         *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","         *      userRecord.save() ;","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object}[persistence] object used for data persistance and lookups","         * @param {Array} [fieldList] list of fields","         */","       , ActiveRecord = function(modelName, persistance, fieldList ) {","            var i ;","","           function Model(data, options) {                 // define the model class/function","                    if ( !options) {                                // fix input","                        options = {} ;","                    }","                    this.__data        = {} ;                       // the data object","                    this.__fields      = {} ;                       // object holding the fields","                    this.__persistance = persistance ;              // persistance layer","                    this.$className    = modelName ;                  // name of the model","                    this.__state       = typeof(options.transformed) === 'boolean' ? options.transformed : DEFAULTS.STATE.UNFILTERED ;  // state of the record","","                    Object.defineProperty(this, '__transform', {    // object used in fluent API","                        value: new Object({ self: this })","                        ,enumerable: false","                        ,writable: false","                        ,configurable: false","                    }) ;","","                    for( i = 0; i < fieldList.length; i++ ) {       // add fields to this and","                        createProperty.call(this, fieldList[i], data) ;   // populate this.fields","                    }","            }","            Model.prototype = this ; // add function using prototype inheritance","","            // add static functions","            for( i in statics ) {","                Model[i] = statics[i] ;","            }","","            // add static properties","            for ( i in DEFAULTS.STATE ) {","                Model[i] = DEFAULTS.STATE[i] ;","            }","","            return Model ;","        } ;","","    /*","     * Make fields accessible as normal properties of 'this' and populate this.fields.","     * Now values can be set an accessed as follows","     *","     *    userRecord.username = 'John' ;","     *    userRecord.transformed(false).password = 'Secret' ;","     */","    function createProperty(field, data) {","        Object.defineProperty(this, field.key, {","            get: getValue.bind(this, field)","            , set: setValue.bind(this, field)","            ,enumerable: true","            ,configurable: true","        }) ;","","        Object.defineProperty(this.__transform, field.key, {          // create fluent api object","            get: getValue.bind(this, field)","            , set: setValue.bind(this, field)","            ,enumerable: true","            ,configurable: true","        }) ;","","        this.__fields[field.key] = field ;","        // if data is an active-record, its state is used so no transformations are required","        this.__data[field.key] = { value: data[field.key], state: (typeof(data.__state) === 'boolean' ? data.__state: this.state) } ;","    }","","    /*","     * is called if a property is accessed (see createProperty)","     */","    function getValue(field) {","        return this.data[field.key]","    }","","    /*","     * is called when a property is set. Note that the context (this) in this function can be 'this' or 'this.transform'","     */","    function setValue(field, value) {","        var self = this ;","        //if ( typeof(this.isTransformed === t)","        this.data[field.key] = value ;","    }","","	ActiveRecord.prototype = {","","        transformed: function(isTransformed) {","            var i","                , retObj =  {} ;","            for( i in this.fields ) {","","            }","            this.__transform.isTransformed = isTransformed ;","            return this.__transform ;","        }","","        , toJSON: function() { // ale","            return {} ; // TODO","        }","","        , getSize: function(key) {","            var self = this._ar","                , size = 0","                , i ;","","            if ( key ) {","                return self._field[self._fieldLookup[key]].field.getSize() ;","            }","            else {","                for( i = 0; i < self._field.length; i++ ) {","                    size += self._field[i].field.getSize() ;","                }","            }","            return size ;","            /*","            return (this.state == \"uncompressed\" ?","                        new Blob([this._inputStr], { type: \"text/plain\"}) : this._zippedBlob","                   ).size ;","            */","        }","    } ;","","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","/* Define the Model class here */","","/**"," * This is a virtual class and is created using {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}. This dynamic class creation method"," * enables us to create classes fully configured with field definitions and a persistence layer at runtime. This persistence layer is, for example, the"," * connection with a database and knows how to translate an ActiveRecord into a query."," *"," * Every model comes with a set of static methods"," *"," *     User.find("," *       {"," *           'username':   'John'"," *           , 'password': 'Secret'"," *       }, function(user) {"," *           alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;"," *           var cloneUser = new User(user) ;"," *           cloneUser.birthDay = new Date() ;"," *           newUser.save() ;"," *       }"," *     ) ;"," *"," * Or simply create a new instance of a Model and use it for a search or save action"," *"," *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;"," *      User.find(userRecord, callback) ;"," *      // or"," *      userRecord.save() ;"," *"," * @class Sway.data.Model"," * @constructor"," */","/**"," * TODO"," * @method save"," *"," */","/**"," * This function should only be used if one or more fields use transformers."," *"," * This function can be used as follows"," *"," *     userRecord = new User({username: 'John'}) ;"," *     userRecord.transformed(false).password = 'Secret' ;"," *"," *"," * @method transformed"," * @chainable"," * @param isTransformed"," * @returns {Object} special object which behaves identical to this, but its state equals <tt>isTransformed</tt>"," */","/**"," * returns all the data in JSON format (unfiltered)"," * @method getToJSON"," * @param {String} key"," * @returns {Number}"," */","/**"," * @method getSize"," * @param {Sting} key"," */","/**"," * TODO"," * @method find"," * @static"," * @param {Object} options"," */","/**"," * @method save"," * @static"," * @param {Object} options"," */","/**"," * @property STATE.TRANFORMED"," * @static"," */","/**"," * @property STATE.NORMAL"," * @static"," */"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"8":0,"85":0,"87":0,"88":0,"89":0,"91":0,"92":0,"93":0,"94":0,"95":0,"97":0,"104":0,"105":0,"108":0,"111":0,"112":0,"116":0,"117":0,"120":0,"130":0,"131":0,"138":0,"145":0,"147":0,"153":0,"154":0,"160":0,"161":0,"163":0,"166":0,"169":0,"171":0,"174":0,"175":0,"179":0,"183":0,"187":0,"188":0,"191":0,"192":0,"195":0,"205":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"Model:87":0,"ActiveRecord:84":0,"createProperty:130":0,"getValue:153":0,"setValue:160":0,"transformed:168":0,"toJSON:178":0,"getSize:182":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 46;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 9;
_yuitest_coverline("./src/data/activerecord.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/activerecord.js", 3);
window.Sway.data = window.Sway.data || {} ;

_yuitest_coverline("./src/data/activerecord.js", 5);
(function(ns) {
    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/activerecord.js", 6);
"use strict" ;

    _yuitest_coverline("./src/data/activerecord.js", 8);
var DEFAULTS = {
            STATE: {
                /*
                 * @property STATE.TRANFORMED
                 * @static
                 */
                TRANSFORMED: 1
                /*
                 * @property STATE.NORMAL
                 * @static
                 */
                , NORMAL: 0
            }
        }
        , statics = {
            /*
            * TODO
            * @method find
            * @static
            * @param {Object} options
            */
            find: function(options) {

            }
            /*
            * @method save
            * @static
            * @param {Object} options
            */
            , save: function(options) {
            }
        }
        /**
         * The ActiveRecord class represents data-structures, like a database table. However, ActiveRecord is a special class, instead of
         * creating instances of itself, is create a new class of type {{#crossLink "Sway.data.Model"}}{{/crossLink}}. ActiveRecord is a
         * blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks
         *
         *      var UserModel = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [
         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *                      ]) ;
         *
         *
         * The ActiveRecord class is a bit special, because it doesn't create an instance of itself, but instead
         * it creates a new class,  {{#crossLink "Sway.data.Model"}}{{/crossLink}}. This class is has configured the
         * fields provided to the ActiveRecord's constructor.
         *
         * ActiveRecord needs the name of the model to be created, a object used to persist the data and finally a list of field
         * definitions.
         * A model is almost identical to the ActiveRecord interface, except that its constructor accepts two parameters,
         *     1) data      - json object: { username: 'John', password: 'Secret' }
         *     2) options   - options object
         * A data record is created as follows
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
         *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;
         *      userRecord.save() ;
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object}[persistence] object used for data persistance and lookups
         * @param {Array} [fieldList] list of fields
         */
       , ActiveRecord = function(modelName, persistance, fieldList ) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 84);
_yuitest_coverline("./src/data/activerecord.js", 85);
var i ;

           _yuitest_coverline("./src/data/activerecord.js", 87);
function Model(data, options) {                 // define the model class/function
                    _yuitest_coverfunc("./src/data/activerecord.js", "Model", 87);
_yuitest_coverline("./src/data/activerecord.js", 88);
if ( !options) {                                // fix input
                        _yuitest_coverline("./src/data/activerecord.js", 89);
options = {} ;
                    }
                    _yuitest_coverline("./src/data/activerecord.js", 91);
this.__data        = {} ;                       // the data object
                    _yuitest_coverline("./src/data/activerecord.js", 92);
this.__fields      = {} ;                       // object holding the fields
                    _yuitest_coverline("./src/data/activerecord.js", 93);
this.__persistance = persistance ;              // persistance layer
                    _yuitest_coverline("./src/data/activerecord.js", 94);
this.$className    = modelName ;                  // name of the model
                    _yuitest_coverline("./src/data/activerecord.js", 95);
this.__state       = typeof(options.transformed) === 'boolean' ? options.transformed : DEFAULTS.STATE.UNFILTERED ;  // state of the record

                    _yuitest_coverline("./src/data/activerecord.js", 97);
Object.defineProperty(this, '__transform', {    // object used in fluent API
                        value: new Object({ self: this })
                        ,enumerable: false
                        ,writable: false
                        ,configurable: false
                    }) ;

                    _yuitest_coverline("./src/data/activerecord.js", 104);
for( i = 0; i < fieldList.length; i++ ) {       // add fields to this and
                        _yuitest_coverline("./src/data/activerecord.js", 105);
createProperty.call(this, fieldList[i], data) ;   // populate this.fields
                    }
            }
            _yuitest_coverline("./src/data/activerecord.js", 108);
Model.prototype = this ; // add function using prototype inheritance

            // add static functions
            _yuitest_coverline("./src/data/activerecord.js", 111);
for( i in statics ) {
                _yuitest_coverline("./src/data/activerecord.js", 112);
Model[i] = statics[i] ;
            }

            // add static properties
            _yuitest_coverline("./src/data/activerecord.js", 116);
for ( i in DEFAULTS.STATE ) {
                _yuitest_coverline("./src/data/activerecord.js", 117);
Model[i] = DEFAULTS.STATE[i] ;
            }

            _yuitest_coverline("./src/data/activerecord.js", 120);
return Model ;
        } ;

    /*
     * Make fields accessible as normal properties of 'this' and populate this.fields.
     * Now values can be set an accessed as follows
     *
     *    userRecord.username = 'John' ;
     *    userRecord.transformed(false).password = 'Secret' ;
     */
    _yuitest_coverline("./src/data/activerecord.js", 130);
function createProperty(field, data) {
        _yuitest_coverfunc("./src/data/activerecord.js", "createProperty", 130);
_yuitest_coverline("./src/data/activerecord.js", 131);
Object.defineProperty(this, field.key, {
            get: getValue.bind(this, field)
            , set: setValue.bind(this, field)
            ,enumerable: true
            ,configurable: true
        }) ;

        _yuitest_coverline("./src/data/activerecord.js", 138);
Object.defineProperty(this.__transform, field.key, {          // create fluent api object
            get: getValue.bind(this, field)
            , set: setValue.bind(this, field)
            ,enumerable: true
            ,configurable: true
        }) ;

        _yuitest_coverline("./src/data/activerecord.js", 145);
this.__fields[field.key] = field ;
        // if data is an active-record, its state is used so no transformations are required
        _yuitest_coverline("./src/data/activerecord.js", 147);
this.__data[field.key] = { value: data[field.key], state: (typeof(data.__state) === 'boolean' ? data.__state: this.state) } ;
    }

    /*
     * is called if a property is accessed (see createProperty)
     */
    _yuitest_coverline("./src/data/activerecord.js", 153);
function getValue(field) {
        _yuitest_coverfunc("./src/data/activerecord.js", "getValue", 153);
_yuitest_coverline("./src/data/activerecord.js", 154);
return this.data[field.key]
    }

    /*
     * is called when a property is set. Note that the context (this) in this function can be 'this' or 'this.transform'
     */
    _yuitest_coverline("./src/data/activerecord.js", 160);
function setValue(field, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "setValue", 160);
_yuitest_coverline("./src/data/activerecord.js", 161);
var self = this ;
        //if ( typeof(this.isTransformed === t)
        _yuitest_coverline("./src/data/activerecord.js", 163);
this.data[field.key] = value ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 166);
ActiveRecord.prototype = {

        transformed: function(isTransformed) {
            _yuitest_coverfunc("./src/data/activerecord.js", "transformed", 168);
_yuitest_coverline("./src/data/activerecord.js", 169);
var i
                , retObj =  {} ;
            _yuitest_coverline("./src/data/activerecord.js", 171);
for( i in this.fields ) {

            }
            _yuitest_coverline("./src/data/activerecord.js", 174);
this.__transform.isTransformed = isTransformed ;
            _yuitest_coverline("./src/data/activerecord.js", 175);
return this.__transform ;
        }

        , toJSON: function() { // ale
            _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 178);
_yuitest_coverline("./src/data/activerecord.js", 179);
return {} ; // TODO
        }

        , getSize: function(key) {
            _yuitest_coverfunc("./src/data/activerecord.js", "getSize", 182);
_yuitest_coverline("./src/data/activerecord.js", 183);
var self = this._ar
                , size = 0
                , i ;

            _yuitest_coverline("./src/data/activerecord.js", 187);
if ( key ) {
                _yuitest_coverline("./src/data/activerecord.js", 188);
return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                _yuitest_coverline("./src/data/activerecord.js", 191);
for( i = 0; i < self._field.length; i++ ) {
                    _yuitest_coverline("./src/data/activerecord.js", 192);
size += self._field[i].field.getSize() ;
                }
            }
            _yuitest_coverline("./src/data/activerecord.js", 195);
return size ;
            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
        }
    } ;


	_yuitest_coverline("./src/data/activerecord.js", 205);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;

/* Define the Model class here */

/**
 * This is a virtual class and is created using {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}}. This dynamic class creation method
 * enables us to create classes fully configured with field definitions and a persistence layer at runtime. This persistence layer is, for example, the
 * connection with a database and knows how to translate an ActiveRecord into a query.
 *
 * Every model comes with a set of static methods
 *
 *     User.find(
 *       {
 *           'username':   'John'
 *           , 'password': 'Secret'
 *       }, function(user) {
 *           alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
 *           var cloneUser = new User(user) ;
 *           cloneUser.birthDay = new Date() ;
 *           newUser.save() ;
 *       }
 *     ) ;
 *
 * Or simply create a new instance of a Model and use it for a search or save action
 *
 *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;
 *      User.find(userRecord, callback) ;
 *      // or
 *      userRecord.save() ;
 *
 * @class Sway.data.Model
 * @constructor
 */
/**
 * TODO
 * @method save
 *
 */
/**
 * This function should only be used if one or more fields use transformers.
 *
 * This function can be used as follows
 *
 *     userRecord = new User({username: 'John'}) ;
 *     userRecord.transformed(false).password = 'Secret' ;
 *
 *
 * @method transformed
 * @chainable
 * @param isTransformed
 * @returns {Object} special object which behaves identical to this, but its state equals <tt>isTransformed</tt>
 */
/**
 * returns all the data in JSON format (unfiltered)
 * @method getToJSON
 * @param {String} key
 * @returns {Number}
 */
/**
 * @method getSize
 * @param {Sting} key
 */
/**
 * TODO
 * @method find
 * @static
 * @param {Object} options
 */
/**
 * @method save
 * @static
 * @param {Object} options
 */
/**
 * @property STATE.TRANFORMED
 * @static
 */
/**
 * @property STATE.NORMAL
 * @static
 */
