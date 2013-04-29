// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(ns) {
    "use strict" ;

    var DEFAULTS = {
            STATE: {
                UNFILTERED: 'unfiltered'
                , FILTERED: 'filtered'
            }
        }
        , statics = {
            /**
            * TODO
            * @method find
            * @static
            * @param {Object} options
            */
            find: function(options) {

            }
            /**
            * @method save
            * @static
            * @param {Object} options
            */
            , save: function(options) {
            }
        }
        /**
         * The ActiveRecord class represents data-structures, like a database table. An instance represents a single record.
         * It is a blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks
         *
         * Create a model
         *
         *      var User = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [
         *                new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
         *              , new Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
         *              , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
         *          ]) ;
         *
         *      ) ; // create a new model class with WebSQL persistance and three fields
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
         * @param {Object} [options]
         *      @param {Boolean} [transformed=false]
         */
       , ActiveRecord = function(modelName, persistance, fieldList ) {
            var i
                , model = function(data, options) {
                    if ( !options) {
                        options = {} ;
                    }
                    this.__data        = {} ;                       // the data object
                    this.__fields      = {} ;                       // object holding the fields
                    this.__persistance = persistance ;              // persistance layer
                    this.$className  = modelName ;                  // name of the model
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
            } ;
            model.prototype = this ; // add function using prototype inheritance

            // add static functions
            for( i in statics ) {
                model[i] = statics[i] ;
            }
            return model ;
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
        // if data is an active-record, its state is used so no transforms are needed
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
        this.data[field.key] = value ;
    }

	ActiveRecord.prototype = {
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
        transformed: function(isTransformed) {
            var i
                , retObj =  {} ;
            for( i in this.fields ) {

            }
            this.__transform.isTransformed = isTransformed ;
            return this.__transform ;
        }
        /**
         * returns all the data in JSON format (unfiltered)
         * @method getToJSON
         * @param {String} key
         * @returns {Number}
         */
        , toJSON: function() { // ale
            return {} ; // TODO
        }
        /**
         * @method setData
         * @chainable
         * @param {Object} data
         * @param {Boolean} [isFiltered=false]
         */
        , setData: function(data, isFiltered) {

        }
        /**
         * @method getSize
         * @param {Sting} key
         */
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
        },
    } ;


	ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
