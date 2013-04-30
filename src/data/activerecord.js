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
         * The ActiveRecord class is a bit special, because it doesn't create an instance of itself, but instead
         * it creates a new class,  {{#crossLink "Sway.data.Model"}}{{/crossLink}}. This class is has configured the
         * fields provided to the ActiveRecord's constructor.
         *
         * ActiveRecord needs the name of the model to be created, a object used to persist the data and finally a list of field
         * definitions.
         * A model is almost identical to the ActiveRecord interface, except that its constructor accepts two parameters,
         *     1) data      - json object: { username: 'John', password: 'Secret' }
         *     2) options   - options object
         * A data record is created as follows
         *
         *      User.find( // asynchronious call
         *         {
         *               'username':   'John'
         *             , 'password': 'Secret'
         *         }, function(user) {
         *             alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
         *             var cloneUser = new User(user) ;
         *             cloneUser.birthDay = new Date() ;
         *             newUser.save() ;
         *         }
         *      ) ;
         *
         *      var userRecord = new User({ username: 'John', password: 'Secret'}) ;
         *      userRecord.save() ;
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
    function getValue(field) {
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

        transformed: function(isTransformed) {
            var i
                , retObj =  {} ;
            for( i in this.fields ) {

            }
            this.__transform.isTransformed = isTransformed ;
            return this.__transform ;
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
 * enables us to create classes fully configured with field definitions and a persistence layer at runtime. This persistence layer is, for example, the
 * connection with a database and knows how to translate an ActiveRecord into a query.
 *
 * Every model comes with a set of static methods
 *
 *     User.find(
 *       {
 *           'username':   'John'
 *           , 'password': 'Secret'
 *       }, function(user) {
 *           alert('Welcome ' + user.username + '! Your birthday is ' + user.birthday) ;
 *           var cloneUser = new User(user) ;
 *           cloneUser.birthDay = new Date() ;
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
 *
 * @class Sway.data.Model
 * @constructor
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
 * TODO
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
