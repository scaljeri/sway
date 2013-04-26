// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(Ns) {
    "use strict" ;

    /**
     * The ActiveRecord class represents data-structures, like a database table. An instance represents a single record.
     * It is a blue print for all models it creates, providing them with functionality needed to perform CRUD-like tasks
     *
     * For example, to create a User model, do
     *
     *      var User = new ActiveRecord( 'User', new WebSqlPersistance('user-table'), [
     *                new Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'}) )
     *              , new Field( [encryptFilter], {type: 'TEXT', key: 'password', friendlyName: 'Password'}) )
     *              , new Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'} )
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
     * @class Sway.data.ActiveRecord
     * @constructor
     * @param {String} modelName name of the model
     * @param {Object}[persistence] object used for data persistance and lookups
     * @param {Array} [fieldList] list of fields
     */
     var ActiveRecord = function(modelName, persistance, fieldList ) {

        /*
        AR prototype methods can be access by a BLESSED model, or simply by an ActiveRecord instance. To make these
        function independent of this BLESSED mechanism the blow variables is used within each function
         */
        Object.defineProperty(this, '_ar',          // use this._ar instead of this
            {
                value:this
                , configurable: false
                , writable: false
                , enumerable: false // hide it
            }
        ) ;

        Object.defineProperty(this, '_persist',
            {
                value: persistance
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_field',
            {
                value: []
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_fieldLookup',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

	ActiveRecord.prototype = {
        /**
         * @chainable
         * @param {Object} model instance to be blessed
         */
        bless: function(model) {
            var i
                , setup ;

            Object.defineProperty(model, '_ar',             // create a ref to ActiveRecord instance
                {
                    value: this
                    , enumerable: false // hide it
                }
            ) ;

            // copy methods
            model.save = this.save ;

            // clone the fields
            if ( !model._field ) {
                Object.defineProperty(model, '_field',             // create a ref to ActiveRecord instance
                    {
                        value: []
                        , enumerable: false // hide it
                    }
                ) ;
                Object.defineProperty(model, '_fieldLookup',             // create a ref to ActiveRecord instance
                    {
                        value:{}
                        , enumerable: false // hide it
                    }
                ) ;

                for( i = 0; i < this._field.length; i++ ){
                    setup = this._field[i] ;
                    model._fieldLookup[setup.key] = model._field.length ;
                    model._field.push(clone(this._field[i])) ;
                }
            }
            return this ;
        }
        /**
         * @param {String} key
         * @return {Object} Field instance
         */
        , getField: function(key) {
            return this._field[this._fieldLookup[key]].field ;
        }
        /**
         * @param {String} key
         * @param {Object} field Field instance
         */
        , setField: function(key, field) {
           this._fieldLookup[key] = this._field.length ;
            this._field.push({ key: key, field: field}) ;
        }
        /**
         * @param {String} key
         * @returns {Number}
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
        save: function() {
        }
    } ;

    function clone (obj){
        var key
            , temp ;

        if(obj === null || typeof(obj) !== 'object') {
            return obj;
        }

        temp = obj.constructor();                           // changed

        for(key in obj) {                                   // copy every attribute
            temp[key] = obj[key] ;
        }
        return temp;
    }

	Ns.ActiveRecord = ActiveRecord ;

})(window.Sway.data) ;
