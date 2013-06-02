if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["./src/data/field.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/field.js",
    code: []
};
_yuitest_coverage["./src/data/field.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    \"use strict\";","","    /**","     * A Field represents a single value of an {{#crossLink \"Sway.data.ActiveRecord\"}}{{/crossLink}} model.","     * It can represent a simple field definition, or an association; an relation between two models.","     *","     *     var username   = new Field('username', { friendlyName: 'User name' })","     *         , password = new Field('password', { type: 'password', friendlyName: 'Password' })","     *         , address  = new Field('address',  { key: 'address', type: 'belongs_to', model: Sway.data.Address, friendlyName: 'Address' }) ;","     *","     * Furthermore, a Field can also hold information about data transformation, which is used by the persistence layer","     *","     *     var accountInfo = new Field( 'accountInfo', { type: 'BLOB', friendLyName: 'Account info', transformers: [encryptFilter, compressFilter] }) ;","     *","     * <h3>Associations</h3>","     *","     * This Active Record implementation is based on the Ruby on Rails (RoR) <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>.<br>","     * The following associations are available:","     *","     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>","     * Assume an 'Account' <tt>belongs\\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\\_one</tt> Account.","     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\\_one</tt> 'AccountHistory', it could look like this","     *","     *      var Account = new Sway.data.ActiveRecord( 'Account', storage, [","     *            new Sway.data.Relation({ key: 'supplier', type: 'belongs_to', model: 'Supplier' }       // creates a field 'supplier_id'","     *            new Sway.data.Relation({ type: 'has_one', model: 'AccountHistory' }                     // AccountHistory should have a account_id field","     *            .....","     *      ]) ;","     *","     *      var Supplier = new Sway.data.ActiveRecord( 'Supplier', storage, [","     *           new Sway.data.Relation({ key: 'account', type: 'has_one', model: 'Account' })","     *           new Sway.data.Relation({ key: 'accountHistory', type: 'has_one', through: 'AccountHistory', model: 'Account' })","     *           ....","     *      ]) ;","     *","     *      var AccountHistory = new Sway.data.ActiveRecord( 'AccountHistory', storage, [","     *          new Sway.datat.Relation({ type: 'belongs_to', model: 'Account' })                          // creates an 'account_id' field","     *          ...","     *      ]) ;","     *","     *      ...","     *      supplierRecord.accountHistory = someAccountHistories","     *","     * An <tt>belongs_to</tt> field is always required!!","     *","     * <h4>HAS_MANY (THROUGH)</h4>","     * This association define a one-to-many or a many-to-many relationship.","     *","     *      new Sway.data.Relation({ key: 'orders', type: 'has_many', model: 'Order' }) ;            // one-to-many","     *      new Sway.data.Relation({ key: 'patients', type: 'has_many', through: 'Appointment', model: 'Patient' }) ;  // many-to-many","     *","     * <h4>HAS_AND_BELONGS_TO_MANY</h4>","     * This relation is identical to <tt>HAS\\_MANY THROUGH</tt> (many-to-many), except it doesn't have a third model","     *","     *      new Sway.data.Relation({ key: 'assemblies', type: 'has_and_belongs_to_many', model: 'Assembly' })","     *","     * And the association in the other moddel look like","     *","     *      new Sway.data.Relation({ key: 'parts', type: 'has_and_belongs_to_many', model: 'Part' })","     *","     *","     * @class Sway.data.Field","     * @constructor","     * @param {String} key name of the field","     * @param {Object} [options] definition of this field","     *      @param {String}  [options.type=TEXT] type of the field or association","     *      @param {String}  [options.model] referenced model","     *      @param {String}  [options.through] specifies a join model. Only available for <tt>HAS\\_ONE</tt> and <tt>HAS\\_MANY</tt> associations","     *      @param {String}  [options.friendlyName] description of the field","     *      @param {Boolean} [options.PK=false] primary key field (there can only be one primary key field)","     *      @param {Boolean} [options.autoIncrement=true] Primary key field is auto-incremented (auto generated key)","     *      @param {Boolean} [options.index=false] put an index on the field","     *      @param {Boolean} [options.unique=false] unique field","     *      @param {Array}   [options.compoundIndex] names of the compound index it is part of.","     *      @param {Boolean} [options.required=false] a required field","     *      @param {Array}   [options.transformers] list of transformer objects. A transformer object can transform the data into a new form and also back","     * into its original form. Think of, zipping and unzipping or encrypting and decrypting","     *      @param {Array}   [options.validators] list of validation functions","     */","    var Field = function (key, options) {","        if (!options) {","            options = {};","        }","        for (var i in options) {","            this[i] = options[i];","        }","        this.key = key;","        this.type = options.type || 'text';  // define default type","        this.isSearchable = true ;","","        return Object.freeze(this);","    };","","    /* this function is called by ActiveRecord, which will also be the context/this */","    function set(key, value) {","        this[key] = value ;","    }","","    Field.prototype = {","","        set: function(value) {","","        },","        /**","         * @method transform","         * @param {*} value value to be transformed","         * @param {Function} callback function called with the transformed data","         */","        transform: function (value, callback) {","            if (this.transformers) {","                transform(0, this.transformers, callback, value);","            }","            else {","                callback(value);","            }","        }","        /**","         * @method validate","         * @param {*} value value to be validated","         * @return {Boolean}","         */, validate: function (value) {","            var i","                , ok = true;","","            if (this.validators) {","                for (i = 0; i < this.validators.length; i++) {","                    if (!this.validators[i].validate(value)) {","                        ok = false;","                        break;","                    }","                }","            }","            return ok;","        }, isField: function () {","            return true;","        }","        /*","         * Returns the size of","         * @method size","         */","        /*","         , getSize: function() {","         return this.state === \"uncompressed\" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;","         }","         */","    };","","    function transform(index, transformers, callback, value) {","        if (transformers[index]) {","            transformers[index].transform(value, transform.bind(null, ++index, transformers, callback));","        }","        else {","            callback(value);","        }","    }","","    ns.Field = Field;","","})(window.Sway.data);","",""];
_yuitest_coverage["./src/data/field.js"].lines = {"1":0,"2":0,"4":0,"5":0,"84":0,"85":0,"86":0,"88":0,"89":0,"91":0,"92":0,"93":0,"95":0,"99":0,"100":0,"103":0,"114":0,"115":0,"118":0,"126":0,"129":0,"130":0,"131":0,"132":0,"133":0,"137":0,"139":0,"152":0,"153":0,"154":0,"157":0,"161":0};
_yuitest_coverage["./src/data/field.js"].functions = {"Field:84":0,"set:99":0,"transform:113":0,"validate:125":0,"isField:138":0,"transform:152":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/field.js"].coveredLines = 32;
_yuitest_coverage["./src/data/field.js"].coveredFunctions = 7;
_yuitest_coverline("./src/data/field.js", 1);
window.Sway = window.Sway || {}; // make sure it exists
_yuitest_coverline("./src/data/field.js", 2);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/field.js", 4);
(function (ns) {
    _yuitest_coverfunc("./src/data/field.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/field.js", 5);
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
    _yuitest_coverline("./src/data/field.js", 84);
var Field = function (key, options) {
        _yuitest_coverfunc("./src/data/field.js", "Field", 84);
_yuitest_coverline("./src/data/field.js", 85);
if (!options) {
            _yuitest_coverline("./src/data/field.js", 86);
options = {};
        }
        _yuitest_coverline("./src/data/field.js", 88);
for (var i in options) {
            _yuitest_coverline("./src/data/field.js", 89);
this[i] = options[i];
        }
        _yuitest_coverline("./src/data/field.js", 91);
this.key = key;
        _yuitest_coverline("./src/data/field.js", 92);
this.type = options.type || 'text';  // define default type
        _yuitest_coverline("./src/data/field.js", 93);
this.isSearchable = true ;

        _yuitest_coverline("./src/data/field.js", 95);
return Object.freeze(this);
    };

    /* this function is called by ActiveRecord, which will also be the context/this */
    _yuitest_coverline("./src/data/field.js", 99);
function set(key, value) {
        _yuitest_coverfunc("./src/data/field.js", "set", 99);
_yuitest_coverline("./src/data/field.js", 100);
this[key] = value ;
    }

    _yuitest_coverline("./src/data/field.js", 103);
Field.prototype = {

        set: function(value) {

        },
        /**
         * @method transform
         * @param {*} value value to be transformed
         * @param {Function} callback function called with the transformed data
         */
        transform: function (value, callback) {
            _yuitest_coverfunc("./src/data/field.js", "transform", 113);
_yuitest_coverline("./src/data/field.js", 114);
if (this.transformers) {
                _yuitest_coverline("./src/data/field.js", 115);
transform(0, this.transformers, callback, value);
            }
            else {
                _yuitest_coverline("./src/data/field.js", 118);
callback(value);
            }
        }
        /**
         * @method validate
         * @param {*} value value to be validated
         * @return {Boolean}
         */, validate: function (value) {
            _yuitest_coverfunc("./src/data/field.js", "validate", 125);
_yuitest_coverline("./src/data/field.js", 126);
var i
                , ok = true;

            _yuitest_coverline("./src/data/field.js", 129);
if (this.validators) {
                _yuitest_coverline("./src/data/field.js", 130);
for (i = 0; i < this.validators.length; i++) {
                    _yuitest_coverline("./src/data/field.js", 131);
if (!this.validators[i].validate(value)) {
                        _yuitest_coverline("./src/data/field.js", 132);
ok = false;
                        _yuitest_coverline("./src/data/field.js", 133);
break;
                    }
                }
            }
            _yuitest_coverline("./src/data/field.js", 137);
return ok;
        }, isField: function () {
            _yuitest_coverfunc("./src/data/field.js", "isField", 138);
_yuitest_coverline("./src/data/field.js", 139);
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

    _yuitest_coverline("./src/data/field.js", 152);
function transform(index, transformers, callback, value) {
        _yuitest_coverfunc("./src/data/field.js", "transform", 152);
_yuitest_coverline("./src/data/field.js", 153);
if (transformers[index]) {
            _yuitest_coverline("./src/data/field.js", 154);
transformers[index].transform(value, transform.bind(null, ++index, transformers, callback));
        }
        else {
            _yuitest_coverline("./src/data/field.js", 157);
callback(value);
        }
    }

    _yuitest_coverline("./src/data/field.js", 161);
ns.Field = Field;

})(window.Sway.data);


