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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns) {","    \"use strict\" ;","","    /*","    A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and","    2) relations can be created when available","     */","    var models = {}","        /**","         * Sway.data.ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access","         * to its resources, like a database or REST interface.<br>","         * This class is a helper class, it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}","         * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks","         *","         *      var webSql = new WebSqlStorage() ;                          // WebSql persistence","         *      var UserModel = new ActiveRecord( 'User', webSql, [","         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","         *                          , new Relation( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})","         *                      ]) ;","         *","         *      var PostModel = new ActiveRecord( 'Post', webSql, [","         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})","         *                            , new Relation( {type: 'BELONGS_TO', model: 'User'} )","         *                      ]) ;","         *","         *      var userRecord = new UserModel() ; // OK","         *","         * To avoid problems with Models who have associations, just make sure all models are created. ActiveRecord keeps a reference to all models it creates,","         * so it is not required to keep a reference to a model all the time. Anytime a model can be request again","         *","         *      var UserModel = new ActiveRecord( 'User' ) ;    // only works if it has been created before","         *","         * @class Sway.data.ActiveRecord","         * @constructor","         * @param {String} modelName name of the model","         * @param {Object}[storage] object used to access the underlying data structure","         * @param {Array} [fields] list of {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}s and {{#crossLink \"Sway.data.Relation\"}}{{/crossLink}}s","         */","        , ActiveRecord = function(modelName, storage, fields, relations ) {","            var i, key ;","","           function Model(data, options) {                              // define the model class/function","               if ( !options) {                                         // fix input","                    options = {} ;","               }","               if ( !data ) {","                   data = {} ;","               }","               else if ( data.$className ) {","                   data = data.toJSON() ;","               }","","               Object.defineProperty(this, '__state__',","                   {","                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL","                       , enumarable: false","                   }) ;","               Object.defineProperty(this, '$className',                // name of the class it belongs too","                   {","                       value: this.constructor.name","                       , writable: false","                   }) ;","               Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                   {                                                    // added to the record","                       value: null","                       , enumarable: false","                       , writable: true","                   }) ;","","               Object.defineProperty(this, '__dataSet',                 // al items","                   {","                       value: data","                       , writable: false","                   }) ;","","               for( i in this.constructor.fields ) {                // TODO: initialize with first item","                   this[i] = data[i] ;","","               }","               return Object.seal(this) ;                               // make sure no properties can be added","            }","","            appendStaticProperties(Model, storage, fields, relations ) ;","            appendPrototypeProperties(Model) ;","","","","            return Model ;","        }","","","    /* Define the Model class here */","","    /**","     * Use the Model class to create instances which represent your data records. These will speed up your develement","     * when CRUD-like tasks need to be done.<br>","     * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}.","     *","     * <h3>The basics</h3>","     * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on","     * a specific field","     *","     *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * Of course, the same can be achieved using the more general search method","     *","     *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * With <tt>find</tt> it is also possible to define more fields to search for.<br>","     * A Model instance, on the otherhand, can be used to create or manipulate data","     *","     *     userRecord = new User() ;                            // create a blank record","     *     userRecord.username = 'John' ;                       // set the username","     *     userRecord.password = 'Secret' ;                     // set the password","     *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail","     *","     * <h3>Multiple result-sets</h3>","     * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always","     * represent a single record, internally this has the whole result set.","     *","     * its current","     * state will always be a single record, it is possible to navigate from one state to an other","     *","     *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;","     *","     * <h3>Advanced</h3>","     *","     *","     *","     * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,","     * the Model instance represent them all, holding in its current state the first record's values","     *","     *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;","     *","     * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}","     * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to","     * understand how to deal with multi-record result-sets.","     *","     *","     *     var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *     ....","     *     userRecord.save() ;","     *","     * All fields are accessible as a property of a record","     *","     *     var userRecord = new User() ;","     *     userRecord.username = 'John' ;","     *     userRecord.password = 'Secret' ;","     *","     * @class Sway.data.Model","     * @constructor","     * @param {Object} [data] JSON data or a model instance to be cloned","     */","        , DEFAULTS = {","                /**","                 * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO","                 *","                 *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record","                 *","                 * @property {Object} STATE","                 */","            STATE: {","                /**","                 * @property {Number} STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /**","                 * @property {Number} STATE.NORMAL","                 * @static","                 */","                , NORMAL: 0","            }","        }","        , STATIC = {","            /**","             * Use find to perform searches","             *","             *      User.find( {","             *           'username':   'John'","             *           , 'password': 'Secret'","             *      }, function(user) { ... } ) ;","             *","             * Or simply create a new instance of a Model and use it for a search or save action","             *","             *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","             *      User.find(userRecord, callback) ;","             *      // or","             *      userRecord.save() ;","             * @method find","             * @static","             * @param {Object} data JSON or model instance","             * @param {Object} [options] configuration","             *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.","             *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable.","             */","            find: function(record, callback) {","                if ( record.$className ) {                                              // json required for searching","                    record = record.toJSON() ;","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;","                if ( typeof(json) === 'object' ) {                                      // not async ?","                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","                    if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO","                        return inst ;","                    }","                }","            }","            /**","             * @method save","             * @static","             * @param {Object} options","             */","            , save: function(json, callback) {","                // for performance (no instance required","            }","        }","","","","","    /**","     * @method item","     */","    /**","     * @method hasNext","     */","        , INSTANCE = {","            /**","             * @method getState","             */","            getState: function() {","                return this.__state__ ;","            }","            /**","             * change the state of a record. See ......","             * @method setState","             * @param state","             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all","             * values are transformed immediately.","             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values","             * are transformed.","             */","            , setState: function(state, isLazy, callback) {","                this.state = state ;","                if ( typeof(isLazy) === 'function') {","                    callback = isLazy ;","                    isLazy = true ;","                }","                // TODO: applie transformers","                callback() ;","            }","            /**","             *","             * returns all the data in JSON format (unfiltered)","             * @method toJSON","             * @param {String} key","             * @returns {Number}","             */","            , toJSON: function() { // ale","                var json = {}","                    , i ;","                for( i in this.constructor.fields ) {","                    json[i] = this[i] ;","                }","                return json ;","            }","            /**","             * Save the data and its relations (See Relation TODO)","             * @method save","             * @param {Boolean} [deep=true] save related data","             * @param {Function} [callback] callback function","             *","             */","            , save: function(deep, callback) {","               return this.constructor.storage.save(this, deep, callback) ;","            }","            , getFields: function() {","                return this.constructor.fields ;","            }","            /**","             * @method next","             */","            , next: function() {","","            }","            /**","             * @method prev","             */","            , prev: function() {","","            }","            /**","             * @method item","             */","            , item: function() {","","            }","            /**","             * @method hasNext","             */","            , hasNext: function() {","","            }","            /**","             * @method hasPrev","             */","            , hasPrev: function() {","","            }","                /**","                 * @method load","                 * @param {String} key name of the field","                 * @param {Function} [callback] callback function, called when the data is available","                 */","            , load: function(key, callback) {","                var json = {} ;","                if ( this.fields[key].FK ) {","                    json[key] = this[key] ;","                    this.fields[key].model.find(json, function(records){","                            this[key] = records ;","                            callback(this) ;","                        }.bind(this) ) ;","                }","            }","            /**","             * Call this function to make it aware of changes made to the data it relates to. Because a Model instance","             * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed","             * by one and the same storage object. This storage object is responsible for the notifications.","             *","             * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance","             * otherwise, the","             * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},","             * @method link","             */","            , link: function() {","","            }","            /**","             * @method unlink","             */","            , unlink: function() {","","            }","            , getLength: function() {","                return this.__dataSet.length ;","            }","        } ;","","    /* Private helpers */","","    function appendStaticProperties(Model, storage, fields, relations) {","        var i, key, hasTransformers = false ;","","        for ( i in STATIC ) {                                   // create static methods","            Model[i] = STATIC[i].bind(Model) ;","        }","","        Model.storage = storage ;                                   // reference to the storage object","        Model.relations = relations ;","        Model.fields = {} ;                                         // field container, referenced by their key value","        Model.hasTransformers = false ;","","","        for( i = 0; i < fields.length; i++ ) {","            key = fields[i].key ;","            Model.fields[key] = fields[i] ;         // add field to fields object","            // create a 'findByXXX' function, like: findByUserName","            Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);","            if ( fields[i].transformers && fields[i].transformers.length > 0 ) {","                Model.hasTransformers = true ;","            }","        }","    }","","    function appendPrototypeProperties(Model) {","        var i ;","","        for( i in INSTANCE ){","            Model.prototype[i] = INSTANCE[i] ;                                // create instance function","        }","    }","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value) ;","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;","        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id","        if ( callback ) {","            callback(newRec) ;                                              // return a new record","        }","        return newRec ;","    }","","	ns.ActiveRecord = ActiveRecord ;","","})(window.Sway.data) ;","","","","","","","","","",""];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"12":0,"46":0,"48":0,"49":0,"50":0,"52":0,"53":0,"55":0,"56":0,"59":0,"64":0,"69":0,"76":0,"82":0,"83":0,"86":0,"89":0,"90":0,"94":0,"217":0,"218":0,"220":0,"221":0,"222":0,"223":0,"224":0,"252":0,"264":0,"265":0,"266":0,"267":0,"270":0,"280":0,"282":0,"283":0,"285":0,"295":0,"298":0,"336":0,"337":0,"338":0,"339":0,"340":0,"341":0,"365":0,"371":0,"372":0,"374":0,"375":0,"378":0,"379":0,"380":0,"381":0,"384":0,"385":0,"386":0,"388":0,"389":0,"390":0,"395":0,"396":0,"398":0,"399":0,"403":0,"404":0,"410":0,"411":0,"412":0,"413":0,"414":0,"416":0,"419":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"Model:48":0,"ActiveRecord:45":0,"find:216":0,"getState:251":0,"setState:263":0,"toJSON:279":0,"save:294":0,"getFields:297":0,"(anonymous 2):339":0,"load:335":0,"getLength:364":0,"appendStaticProperties:371":0,"appendPrototypeProperties:395":0,"findBy:403":0,"loadJSON:410":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 76;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 16;
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
         *      var userRecord = new UserModel() ; // OK
         *
         * To avoid problems with Models who have associations, just make sure all models are created. ActiveRecord keeps a reference to all models it creates,
         * so it is not required to keep a reference to a model all the time. Anytime a model can be request again
         *
         *      var UserModel = new ActiveRecord( 'User' ) ;    // only works if it has been created before
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object}[storage] object used to access the underlying data structure
         * @param {Array} [fields] list of {{#crossLink "Sway.data.Field"}}{{/crossLink}}s and {{#crossLink "Sway.data.Relation"}}{{/crossLink}}s
         */
        , ActiveRecord = function(modelName, storage, fields, relations ) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 45);
_yuitest_coverline("./src/data/activerecord.js", 46);
var i, key ;

           _yuitest_coverline("./src/data/activerecord.js", 48);
function Model(data, options) {                              // define the model class/function
               _yuitest_coverfunc("./src/data/activerecord.js", "Model", 48);
_yuitest_coverline("./src/data/activerecord.js", 49);
if ( !options) {                                         // fix input
                    _yuitest_coverline("./src/data/activerecord.js", 50);
options = {} ;
               }
               _yuitest_coverline("./src/data/activerecord.js", 52);
if ( !data ) {
                   _yuitest_coverline("./src/data/activerecord.js", 53);
data = {} ;
               }
               else {_yuitest_coverline("./src/data/activerecord.js", 55);
if ( data.$className ) {
                   _yuitest_coverline("./src/data/activerecord.js", 56);
data = data.toJSON() ;
               }}

               _yuitest_coverline("./src/data/activerecord.js", 59);
Object.defineProperty(this, '__state__',
                   {
                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                       , enumarable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 64);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                   {
                       value: this.constructor.name
                       , writable: false
                   }) ;
               _yuitest_coverline("./src/data/activerecord.js", 69);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                   {                                                    // added to the record
                       value: null
                       , enumarable: false
                       , writable: true
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 76);
Object.defineProperty(this, '__dataSet',                 // al items
                   {
                       value: data
                       , writable: false
                   }) ;

               _yuitest_coverline("./src/data/activerecord.js", 82);
for( i in this.constructor.fields ) {                // TODO: initialize with first item
                   _yuitest_coverline("./src/data/activerecord.js", 83);
this[i] = data[i] ;

               }
               _yuitest_coverline("./src/data/activerecord.js", 86);
return Object.seal(this) ;                               // make sure no properties can be added
            }

            _yuitest_coverline("./src/data/activerecord.js", 89);
appendStaticProperties(Model, storage, fields, relations ) ;
            _yuitest_coverline("./src/data/activerecord.js", 90);
appendPrototypeProperties(Model) ;



            _yuitest_coverline("./src/data/activerecord.js", 94);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 216);
_yuitest_coverline("./src/data/activerecord.js", 217);
if ( record.$className ) {                                              // json required for searching
                    _yuitest_coverline("./src/data/activerecord.js", 218);
record = record.toJSON() ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 220);
var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                _yuitest_coverline("./src/data/activerecord.js", 221);
if ( typeof(json) === 'object' ) {                                      // not async ?
                    _yuitest_coverline("./src/data/activerecord.js", 222);
var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                    _yuitest_coverline("./src/data/activerecord.js", 223);
if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO
                        _yuitest_coverline("./src/data/activerecord.js", 224);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 251);
_yuitest_coverline("./src/data/activerecord.js", 252);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 263);
_yuitest_coverline("./src/data/activerecord.js", 264);
this.state = state ;
                _yuitest_coverline("./src/data/activerecord.js", 265);
if ( typeof(isLazy) === 'function') {
                    _yuitest_coverline("./src/data/activerecord.js", 266);
callback = isLazy ;
                    _yuitest_coverline("./src/data/activerecord.js", 267);
isLazy = true ;
                }
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 270);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 279);
_yuitest_coverline("./src/data/activerecord.js", 280);
var json = {}
                    , i ;
                _yuitest_coverline("./src/data/activerecord.js", 282);
for( i in this.constructor.fields ) {
                    _yuitest_coverline("./src/data/activerecord.js", 283);
json[i] = this[i] ;
                }
                _yuitest_coverline("./src/data/activerecord.js", 285);
return json ;
            }
            /**
             * Save the data and its relations (See Relation TODO)
             * @method save
             * @param {Boolean} [deep=true] save related data
             * @param {Function} [callback] callback function
             *
             */
            , save: function(deep, callback) {
               _yuitest_coverfunc("./src/data/activerecord.js", "save", 294);
_yuitest_coverline("./src/data/activerecord.js", 295);
return this.constructor.storage.save(this, deep, callback) ;
            }
            , getFields: function() {
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 297);
_yuitest_coverline("./src/data/activerecord.js", 298);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 335);
_yuitest_coverline("./src/data/activerecord.js", 336);
var json = {} ;
                _yuitest_coverline("./src/data/activerecord.js", 337);
if ( this.fields[key].FK ) {
                    _yuitest_coverline("./src/data/activerecord.js", 338);
json[key] = this[key] ;
                    _yuitest_coverline("./src/data/activerecord.js", 339);
this.fields[key].model.find(json, function(records){
                            _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 339);
_yuitest_coverline("./src/data/activerecord.js", 340);
this[key] = records ;
                            _yuitest_coverline("./src/data/activerecord.js", 341);
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
                _yuitest_coverfunc("./src/data/activerecord.js", "getLength", 364);
_yuitest_coverline("./src/data/activerecord.js", 365);
return this.__dataSet.length ;
            }
        } ;

    /* Private helpers */

    _yuitest_coverline("./src/data/activerecord.js", 371);
function appendStaticProperties(Model, storage, fields, relations) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendStaticProperties", 371);
_yuitest_coverline("./src/data/activerecord.js", 372);
var i, key, hasTransformers = false ;

        _yuitest_coverline("./src/data/activerecord.js", 374);
for ( i in STATIC ) {                                   // create static methods
            _yuitest_coverline("./src/data/activerecord.js", 375);
Model[i] = STATIC[i].bind(Model) ;
        }

        _yuitest_coverline("./src/data/activerecord.js", 378);
Model.storage = storage ;                                   // reference to the storage object
        _yuitest_coverline("./src/data/activerecord.js", 379);
Model.relations = relations ;
        _yuitest_coverline("./src/data/activerecord.js", 380);
Model.fields = {} ;                                         // field container, referenced by their key value
        _yuitest_coverline("./src/data/activerecord.js", 381);
Model.hasTransformers = false ;


        _yuitest_coverline("./src/data/activerecord.js", 384);
for( i = 0; i < fields.length; i++ ) {
            _yuitest_coverline("./src/data/activerecord.js", 385);
key = fields[i].key ;
            _yuitest_coverline("./src/data/activerecord.js", 386);
Model.fields[key] = fields[i] ;         // add field to fields object
            // create a 'findByXXX' function, like: findByUserName
            _yuitest_coverline("./src/data/activerecord.js", 388);
Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);
            _yuitest_coverline("./src/data/activerecord.js", 389);
if ( fields[i].transformers && fields[i].transformers.length > 0 ) {
                _yuitest_coverline("./src/data/activerecord.js", 390);
Model.hasTransformers = true ;
            }
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 395);
function appendPrototypeProperties(Model) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendPrototypeProperties", 395);
_yuitest_coverline("./src/data/activerecord.js", 396);
var i ;

        _yuitest_coverline("./src/data/activerecord.js", 398);
for( i in INSTANCE ){
            _yuitest_coverline("./src/data/activerecord.js", 399);
Model.prototype[i] = INSTANCE[i] ;                                // create instance function
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 403);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 403);
_yuitest_coverline("./src/data/activerecord.js", 404);
console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 410);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 410);
_yuitest_coverline("./src/data/activerecord.js", 411);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        _yuitest_coverline("./src/data/activerecord.js", 412);
newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 413);
if ( callback ) {
            _yuitest_coverline("./src/data/activerecord.js", 414);
callback(newRec) ;                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 416);
return newRec ;
    }

	_yuitest_coverline("./src/data/activerecord.js", 419);
ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;










