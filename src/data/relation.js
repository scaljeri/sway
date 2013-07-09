// Create the namespace -> JS load order independent
window.Sway = window.Sway || {};
window.Sway.data = window.Sway.data || {};

(function (ns) {
    /*
        *) Rule nr1: Only one relation can exist between two tables

     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)
     has_one
     has_many
     has_many :through   (the thirt table is also a model)
     has_one :through    ( goes one-to-one through other model)
     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)
     */

    /**
     * Sway.data.Relation defines the association between two {{#crossLink "Sway.data.Model"}}{{/crossLink}}s. It is based on the Ruby on Rails (RoR)
     * <a href="http://guides.rubyonrails.org/association_basics.html">ActiveRecord Associations</a>.<br>
     * The following associations are available:
     *
     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>
     * Assume an 'Account' <tt>belongs\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\_one</tt> Account.
     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\_one</tt> 'AccountHistory', it will look like this
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
     * @class Sway.data.Relation
     * @constructor
     * @param {String} key
     * @param {String} type type of association
     * @param {String} model name of the model
     * @param {Object} [options]
     *          @param {String} [options.through] specifies a join model. Only available for <tt>HAS\_ONE</tt> and <tt>HAS\_MANY</tt> associations
     *          @param {String} [options.friendlyName] description of the field
     */
    var Relation = function (key, type, model, options) {
        if ( !options ) {
            options = {} ;
        }
        this.key = key;
        this.type = type;
        this.model = model;
        this.defaultValue = options.defaultValue||null ;

        switch (type) {
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
            default:
                this.set = function(){ throw("Associtation " + type  + " is not supported");};
        }

        return Object.freeze(this);
    };

    Relation.prototype = {} ;

    /*
        @param {Object} self the object which receives the 'activeRecord'
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
        else {  // nope, no relation!!
            throw "No Relation defined for " + self.$className + ":belongs_to --> " + activeRecord.$className + ":???" ;
        }
    }

    function getDataThrough(self, key) {
        return self.__data[key] ? self.__data[key][key] : null ;
    }

    ns.Relation = Relation;
})(window.Sway.data);