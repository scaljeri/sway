// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(ns) {
    "use strict" ;

    /*
    A reference to all registered model classes is kept here for two reasons, 1) you only need to define it once and
    2) relations can be created when available
     */
    var models = {} ;
    /*
          ActiveRecord.define('User')
                addField( new Field( { } )
                addField( new Field( {} )
                addRelation

          keep reference to each 'User' class
          ActiveRecord( 'User', [ new Relation( {key: orders, model: 'Order', type: 'has_many'}] ) ;
          new ActiveRecord( 'User' ) ;  // return the reference
     */


        /**
         * ActiveRecord is the pattern used for this ORM implementation. This pattern encapsulates access
         * to its resources, like a database.<br>
         * This class is a helper class, because it creates new Model classes of type {{#crossLink "Sway.data.Model"}}{{/crossLink}}.
         * It serves as a blue print and gives all models it creates everything they need to perform CRUD-like tasks
         *
         *      var webSql = new WebSqlStorage() ;
         *      var UserModel = new ActiveRecord( 'User', webSql, [
         *                            new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *                          , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *                          , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *                          , new Relation( { key: 'posts', type: 'HAS_MANY', friendlyName: 'Posts', model: 'Post'})
         *                      ]) ;
         *      var userRecord = new UserModel() ; // -> error, because model 'Post' does not exist
         *
         *      var PostModel = new ActiveRecord( 'Post', webSql, [
         *                            new Field( {type: 'Text', key: 'comment', friendlyName: 'Comment'})
         *                            , new Relation( {type: 'BELONGS_TO', model: 'User'} )
         *                      ]) ;
         *
         *      var userRecord = new UserModel() ; // OK
         *
         * Make sure that all relations exists, before using a model. Furthermore, ActiveRecord remembers all models it creates,
         * so you can recreate models
         *
         *      var UserModel = new ActiveRecord( 'User' ) ;
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object}[storage] object used to access the underlying data structure
         * @param {Array} fieldList list of fields (see {{#crossLink "Sway.data.Field"}}{{/crossLink}}) ) ;
         * @param {Array} [relations] list of Relations
         */
       var ActiveRecord = function(modelName, storage, fields, relations ) {
            var i, key ;

           function Model(data, options) {                              // define the model class/function
               if ( !options) {                                         // fix input
                    options = {} ;
               }
               if ( !data ) {
                   data = {} ;
               }
               else if ( data.$className ) {
                   data = data.toJSON() ;
               }

               Object.defineProperty(this, '__state__',
                   {
                       value: typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.NORMAL
                       , enumarable: false
                   }) ;
               Object.defineProperty(this, '$className',                // name of the class it belongs too
                   {
                       value: this.constructor.name
                       , writable: false
                   }) ;
               Object.defineProperty(this, '__id__',                    // if none of the fields is unique, this field is
                   {                                                    // added to the record
                       value: null
                       , enumarable: false
                       , writable: true
                   }) ;

               Object.defineProperty(this, '__dataSet',                 // al items
                   {
                       value: data
                       , writable: false
                   }) ;

               for( i in this.constructor.fields ) {                // TODO: initialize with first item
                   this[i] = data[i] ;

               }
               return Object.seal(this) ;                               // make sure no properties can be added
            }

            appendStaticProperties(Model, storage, fields, relations ) ;
            appendPrototypeProperties(Model) ;



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
                if ( record.$className ) {                                              // json required for searching
                    record = record.toJSON() ;
                }
                var json = this.storage.find(record, loadJSON.bind(this, callback) ) ;
                if ( typeof(json) === 'object' ) {                                      // not async ?
                    var inst = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
                    if ( inst.setState(DEFAULTS.STATE.NORMAL, callback) ) {             // detect if async ? TODO
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
                this.state = state ;
                if ( typeof(isLazy) === 'function') {
                    callback = isLazy ;
                    isLazy = true ;
                }
                // TODO: applie transformers
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
                var json = {}
                    , i ;
                for( i in this.constructor.fields ) {
                    json[i] = this[i] ;
                }
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
               return this.constructor.storage.save(this, deep, callback) ;
            }
            , getFields: function() {
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
                var json = {} ;
                if ( this.fields[key].FK ) {
                    json[key] = this[key] ;
                    this.fields[key].model.find(json, function(records){
                            this[key] = records ;
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
                return this.__dataSet.length ;
            }
        } ;

    /* Private helpers */

    function appendStaticProperties(Model, storage, fields, relations) {
        var i, key, hasTransformers = false ;

        for ( i in STATIC ) {                                   // create static methods
            Model[i] = STATIC[i].bind(Model) ;
        }

        Model.storage = storage ;                                   // reference to the storage object
        Model.relations = relations ;
        Model.fields = {} ;                                         // field container, referenced by their key value
        Model.hasTransformers = false ;


        for( i = 0; i < fields.length; i++ ) {
            key = fields[i].key ;
            Model.fields[key] = fields[i] ;         // add field to fields object
            // create a 'findByXXX' function, like: findByUserName
            Model[['findBy', key.slice(0,1).toUpperCase(), key.slice(1)].join('')] = findBy.bind(Model, key);
            if ( fields[i].transformers && fields[i].transformers.length > 0 ) {
                Model.hasTransformers = true ;
            }
        }
    }

    function appendPrototypeProperties(Model) {
        var i ;

        for( i in INSTANCE ){
            Model.prototype[i] = INSTANCE[i] ;                                // create instance function
        }
    }

    function findBy(property, value) {
        console.log("find by " + property + " with value=" + value) ;
    }

    /*
     * loadJSON receives json from a storage object. It converts this into an active record object.
     */
    function loadJSON(callback, json) {
        var newRec = new this(json, {state: DEFAULTS.STATE.TRANSFORMED}) ;
        newRec.__id__ = json.__id__ ;                                   // existing records get a unique id
        if ( callback ) {
            callback(newRec) ;                                              // return a new record
        }
        return newRec ;
    }

	ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;










