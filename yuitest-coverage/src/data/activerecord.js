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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","    var DEFAULTS = {","            STATE: {","                /*","                 * @property STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /*","                 * @property STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , statics = {","            /*","            * TODO","            * @method find","            * @static","            * @param {Object} options","            */","            find: function(options) {","","            }","            /*","            * @method save","            * @static","            * @param {Object} options","            */","            , save: function(options) {","            }","        }","        /**","         * ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access","         * to its resources, like a database.<br>","         * This class is a helper class, because it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}.","         * Its a blue print and gives all models it creates everything they need to perform CRUD-like tasks","         *","         *      var UserModel = new ActiveRecord( 'User', new WebSqlStorage('user-table'), [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                      ]) ;","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object}[storage] object used to access the underlying data structure","         * @param {Array} [fieldList] list of fields (see {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}) ) ;","         */","       , ActiveRecord = function(modelName, storage, fieldList ) {","            var i, key ;","","           function Model(data, options) {                              // define the model class/function","               if ( !options) {                                         // fix input","                    options = {} ;","               }","               if ( !data ) {","                   data = {} ;","               }","               else if ( data.$className ) {","                   data = data.toJSON() ;","               }","","               Object.defineProperty(this, '__state__',","                   {","                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL","                       , enumarable: false","                   }) ;","               Object.defineProperty(this, '$className',                // name of the class it belongs too","                   {","                       value: this.constructor.name","                       , writable: false","                   }) ;","               Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                   {                                                    // added to the record","                       value: null","                       , enumarable: false","                       , writable: true","                   }) ;","","               Object.defineProperty(this, '__length',                  // if the data comes from storage, this number represents","                   {                                                    // the number of items this record encapsulates","                       value: 0","                       , writable: false","                   }) ;","               Object.defineProperty(this, '__dataSet',                 // al items","                   {","                       value: data","                       , writable: false","                   }) ;","","               for( i in this.constructor.fields ) {                // TODO: initialize with first item","                   this[i] = data[i] ;","","               }","               return Object.seal(this) ;                               // make sure no properties can be added","            }","","            for( i in INSTANCE ){","                Model.prototype[i] = INSTANCE[i] ;                                // create instance function","            }","","            // create static stuff","            for ( i in STATIC ) {                                   // create static methods","                Model[i] = STATIC[i].bind(Model) ;","            }","            Model.storage = storage ;                                   // reference to the storage object","            Model.fields = {} ;                                         // field container, referenced by their key value","            for( i = 0; i < fieldList.length; i++ ) {","                key = fieldList[i].key ;","                Model.fields[key] = fieldList[i] ;         // add field to fields object","                // create a 'findByXXX' function, like: findByUserName","                Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);","            }","            return Model ;","        }","","        , STATIC = {","            find: function(record, callback) {","                if ( record.$className ) {","                    record = record.toJSON() ;","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;","                if ( typeof(json) === 'object' ) {","                    return new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","                }","            }","            , save: function(json, callback) {","                // for performance (no instance required","            }","        }","","        , INSTANCE = {","            getState: function() {","                return this.__state__ ;","            }","            , setState: function(state, callback) {","                this.state = state ;","                // TODO: applie transformers","                callback() ;","            }","            , toJSON: function() { // ale","                var json = {}","                    , i ;","                for( i in this.constructor.fields ) {","                    json[i] = this[i] ;","                }","                return json ;","            }","            , save: function(callback) {","","            }","            , getFields: function() {","                return this.constructor.fields ;","            }","            , next: function() {","","            }","            , prev: function() {","","            }","            , item: function() {","","            }","            , hasNext: function() {","","            }","            , hasPrev: function() {","","            }","            , load: function(key, callback) {","                var json = {} ;","                if ( this.fields[key].FK ) {","                    json[key] = this[key] ;","                    this.fields[key].model.find(json, function(records){","                            this[key] = records ;","                            callback(this) ;","                        }.bind(this) ) ;","                }","            }","        } ;","","    /* Private helpers */","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value) ;","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id","        if ( callback ) {","            callback(newRec) ;                                              // return a new record","        }","        return newRec ;","    }","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","/* Define the Model class here */","","/**"," * Use the Model class to create instances which represent your data records. These will speed up your develement"," * when CRUD-like tasks need to be done.<br>"," * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}."," *"," * <h3>The basics</h3>"," * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on"," * a specific field"," *"," *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;"," *"," * Of course, the same can be achieved using the more general search method"," *"," *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;"," *"," * With <tt>find</tt> it is also possible to define more fields to search for.<br>"," * A Model instance, on the otherhand, can be used to create or manipulate data"," *"," *     userRecord = new User() ;                            // create a blank record"," *     userRecord.username = 'John' ;                       // set the username"," *     userRecord.password = 'Secret' ;                     // set the password"," *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail"," *"," * <h3>Multiple result-sets</h3>"," * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always"," * represent a single record, internally this has the whole result set."," *"," * its current"," * state will always be a single record, it is possible to navigate from one state to an other"," *"," *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;"," *"," * <h3>Advanced</h3>"," *"," *"," *"," * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,"," * the Model instance represent them all, holding in its current state the first record's values"," *"," *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;"," *"," * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}"," * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to"," * understand how to deal with multi-record result-sets."," *"," *"," *     var userRecord = new User({username: 'John', password: 'Secret'}) ;"," *     ...."," *     userRecord.save() ;"," *"," * All fields are accessible as a property of a record"," *"," *     var userRecord = new User() ;"," *     userRecord.username = 'John' ;"," *     userRecord.password = 'Secret' ;"," *"," * @class Sway.data.Model"," * @constructor"," * @param {Object} [data] JSON data or a model instance to be cloned"," */","/**"," * TODO"," * @method save"," *"," */","/**"," * @method next"," */","/**"," * @method prev"," */","/**"," * @method item"," */","/**"," * @method hasNext"," */","/**"," * set the a new state."," * @param state"," * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all"," * values are transformed immediately."," * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values"," * are transformed."," */","/**"," *"," * returns all the data in JSON format (unfiltered)"," * @method toJSON"," * @param {String} key"," * @returns {Number}"," */","/**"," * Use find to perform searches"," *"," *      User.find( {"," *           'username':   'John'"," *           , 'password': 'Secret'"," *      }, function(user) { ... } ) ;"," *"," * Or simply create a new instance of a Model and use it for a search or save action"," *"," *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;"," *      User.find(userRecord, callback) ;"," *      // or"," *      userRecord.save() ;"," * @method find"," * @static"," * @param {Object} data JSON or model instance"," * @param {Object} [options] configuration"," *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded."," *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable."," */","/**"," * @method save"," * @static"," * @param {Object} options"," */","/**"," * @property STATE.TRANFORMED"," * @static"," */","/**"," * @property STATE.NORMAL"," * @static"," */","","/**"," * @method getState"," */","/**"," * @method setState"," */","/**"," * Call this function to make it aware of changes made to the data it relates to. Because a Model instance"," * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed"," * by one and the same storage object. This storage object is responsible for the notifications."," *"," * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance"," * otherwise, the"," * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},"," * @method link"," */","/**"," * @method unlink"," */","/**"," * @method load"," * @param {String} key name of the field"," * @param {Function} [callback] callback function, called when the data is available"," */"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"8":0,"59":0,"61":0,"62":0,"63":0,"65":0,"66":0,"68":0,"69":0,"72":0,"77":0,"82":0,"89":0,"94":0,"100":0,"101":0,"104":0,"107":0,"108":0,"112":0,"113":0,"115":0,"116":0,"117":0,"118":0,"119":0,"121":0,"123":0,"128":0,"129":0,"131":0,"132":0,"133":0,"143":0,"146":0,"148":0,"151":0,"153":0,"154":0,"156":0,"162":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"193":0,"194":0,"200":0,"201":0,"202":0,"203":0,"204":0,"206":0,"209":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"Model:61":0,"ActiveRecord:58":0,"find:127":0,"getState:142":0,"setState:145":0,"toJSON:150":0,"getFields:161":0,"(anonymous 2):183":0,"load:179":0,"findBy:193":0,"loadJSON:200":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 60;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 12;
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
         * ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access
         * to its resources, like a database.<br>
         * This class is a helper class, because it creates new Model classes of type {{#crossLink "Sway.data.Model"}}{{/crossLink}}.
         * Its a blue print and gives all models it creates everything they need to perform CRUD-like tasks
         *
         *      var UserModel = new ActiveRecord( 'User', new WebSqlStorage('user-table'), [
         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *                      ]) ;
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object}[storage] object used to access the underlying data structure
         * @param {Array} [fieldList] list of fields (see {{#crossLink "Sway.data.Field"}}{{/crossLink}}) ) ;
         */
       , ActiveRecord = function(modelName, storage, fieldList ) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 58);
_yuitest_coverline("./src/data/activerecord.js", 59);
var i, key ;

           _yuitest_coverline("./src/data/activerecord.js", 61);
function Model(data, options) {                              // define the model class/function
               _yuitest_coverfunc("./src/data/activerecord.js", "Model", 61);
_yuitest_coverline("./src/data/activerecord.js", 62);
if ( !options) {                                         // fix input
                    _yuitest_coverline("./src/data/activerecord.js", 63);
options = {} ;
               }
               _yuitest_coverline("./src/data/activerecord.js", 65);
if ( !data ) {
                   _yuitest_coverline("./src/data/activerecord.js", 66);
data = {} ;
               }
               else {_yuitest_coverline("./src/data/activerecord.js", 68);
if ( data.$className ) {
                   _yuitest_coverline("./src/data/activerecord.js", 69);
data = data.toJSON() ;
               }}

               _yuitest_coverline("./src/data/activerecord.js", 72);
Object.defineProperty(this, '__state__',
                   {
                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                       , enumarable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 77);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                   {
                       value: this.constructor.name
                       , writable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 82);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                   {                                                    // added to the record
                       value: null
                       , enumarable: false
                       , writable: true
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 89);
Object.defineProperty(this, '__length',                  // if the data comes from storage, this number represents
                   {                                                    // the number of items this record encapsulates
                       value: 0
                       , writable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 94);
Object.defineProperty(this, '__dataSet',                 // al items
                   {
                       value: data
                       , writable: false
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 100);
for( i in this.constructor.fields ) {                // TODO: initialize with first item
                   _yuitest_coverline("./src/data/activerecord.js", 101);
this[i] = data[i] ;

               }
               _yuitest_coverline("./src/data/activerecord.js", 104);
return Object.seal(this) ;                               // make sure no properties can be added
            }

            _yuitest_coverline("./src/data/activerecord.js", 107);
for( i in INSTANCE ){
                _yuitest_coverline("./src/data/activerecord.js", 108);
Model.prototype[i] = INSTANCE[i] ;                                // create instance function
            }

            // create static stuff
            _yuitest_coverline("./src/data/activerecord.js", 112);
for ( i in STATIC ) {                                   // create static methods
                _yuitest_coverline("./src/data/activerecord.js", 113);
Model[i] = STATIC[i].bind(Model) ;
            }
            _yuitest_coverline("./src/data/activerecord.js", 115);
Model.storage = storage ;                                   // reference to the storage object
            _yuitest_coverline("./src/data/activerecord.js", 116);
Model.fields = {} ;                                         // field container, referenced by their key value
            _yuitest_coverline("./src/data/activerecord.js", 117);
for( i = 0; i < fieldList.length; i++ ) {
                _yuitest_coverline("./src/data/activerecord.js", 118);
key = fieldList[i].key ;
                _yuitest_coverline("./src/data/activerecord.js", 119);
Model.fields[key] = fieldList[i] ;         // add field to fields object
                // create a 'findByXXX' function, like: findByUserName
                _yuitest_coverline("./src/data/activerecord.js", 121);
Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);
            }
            _yuitest_coverline("./src/data/activerecord.js", 123);
return Model ;
        }

        , STATIC = {
            find: function(record, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 127);
_yuitest_coverline("./src/data/activerecord.js", 128);
if ( record.$className ) {
                    _yuitest_coverline("./src/data/activerecord.js", 129);
record = record.toJSON() ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 131);
var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                _yuitest_coverline("./src/data/activerecord.js", 132);
if ( typeof(json) === 'object' ) {
                    _yuitest_coverline("./src/data/activerecord.js", 133);
return new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                }
            }
            , save: function(json, callback) {
                // for performance (no instance required
            }
        }

        , INSTANCE = {
            getState: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 142);
_yuitest_coverline("./src/data/activerecord.js", 143);
return this.__state__ ;
            }
            , setState: function(state, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 145);
_yuitest_coverline("./src/data/activerecord.js", 146);
this.state = state ;
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 148);
callback() ;
            }
            , toJSON: function() { // ale
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 150);
_yuitest_coverline("./src/data/activerecord.js", 151);
var json = {}
                    , i ;
                _yuitest_coverline("./src/data/activerecord.js", 153);
for( i in this.constructor.fields ) {
                    _yuitest_coverline("./src/data/activerecord.js", 154);
json[i] = this[i] ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 156);
return json ;
            }
            , save: function(callback) {

            }
            , getFields: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 161);
_yuitest_coverline("./src/data/activerecord.js", 162);
return this.constructor.fields ;
            }
            , next: function() {

            }
            , prev: function() {

            }
            , item: function() {

            }
            , hasNext: function() {

            }
            , hasPrev: function() {

            }
            , load: function(key, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 179);
_yuitest_coverline("./src/data/activerecord.js", 180);
var json = {} ;
                _yuitest_coverline("./src/data/activerecord.js", 181);
if ( this.fields[key].FK ) {
                    _yuitest_coverline("./src/data/activerecord.js", 182);
json[key] = this[key] ;
                    _yuitest_coverline("./src/data/activerecord.js", 183);
this.fields[key].model.find(json, function(records){
                            _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 183);
_yuitest_coverline("./src/data/activerecord.js", 184);
this[key] = records ;
                            _yuitest_coverline("./src/data/activerecord.js", 185);
callback(this) ;
                        }.bind(this) ) ;
                }
            }
        } ;

    /* Private helpers */

    _yuitest_coverline("./src/data/activerecord.js", 193);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 193);
_yuitest_coverline("./src/data/activerecord.js", 194);
console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 200);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 200);
_yuitest_coverline("./src/data/activerecord.js", 201);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        _yuitest_coverline("./src/data/activerecord.js", 202);
newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 203);
if ( callback ) {
            _yuitest_coverline("./src/data/activerecord.js", 204);
callback(newRec) ;                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 206);
return newRec ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 209);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;

/* Define the Model class here */

/**
 * Use the Model class to create instances which represent your data records. These will speed up your develement
 * when CRUD-like tasks need to be done.<br>
 * To create a Model class, use {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}}.
 *
 * <h3>The basics</h3>
 * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on
 * a specific field
 *
 *     UserModel.findByUsername('John', function(userRecord) {
 *          // this === UserModel
 *     }) ;
 *
 * Of course, the same can be achieved using the more general search method
 *
 *     UserModel.find( {username: 'John'}, function(userRecord) {
 *          // this === UserModel
 *     }) ;
 *
 * With <tt>find</tt> it is also possible to define more fields to search for.<br>
 * A Model instance, on the otherhand, can be used to create or manipulate data
 *
 *     userRecord = new User() ;                            // create a blank record
 *     userRecord.username = 'John' ;                       // set the username
 *     userRecord.password = 'Secret' ;                     // set the password
 *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail
 *
 * <h3>Multiple result-sets</h3>
 * In {{#crossLink "Sway"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always
 * represent a single record, internally this has the whole result set.
 *
 * its current
 * state will always be a single record, it is possible to navigate from one state to an other
 *
 *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result
 *           while( record.hasNext() ) {                    // check if there is an other record
 *                record.next() ;                           // move on record up
 *                ....
 *           }
 *           record.item(1) ;                               // go to second record
 *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'
 *     }) ;
 *
 * <h3>Advanced</h3>
 *
 *
 *
 * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,
 * the Model instance represent them all, holding in its current state the first record's values
 *
 *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records
 *          console.log("Found " + ar.length + " records) ;
 *      }) ;
 *
 * Checkout {{#crossLink "Sway.data.Model/next:method"}}{{/crossLink}}, {{#crossLink "Sway.data.Model/prev:method"}}{{/crossLink}}
 * {{#crossLink "Sway.data.Model/item:method"}}{{/crossLink}} and {{#crossLink "Sway.data.Model/hasNext:method"}}{{/crossLink}} to
 * understand how to deal with multi-record result-sets.
 *
 *
 *     var userRecord = new User({username: 'John', password: 'Secret'}) ;
 *     ....
 *     userRecord.save() ;
 *
 * All fields are accessible as a property of a record
 *
 *     var userRecord = new User() ;
 *     userRecord.username = 'John' ;
 *     userRecord.password = 'Secret' ;
 *
 * @class Sway.data.Model
 * @constructor
 * @param {Object} [data] JSON data or a model instance to be cloned
 */
/**
 * TODO
 * @method save
 *
 */
/**
 * @method next
 */
/**
 * @method prev
 */
/**
 * @method item
 */
/**
 * @method hasNext
 */
/**
 * set the a new state.
 * @param state
 * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all
 * values are transformed immediately.
 * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values
 * are transformed.
 */
/**
 *
 * returns all the data in JSON format (unfiltered)
 * @method toJSON
 * @param {String} key
 * @returns {Number}
 */
/**
 * Use find to perform searches
 *
 *      User.find( {
 *           'username':   'John'
 *           , 'password': 'Secret'
 *      }, function(user) { ... } ) ;
 *
 * Or simply create a new instance of a Model and use it for a search or save action
 *
 *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;
 *      User.find(userRecord, callback) ;
 *      // or
 *      userRecord.save() ;
 * @method find
 * @static
 * @param {Object} data JSON or model instance
 * @param {Object} [options] configuration
 *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.
 *  If the record is <tt>lazy</tt>, call {{#crossLink "Sway.data.Model/load:method"}}{{/crossLink}} first to make the data avaiable.
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

/**
 * @method getState
 */
/**
 * @method setState
 */
/**
 * Call this function to make it aware of changes made to the data it relates to. Because a Model instance
 * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed
 * by one and the same storage object. This storage object is responsible for the notifications.
 *
 * Always call {{#crossLink "Sway.data.Model/unlink:method"}}{{/crossLink}} to disable this behavior, or when the Model instance
 * otherwise, the
 * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink "Sway.data.Model/unlink:method"}}{{/crossLink}},
 * @method link
 */
/**
 * @method unlink
 */
/**
 * @method load
 * @param {String} key name of the field
 * @param {Function} [callback] callback function, called when the data is available
 */
