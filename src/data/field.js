window.Sway = window.Sway || {}; // make sure it exists
window.Sway.data = window.Sway.data || {};

(function (ns) {
    "use strict";

    /**
     * A Field represents a single value of an {{#crossLink "Sway.data.ActiveRecord"}}{{/crossLink}} model.
     * It can represent a simple field definition, or an association; an relation between two models.
     *
     *     var username   = new Field('username', { friendlyName: 'User name' })
     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })
     *         , address  = new Field('address',  { key: 'address', type: 'belongs_to', model: Sway.data.Address, friendlyName: 'Address' }) ;
     *
     * Furthermore, a Field can also hold information about data transformation, which is used by the persistence layer
     *
     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;
     *
     * <h3>Associations</h3>
     *
     * This Active Record implementation is based on the Ruby on Rails (RoR) <a href="http://guides.rubyonrails.org/association_basics.html">ActiveRecord Associations</a>.<br>
     * The following associations are available:
     *
     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>
     * Assume an 'Account' <tt>belongs\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\_one</tt> Account.
     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\_one</tt> 'AccountHistory', it could look like this
     *
     *      var Account = new Sway.data.ActiveRecord( 'Account', storage, [
     *            new Sway.data.Relation({ key: 'supplier', type: 'belongs_to', model: 'Supplier' }       // creates a field 'supplier_id'
     *            new Sway.data.Relation({ type: 'has_one', model: 'AccountHistory' }                     // AccountHistory should have a account_id field
     *            .....
     *      ]) ;
     *
     *      var Supplier = new Sway.data.ActiveRecord( 'Supplier', storage, [
     *           new Sway.data.Relation({ key: 'account', type: 'has_one', model: 'Account' })
     *           new Sway.data.Relation({ key: 'accountHistory', type: 'has_one', through: 'AccountHistory', model: 'Account' })
     *           ....
     *      ]) ;
     *
     *      var AccountHistory = new Sway.data.ActiveRecord( 'AccountHistory', storage, [
     *          new Sway.datat.Relation({ type: 'belongs_to', model: 'Account' })                          // creates an 'account_id' field
     *          ...
     *      ]) ;
     *
     *      ...
     *      supplierRecord.accountHistory = someAccountHistories
     *
     * An <tt>belongs_to</tt> field is always required!!
     *
     * <h4>HAS_MANY (THROUGH)</h4>
     * This association define a one-to-many or a many-to-many relationship.
     *
     *      new Sway.data.Relation({ key: 'orders', type: 'has_many', model: 'Order' }) ;            // one-to-many
     *      new Sway.data.Relation({ key: 'patients', type: 'has_many', through: 'Appointment', model: 'Patient' }) ;  // many-to-many
     *
     * <h4>HAS_AND_BELONGS_TO_MANY</h4>
     * This relation is identical to <tt>HAS\_MANY THROUGH</tt> (many-to-many), except it doesn't have a third model
     *
     *      new Sway.data.Relation({ key: 'assemblies', type: 'has_and_belongs_to_many', model: 'Assembly' })
     *
     * And the association in the other moddel look like
     *
     *      new Sway.data.Relation({ key: 'parts', type: 'has_and_belongs_to_many', model: 'Part' })
     *
     *
     * @class Sway.data.Field
     * @constructor
     * @param {String} key name of the field
     * @param {Object} [options] definition of this field
     *      @param {String}  [options.type=TEXT] type of the field or association
     *      @param {String}  [options.model] referenced model
     *      @param {String}  [options.through] specifies a join model. Only available for <tt>HAS\_ONE</tt> and <tt>HAS\_MANY</tt> associations
     *      @param {String}  [options.friendlyName] description of the field
     *      @param {Boolean} [options.PK=false] primary key field (there can only be one primary key field)
     *      @param {Boolean} [options.autoIncrement=true] Primary key field is auto-incremented (auto generated key)
     *      @param {Boolean} [options.index=false] put an index on the field
     *      @param {Boolean} [options.unique=false] unique field
     *      @param {Array}   [options.compoundIndex] names of the compound index it is part of.
     *      @param {Boolean} [options.required=false] a required field
     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back
     * into its original form. Think of, zipping and unzipping or encrypting and decrypting
     *      @param {Array}   [options.validators] list of validation functions
     */
    var Field = function (key, options) {
        if ( !options ) {
            options = {} ;
        }
        for (var i in options) {
            this[i] = options[i];
        }
        this.key = key;
        this.type = options.type || 'text';  // default type

        switch (this.type) {
            case 'belongs_to' :
                this.set = setHasOne.bind(this) ;        // force context === this
                this.defaultValue = options.defaultValue||null ;
                break ;
            case 'has_one':
                this.set = (options.through ? setHasOneThrough : setHasOne).bind(this) ;
                if ( options.through ) {
                    this.get = getDataThrough ;
                }
                this.defaultValue = options.defaultValue||null ;
                break ;
            case 'has_many':
                this.set = (options.through ? setHasManyThrough : setHasMany).bind(this) ;
                if ( options.through ) {
                    this.get = getDataThrough ;
                }
                this.defaultValue = options.defaultValue||[] ;
                break;
            case 'has_and_belongs_to_many':
                this.set = setHasMany.bind(this);
                this.defaultValue = options.defaultValue||[] ;
                break;
            default: // its not a association
                if ( this.model || this.through ) {
                    throw "The field " + key + " does not support the mode/through property (" + this.model + " " + this.through + ")" ;
                }
        }
    };

    /*
     The context/this is the instance of this class
     @param {Object} self the AR object which receives the 'activeRecord'
     @param {String} key the property of self
     @param {Object} activeRecord the value to be set
     */
    function setHasOne(self, key, activeRecord) {
        console.log(self.$className + ':' + key + ' has-one ' + activeRecord.$className) ;
        self.__data[key] = activeRecord ;
        setSelf2AR(self, key, activeRecord) ;
    }
    function setHasMany(self, key, activeRecord) {
        console.log(self.$className + ':' + key + ' has-many ' + activeRecord.$className) ;
        var i;

        if ( Array.isArray(activeRecord) ) {
            self.__data[key] = activeRecord ;
            for( i = 0; i < activeRecord.length; i++) {
                setSelf2AR(self, key, activeRecord) ;
            }
        }
        else if ( self.__data[key].indexOf(activeRecord) === -1 ) {
            self.__data[key].push(activeRecord) ;
            setSelf2AR(self, key, activeRecord) ;
        }
    }

    function setHasManyThrough(self, key, activeRecord) {
        if ( activeRecord.$className === this.model ) {
            console.log(this.model + " goes through " + this.through) ;
            if ( this.through ) {

            }
            else {
                throw "The assoc " + this.key + " for " + self.$className + " doesn't have 'through' defined!!" ;
            }
        }
        else {
            throw "Association missmatch, " + this.model + " (assoc) not equals " + activeRecord.$className + " (val)" ;

        }
    }

    function setHasOneThrough(self, key, activeRecord) {
    }

    function setSelf2AR(self, key, activeRecord) {
        var otherField = activeRecord.constructor.__reverseRelation[self.$className] ;
        if ( otherField ) {
            if ( activeRecord[otherField.key] !== self ) {
                activeRecord[otherField.key] = self ;
            }
        }
        else {  // oops, no relation!!
            throw "No Relation defined for " + self.$className + ":belongs_to --> " + activeRecord.$className + ":???" ;
        }
    }

    function getDataThrough(self, key) {
        return self.__data[key] ? self.__data[key][key] : null ;
    }

    /* this function is called by ActiveRecord, which will also be the context/this */
    /*
    function set(key, value) {
        this[key] = value ;
    }
    */

    Field.prototype = {

        set: function(value) {

        },
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function (value, callback) {
            if (this.transformers) {
                transform(0, this.transformers, callback, value);
            }
            else {
                callback(value);
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */, validate: function (value) {
            var i
                , ok = true;

            if (this.validators) {
                for (i = 0; i < this.validators.length; i++) {
                    if (!this.validators[i].validate(value)) {
                        ok = false;
                        break;
                    }
                }
            }
            return ok;
        }, isField: function () {
            return true;
        }
        /*
         * Returns the size of
         * @method size
         */
        /*
         , getSize: function() {
         return this.state === "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;
         }
         */
    };

    function transform(index, transformers, callback, value) {
        if (transformers[index]) {
            transformers[index].transform(value, transform.bind(null, ++index, transformers, callback));
        }
        else {
            callback(value);
        }
    }

    ns.Field = Field;

})(window.Sway.data);


