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
_yuitest_coverage["./src/data/activerecord.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {};","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\";","","    /*","     A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and","     2) relations can be created when available","     */","    var models = {}","    /**","     * Sway.data.ActiveRecord is the pattern used for this ORM implementation and based on the Ruby on Rails (RoR)","     * <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>. This pattern","     * encapsulates access to its resources, like a database or REST interface.<br>","     * This class is a helper class, it creates new Model classes of type {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}","     * and serves as a blue print for all models. It gives them all they need to perform CRUD-like tasks","     *","     *      var webSql = new WebSqlStorage() ;                          // WebSql persistence","     *      var UserModel = new ActiveRecord( 'User', webSql, [","     *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})","     *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})","     *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})","     *                          , new Field( { key: 'posts', type: 'has_many', friendlyName: 'Posts', model: 'Post'})","     *                      ]) ;","     *","     *      var PostModel = new ActiveRecord( 'Post', webSql, [","     *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})","     *                            , new Field( {type: 'belongs_to', model: 'User'} )","     *                      ]) ;","     *","     *      var userRecord = new UserModel() ;","     *","     * To avoid problems with Model associations, make sure all involved models are created before any usage. A defined model can be accessed","     * as follows","     *","     *      var UserModel = ActiveRecord.get( 'User' ) ;","     *","     * @class Sway.data.ActiveRecord","     * @constructor","     * @param {String} modelName name of the model","     * @param {Object} storage  object used to access the underlying data structure","     * @param {Array}  fields  list of {{#crossLink \"Sway.data.Field\"}}{{/crossLink}}s and {{#crossLink \"Sway.data.Relation\"}}{{/crossLink}}s","     */","        , ActiveRecord = function (modelName, storage, fields) {","            var Model = createModel(modelName);","","            appendStaticProperties(Model, storage, fields);","            appendPrototypeProperties(Model);","","            models[modelName] = Model;","","            return Model;","        };","    /**","     * Returns a model class","     * @method get","     * @static","     * @param {String} modelName name of the model","     * @return {Class} a model","     */","    ActiveRecord.get = function (modelName) {","        return models[modelName];","    };","","","    /* Define the Model class here */","","    /**","     * Use the Model class to create instances which represent your data records. These will speed up your develement","     * when CRUD-like tasks need to be done.<br>","     * To create a Model class, use {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}}.","     *","     * <h3>The basics</h3>","     * To perform a search, a couple of static methods are available. Use the <tt>findByX</tt> methods to search on","     * a specific field","     *","     *     UserModel.findByUsername('John', function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * Of course, the same can be achieved using the more general search method","     *","     *     UserModel.find( {username: 'John'}, function(userRecord) {"," *          // this === UserModel"," *     }) ;","     *","     * With <tt>find</tt> it is also possible to define more fields to search for.<br>","     * A Model instance, on the otherhand, can be used to create or manipulate data","     *","     *     userRecord = new User() ;                            // create a blank record","     *     userRecord.username = 'John' ;                       // set the username","     *     userRecord.password = 'Secret' ;                     // set the password","     *     userRecord.save(successCallback, errorCallback) ;    // check the result, because this action might fail","     *","     * <h3>Multiple result-sets</h3>","     * In {{#crossLink \"Sway\"}}{{/crossLink}} a Model instance can also represent multiple records. Although it always","     * represent a single record, internally this has the whole result set.","     *","     * its current","     * state will always be a single record, it is possible to navigate from one state to an other","     *","     *     User.search({username: 'John'}, function(record) {   // record is a model instance representing more than on result"," *           while( record.hasNext() ) {                    // check if there is an other record"," *                record.next() ;                           // move on record up"," *                ...."," *           }"," *           record.item(1) ;                               // go to second record"," *           record.prev() ;                                // go to first record. Use 'prev' in combination with 'hasPrev'"," *     }) ;","     *","     * <h3>Advanced</h3>","     *","     *","     *","     * An instance represents one or more records, which depends on how it was created. For example, if a database search returns multiple records,","     * the Model instance represent them all, holding in its current state the first record's values","     *","     *      User.find({ username: 'John' }, function(ar) {  // ActiveRecord instance, holding multiple records"," *          console.log(\"Found \" + ar.length + \" records) ;"," *      }) ;","     *","     * Checkout {{#crossLink \"Sway.data.Model/next:method\"}}{{/crossLink}}, {{#crossLink \"Sway.data.Model/prev:method\"}}{{/crossLink}}","     * {{#crossLink \"Sway.data.Model/item:method\"}}{{/crossLink}} and {{#crossLink \"Sway.data.Model/hasNext:method\"}}{{/crossLink}} to","     * understand how to deal with multi-record result-sets.","     *","     *","     *     var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *     ....","     *     userRecord.save() ;","     *","     * All fields are accessible as a property of a record","     *","     *     var userRecord = new User() ;","     *     userRecord.username = 'John' ;","     *     userRecord.password = 'Secret' ;","     *","     * @class Sway.data.Model","     */","    var DEFAULTS = {","            /**","             * a record can be in two states; NORMAL (default) or TRANSFORMED ...... TODO","             *","             *      userRecord.setState(User.TRANSFORMED, callback) ; // change the state of the record","             *","             * @property {Object} STATE","             */","            STATE: {","                /**","                 * @property {Number} STATE.TRANFORMED","                 * @static","                 */","                TRANSFORMED: 1","                /**","                 * @property {Number} STATE.NORMAL","                 * @static","                 */, NORMAL: 0","            }","        }","        , STATIC = {","            /**","             * Use find to perform searches","             *","             *      User.find( {","             *           'username':   'John'","             *           , 'password': 'Secret'","             *      }, function(user) { ... } ) ;","             *","             * Or simply create a new instance of a Model and use it for a search or save action","             *","             *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;","             *      User.find(userRecord, callback) ;","             *      // or","             *      userRecord.save() ;","             * @method find","             * @static","             * @param {Object} data JSON or model instance","             * @param {Object} [options] configuration","             *  @param {Boolean} [lazy=true] If false, <tt>find</tt> returns a model which will have all its data, including foreign key data, loaded.","             *  If the record is <tt>lazy</tt>, call {{#crossLink \"Sway.data.Model/load:method\"}}{{/crossLink}} first to make the data avaiable.","             */","            find: function (record, callback) {","                if (record.$className) {                                              // json required for searching","                    record = record.toJSON();","                }","                var json = this.storage.find(record, loadJSON.bind(this, callback));","                if (typeof(json) === 'object') {                                      // not async ?","                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});","                    if (inst.setState(DEFAULTS.STATE.NORMAL, callback)) {             // detect if async ? TODO","                        return inst;","                    }","                }","            }","            /**","             * save json data instead of an active record","             * @method save","             * @static","             * @param {Object} data json data","             * @param {Object} options","             * @return {Object} active record","             */, save: function (json, callback) {","                // for performance (no instance required","            }","            /**","             * Load relations for defined field(s). By default relations are lazy loaded.","             * @method include","             * @static","             * @param {Array} fieldNames define the relations which should be loaded","             * @return Model class","             * @example","             ModeClass.include('comments').findByName('John') ;","             */, include: function (fieldName) {","                return {","                    //find","                };","            }","        }","","    /**","     * @method item","     */","    /**","     * @method hasNext","     */","        , INSTANCE = {","            /**","             * @method getState","             */","            getState: function () {","                return this.__state__;","            }","            /**","             * change the state of a record. See ......","             * @method setState","             * @param state","             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all","             * values are transformed immediately.","             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values","             * are transformed.","             */, setState: function (state, isLazy, callback) {","                this.state = state;","                if (typeof(isLazy) === 'function') {","                    callback = isLazy;","                    isLazy = true;","                }","                // TODO: applie transformers","                callback();","            }","            /**","             *","             * returns all data in JSON format","             * @method toJSON","             * @return {Object}","             */, toJSON: function () {","                return this.__data;","            }","            /**","             * Save the data and its relations","             * @method save","             * @param {Object} [options] configuration","             * @param {Function} [options.success] success callback function","             * @param {Function} [options.error] error callback function","             *","             */","            , save: function (options) {","                //return this.constructor.storage.save(this, deep, callback) ;","            }","            , getFields: function () {","                return this.constructor.fields;","            }","            /**","             * load all properties of the model instance.","             * @method load","             * @param {Function} [callback] callback function, called when the data is available","             * @param {Object} [options] configuration options","             *  @param {Boolnea} [options.lazy=true] lazy loading","             */","            , load: function (callback, options) {","                var json = {};","                if (this.fields[key].FK) {","                    json[key] = this[key];","                    this.fields[key].model.find(json, function (records) {","                        this[key] = records;","                        callback(this);","                    }.bind(this));","                }","            }","            /**","             * set all values back to their original value","             * @method reset","             * @chainable","             * return {Object} self","             */","            , reset: function () {","","            }","            /**","             * Call this function to make it aware of changes made to the data it relates to. Because a Model instance","             * has no direct link with, for example, a database, this mechanism only works when all changes made to the data are performed","             * by one and the same storage object. This storage object is responsible for the notifications.","             *","             * Always call {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}} to disable this behavior, or when the Model instance","             * otherwise, the","             * If the record or this <tt>link</tt> is not needed anymore, make sure to remove by calling {{#crossLink \"Sway.data.Model/unlink:method\"}}{{/crossLink}},","             * @method link","             */","            , link: function () {","","            }","            /**","             * @method unlink","             */, unlink: function () {","","            }, getLength: function () {","                return this.__dataSet.length;","            }","        };","","","    /* Private helpers */","","    /**","     * @class Sway.data.Model","     * @constructor","     * @param {Object} [data] ActiveRecord object or JSON data","     * @param {Object} [options]","     *      @param {String} [options.state] initial state","     */","    function createModel(modelName) {","        var model = function Model(data, options) {                              // define the model class/function","            options = options || {};                                         // fix input","            data = data || {};","","            if (data.$className) {                                        // check if data is an ActiveRecord instance","                data = data.toJSON();","            }","","            Object.defineProperty(this, '__state__',","                {","                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL, enumarable: false","                });","            Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is","                {                                                    // added to the record","                    value: null, enumarable: false, writable: true","                });","","            Object.defineProperty(this, '__data',","                {","                    value: data, writable: false                    // make only the properties of data writable","                });","","            Object.defineProperty(this, '$className',                // name of the class it belongs too","                {","                    value: modelName, writable: false","                });","","            /**","             * bla bla","             * @property {Boolean} isDirty","             */","            Object.defineProperty(this, 'isDirty',{value: false} ) ;","            Object.defineProperty(this, '__isNew',{value: true} ) ;","","","            /**","             * bla bla","             * @property {Boolean} isNew","             */","            Object.defineProperty(this, 'isNew',{","                set: isNew.bind(this)","                , get: isNew.bind(this)","            }) ;","","            var field, i;","            for (i in this.constructor.fields) {","                field = this.constructor.fields[i];","                (function (i, field) {","                    Object.defineProperty(this, i, {","                        set: function(value){field.set( this, i, value);}.bind(this)    // set is handled by the field itself","                        , get: getProperty.bind(this, i)","                    });","                    if ( data[field.key] ) {","                        this[i] = data[field.key];","                    }","                }.bind(this))(i, field);","","","            }","            return Object.preventExtensions(this);                               // make sure no properties can be added","        };","        model.$name = modelName ;","        return model ;","    }","","","    function getProperty(key) {","        return this.__data[key];","    }","","    function appendStaticProperties(Model, storage, fields) {","        var i","            , field","            , hasPK = false;                                    // used to determine if a PK is defined, if not create findById function","","        for (i in STATIC) {                                   // create static methods","            Model[i] = STATIC[i].bind(Model);","        }","","        /*","         A relation needs to be set on both object. For example, if a patient has an address, an address belongs to","         a patient. In code","         patient.address = address ;","         address.__reverseRelation.belongs_to['patient'] = this ; // note that","         */","        Object.defineProperty(Model, '__reverseRelation', { value: {}, enumarable: false}) ;","","        Model.storage = storage;                                   // reference to the storage object","        Model.fields = {};                                         // field container, referenced by their key value","        Model.relations = {};                                         // field container, referenced by their key value","","        Object.defineProperty(Model, 'findLookup', {","            value: {}","            , enumerable: false","        }) ;","","        for (i = 0; i < fields.length; i++) {","            field = fields[i] ;","            Model.fields[field.key] = field;         // add field to fields object","            createFindByXXX(Model, field);","            hasPK = hasPK | !!field.PK;                // bitwise OR to determine if PK is defined (hasPK is 1 or 0)","","            if ( field.model ) { // if defined, its a relation between two models","                Model.__reverseRelation[field.model.$className||field.model] = field ;","            }","        }","","        if (hasPK === 0) {","            // TODO add id Field to Model too!!","            createFindByXXX(Model, new ns.Field('id', {autoIncrement: true }));","        }","    }","","    function createFindByXXX(Model, field) {","        var name = ['findBy', field.key.slice(0, 1).toUpperCase(), field.key.slice(1)].join('');","        Model[name] = (Model.findLookup[name] = findBy.bind(Model, field.key)) ;","    }","","    function appendPrototypeProperties(Model, data) {","        var i;","","        for (i in INSTANCE) {","            Model.prototype[i] = INSTANCE[i];                                // create instance function","        }","    }","","    function findBy(property, value) {","        console.log(\"find by \" + property + \" with value=\" + value);","    }","","    /*","     * loadJSON receives json from a storage object. It converts this into an active record object.","     */","    function loadJSON(callback, json) {","        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});","        newRec.__id__ = json.__id__;                                   // existing records get a unique id","        if (callback) {","            callback(newRec);                                              // return a new record","        }","        return newRec;","    }","","    function isNew(state) {","       if ( state === undefined )  {","           return this.__isNew ;","       }","       else if (state === false) {","           // TODO: remove PK value","           this.__isNew = true ;","       }","    }","","    ns.ActiveRecord = ActiveRecord;","","})(window.Sway.data);","","","","","","","","","",""];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/activerecord.js"].lines = {"2":0,"3":0,"5":0,"6":0,"12":0,"47":0,"49":0,"50":0,"52":0,"54":0,"63":0,"64":0,"141":0,"184":0,"185":0,"187":0,"188":0,"189":0,"190":0,"191":0,"214":0,"231":0,"242":0,"243":0,"244":0,"245":0,"248":0,"256":0,"270":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"316":0,"330":0,"331":0,"332":0,"333":0,"335":0,"336":0,"339":0,"343":0,"348":0,"353":0,"362":0,"363":0,"370":0,"375":0,"376":0,"377":0,"378":0,"379":0,"380":0,"383":0,"384":0,"390":0,"392":0,"393":0,"397":0,"398":0,"401":0,"402":0,"406":0,"407":0,"416":0,"418":0,"419":0,"420":0,"422":0,"427":0,"428":0,"429":0,"430":0,"431":0,"433":0,"434":0,"438":0,"440":0,"444":0,"445":0,"446":0,"449":0,"450":0,"452":0,"453":0,"457":0,"458":0,"464":0,"465":0,"466":0,"467":0,"468":0,"470":0,"473":0,"474":0,"475":0,"477":0,"479":0,"483":0};
_yuitest_coverage["./src/data/activerecord.js"].functions = {"ActiveRecord:46":0,"get:63":0,"find:183":0,"include:213":0,"getState:230":0,"setState:241":0,"toJSON:255":0,"getFields:269":0,"(anonymous 2):283":0,"load:279":0,"getLength:315":0,"set:380":0,"(anonymous 3):378":0,"Model:331":0,"createModel:330":0,"getProperty:397":0,"appendStaticProperties:401":0,"createFindByXXX:444":0,"appendPrototypeProperties:449":0,"findBy:457":0,"loadJSON:464":0,"isNew:473":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/activerecord.js"].coveredLines = 101;
_yuitest_coverage["./src/data/activerecord.js"].coveredFunctions = 23;
_yuitest_coverline("./src/data/activerecord.js", 2);
window.Sway = window.Sway || {};
_yuitest_coverline("./src/data/activerecord.js", 3);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/activerecord.js", 5);
(function (ns) {
    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/activerecord.js", 6);
"use strict";

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
        , ActiveRecord = function (modelName, storage, fields) {
            _yuitest_coverfunc("./src/data/activerecord.js", "ActiveRecord", 46);
_yuitest_coverline("./src/data/activerecord.js", 47);
var Model = createModel(modelName);

            _yuitest_coverline("./src/data/activerecord.js", 49);
appendStaticProperties(Model, storage, fields);
            _yuitest_coverline("./src/data/activerecord.js", 50);
appendPrototypeProperties(Model);

            _yuitest_coverline("./src/data/activerecord.js", 52);
models[modelName] = Model;

            _yuitest_coverline("./src/data/activerecord.js", 54);
return Model;
        };
    /**
     * Returns a model class
     * @method get
     * @static
     * @param {String} modelName name of the model
     * @return {Class} a model
     */
    _yuitest_coverline("./src/data/activerecord.js", 63);
ActiveRecord.get = function (modelName) {
        _yuitest_coverfunc("./src/data/activerecord.js", "get", 63);
_yuitest_coverline("./src/data/activerecord.js", 64);
return models[modelName];
    };


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
                 */, NORMAL: 0
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
            find: function (record, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "find", 183);
_yuitest_coverline("./src/data/activerecord.js", 184);
if (record.$className) {                                              // json required for searching
                    _yuitest_coverline("./src/data/activerecord.js", 185);
record = record.toJSON();
                }
                _yuitest_coverline("./src/data/activerecord.js", 187);
var json = this.storage.find(record, loadJSON.bind(this, callback));
                _yuitest_coverline("./src/data/activerecord.js", 188);
if (typeof(json) === 'object') {                                      // not async ?
                    _yuitest_coverline("./src/data/activerecord.js", 189);
var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});
                    _yuitest_coverline("./src/data/activerecord.js", 190);
if (inst.setState(DEFAULTS.STATE.NORMAL, callback)) {             // detect if async ? TODO
                        _yuitest_coverline("./src/data/activerecord.js", 191);
return inst;
                    }
                }
            }
            /**
             * save json data instead of an active record
             * @method save
             * @static
             * @param {Object} data json data
             * @param {Object} options
             * @return {Object} active record
             */, save: function (json, callback) {
                // for performance (no instance required
            }
            /**
             * Load relations for defined field(s). By default relations are lazy loaded.
             * @method include
             * @static
             * @param {Array} fieldNames define the relations which should be loaded
             * @return Model class
             * @example
             ModeClass.include('comments').findByName('John') ;
             */, include: function (fieldName) {
                _yuitest_coverfunc("./src/data/activerecord.js", "include", 213);
_yuitest_coverline("./src/data/activerecord.js", 214);
return {
                    //find
                };
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
            getState: function () {
                _yuitest_coverfunc("./src/data/activerecord.js", "getState", 230);
_yuitest_coverline("./src/data/activerecord.js", 231);
return this.__state__;
            }
            /**
             * change the state of a record. See ......
             * @method setState
             * @param state
             * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all
             * values are transformed immediately.
             * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values
             * are transformed.
             */, setState: function (state, isLazy, callback) {
                _yuitest_coverfunc("./src/data/activerecord.js", "setState", 241);
_yuitest_coverline("./src/data/activerecord.js", 242);
this.state = state;
                _yuitest_coverline("./src/data/activerecord.js", 243);
if (typeof(isLazy) === 'function') {
                    _yuitest_coverline("./src/data/activerecord.js", 244);
callback = isLazy;
                    _yuitest_coverline("./src/data/activerecord.js", 245);
isLazy = true;
                }
                // TODO: applie transformers
                _yuitest_coverline("./src/data/activerecord.js", 248);
callback();
            }
            /**
             *
             * returns all data in JSON format
             * @method toJSON
             * @return {Object}
             */, toJSON: function () {
                _yuitest_coverfunc("./src/data/activerecord.js", "toJSON", 255);
_yuitest_coverline("./src/data/activerecord.js", 256);
return this.__data;
            }
            /**
             * Save the data and its relations
             * @method save
             * @param {Object} [options] configuration
             * @param {Function} [options.success] success callback function
             * @param {Function} [options.error] error callback function
             *
             */
            , save: function (options) {
                //return this.constructor.storage.save(this, deep, callback) ;
            }
            , getFields: function () {
                _yuitest_coverfunc("./src/data/activerecord.js", "getFields", 269);
_yuitest_coverline("./src/data/activerecord.js", 270);
return this.constructor.fields;
            }
            /**
             * load all properties of the model instance.
             * @method load
             * @param {Function} [callback] callback function, called when the data is available
             * @param {Object} [options] configuration options
             *  @param {Boolnea} [options.lazy=true] lazy loading
             */
            , load: function (callback, options) {
                _yuitest_coverfunc("./src/data/activerecord.js", "load", 279);
_yuitest_coverline("./src/data/activerecord.js", 280);
var json = {};
                _yuitest_coverline("./src/data/activerecord.js", 281);
if (this.fields[key].FK) {
                    _yuitest_coverline("./src/data/activerecord.js", 282);
json[key] = this[key];
                    _yuitest_coverline("./src/data/activerecord.js", 283);
this.fields[key].model.find(json, function (records) {
                        _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 2)", 283);
_yuitest_coverline("./src/data/activerecord.js", 284);
this[key] = records;
                        _yuitest_coverline("./src/data/activerecord.js", 285);
callback(this);
                    }.bind(this));
                }
            }
            /**
             * set all values back to their original value
             * @method reset
             * @chainable
             * return {Object} self
             */
            , reset: function () {

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
            , link: function () {

            }
            /**
             * @method unlink
             */, unlink: function () {

            }, getLength: function () {
                _yuitest_coverfunc("./src/data/activerecord.js", "getLength", 315);
_yuitest_coverline("./src/data/activerecord.js", 316);
return this.__dataSet.length;
            }
        };


    /* Private helpers */

    /**
     * @class Sway.data.Model
     * @constructor
     * @param {Object} [data] ActiveRecord object or JSON data
     * @param {Object} [options]
     *      @param {String} [options.state] initial state
     */
    _yuitest_coverline("./src/data/activerecord.js", 330);
function createModel(modelName) {
        _yuitest_coverfunc("./src/data/activerecord.js", "createModel", 330);
_yuitest_coverline("./src/data/activerecord.js", 331);
var model = function Model(data, options) {                              // define the model class/function
            _yuitest_coverfunc("./src/data/activerecord.js", "Model", 331);
_yuitest_coverline("./src/data/activerecord.js", 332);
options = options || {};                                         // fix input
            _yuitest_coverline("./src/data/activerecord.js", 333);
data = data || {};

            _yuitest_coverline("./src/data/activerecord.js", 335);
if (data.$className) {                                        // check if data is an ActiveRecord instance
                _yuitest_coverline("./src/data/activerecord.js", 336);
data = data.toJSON();
            }

            _yuitest_coverline("./src/data/activerecord.js", 339);
Object.defineProperty(this, '__state__',
                {
                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL, enumarable: false
                });
            _yuitest_coverline("./src/data/activerecord.js", 343);
Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                {                                                    // added to the record
                    value: null, enumarable: false, writable: true
                });

            _yuitest_coverline("./src/data/activerecord.js", 348);
Object.defineProperty(this, '__data',
                {
                    value: data, writable: false                    // make only the properties of data writable
                });

            _yuitest_coverline("./src/data/activerecord.js", 353);
Object.defineProperty(this, '$className',                // name of the class it belongs too
                {
                    value: modelName, writable: false
                });

            /**
             * bla bla
             * @property {Boolean} isDirty
             */
            _yuitest_coverline("./src/data/activerecord.js", 362);
Object.defineProperty(this, 'isDirty',{value: false} ) ;
            _yuitest_coverline("./src/data/activerecord.js", 363);
Object.defineProperty(this, '__isNew',{value: true} ) ;


            /**
             * bla bla
             * @property {Boolean} isNew
             */
            _yuitest_coverline("./src/data/activerecord.js", 370);
Object.defineProperty(this, 'isNew',{
                set: isNew.bind(this)
                , get: isNew.bind(this)
            }) ;

            _yuitest_coverline("./src/data/activerecord.js", 375);
var field, i;
            _yuitest_coverline("./src/data/activerecord.js", 376);
for (i in this.constructor.fields) {
                _yuitest_coverline("./src/data/activerecord.js", 377);
field = this.constructor.fields[i];
                _yuitest_coverline("./src/data/activerecord.js", 378);
(function (i, field) {
                    _yuitest_coverfunc("./src/data/activerecord.js", "(anonymous 3)", 378);
_yuitest_coverline("./src/data/activerecord.js", 379);
Object.defineProperty(this, i, {
                        set: function(value){_yuitest_coverfunc("./src/data/activerecord.js", "set", 380);
_yuitest_coverline("./src/data/activerecord.js", 380);
field.set( this, i, value);}.bind(this)    // set is handled by the field itself
                        , get: getProperty.bind(this, i)
                    });
                    _yuitest_coverline("./src/data/activerecord.js", 383);
if ( data[field.key] ) {
                        _yuitest_coverline("./src/data/activerecord.js", 384);
this[i] = data[field.key];
                    }
                }.bind(this))(i, field);


            }
            _yuitest_coverline("./src/data/activerecord.js", 390);
return Object.preventExtensions(this);                               // make sure no properties can be added
        };
        _yuitest_coverline("./src/data/activerecord.js", 392);
model.$name = modelName ;
        _yuitest_coverline("./src/data/activerecord.js", 393);
return model ;
    }


    _yuitest_coverline("./src/data/activerecord.js", 397);
function getProperty(key) {
        _yuitest_coverfunc("./src/data/activerecord.js", "getProperty", 397);
_yuitest_coverline("./src/data/activerecord.js", 398);
return this.__data[key];
    }

    _yuitest_coverline("./src/data/activerecord.js", 401);
function appendStaticProperties(Model, storage, fields) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendStaticProperties", 401);
_yuitest_coverline("./src/data/activerecord.js", 402);
var i
            , field
            , hasPK = false;                                    // used to determine if a PK is defined, if not create findById function

        _yuitest_coverline("./src/data/activerecord.js", 406);
for (i in STATIC) {                                   // create static methods
            _yuitest_coverline("./src/data/activerecord.js", 407);
Model[i] = STATIC[i].bind(Model);
        }

        /*
         A relation needs to be set on both object. For example, if a patient has an address, an address belongs to
         a patient. In code
         patient.address = address ;
         address.__reverseRelation.belongs_to['patient'] = this ; // note that
         */
        _yuitest_coverline("./src/data/activerecord.js", 416);
Object.defineProperty(Model, '__reverseRelation', { value: {}, enumarable: false}) ;

        _yuitest_coverline("./src/data/activerecord.js", 418);
Model.storage = storage;                                   // reference to the storage object
        _yuitest_coverline("./src/data/activerecord.js", 419);
Model.fields = {};                                         // field container, referenced by their key value
        _yuitest_coverline("./src/data/activerecord.js", 420);
Model.relations = {};                                         // field container, referenced by their key value

        _yuitest_coverline("./src/data/activerecord.js", 422);
Object.defineProperty(Model, 'findLookup', {
            value: {}
            , enumerable: false
        }) ;

        _yuitest_coverline("./src/data/activerecord.js", 427);
for (i = 0; i < fields.length; i++) {
            _yuitest_coverline("./src/data/activerecord.js", 428);
field = fields[i] ;
            _yuitest_coverline("./src/data/activerecord.js", 429);
Model.fields[field.key] = field;         // add field to fields object
            _yuitest_coverline("./src/data/activerecord.js", 430);
createFindByXXX(Model, field);
            _yuitest_coverline("./src/data/activerecord.js", 431);
hasPK = hasPK | !!field.PK;                // bitwise OR to determine if PK is defined (hasPK is 1 or 0)

            _yuitest_coverline("./src/data/activerecord.js", 433);
if ( field.model ) { // if defined, its a relation between two models
                _yuitest_coverline("./src/data/activerecord.js", 434);
Model.__reverseRelation[field.model.$className||field.model] = field ;
            }
        }

        _yuitest_coverline("./src/data/activerecord.js", 438);
if (hasPK === 0) {
            // TODO add id Field to Model too!!
            _yuitest_coverline("./src/data/activerecord.js", 440);
createFindByXXX(Model, new ns.Field('id', {autoIncrement: true }));
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 444);
function createFindByXXX(Model, field) {
        _yuitest_coverfunc("./src/data/activerecord.js", "createFindByXXX", 444);
_yuitest_coverline("./src/data/activerecord.js", 445);
var name = ['findBy', field.key.slice(0, 1).toUpperCase(), field.key.slice(1)].join('');
        _yuitest_coverline("./src/data/activerecord.js", 446);
Model[name] = (Model.findLookup[name] = findBy.bind(Model, field.key)) ;
    }

    _yuitest_coverline("./src/data/activerecord.js", 449);
function appendPrototypeProperties(Model, data) {
        _yuitest_coverfunc("./src/data/activerecord.js", "appendPrototypeProperties", 449);
_yuitest_coverline("./src/data/activerecord.js", 450);
var i;

        _yuitest_coverline("./src/data/activerecord.js", 452);
for (i in INSTANCE) {
            _yuitest_coverline("./src/data/activerecord.js", 453);
Model.prototype[i] = INSTANCE[i];                                // create instance function
        }
    }

    _yuitest_coverline("./src/data/activerecord.js", 457);
function findBy(property, value) {
        _yuitest_coverfunc("./src/data/activerecord.js", "findBy", 457);
_yuitest_coverline("./src/data/activerecord.js", 458);
console.log("find by " + property + " with value=" + value);
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    _yuitest_coverline("./src/data/activerecord.js", 464);
function loadJSON(callback, json) {
        _yuitest_coverfunc("./src/data/activerecord.js", "loadJSON", 464);
_yuitest_coverline("./src/data/activerecord.js", 465);
var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});
        _yuitest_coverline("./src/data/activerecord.js", 466);
newRec.__id__ = json.__id__;                                   // existing records get a unique id
        _yuitest_coverline("./src/data/activerecord.js", 467);
if (callback) {
            _yuitest_coverline("./src/data/activerecord.js", 468);
callback(newRec);                                              // return a new record
        }
        _yuitest_coverline("./src/data/activerecord.js", 470);
return newRec;
    }

    _yuitest_coverline("./src/data/activerecord.js", 473);
function isNew(state) {
       _yuitest_coverfunc("./src/data/activerecord.js", "isNew", 473);
_yuitest_coverline("./src/data/activerecord.js", 474);
if ( state === undefined )  {
           _yuitest_coverline("./src/data/activerecord.js", 475);
return this.__isNew ;
       }
       else {_yuitest_coverline("./src/data/activerecord.js", 477);
if (state === false) {
           // TODO: remove PK value
           _yuitest_coverline("./src/data/activerecord.js", 479);
this.__isNew = true ;
       }}
    }

    _yuitest_coverline("./src/data/activerecord.js", 483);
ns.ActiveRecord = ActiveRecord;

})(window.Sway.data);










