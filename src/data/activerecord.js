// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(ns) {
    "use strict" ;

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
         * ActiveRecord needs the name of the model to be created, an object used to persist the data and finally a list of field
         * definitions.
         *
         * @class Sway.data.ActiveRecord
         * @constructor
         * @param {String} modelName name of the model
         * @param {Object}[persistence] object used for data persistance and lookups
         * @param {Array} [fieldList] list of fields
         */
       , ActiveRecord = function(modelName, persistance, fieldList ) {

           function Model(data, options) {                              // define the model class/function
               console.dir(Model.fields) ;
               var i ;

               if ( !options) {                                         // fix input
                    options = {} ;
               }
               if ( !data ) {
                   data = {} ;
               }
               else if ( data.$className ) {
                   data = data.toJSON() ;
               }

               this.__persistance = persistance ;                       // persistance layer
               this.__state       = typeof(options.state) === 'boolean' ? options.state : DEFAULTS.STATE.UNFILTERED ;  // default state of the record
               this.$className    = modelName ;                         // name of the model

               for( i in this.constructor.fields ) {
                    this[i] = data[i] ;
               }
               return Object.seal(this) ;
            }

            Model.prototype.setState = this.setState ;                                    // add function using prototype inheritance
            Model.prototype.toJSON = this.toJSON ;                                         // add function using prototype inheritance

            // create static stuff
            Model.find = ActiveRecord.find ;
            Model.persistance = persistance ;
            Model.fields = {} ;
            for( var i = 0; i < fieldList.length; i++ ) {                   // add fields to this and
                Model.fields[fieldList[i].key] = fieldList[i] ;             // hash of field objects
            }
            return Model ;                                                  // return a Model instance
        } ;

    ActiveRecord.find = function(record) {
        if ( record.$className ) {
            record = record.toJSON() ;
        }
        var result = this.persistance.find(record) ;
        return new this(result) ;                                           // return a new record
    } ;

	ActiveRecord.prototype = {
        setState: function(state, callback) {
            this.state = state ;
            // TODO: applie transformers
            callback() ;
        }
        , toJSON: function() { // ale
            var json = {}
                , i ;
            for( i in this.constructor.fields ) {
                json[i] = this[i] ;
            }
            return json ;
        }
    } ;

	ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;

/* Define the Model class here */

/**
 * This is a virtual class and is created using {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}}. This dynamic class creation method
 * facilitates the creation of new classes fully configured with field definitions and a persistence layer at runtime. Theses instances
 * can directly save data
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
 * @param {Object|Model} [data] JSON data or a model instance to be cloned
 */
/**
 * TODO
 * @method save
 *
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
 *    User.find(
 *      {
 *           'username':   'John'
 *           , 'password': 'Secret'
 *      }, function(user) { ... } ) ;
 *
 * Or use a model instance for searching
 *
 *     User.find(userRecord, callbackFunc) ;
 *
 *
 *
 *
 *
 *           alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
 *           var cloneUser = new User(user) ;
 *           cloneUser.birthDay = new Date() ;              // access field 'birthday' as a property
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
