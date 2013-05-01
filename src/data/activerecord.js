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
            var i ;

           function Model(data, options) {                 // define the model class/function
                    if ( !options) {                                // fix input
                        options = {} ;
                    }
                    this.__data        = {} ;                       // the data object
                    this.__fields      = {} ;                       // object holding the fields
                    this.__persistance = persistance ;              // persistance layer
                    this.$className    = modelName ;                  // name of the model
                    this.__state       = typeof(options.transformed) === 'boolean' ? options.transformed : DEFAULTS.STATE.UNFILTERED ;  // state of the record

                    Object.defineProperty(this, '__transform', {    // object used in fluent API
                        value: new Object({ self: this })
                        ,enumerable: false
                        ,writable: false
                        ,configurable: false
                    }) ;

                    for( i = 0; i < fieldList.length; i++ ) {       // add fields to this and
                        createProperty.call(this, fieldList[i], data) ;   // populate this.fields
                    }
            }
            Model.prototype = this ; // add function using prototype inheritance

            // add static functions
            for( i in statics ) {
                Model[i] = statics[i] ;
            }

            // add static properties
            for ( i in DEFAULTS.STATE ) {
                Model[i] = DEFAULTS.STATE[i] ;
            }

            return Model ;
        } ;

    /*
     * Make fields accessible as normal properties of 'this' and populate this.fields.
     * Now values can be set an accessed as follows
     *
     *    userRecord.username = 'John' ;
     *    userRecord.transformed(false).password = 'Secret' ;
     */
    function createProperty(field, data) {
        Object.defineProperty(this, field.key, {
            get: getValue.bind(this, field)
            , set: setValue.bind(this, field)
            ,enumerable: true
            ,configurable: true
        }) ;

        Object.defineProperty(this.__transform, field.key, {          // create fluent api object
            get: getValue.bind(this, field)
            , set: setValue.bind(this, field)
            ,enumerable: true
            ,configurable: true
        }) ;

        this.__fields[field.key] = field ;
        // if data is an active-record, its state is used so no transformations are required
        this.__data[field.key] = { value: data[field.key], state: (typeof(data.__state) === 'boolean' ? data.__state: this.state) } ;
    }

    /*
     * is called if a property is accessed (see createProperty)
     */
    function getValue(field, callback) {
        // TODO take into account this.__transform
        return this.data[field.key]
    }

    /*
     * is called when a property is set. Note that the context (this) in this function can be 'this' or 'this.transform'
     */
    function setValue(field, value) {
        var self = this ;
        //if ( typeof(this.isTransformed === t)
        this.data[field.key] = value ;
    }

	ActiveRecord.prototype = {
        // TODO: should not be lazy, or else you cannot use properties, because they need to be transformed :(
        /**
         * set the a new state.
         * @param state
         * @param {Boolean} [isLazy=true] values are transformed into the new state when requested. If <tt>true, all
         * values are transformed immediately.
         * @param {Function} [callback] if <tt>isLazy</tt> is set to TRUE the callback is called when all values
         * are transformed.
         */
        setState: function(state, isLazy, callback) {
            // TODO
            this.state = state ;
        }
        /**
         * set the value for a specific field with a specific state. If called with the <tt>state</tt> left empty it behaves
         * identical to setting this value using the instance corresponding property
         *
         *          userRecord.username = 'John'                // or
         *          userRecord.setValue('username', 'John') ;
         *
         * @param {String} key
         * @param {String} value
         * @param {String} [state] one of the Model.STATEs. If empty, the data is expected to be in the state of the record
         */
        , setValue: function(key, value, state) {

        }
        /**
         * Returns the value of a specific field. If called without a <tt>state</tt> defined, it behaves identical to
         * retrieving the value using the instance corresponding property
         *
         *          userRecord.username                        // or
         *          userRecord.getValue('username') ;
         */
        // only use this function if
        , getValue: function(key, state) {

        }

        , toJSON: function() { // ale
            return {} ; // TODO
        }

        , getSize: function(key) {
            var self = this._ar
                , size = 0
                , i ;

            if ( key ) {
                return self._field[self._fieldLookup[key]].field.getSize() ;
            }
            else {
                for( i = 0; i < self._field.length; i++ ) {
                    size += self._field[i].field.getSize() ;
                }
            }
            return size ;
            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
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
 * @example
        var userRecord = new User({...}) ;
        var userRecord1 = new User(userRecord) ;
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
