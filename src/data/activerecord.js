// Create the namespace -> JS load order independent
window.Sway = window.Sway || {} ;
window.Sway.data = window.Sway.data || {} ;

(function(ns) {
    "use strict" ;

    var statics = {
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
       , ActiveRecord = function(modelName, persistance, fieldList ) {
            var i
                , model = function(options) {
                this.options = options ;
                this.persistance = persistance ;
                this.fields = fieldList ;
                this.$className = modelName ;
            } ;
            model.prototype = this ; // add function using prototype inheritance

            // add static functions
            for( i in statics ) {
                model[i] = statics[i] ;
            }
            return model ;
        } ;

	ActiveRecord.prototype = {
        /**
         * @method getData
         * @param {String} key
         * @returns {Number}
         */
        getData: function(state) {

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
