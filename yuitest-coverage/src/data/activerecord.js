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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","    /*","    A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and","    2) relations can be created when available","     */","    var models = {}","        /**","         * Sway.data.ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access","         * to its resources, like a database or REST interface.<br>","         * This class is a helper class, it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}","         * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks","         *","         *      var webSql = new WebSqlStorage() ;                          // WebSql persistence","         *      var UserModel = new ActiveRecord( 'User', webSql, [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                          , new Relation( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})","         *                      ]) ;","         *","         *      var PostModel = new ActiveRecord( 'Post', webSql, [","         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})","         *                            , new Relation( {type: 'BELONGS_TO', model: 'User'} )","         *                      ]) ;","         *","         *      var userRecord = new UserModel() ;","         *","         * To avoid problems with Model associations, make sure all involved models are created before any usage. Furthermore, a model only needs to","         * be defined only once, and can easily be obtained later as follows","         *","         *      var UserModel = ActiveRecord.get( 'User' ) ;","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object} storage  object used to access the underlying data structure","         * @param {Array}  fields  list of {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}s and {{#crossLink \"Sway.data.Relation\"}}{{/crossLink}}s","         */","        , ActiveRecord = function(modelName, storage, fields ) {","            var  Model = createModel() ;","","            appendStaticProperties(Model, storage, fields ) ;","            appendPrototypeProperties(Model) ;","","            models[modelName] = Model ;","","            return Model ;","        }","","","    /* Define the Model class here */","","    /**","     * Use the Model class to create instances which represent your data records. These will speed up your develement","     * when CRUD-like tasks need to be done.<br>","     * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}.","     *","     * <h3>The basics</h3>","     * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on","     * a specific field","     *","     *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * Of course, the same can be achieved using the more general search method","     *","     *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * With <tt>find</tt> it is also possible to define more fields to search for.<br>","     * A Model instance, on the otherhand, can be used to create or manipulate data","     *","     *     userRecord = new User() ;                            // create a blank record","     *     userRecord.username = 'John' ;                       // set the username","     *     userRecord.password = 'Secret' ;                     // set the password","     *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail","     *","     * <h3>Multiple result-sets</h3>","     * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always","     * represent a single record, internally this has the whole result set.","     *","     * its current","     * state will always be a single record, it is possible to navigate from one state to an other","     *","     *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;","     *","     * <h3>Advanced</h3>","     *","     *","     *","     * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,","     * the Model instance represent them all, holding in its current state the first record's values","     *","     *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;","     *","     * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}","     * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to","     * understand how to deal with multi-record result-sets.","     *","     *","     *     var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *     ....","     *     userRecord.save() ;","     *","     * All fields are accessible as a property of a record","     *","     *     var userRecord = new User() ;","     *     userRecord.username = 'John' ;","     *     userRecord.password = 'Secret' ;","     *","     * @class Sway.data.Model","     */","        , DEFAULTS = {","                /**","                 * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO","                 *","                 *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record","                 *","                 * @property {Object} STATE","                 */","            STATE: {","                /**","                 * @property {Number} STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /**","                 * @property {Number} STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , STATIC = {","            /**","             * Use find to perform searches","             *","             *      User.find( {","             *           'username':   'John'","             *           , 'password': 'Secret'","             *      }, function(user) { ... } ) ;","             *","             * Or simply create a new instance of a Model and use it for a search or save action","             *","             *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","             *      User.find(userRecord, callback) ;","             *      // or","             *      userRecord.save() ;","             * @method find","             * @static","             * @param {Object} data JSON or model instance","             * @param {Object} [options] configuration","             *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.","             *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable.","             */","            find: function(record, callback) {","                if ( record.$className ) {                                              // json required for searching","                    record = record.toJSON() ;","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;","                if ( typeof(json) === 'object' ) {                                      // not async ?","                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","                    if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO","                        return inst ;","                    }","                }","            }","            /**","             * @method save","             * @static","             * @param {Object} options","             */","            , save: function(json, callback) {","                // for performance (no instance required","            }","        }","","    /**","     * @method item","     */","    /**","     * @method hasNext","     */","        , INSTANCE = {","            /**","             * @method getState","             */","            getState: function() {","                return this.__state__ ;","            }","            /**","             * change the state of a record. See ......","             * @method setState","             * @param state","             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all","             * values are transformed immediately.","             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values","             * are transformed.","             */","            , setState: function(state, isLazy, callback) {","                this.state = state ;","                if ( typeof(isLazy) === 'function') {","                    callback = isLazy ;","                    isLazy = true ;","                }","                // TODO: applie transformers","                callback() ;","            }","            /**","             *","             * returns all data in JSON format","             * @method toJSON","             * @returns {Object}","             */","            , toJSON: function() {","                return this.__data ;","            }","            /**","             * Save the data and its relations (See Relation TODO)","             * @method save","             * @param {Boolean} [deep=true] save related data","             * @param {Function} [callback] callback function","             *","             */","            , save: function(deep, success, error) {","               //return this.constructor.storage.save(this, deep, callback) ;","            }","            , getFields: function() {","                return this.constructor.fields ;","            }","                /**","                 * @method load","                 * @param {String} key name of the field","                 * @param {Function} [callback] callback function, called when the data is available","                 */","            , load: function(key, callback) {","                var json = {} ;","                if ( this.fields[key].FK ) {","                    json[key] = this[key] ;","                    this.fields[key].model.find(json, function(records){","                            this[key] = records ;","                            callback(this) ;","                        }.bind(this) ) ;","                }","            }","            /**","             * Call this function to make it aware of changes made to the data it relates to. Because a Model instance","             * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed","             * by one and the same storage object. This storage object is responsible for the notifications.","             *","             * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance","             * otherwise, the","             * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},","             * @method link","             */","            , link: function() {","","            }","            /**","             * @method unlink","             */","            , unlink: function() {","","            }","            , getLength: function() {","                return this.__dataSet.length ;","            }","        } ;","","    ActiveRecord.get = function(modelName) {","       return models[modelName] ;","    } ;","","    /* Private helpers */","","    /**","     * @class Sway.data.Model","     * @constructor","     * @param {Object} [data] ActiveRecord object or JSON data","     * @param {Object} [options]","     *      @param {String} [options.state] initial state","     */","    function createModel() {","        return function Model(data, options) {                              // define the model class/function","            options = options||{} ;                                         // fix input","            data    = data   ||{} ;","","            if ( data.$className ) {                                        // check if data is an ActiveRecord instance","                data = data.toJSON() ;","            }","","            Object.defineProperty(this, '__state__',","                {","                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL","                    , enumarable: false","                }) ;","            Object.defineProperty(this, '$className',                // name of the class it belongs too","                {","                    value: this.constructor.name","                    , writable: false","                }) ;","            Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                {                                                    // added to the record","                    value: null","                    , enumarable: false","                    , writable: true","                }) ;","","            Object.defineProperty(this, '__data',                 // al items","                {","                    value: data","                    , writable: false","                }) ;","","            for( var i in this.constructor.fields) {","               (function(i){","                  Object.defineProperty(this, i, {","                      set:  updateProperty.bind(this, i)","                      , get: getProperty.bind(this, i)","                  }) ;","               }.bind(this))(i) ;","            }","","           return Object.preventExtensions(this) ;                               // make sure no properties can be added","        } ;","    }","","    function getProperty(key) {","        return this.__data[key] ;","    }","","    function updateProperty(key, value) {","        this.__data[key] = value ;","    }","","    function appendStaticProperties(Model, storage, fields) {","        var i, hasPK = false;","","        for ( i in STATIC ) {                                   // create static methods","            Model[i] = STATIC[i].bind(Model) ;","        }","","        Model.storage = storage ;                                   // reference to the storage object","        Model.fields = {} ;                                         // field container, referenced by their key value","        Model.relations = {} ;                                         // field container, referenced by their key value","","","        for( i = 0; i < fields.length; i++ ) {","            Model.fields[fields[i].key] = fields[i] ;         // add field to fields object","            if ( fields[i].isField() ) {","                createFindByXXX(Model, fields[i]) ;","            }","            else {  // do something with associations","","            }","","            if ( fields[i].PK ) {","                hasPK = true ;","            }","        }","","        if ( !hasPK ) {","            createFindByXXX(Model, new ns.Field('id', {autoIncrement: true })) ;","        }","    }","","    function createFindByXXX(Model, field) {","        Model[['findBy', field.key.slice(0,1).toUpperCase(), field.key.slice(1)].join('')] = findBy.bind(Model, field.key);","    }","","    function appendPrototypeProperties(Model, data) {","        var i ;","","        for( i in INSTANCE ){","            Model.prototype[i] = INSTANCE[i] ;                                // create instance function","        }","    }","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value) ;","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id","        if ( callback ) {","            callback(newRec) ;                                              // return a new record","        }","        return newRec ;","    }","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","","","","","","","","",""];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"12":0,"46":0,"48":0,"49":0,"51":0,"53":0,"174":0,"175":0,"177":0,"178":0,"179":0,"180":0,"181":0,"206":0,"218":0,"219":0,"220":0,"221":0,"224":0,"233":0,"246":0,"254":0,"255":0,"256":0,"257":0,"258":0,"259":0,"283":0,"287":0,"288":0,"300":0,"301":0,"302":0,"303":0,"305":0,"306":0,"309":0,"314":0,"319":0,"326":0,"332":0,"333":0,"334":0,"341":0,"345":0,"346":0,"349":0,"350":0,"353":0,"354":0,"356":0,"357":0,"360":0,"361":0,"362":0,"365":0,"366":0,"367":0,"368":0,"374":0,"375":0,"379":0,"380":0,"384":0,"385":0,"388":0,"389":0,"391":0,"392":0,"396":0,"397":0,"403":0,"404":0,"405":0,"406":0,"407":0,"409":0,"412":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:45":0,"find:173":0,"getState:205":0,"setState:217":0,"toJSON:232":0,"getFields:245":0,"(anonymous 2):257":0,"load:253":0,"getLength:282":0,"get:287":0,"(anonymous 3):333":0,"Model:301":0,"createModel:300":0,"getProperty:345":0,"updateProperty:349":0,"appendStaticProperties:353":0,"createFindByXXX:384":0,"appendPrototypeProperties:388":0,"findBy:396":0,"loadJSON:403":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 82;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 21;
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
         * Sway.data.ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access
         * to its resources, like a database or REST interface.<br>
         * This class is a helper class, it creates new Model classes of type {{#crossLink "Sway.data.Model"}}{{/crossLink}}
         * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks
         *
         *      var webSql = new WebSqlStorage() ;                          // WebSql persistence
         *      var UserModel = new ActiveRecord( 'User', webSql, [
         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *                          , new Relation( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})
         *                      ]) ;
         *
         *      var PostModel = new ActiveRecord( 'Post', webSql, [
         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})
         *                            , new Relation( {type: 'BELONGS_TO', model: 'User'} )
         *                      ]) ;
         *
         *      var userRecord = new UserModel() ;
         *
         * To avoid problems with Model associations, make sure all involved models are created before any usage. Furthermore, a model only needs to
         * be defined only once, and can easily be obtained later as follows
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
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 45);
_yuitest_coverline("./src/data/activerecord.js", 46);
var  Model = createModel() ;

            _yuitest_coverline("./src/data/activerecord.js", 48);
appendStaticProperties(Model, storage, fields ) ;
            _yuitest_coverline("./src/data/activerecord.js", 49);
appendPrototypeProperties(Model) ;

            _yuitest_coverline("./src/data/activerecord.js", 51);
models[modelName] = Model ;

            _yuitest_coverline("./src/data/activerecord.js", 53);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 173);
_yuitest_coverline("./src/data/activerecord.js", 174);
if ( record.$className ) {                                              // json required for searching
                    _yuitest_coverline("./src/data/activerecord.js", 175);
record = record.toJSON() ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 177);
var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                _yuitest_coverline("./src/data/activerecord.js", 178);
if ( typeof(json) === 'object' ) {                                      // not async ?
                    _yuitest_coverline("./src/data/activerecord.js", 179);
var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                    _yuitest_coverline("./src/data/activerecord.js", 180);
if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO
                        _yuitest_coverline("./src/data/activerecord.js", 181);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 205);
_yuitest_coverline("./src/data/activerecord.js", 206);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 217);
_yuitest_coverline("./src/data/activerecord.js", 218);
this.state = state ;
                _yuitest_coverline("./src/data/activerecord.js", 219);
if ( typeof(isLazy) === 'function') {
                    _yuitest_coverline("./src/data/activerecord.js", 220);
callback = isLazy ;
                    _yuitest_coverline("./src/data/activerecord.js", 221);
isLazy = true ;
                }
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 224);
callback() ;
            }
            /**
             *
             * returns all data in JSON format
             * @method toJSON
             * @returns {Object}
             */
            , toJSON: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 232);
_yuitest_coverline("./src/data/activerecord.js", 233);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 245);
_yuitest_coverline("./src/data/activerecord.js", 246);
return this.constructor.fields ;
            }
                /**
                 * @method load
                 * @param {String} key name of the field
                 * @param {Function} [callback] callback function, called when the data is available
                 */
            , load: function(key, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 253);
_yuitest_coverline("./src/data/activerecord.js", 254);
var json = {} ;
                _yuitest_coverline("./src/data/activerecord.js", 255);
if ( this.fields[key].FK ) {
                    _yuitest_coverline("./src/data/activerecord.js", 256);
json[key] = this[key] ;
                    _yuitest_coverline("./src/data/activerecord.js", 257);
this.fields[key].model.find(json, function(records){
                            _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 257);
_yuitest_coverline("./src/data/activerecord.js", 258);
this[key] = records ;
                            _yuitest_coverline("./src/data/activerecord.js", 259);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getLength", 282);
_yuitest_coverline("./src/data/activerecord.js", 283);
return this.__dataSet.length ;
            }
        } ;

    _yuitest_coverline("./src/data/activerecord.js", 287);
ActiveRecord.get = function(modelName) {
       _yuitest_coverfunc("./src/data/activerecord.js", "get", 287);
_yuitest_coverline("./src/data/activerecord.js", 288);
return models[modelName] ;
    } ;

    /* Private helpers */

    /**
     * @class Sway.data.Model
     * @constructor
     * @param {Object} [data] ActiveRecord object or JSON data
     * @param {Object} [options]
     *      @param {String} [options.state] initial state
     */
    _yuitest_coverline("./src/data/activerecord.js", 300);
function createModel() {
        _yuitest_coverfunc("./src/data/activerecord.js", "createModel", 300);
_yuitest_coverline("./src/data/activerecord.js", 301);
return function Model(data, options) {                              // define the model class/function
            _yuitest_coverfunc("./src/data/activerecord.js", "Model", 301);
_yuitest_coverline("./src/data/activerecord.js", 302);
options = options||{} ;                                         // fix input
            _yuitest_coverline("./src/data/activerecord.js", 303);
data    = data   ||{} ;

            _yuitest_coverline("./src/data/activerecord.js", 305);
if ( data.$className ) {                                        // check if data is an ActiveRecord instance
                _yuitest_coverline("./src/data/activerecord.js", 306);
data = data.toJSON() ;
            }

            _yuitest_coverline("./src/data/activerecord.js", 309);
Object.defineProperty(this, '__state__',
                {
                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                    , enumarable: false
                }) ;
            _yuitest_coverline("./src/data/activerecord.js", 314);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                {
                    value: this.constructor.name
                    , writable: false
                }) ;
            _yuitest_coverline("./src/data/activerecord.js", 319);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                {                                                    // added to the record
                    value: null
                    , enumarable: false
                    , writable: true
                }) ;

            _yuitest_coverline("./src/data/activerecord.js", 326);
Object.defineProperty(this, '__data',                 // al items
                {
                    value: data
                    , writable: false
                }) ;

            _yuitest_coverline("./src/data/activerecord.js", 332);
for( var i in this.constructor.fields) {
               _yuitest_coverline("./src/data/activerecord.js", 333);
(function(i){
                  _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 3)", 333);
_yuitest_coverline("./src/data/activerecord.js", 334);
Object.defineProperty(this, i, {
                      set:  updateProperty.bind(this, i)
                      , get: getProperty.bind(this, i)
                  }) ;
               }.bind(this))(i) ;
            }

           _yuitest_coverline("./src/data/activerecord.js", 341);
return Object.preventExtensions(this) ;                               // make sure no properties can be added
        } ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 345);
function getProperty(key) {
        _yuitest_coverfunc("./src/data/activerecord.js", "getProperty", 345);
_yuitest_coverline("./src/data/activerecord.js", 346);
return this.__data[key] ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 349);
function updateProperty(key, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "updateProperty", 349);
_yuitest_coverline("./src/data/activerecord.js", 350);
this.__data[key] = value ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 353);
function appendStaticProperties(Model, storage, fields) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendStaticProperties", 353);
_yuitest_coverline("./src/data/activerecord.js", 354);
var i, hasPK = false;

        _yuitest_coverline("./src/data/activerecord.js", 356);
for ( i in STATIC ) {                                   // create static methods
            _yuitest_coverline("./src/data/activerecord.js", 357);
Model[i] = STATIC[i].bind(Model) ;
        }

        _yuitest_coverline("./src/data/activerecord.js", 360);
Model.storage = storage ;                                   // reference to the storage object
        _yuitest_coverline("./src/data/activerecord.js", 361);
Model.fields = {} ;                                         // field container, referenced by their key value
        _yuitest_coverline("./src/data/activerecord.js", 362);
Model.relations = {} ;                                         // field container, referenced by their key value


        _yuitest_coverline("./src/data/activerecord.js", 365);
for( i = 0; i < fields.length; i++ ) {
            _yuitest_coverline("./src/data/activerecord.js", 366);
Model.fields[fields[i].key] = fields[i] ;         // add field to fields object
            _yuitest_coverline("./src/data/activerecord.js", 367);
if ( fields[i].isField() ) {
                _yuitest_coverline("./src/data/activerecord.js", 368);
createFindByXXX(Model, fields[i]) ;
            }
            else {  // do something with associations

            }

            _yuitest_coverline("./src/data/activerecord.js", 374);
if ( fields[i].PK ) {
                _yuitest_coverline("./src/data/activerecord.js", 375);
hasPK = true ;
            }
        }

        _yuitest_coverline("./src/data/activerecord.js", 379);
if ( !hasPK ) {
            _yuitest_coverline("./src/data/activerecord.js", 380);
createFindByXXX(Model, new ns.Field('id', {autoIncrement: true })) ;
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 384);
function createFindByXXX(Model, field) {
        _yuitest_coverfunc("./src/data/activerecord.js", "createFindByXXX", 384);
_yuitest_coverline("./src/data/activerecord.js", 385);
Model[['findBy', field.key.slice(0,1).toUpperCase(), field.key.slice(1)].join('')] = findBy.bind(Model, field.key);
    }

    _yuitest_coverline("./src/data/activerecord.js", 388);
function appendPrototypeProperties(Model, data) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendPrototypeProperties", 388);
_yuitest_coverline("./src/data/activerecord.js", 389);
var i ;

        _yuitest_coverline("./src/data/activerecord.js", 391);
for( i in INSTANCE ){
            _yuitest_coverline("./src/data/activerecord.js", 392);
Model.prototype[i] = INSTANCE[i] ;                                // create instance function
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 396);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 396);
_yuitest_coverline("./src/data/activerecord.js", 397);
console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 403);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 403);
_yuitest_coverline("./src/data/activerecord.js", 404);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        _yuitest_coverline("./src/data/activerecord.js", 405);
newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 406);
if ( callback ) {
            _yuitest_coverline("./src/data/activerecord.js", 407);
callback(newRec) ;                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 409);
return newRec ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 412);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;










