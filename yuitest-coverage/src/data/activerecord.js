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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","    /*","    A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and","    2) relations can be created when available","     */","    var models = {}","        /**","         * Sway.data.ActiveRecord is the pattern used for this ORM implementation and based on the Ruby on Rails (RoR)","         * <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>. This pattern","         * encapsulates access to its resources, like a database or REST interface.<br>","         * This class is a helper class, it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}","         * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks","         *","         *      var webSql = new WebSqlStorage() ;                          // WebSql persistence","         *      var UserModel = new ActiveRecord( 'User', webSql, [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                          , new Field( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})","         *                      ]) ;","         *","         *      var PostModel = new ActiveRecord( 'Post', webSql, [","         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})","         *                            , new Field( {type: 'belongs_to', model: 'User'} )","         *                      ]) ;","         *","         *      var userRecord = new UserModel() ;","         *","         * To avoid problems with Model associations, make sure all involved models are created before any usage. A defined model can be accessed","         * as follows","         *","         *      var UserModel = ActiveRecord.get( 'User' ) ;","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object} storage  object used to access the underlying data structure","         * @param {Array}  fields  list of {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}s and {{#crossLink \"Sway.data.Relation\"}}{{/crossLink}}s","         */","        , ActiveRecord = function(modelName, storage, fields ) {","            var  Model = createModel() ;","","            appendStaticProperties(Model, storage, fields ) ;","            appendPrototypeProperties(Model) ;","","            models[modelName] = Model ;","","            return Model ;","        } ;","    /**","     * Returns a model class","     * @method get","     * @static","     * @param {String} modelName name of the model","     * @returns {Class} a model","     */","    ActiveRecord.get = function(modelName) {","        return models[modelName] ;","    } ;","","","    /* Define the Model class here */","","    /**","     * Use the Model class to create instances which represent your data records. These will speed up your develement","     * when CRUD-like tasks need to be done.<br>","     * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}.","     *","     * <h3>The basics</h3>","     * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on","     * a specific field","     *","     *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * Of course, the same can be achieved using the more general search method","     *","     *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * With <tt>find</tt> it is also possible to define more fields to search for.<br>","     * A Model instance, on the otherhand, can be used to create or manipulate data","     *","     *     userRecord = new User() ;                            // create a blank record","     *     userRecord.username = 'John' ;                       // set the username","     *     userRecord.password = 'Secret' ;                     // set the password","     *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail","     *","     * <h3>Multiple result-sets</h3>","     * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always","     * represent a single record, internally this has the whole result set.","     *","     * its current","     * state will always be a single record, it is possible to navigate from one state to an other","     *","     *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;","     *","     * <h3>Advanced</h3>","     *","     *","     *","     * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,","     * the Model instance represent them all, holding in its current state the first record's values","     *","     *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;","     *","     * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}","     * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to","     * understand how to deal with multi-record result-sets.","     *","     *","     *     var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *     ....","     *     userRecord.save() ;","     *","     * All fields are accessible as a property of a record","     *","     *     var userRecord = new User() ;","     *     userRecord.username = 'John' ;","     *     userRecord.password = 'Secret' ;","     *","     * @class Sway.data.Model","     */","     var DEFAULTS = {","                /**","                 * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO","                 *","                 *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record","                 *","                 * @property {Object} STATE","                 */","            STATE: {","                /**","                 * @property {Number} STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /**","                 * @property {Number} STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , STATIC = {","            /**","             * Use find to perform searches","             *","             *      User.find( {","             *           'username':   'John'","             *           , 'password': 'Secret'","             *      }, function(user) { ... } ) ;","             *","             * Or simply create a new instance of a Model and use it for a search or save action","             *","             *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","             *      User.find(userRecord, callback) ;","             *      // or","             *      userRecord.save() ;","             * @method find","             * @static","             * @param {Object} data JSON or model instance","             * @param {Object} [options] configuration","             *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.","             *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable.","             */","            find: function(record, callback) {","                if ( record.$className ) {                                              // json required for searching","                    record = record.toJSON() ;","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;","                if ( typeof(json) === 'object' ) {                                      // not async ?","                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","                    if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO","                        return inst ;","                    }","                }","            }","            /**","             * @method save","             * @static","             * @param {Object} options","             */","            , save: function(json, callback) {","                // for performance (no instance required","            }","        }","","    /**","     * @method item","     */","    /**","     * @method hasNext","     */","        , INSTANCE = {","            /**","             * @method getState","             */","            getState: function() {","                return this.__state__ ;","            }","            /**","             * change the state of a record. See ......","             * @method setState","             * @param state","             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all","             * values are transformed immediately.","             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values","             * are transformed.","             */","            , setState: function(state, isLazy, callback) {","                this.state = state ;","                if ( typeof(isLazy) === 'function') {","                    callback = isLazy ;","                    isLazy = true ;","                }","                // TODO: applie transformers","                callback() ;","            }","            /**","             *","             * returns all data in JSON format","             * @method toJSON","             * @returns {Object}","             */","            , toJSON: function() {","                return this.__data ;","            }","            /**","             * Save the data and its relations (See Relation TODO)","             * @method save","             * @param {Boolean} [deep=true] save related data","             * @param {Function} [callback] callback function","             *","             */","            , save: function(deep, success, error) {","               //return this.constructor.storage.save(this, deep, callback) ;","            }","            , getFields: function() {","                return this.constructor.fields ;","            }","                /**","                 * @method load","                 * @param {String} key name of the field","                 * @param {Function} [callback] callback function, called when the data is available","                 */","            , load: function(key, callback) {","                var json = {} ;","                if ( this.fields[key].FK ) {","                    json[key] = this[key] ;","                    this.fields[key].model.find(json, function(records){","                            this[key] = records ;","                            callback(this) ;","                        }.bind(this) ) ;","                }","            }","            /**","             * Call this function to make it aware of changes made to the data it relates to. Because a Model instance","             * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed","             * by one and the same storage object. This storage object is responsible for the notifications.","             *","             * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance","             * otherwise, the","             * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},","             * @method link","             */","            , link: function() {","","            }","            /**","             * @method unlink","             */","            , unlink: function() {","","            }","            , getLength: function() {","                return this.__dataSet.length ;","            }","        } ;","","","","    /* Private helpers */","","    /**","     * @class Sway.data.Model","     * @constructor","     * @param {Object} [data] ActiveRecord object or JSON data","     * @param {Object} [options]","     *      @param {String} [options.state] initial state","     */","    function createModel() {","        return function Model(data, options) {                              // define the model class/function","            options = options||{} ;                                         // fix input","            data    = data   ||{} ;","","            if ( data.$className ) {                                        // check if data is an ActiveRecord instance","                data = data.toJSON() ;","            }","","            Object.defineProperty(this, '__state__',","                {","                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL","                    , enumarable: false","                }) ;","            Object.defineProperty(this, '$className',                // name of the class it belongs too","                {","                    value: this.constructor.name","                    , writable: false","                }) ;","            Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                {                                                    // added to the record","                    value: null","                    , enumarable: false","                    , writable: true","                }) ;","","            Object.defineProperty(this, '__data',                 // al items","                {","                    value: data","                    , writable: false","                }) ;","","            var field, i ;","            for( i in this.constructor.fields) {","                field = this.constructor.fields[i] ;","               (function(i, field){","                  Object.defineProperty(this, i, {","                      set:  field.set.bind(null, this.__data)                   // set is handled by the field itself","                      , get: getProperty.bind(this, i)","                  }) ;","                  field.set(data[field.key]) ;","               }.bind(this))(i, field) ;","            }","","           return Object.preventExtensions(this) ;                               // make sure no properties can be added","        } ;","    }","","    function getProperty(key) {","        return this.__data[key] ;","    }","","    function appendStaticProperties(Model, storage, fields) {","        var i, hasPK = false;","","        for ( i in STATIC ) {                                   // create static methods","            Model[i] = STATIC[i].bind(Model) ;","        }","","        Model.storage = storage ;                                   // reference to the storage object","        Model.fields = {} ;                                         // field container, referenced by their key value","        Model.relations = {} ;                                         // field container, referenced by their key value","","","        for( i = 0; i < fields.length; i++ ) {","            Model.fields[fields[i].key] = fields[i] ;         // add field to fields object","            if ( fields[i].isSearchable ) {","                createFindByXXX(Model, fields[i]) ;","            }","            else {  // do something with associations","","            }","","            if ( fields[i].PK ) {","                hasPK = true ;","            }","        }","","        if ( !hasPK ) {","            createFindByXXX(Model, new ns.Field('id', {autoIncrement: true })) ;","        }","    }","","    function createFindByXXX(Model, field) {","        Model[['findBy', field.key.slice(0,1).toUpperCase(), field.key.slice(1)].join('')] = findBy.bind(Model, field.key);","    }","","    function appendPrototypeProperties(Model, data) {","        var i ;","","        for( i in INSTANCE ){","            Model.prototype[i] = INSTANCE[i] ;                                // create instance function","        }","    }","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value) ;","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id","        if ( callback ) {","            callback(newRec) ;                                              // return a new record","        }","        return newRec ;","    }","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","","","","","","","","",""];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"12":0,"47":0,"49":0,"50":0,"52":0,"54":0,"63":0,"64":0,"141":0,"185":0,"186":0,"188":0,"189":0,"190":0,"191":0,"192":0,"217":0,"229":0,"230":0,"231":0,"232":0,"235":0,"244":0,"257":0,"265":0,"266":0,"267":0,"268":0,"269":0,"270":0,"294":0,"309":0,"310":0,"311":0,"312":0,"314":0,"315":0,"318":0,"323":0,"328":0,"335":0,"341":0,"342":0,"343":0,"344":0,"345":0,"349":0,"353":0,"357":0,"358":0,"361":0,"362":0,"364":0,"365":0,"368":0,"369":0,"370":0,"373":0,"374":0,"375":0,"376":0,"382":0,"383":0,"387":0,"388":0,"392":0,"393":0,"396":0,"397":0,"399":0,"400":0,"404":0,"405":0,"411":0,"412":0,"413":0,"414":0,"415":0,"417":0,"420":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:46":0,"get:63":0,"find:184":0,"getState:216":0,"setState:228":0,"toJSON:243":0,"getFields:256":0,"(anonymous 2):268":0,"load:264":0,"getLength:293":0,"(anonymous 3):344":0,"Model:310":0,"createModel:309":0,"getProperty:357":0,"appendStaticProperties:361":0,"createFindByXXX:392":0,"appendPrototypeProperties:396":0,"findBy:404":0,"loadJSON:411":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 84;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 20;
_yuitest_coverline("./src/data/activerecord.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/activerecord.js", 3);
window.Sway.data = window.Sway.data || {} ;

_yuitest_coverline("./src/data/activerecord.js", 5);
(function(ns) {
    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/activerecord.js", 6);
"use strict" ;

    /*
    A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and
    2) relations can be created when available
     */
    _yuitest_coverline("./src/data/activerecord.js", 12);
var models = {}
        /**
         * Sway.data.ActiveRecord is the pattern used for this ORM implementation and based on the Ruby on Rails (RoR)
         * <a href="http://guides.rubyonrails.org/association_basics.html">ActiveRecord Associations</a>. This pattern
         * encapsulates access to its resources, like a database or REST interface.<br>
         * This class is a helper class, it creates new Model classes of type {{#crossLink "Sway.data.Model"}}{{/crossLink}}
         * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks
         *
         *      var webSql = new WebSqlStorage() ;                          // WebSql persistence
         *      var UserModel = new ActiveRecord( 'User', webSql, [
         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *                          , new Field( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})
         *                      ]) ;
         *
         *      var PostModel = new ActiveRecord( 'Post', webSql, [
         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})
         *                            , new Field( {type: 'belongs_to', model: 'User'} )
         *                      ]) ;
         *
         *      var userRecord = new UserModel() ;
         *
         * To avoid problems with Model associations, make sure all involved models are created before any usage. A defined model can be accessed
         * as follows
         *
         *      var UserModel = ActiveRecord.get( 'User' ) ;
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object} storage  object used to access the underlying data structure
         * @param {Array}  fields  list of {{#crossLink "Sway.data.Field"}}{{/crossLink}}s and {{#crossLink "Sway.data.Relation"}}{{/crossLink}}s
         */
        , ActiveRecord = function(modelName, storage, fields ) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 46);
_yuitest_coverline("./src/data/activerecord.js", 47);
var  Model = createModel() ;

            _yuitest_coverline("./src/data/activerecord.js", 49);
appendStaticProperties(Model, storage, fields ) ;
            _yuitest_coverline("./src/data/activerecord.js", 50);
appendPrototypeProperties(Model) ;

            _yuitest_coverline("./src/data/activerecord.js", 52);
models[modelName] = Model ;

            _yuitest_coverline("./src/data/activerecord.js", 54);
return Model ;
        } ;
    /**
     * Returns a model class
     * @method get
     * @static
     * @param {String} modelName name of the model
     * @returns {Class} a model
     */
    _yuitest_coverline("./src/data/activerecord.js", 63);
ActiveRecord.get = function(modelName) {
        _yuitest_coverfunc("./src/data/activerecord.js", "get", 63);
_yuitest_coverline("./src/data/activerecord.js", 64);
return models[modelName] ;
    } ;


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
     */
     _yuitest_coverline("./src/data/activerecord.js", 141);
var DEFAULTS = {
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
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 184);
_yuitest_coverline("./src/data/activerecord.js", 185);
if ( record.$className ) {                                              // json required for searching
                    _yuitest_coverline("./src/data/activerecord.js", 186);
record = record.toJSON() ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 188);
var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                _yuitest_coverline("./src/data/activerecord.js", 189);
if ( typeof(json) === 'object' ) {                                      // not async ?
                    _yuitest_coverline("./src/data/activerecord.js", 190);
var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                    _yuitest_coverline("./src/data/activerecord.js", 191);
if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO
                        _yuitest_coverline("./src/data/activerecord.js", 192);
return inst ;
                    }
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 216);
_yuitest_coverline("./src/data/activerecord.js", 217);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 228);
_yuitest_coverline("./src/data/activerecord.js", 229);
this.state = state ;
                _yuitest_coverline("./src/data/activerecord.js", 230);
if ( typeof(isLazy) === 'function') {
                    _yuitest_coverline("./src/data/activerecord.js", 231);
callback = isLazy ;
                    _yuitest_coverline("./src/data/activerecord.js", 232);
isLazy = true ;
                }
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 235);
callback() ;
            }
            /**
             *
             * returns all data in JSON format
             * @method toJSON
             * @returns {Object}
             */
            , toJSON: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 243);
_yuitest_coverline("./src/data/activerecord.js", 244);
return this.__data ;
            }
            /**
             * Save the data and its relations (See Relation TODO)
             * @method save
             * @param {Boolean} [deep=true] save related data
             * @param {Function} [callback] callback function
             *
             */
            , save: function(deep, success, error) {
               //return this.constructor.storage.save(this, deep, callback) ;
            }
            , getFields: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 256);
_yuitest_coverline("./src/data/activerecord.js", 257);
return this.constructor.fields ;
            }
                /**
                 * @method load
                 * @param {String} key name of the field
                 * @param {Function} [callback] callback function, called when the data is available
                 */
            , load: function(key, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 264);
_yuitest_coverline("./src/data/activerecord.js", 265);
var json = {} ;
                _yuitest_coverline("./src/data/activerecord.js", 266);
if ( this.fields[key].FK ) {
                    _yuitest_coverline("./src/data/activerecord.js", 267);
json[key] = this[key] ;
                    _yuitest_coverline("./src/data/activerecord.js", 268);
this.fields[key].model.find(json, function(records){
                            _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 268);
_yuitest_coverline("./src/data/activerecord.js", 269);
this[key] = records ;
                            _yuitest_coverline("./src/data/activerecord.js", 270);
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
            , getLength: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getLength", 293);
_yuitest_coverline("./src/data/activerecord.js", 294);
return this.__dataSet.length ;
            }
        } ;



    /* Private helpers */

    /**
     * @class Sway.data.Model
     * @constructor
     * @param {Object} [data] ActiveRecord object or JSON data
     * @param {Object} [options]
     *      @param {String} [options.state] initial state
     */
    _yuitest_coverline("./src/data/activerecord.js", 309);
function createModel() {
        _yuitest_coverfunc("./src/data/activerecord.js", "createModel", 309);
_yuitest_coverline("./src/data/activerecord.js", 310);
return function Model(data, options) {                              // define the model class/function
            _yuitest_coverfunc("./src/data/activerecord.js", "Model", 310);
_yuitest_coverline("./src/data/activerecord.js", 311);
options = options||{} ;                                         // fix input
            _yuitest_coverline("./src/data/activerecord.js", 312);
data    = data   ||{} ;

            _yuitest_coverline("./src/data/activerecord.js", 314);
if ( data.$className ) {                                        // check if data is an ActiveRecord instance
                _yuitest_coverline("./src/data/activerecord.js", 315);
data = data.toJSON() ;
            }

            _yuitest_coverline("./src/data/activerecord.js", 318);
Object.defineProperty(this, '__state__',
                {
                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                    , enumarable: false
                }) ;
            _yuitest_coverline("./src/data/activerecord.js", 323);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                {
                    value: this.constructor.name
                    , writable: false
                }) ;
            _yuitest_coverline("./src/data/activerecord.js", 328);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                {                                                    // added to the record
                    value: null
                    , enumarable: false
                    , writable: true
                }) ;

            _yuitest_coverline("./src/data/activerecord.js", 335);
Object.defineProperty(this, '__data',                 // al items
                {
                    value: data
                    , writable: false
                }) ;

            _yuitest_coverline("./src/data/activerecord.js", 341);
var field, i ;
            _yuitest_coverline("./src/data/activerecord.js", 342);
for( i in this.constructor.fields) {
                _yuitest_coverline("./src/data/activerecord.js", 343);
field = this.constructor.fields[i] ;
               _yuitest_coverline("./src/data/activerecord.js", 344);
(function(i, field){
                  _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 3)", 344);
_yuitest_coverline("./src/data/activerecord.js", 345);
Object.defineProperty(this, i, {
                      set:  field.set.bind(null, this.__data)                   // set is handled by the field itself
                      , get: getProperty.bind(this, i)
                  }) ;
                  _yuitest_coverline("./src/data/activerecord.js", 349);
field.set(data[field.key]) ;
               }.bind(this))(i, field) ;
            }

           _yuitest_coverline("./src/data/activerecord.js", 353);
return Object.preventExtensions(this) ;                               // make sure no properties can be added
        } ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 357);
function getProperty(key) {
        _yuitest_coverfunc("./src/data/activerecord.js", "getProperty", 357);
_yuitest_coverline("./src/data/activerecord.js", 358);
return this.__data[key] ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 361);
function appendStaticProperties(Model, storage, fields) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendStaticProperties", 361);
_yuitest_coverline("./src/data/activerecord.js", 362);
var i, hasPK = false;

        _yuitest_coverline("./src/data/activerecord.js", 364);
for ( i in STATIC ) {                                   // create static methods
            _yuitest_coverline("./src/data/activerecord.js", 365);
Model[i] = STATIC[i].bind(Model) ;
        }

        _yuitest_coverline("./src/data/activerecord.js", 368);
Model.storage = storage ;                                   // reference to the storage object
        _yuitest_coverline("./src/data/activerecord.js", 369);
Model.fields = {} ;                                         // field container, referenced by their key value
        _yuitest_coverline("./src/data/activerecord.js", 370);
Model.relations = {} ;                                         // field container, referenced by their key value


        _yuitest_coverline("./src/data/activerecord.js", 373);
for( i = 0; i < fields.length; i++ ) {
            _yuitest_coverline("./src/data/activerecord.js", 374);
Model.fields[fields[i].key] = fields[i] ;         // add field to fields object
            _yuitest_coverline("./src/data/activerecord.js", 375);
if ( fields[i].isSearchable ) {
                _yuitest_coverline("./src/data/activerecord.js", 376);
createFindByXXX(Model, fields[i]) ;
            }
            else {  // do something with associations

            }

            _yuitest_coverline("./src/data/activerecord.js", 382);
if ( fields[i].PK ) {
                _yuitest_coverline("./src/data/activerecord.js", 383);
hasPK = true ;
            }
        }

        _yuitest_coverline("./src/data/activerecord.js", 387);
if ( !hasPK ) {
            _yuitest_coverline("./src/data/activerecord.js", 388);
createFindByXXX(Model, new ns.Field('id', {autoIncrement: true })) ;
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 392);
function createFindByXXX(Model, field) {
        _yuitest_coverfunc("./src/data/activerecord.js", "createFindByXXX", 392);
_yuitest_coverline("./src/data/activerecord.js", 393);
Model[['findBy', field.key.slice(0,1).toUpperCase(), field.key.slice(1)].join('')] = findBy.bind(Model, field.key);
    }

    _yuitest_coverline("./src/data/activerecord.js", 396);
function appendPrototypeProperties(Model, data) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendPrototypeProperties", 396);
_yuitest_coverline("./src/data/activerecord.js", 397);
var i ;

        _yuitest_coverline("./src/data/activerecord.js", 399);
for( i in INSTANCE ){
            _yuitest_coverline("./src/data/activerecord.js", 400);
Model.prototype[i] = INSTANCE[i] ;                                // create instance function
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 404);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 404);
_yuitest_coverline("./src/data/activerecord.js", 405);
console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 411);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 411);
_yuitest_coverline("./src/data/activerecord.js", 412);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        _yuitest_coverline("./src/data/activerecord.js", 413);
newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 414);
if ( callback ) {
            _yuitest_coverline("./src/data/activerecord.js", 415);
callback(newRec) ;                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 417);
return newRec ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 420);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;










