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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","","        /**","         * ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access","         * to its resources, like a database.<br>","         * This class is a helper class, because it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}.","         * Its a blue print and gives all models it creates everything they need to perform CRUD-like tasks","         *","         *      var UserModel = new ActiveRecord( 'User', new WebSqlStorage('user-table'), [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                      ]) ;","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object}[storage] object used to access the underlying data structure","         * @param {Array} fieldList list of fields (see {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}) ) ;","         * @param {Array} [relations] list of Relations","         */","       var ActiveRecord = function(modelName, storage, fields, relations ) {","            var i, key ;","","           function Model(data, options) {                              // define the model class/function","               if ( !options) {                                         // fix input","                    options = {} ;","               }","               if ( !data ) {","                   data = {} ;","               }","               else if ( data.$className ) {","                   data = data.toJSON() ;","               }","","               Object.defineProperty(this, '__state__',","                   {","                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL","                       , enumarable: false","                   }) ;","               Object.defineProperty(this, '$className',                // name of the class it belongs too","                   {","                       value: this.constructor.name","                       , writable: false","                   }) ;","               Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                   {                                                    // added to the record","                       value: null","                       , enumarable: false","                       , writable: true","                   }) ;","","               Object.defineProperty(this, '__length',                  // if the data comes from storage, this number represents","                   {                                                    // the number of items this record encapsulates","                       value: 0","                       , writable: false","                   }) ;","               Object.defineProperty(this, '__dataSet',                 // al items","                   {","                       value: data","                       , writable: false","                   }) ;","","               for( i in this.constructor.fields ) {                // TODO: initialize with first item","                   this[i] = data[i] ;","","               }","               return Object.seal(this) ;                               // make sure no properties can be added","            }","","            appendStaticProperties(Model, storage, fields, relations ) ;","            appendPrototypeProperties(Model) ;","","","","            return Model ;","        }","","","    /* Define the Model class here */","","    /**","     * Use the Model class to create instances which represent your data records. These will speed up your develement","     * when CRUD-like tasks need to be done.<br>","     * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}.","     *","     * <h3>The basics</h3>","     * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on","     * a specific field","     *","     *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * Of course, the same can be achieved using the more general search method","     *","     *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * With <tt>find</tt> it is also possible to define more fields to search for.<br>","     * A Model instance, on the otherhand, can be used to create or manipulate data","     *","     *     userRecord = new User() ;                            // create a blank record","     *     userRecord.username = 'John' ;                       // set the username","     *     userRecord.password = 'Secret' ;                     // set the password","     *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail","     *","     * <h3>Multiple result-sets</h3>","     * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always","     * represent a single record, internally this has the whole result set.","     *","     * its current","     * state will always be a single record, it is possible to navigate from one state to an other","     *","     *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;","     *","     * <h3>Advanced</h3>","     *","     *","     *","     * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,","     * the Model instance represent them all, holding in its current state the first record's values","     *","     *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;","     *","     * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}","     * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to","     * understand how to deal with multi-record result-sets.","     *","     *","     *     var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *     ....","     *     userRecord.save() ;","     *","     * All fields are accessible as a property of a record","     *","     *     var userRecord = new User() ;","     *     userRecord.username = 'John' ;","     *     userRecord.password = 'Secret' ;","     *","     * @class Sway.data.Model","     * @constructor","     * @param {Object} [data] JSON data or a model instance to be cloned","     */","        , DEFAULTS = {","                /**","                 * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO","                 *","                 *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record","                 *","                 * @property {Object} STATE","                 */","            STATE: {","                /**","                 * @property {Number} STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /**","                 * @property {Number} STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , STATIC = {","            /**","             * Use find to perform searches","             *","             *      User.find( {","             *           'username':   'John'","             *           , 'password': 'Secret'","             *      }, function(user) { ... } ) ;","             *","             * Or simply create a new instance of a Model and use it for a search or save action","             *","             *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","             *      User.find(userRecord, callback) ;","             *      // or","             *      userRecord.save() ;","             * @method find","             * @static","             * @param {Object} data JSON or model instance","             * @param {Object} [options] configuration","             *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.","             *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable.","             */","            find: function(record, callback) {","                if ( record.$className ) {","                    record = record.toJSON() ;","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;","                if ( typeof(json) === 'object' ) {","                    return new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","                }","            }","            /**","             * @method save","             * @static","             * @param {Object} options","             */","            , save: function(json, callback) {","                // for performance (no instance required","            }","        }","","","","","    /**","     * @method item","     */","    /**","     * @method hasNext","     */","        , INSTANCE = {","            /**","             * @method getState","             */","            getState: function() {","                return this.__state__ ;","            }","            /**","             * change the state of a record. See ......","             * @method setState","             * @param state","             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all","             * values are transformed immediately.","             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values","             * are transformed.","             */","            , setState: function(state, isLazy, callback) {","                this.state = state ;","                if ( typeof(isLazy) === 'function') {","                    callback = isLazy ;","                    isLazy = true ;","                }","                // TODO: applie transformers","                callback() ;","            }","            /**","             *","             * returns all the data in JSON format (unfiltered)","             * @method toJSON","             * @param {String} key","             * @returns {Number}","             */","            , toJSON: function() { // ale","                var json = {}","                    , i ;","                for( i in this.constructor.fields ) {","                    json[i] = this[i] ;","                }","                return json ;","            }","            /**","             * TODO","             * @method save","             *","             */","            , save: function(callback) {","","            }","            , getFields: function() {","                return this.constructor.fields ;","            }","            /**","             * @method next","             */","            , next: function() {","","            }","            /**","             * @method prev","             */","            , prev: function() {","","            }","            /**","             * @method item","             */","            , item: function() {","","            }","            /**","             * @method hasNext","             */","            , hasNext: function() {","","            }","            /**","             * @method hasPrev","             */","            , hasPrev: function() {","","            }","                /**","                 * @method load","                 * @param {String} key name of the field","                 * @param {Function} [callback] callback function, called when the data is available","                 */","            , load: function(key, callback) {","                var json = {} ;","                if ( this.fields[key].FK ) {","                    json[key] = this[key] ;","                    this.fields[key].model.find(json, function(records){","                            this[key] = records ;","                            callback(this) ;","                        }.bind(this) ) ;","                }","            }","            /**","             * Call this function to make it aware of changes made to the data it relates to. Because a Model instance","             * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed","             * by one and the same storage object. This storage object is responsible for the notifications.","             *","             * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance","             * otherwise, the","             * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},","             * @method link","             */","            , link: function() {","","            }","            /**","             * @method unlink","             */","            , unlink: function() {","","            }","        } ;","","    /* Private helpers */","","    function appendStaticProperties(Model, storage, fields, relations) {","        var i, key ;","","        for ( i in STATIC ) {                                   // create static methods","            Model[i] = STATIC[i].bind(Model) ;","        }","","        Model.storage = storage ;                                   // reference to the storage object","        Model.relations = relations ;","        Model.fields = {} ;                                         // field container, referenced by their key value","","        for( i = 0; i < fields.length; i++ ) {","            key = fields[i].key ;","            Model.fields[key] = fields[i] ;         // add field to fields object","            // create a 'findByXXX' function, like: findByUserName","            Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);","        }","    }","","    function appendPrototypeProperties(Model) {","        var i ;","","        for( i in INSTANCE ){","            Model.prototype[i] = INSTANCE[i] ;                                // create instance function","        }","    }","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value) ;","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id","        if ( callback ) {","            callback(newRec) ;                                              // return a new record","        }","        return newRec ;","    }","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","","","","","","","","",""];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"28":0,"29":0,"31":0,"32":0,"33":0,"35":0,"36":0,"38":0,"39":0,"42":0,"47":0,"52":0,"59":0,"64":0,"70":0,"71":0,"74":0,"77":0,"78":0,"82":0,"205":0,"206":0,"208":0,"209":0,"210":0,"237":0,"249":0,"250":0,"251":0,"252":0,"255":0,"265":0,"267":0,"268":0,"270":0,"281":0,"319":0,"320":0,"321":0,"322":0,"323":0,"324":0,"351":0,"352":0,"354":0,"355":0,"358":0,"359":0,"360":0,"362":0,"363":0,"364":0,"366":0,"370":0,"371":0,"373":0,"374":0,"378":0,"379":0,"385":0,"386":0,"387":0,"388":0,"389":0,"391":0,"394":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"Model:31":0,"ActiveRecord:28":0,"find:204":0,"getState:236":0,"setState:248":0,"toJSON:264":0,"getFields:280":0,"(anonymous 2):322":0,"load:318":0,"appendStaticProperties:351":0,"appendPrototypeProperties:370":0,"findBy:378":0,"loadJSON:385":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 70;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 14;
_yuitest_coverline("./src/data/activerecord.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/activerecord.js", 3);
window.Sway.data = window.Sway.data || {} ;

_yuitest_coverline("./src/data/activerecord.js", 5);
(function(ns) {
    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/activerecord.js", 6);
"use strict" ;


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
         * @param {Array} fieldList list of fields (see {{#crossLink "Sway.data.Field"}}{{/crossLink}}) ) ;
         * @param {Array} [relations] list of Relations
         */
       _yuitest_coverline("./src/data/activerecord.js", 28);
var ActiveRecord = function(modelName, storage, fields, relations ) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 28);
_yuitest_coverline("./src/data/activerecord.js", 29);
var i, key ;

           _yuitest_coverline("./src/data/activerecord.js", 31);
function Model(data, options) {                              // define the model class/function
               _yuitest_coverfunc("./src/data/activerecord.js", "Model", 31);
_yuitest_coverline("./src/data/activerecord.js", 32);
if ( !options) {                                         // fix input
                    _yuitest_coverline("./src/data/activerecord.js", 33);
options = {} ;
               }
               _yuitest_coverline("./src/data/activerecord.js", 35);
if ( !data ) {
                   _yuitest_coverline("./src/data/activerecord.js", 36);
data = {} ;
               }
               else {_yuitest_coverline("./src/data/activerecord.js", 38);
if ( data.$className ) {
                   _yuitest_coverline("./src/data/activerecord.js", 39);
data = data.toJSON() ;
               }}

               _yuitest_coverline("./src/data/activerecord.js", 42);
Object.defineProperty(this, '__state__',
                   {
                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                       , enumarable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 47);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                   {
                       value: this.constructor.name
                       , writable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 52);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                   {                                                    // added to the record
                       value: null
                       , enumarable: false
                       , writable: true
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 59);
Object.defineProperty(this, '__length',                  // if the data comes from storage, this number represents
                   {                                                    // the number of items this record encapsulates
                       value: 0
                       , writable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 64);
Object.defineProperty(this, '__dataSet',                 // al items
                   {
                       value: data
                       , writable: false
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 70);
for( i in this.constructor.fields ) {                // TODO: initialize with first item
                   _yuitest_coverline("./src/data/activerecord.js", 71);
this[i] = data[i] ;

               }
               _yuitest_coverline("./src/data/activerecord.js", 74);
return Object.seal(this) ;                               // make sure no properties can be added
            }

            _yuitest_coverline("./src/data/activerecord.js", 77);
appendStaticProperties(Model, storage, fields, relations ) ;
            _yuitest_coverline("./src/data/activerecord.js", 78);
appendPrototypeProperties(Model) ;



            _yuitest_coverline("./src/data/activerecord.js", 82);
return Model ;
        }


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
        , DEFAULTS = {
                /**
                 * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO
                 *
                 *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record
                 *
                 * @property {Object} STATE
                 */
            STATE: {
                /**
                 * @property {Number} STATE.TRANFORMED
                 * @static
                 */
                TRANSFORMED: 1
                /**
                 * @property {Number} STATE.NORMAL
                 * @static
                 */
                , NORMAL: 0
            }
        }
        , STATIC = {
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
            find: function(record, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 204);
_yuitest_coverline("./src/data/activerecord.js", 205);
if ( record.$className ) {
                    _yuitest_coverline("./src/data/activerecord.js", 206);
record = record.toJSON() ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 208);
var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                _yuitest_coverline("./src/data/activerecord.js", 209);
if ( typeof(json) === 'object' ) {
                    _yuitest_coverline("./src/data/activerecord.js", 210);
return new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                }
            }
            /**
             * @method save
             * @static
             * @param {Object} options
             */
            , save: function(json, callback) {
                // for performance (no instance required
            }
        }




    /**
     * @method item
     */
    /**
     * @method hasNext
     */
        , INSTANCE = {
            /**
             * @method getState
             */
            getState: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 236);
_yuitest_coverline("./src/data/activerecord.js", 237);
return this.__state__ ;
            }
            /**
             * change the state of a record. See ......
             * @method setState
             * @param state
             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all
             * values are transformed immediately.
             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values
             * are transformed.
             */
            , setState: function(state, isLazy, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 248);
_yuitest_coverline("./src/data/activerecord.js", 249);
this.state = state ;
                _yuitest_coverline("./src/data/activerecord.js", 250);
if ( typeof(isLazy) === 'function') {
                    _yuitest_coverline("./src/data/activerecord.js", 251);
callback = isLazy ;
                    _yuitest_coverline("./src/data/activerecord.js", 252);
isLazy = true ;
                }
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 255);
callback() ;
            }
            /**
             *
             * returns all the data in JSON format (unfiltered)
             * @method toJSON
             * @param {String} key
             * @returns {Number}
             */
            , toJSON: function() { // ale
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 264);
_yuitest_coverline("./src/data/activerecord.js", 265);
var json = {}
                    , i ;
                _yuitest_coverline("./src/data/activerecord.js", 267);
for( i in this.constructor.fields ) {
                    _yuitest_coverline("./src/data/activerecord.js", 268);
json[i] = this[i] ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 270);
return json ;
            }
            /**
             * TODO
             * @method save
             *
             */
            , save: function(callback) {

            }
            , getFields: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 280);
_yuitest_coverline("./src/data/activerecord.js", 281);
return this.constructor.fields ;
            }
            /**
             * @method next
             */
            , next: function() {

            }
            /**
             * @method prev
             */
            , prev: function() {

            }
            /**
             * @method item
             */
            , item: function() {

            }
            /**
             * @method hasNext
             */
            , hasNext: function() {

            }
            /**
             * @method hasPrev
             */
            , hasPrev: function() {

            }
                /**
                 * @method load
                 * @param {String} key name of the field
                 * @param {Function} [callback] callback function, called when the data is available
                 */
            , load: function(key, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 318);
_yuitest_coverline("./src/data/activerecord.js", 319);
var json = {} ;
                _yuitest_coverline("./src/data/activerecord.js", 320);
if ( this.fields[key].FK ) {
                    _yuitest_coverline("./src/data/activerecord.js", 321);
json[key] = this[key] ;
                    _yuitest_coverline("./src/data/activerecord.js", 322);
this.fields[key].model.find(json, function(records){
                            _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 322);
_yuitest_coverline("./src/data/activerecord.js", 323);
this[key] = records ;
                            _yuitest_coverline("./src/data/activerecord.js", 324);
callback(this) ;
                        }.bind(this) ) ;
                }
            }
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
            , link: function() {

            }
            /**
             * @method unlink
             */
            , unlink: function() {

            }
        } ;

    /* Private helpers */

    _yuitest_coverline("./src/data/activerecord.js", 351);
function appendStaticProperties(Model, storage, fields, relations) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendStaticProperties", 351);
_yuitest_coverline("./src/data/activerecord.js", 352);
var i, key ;

        _yuitest_coverline("./src/data/activerecord.js", 354);
for ( i in STATIC ) {                                   // create static methods
            _yuitest_coverline("./src/data/activerecord.js", 355);
Model[i] = STATIC[i].bind(Model) ;
        }

        _yuitest_coverline("./src/data/activerecord.js", 358);
Model.storage = storage ;                                   // reference to the storage object
        _yuitest_coverline("./src/data/activerecord.js", 359);
Model.relations = relations ;
        _yuitest_coverline("./src/data/activerecord.js", 360);
Model.fields = {} ;                                         // field container, referenced by their key value

        _yuitest_coverline("./src/data/activerecord.js", 362);
for( i = 0; i < fields.length; i++ ) {
            _yuitest_coverline("./src/data/activerecord.js", 363);
key = fields[i].key ;
            _yuitest_coverline("./src/data/activerecord.js", 364);
Model.fields[key] = fields[i] ;         // add field to fields object
            // create a 'findByXXX' function, like: findByUserName
            _yuitest_coverline("./src/data/activerecord.js", 366);
Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 370);
function appendPrototypeProperties(Model) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendPrototypeProperties", 370);
_yuitest_coverline("./src/data/activerecord.js", 371);
var i ;

        _yuitest_coverline("./src/data/activerecord.js", 373);
for( i in INSTANCE ){
            _yuitest_coverline("./src/data/activerecord.js", 374);
Model.prototype[i] = INSTANCE[i] ;                                // create instance function
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 378);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 378);
_yuitest_coverline("./src/data/activerecord.js", 379);
console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 385);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 385);
_yuitest_coverline("./src/data/activerecord.js", 386);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        _yuitest_coverline("./src/data/activerecord.js", 387);
newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 388);
if ( callback ) {
            _yuitest_coverline("./src/data/activerecord.js", 389);
callback(newRec) ;                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 391);
return newRec ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 394);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;










