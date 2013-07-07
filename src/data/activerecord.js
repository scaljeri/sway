// Create the namespace -> JS load order independent
window.Sway = window.Sway || {};
window.Sway.data = window.Sway.data || {};

(function (ns) {
    "use strict";

    /*
     A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and
     2) relations can be created when available
     */
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
            var Model = createModel(modelName);

            appendStaticProperties(Model, storage, fields);
            appendPrototypeProperties(Model);

            models[modelName] = Model;

            return Model;
        };
    /**
     * Returns a model class
     * @method get
     * @static
     * @param {String} modelName name of the model
     * @return {Class} a model
     */
    ActiveRecord.get = function (modelName) {
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
                if (record.$className) {                                              // json required for searching
                    record = record.toJSON();
                }
                var json = this.storage.find(record, loadJSON.bind(this, callback));
                if (typeof(json) === 'object') {                                      // not async ?
                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});
                    if (inst.setState(DEFAULTS.STATE.NORMAL, callback)) {             // detect if async ? TODO
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
                this.state = state;
                if (typeof(isLazy) === 'function') {
                    callback = isLazy;
                    isLazy = true;
                }
                // TODO: applie transformers
                callback();
            }
            /**
             *
             * returns all data in JSON format
             * @method toJSON
             * @return {Object}
             */, toJSON: function () {
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
                var json = {};
                if (this.fields[key].FK) {
                    json[key] = this[key];
                    this.fields[key].model.find(json, function (records) {
                        this[key] = records;
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
    function createModel(modelName) {
        var model = function Model(data, options) {                              // define the model class/function
            options = options || {};                                         // fix input
            data = data || {};

            if (data.$className) {                                        // check if data is an ActiveRecord instance
                data = data.toJSON();
            }

            Object.defineProperty(this, '__state__',
                {
                    value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL, enumarable: false
                });
            Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                {                                                    // added to the record
                    value: null, enumarable: false, writable: true
                });

            Object.defineProperty(this, '__data',
                {
                    value: data, writable: false                    // make only the properties of data writable
                });

            Object.defineProperty(this, '$className',                // name of the class it belongs too
                {
                    value: modelName, writable: false
                });

            /**
             * bla bla
             * @property {Boolean} isDirty
             */
            Object.defineProperty(this, 'isDirty',{value: false} ) ;
            Object.defineProperty(this, '__isNew',{value: true} ) ;


            /**
             * bla bla
             * @property {Boolean} isNew
             */
            Object.defineProperty(this, 'isNew',{
                set: isNew.bind(this)
                , get: isNew.bind(this)
            }) ;

            var field, i;
            for (i in this.constructor.fields) {
                field = this.constructor.fields[i];
                (function (i, field) {
                    Object.defineProperty(this, i, {
                        set: function(value){field.set( this, i, value);}.bind(this)    // set is handled by the field itself
                        , get: getProperty.bind(this, i)
                    });
                    if ( this.__data[i] === undefined ) { // set default value
                        this.__data[i] = field.defaultValue ;
                    }
                }.bind(this))(i, field);


            }
            return Object.preventExtensions(this);                               // make sure no properties can be added
        };
        model.$name = modelName ;
        return model ;
    }


    function getProperty(key) {
        return this.__data[key];
    }

    function appendStaticProperties(Model, storage, fields) {
        var i
            , field
            , hasPK = false;                                    // used to determine if a PK is defined, if not create findById function

        for (i in STATIC) {                                   // create static methods
            Model[i] = STATIC[i].bind(Model);
        }

        /*
         A relation needs to be set on both object. For example, if a patient has an address, an address belongs to
         a patient. In code
         patient.address = address ;
         address.__reverseRelation.belongs_to['patient'] = this ; // note that
         */
        Object.defineProperty(Model, '__reverseRelation', { value: {}, enumarable: false}) ;

        Model.storage = storage;                                   // reference to the storage object
        Model.fields = {};                                         // field container, referenced by their key value
        Model.relations = {};                                         // field container, referenced by their key value

        Object.defineProperty(Model, 'findLookup', {
            value: {}
            , enumerable: false
        }) ;

        for (i = 0; i < fields.length; i++) {
            field = fields[i] ;
            Model.fields[field.key] = field;         // add field to fields object
            createFindByXXX(Model, field);
            hasPK = hasPK | !!field.PK;                // bitwise OR to determine if PK is defined (hasPK is 1 or 0)

            if ( field.model ) { // if defined, its a relation between two models
                Model.__reverseRelation[field.model.$className||field.model] = field ;
            }
        }

        if (hasPK === 0) {
            // TODO add id Field to Model too!!
            createFindByXXX(Model, new ns.Field('id', {autoIncrement: true }));
        }
    }

    function createFindByXXX(Model, field) {
        var name = ['findBy', field.key.slice(0, 1).toUpperCase(), field.key.slice(1)].join('');
        Model[name] = (Model.findLookup[name] = findBy.bind(Model, field.key)) ;
    }

    function appendPrototypeProperties(Model, data) {
        var i;

        for (i in INSTANCE) {
            Model.prototype[i] = INSTANCE[i];                                // create instance function
        }
    }

    function findBy(property, value) {
        console.log("find by " + property + " with value=" + value);
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    function loadJSON(callback, json) {
        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED});
        newRec.__id__ = json.__id__;                                   // existing records get a unique id
        if (callback) {
            callback(newRec);                                              // return a new record
        }
        return newRec;
    }

    function isNew(state) {
       if ( state === undefined )  {
           return this.__isNew ;
       }
       else if (state === false) {
           // TODO: remove PK value
           this.__isNew = true ;
       }
    }

    ns.ActiveRecord = ActiveRecord;

})(window.Sway.data);










