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
_yuitest_coverage["./src/data/relation.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/relation.js",
    code: []
};
_yuitest_coverage["./src/data/relation.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {};","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    /*","        *) Rule nr1: Only one relation can exist between two tables","","     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)","     has_one","     has_many","     has_many :through   (the thirt table is also a model)","     has_one :through    ( goes one-to-one through other model)","     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)","     */","","    /**","     * Sway.data.Relation defines the association between two {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}s. It is based on the Ruby on Rails (RoR)","     * <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>.<br>","     * The following associations are available:","     *","     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>","     * Assume an 'Account' <tt>belongs\\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\\_one</tt> Account.","     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\\_one</tt> 'AccountHistory', it will look like this","     *","     *      var Account = new Sway.data.ActiveRecord( 'Account', storage, [","     *            new Sway.data.Relation({ key: 'supplier', type: 'belongs_to', model: 'Supplier' }       // creates a field 'supplier_id'","     *            new Sway.data.Relation({ type: 'has_one', model: 'AccountHistory' }                     // AccountHistory should have a account_id field","     *            .....","     *      ]) ;","     *","     *      var Supplier = new Sway.data.ActiveRecord( 'Supplier', storage, [","     *           new Sway.data.Relation({ key: 'account', type: 'has_one', model: 'Account' })","     *           new Sway.data.Relation({ key: 'accountHistory', type: 'has_one', through: 'AccountHistory', model: 'Account' })","     *           ....","     *      ]) ;","     *","     *      var AccountHistory = new Sway.data.ActiveRecord( 'AccountHistory', storage, [","     *          new Sway.datat.Relation({ type: 'belongs_to', model: 'Account' })                          // creates an 'account_id' field","     *          ...","     *      ]) ;","     *","     *      ...","     *      supplierRecord.accountHistory = someAccountHistories","     *","     * An <tt>belongs_to</tt> field is always required!!","     *","     * <h4>HAS_MANY (THROUGH)</h4>","     * This association define a one-to-many or a many-to-many relationship.","     *","     *      new Sway.data.Relation({ key: 'orders', type: 'has_many', model: 'Order' }) ;            // one-to-many","     *      new Sway.data.Relation({ key: 'patients', type: 'has_many', through: 'Appointment', model: 'Patient' }) ;  // many-to-many","     *","     * <h4>HAS_AND_BELONGS_TO_MANY</h4>","     * This relation is identical to <tt>HAS\\_MANY THROUGH</tt> (many-to-many), except it doesn't have a third model","     *","     *      new Sway.data.Relation({ key: 'assemblies', type: 'has_and_belongs_to_many', model: 'Assembly' })","     *","     * And the association in the other moddel look like","     *","     *      new Sway.data.Relation({ key: 'parts', type: 'has_and_belongs_to_many', model: 'Part' })","     *","     * @class Sway.data.Relation","     * @constructor","     * @param {String} key","     * @param {String} type type of association","     * @param {String} model name of the model","     * @param {Object} [options]","     *          @param {String} [options.through] specifies a join model. Only available for <tt>HAS\\_ONE</tt> and <tt>HAS\\_MANY</tt> associations","     *          @param {String} [options.friendlyName] description of the field","     */","    var Relation = function (key, type, model, options) {","        if ( !options ) {","            options = {} ;","        }","        this.key = key;","        this.type = type;","        this.model = model;","        this.defaultValue = options.defaultValue||null ;","","        switch (type) {","            case 'belongs_to' :","                this.set = setHasOne.bind(this) ;        // force context === this","                this.defaultValue = options.defaultValue||null ;","                break ;","            case 'has_one':","                this.set = setHasOne.bind(this) ;","                this.defaultValue = options.defaultValue||null ;","                break ;","            case 'has_many':","                this.set = setHasMany.bind(this) ;","                this.defaultValue = options.defaultValue||[] ;","                break;","            case 'has_and_belongs_to_many':","                this.set = setHasMany.bind(this);","                this.defaultValue = options.defaultValue||[] ;","                break;","            default:","                this.set = function(){ throw(\"Associtation \" + type  + \" is not supported\");};","        }","","        return Object.freeze(this);","    };","","    Relation.prototype = {} ;","","    /*","        @param {Object} self the object which receives the 'activeRecord'","        @param {String} key the property of self","        @param {Object} activeRecord the value to be set","     */","    function setHasOne(self, key, activeRecord) {","        console.log(self.$className + ':' + key + ' has-one ' + activeRecord.$className) ;","        self.__data[key] = activeRecord ;","        setSelf2AR(self, key, activeRecord) ;","    }","    function setHasMany(self, key, activeRecord) {","        console.log(self.$className + ':' + key + ' has-many ' + activeRecord.$className) ;","        var i;","","        if ( Array.isArray(activeRecord) ) {","            self.__data[key] = activeRecord ;","            for( i = 0; i < activeRecord.length; i++) {","                setSelf2AR(self, key, activeRecord) ;","            }","        }","        else if ( self.__data[key].indexOf(activeRecord) === -1 ) {","            self.__data[key].push(activeRecord) ;","            setSelf2AR(self, key, activeRecord) ;","        }","    }","","    function setSelf2AR(self, key, activeRecord) {","        var otherField = activeRecord.constructor.__reverseRelation[self.$className] ;","        if ( otherField ) {","            if ( activeRecord[otherField.key] !== self ) {","                activeRecord[otherField.key] = self ;","            }","        }","        else {  // nope, no relation!!","            throw \"No Relation defined for \" + self.$className + \":belongs_to --> \" + activeRecord.$className + \":???\" ;","        }","    }","","    ns.Relation = Relation;","})(window.Sway.data);"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/relation.js"].lines = {"2":0,"3":0,"5":0,"72":0,"73":0,"74":0,"76":0,"77":0,"78":0,"79":0,"81":0,"83":0,"84":0,"85":0,"87":0,"88":0,"89":0,"91":0,"92":0,"93":0,"95":0,"96":0,"97":0,"99":0,"102":0,"105":0,"112":0,"113":0,"114":0,"115":0,"117":0,"118":0,"119":0,"121":0,"122":0,"123":0,"124":0,"127":0,"128":0,"129":0,"133":0,"134":0,"135":0,"136":0,"137":0,"141":0,"145":0};
_yuitest_coverage["./src/data/relation.js"].functions = {"set:99":0,"Relation:72":0,"setHasOne:112":0,"setHasMany:117":0,"setSelf2AR:133":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/relation.js"].coveredLines = 47;
_yuitest_coverage["./src/data/relation.js"].coveredFunctions = 6;
_yuitest_coverline("./src/data/relation.js", 2);
window.Sway = window.Sway || {};
_yuitest_coverline("./src/data/relation.js", 3);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/relation.js", 5);
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
    _yuitest_coverfunc("./src/data/relation.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/relation.js", 72);
var Relation = function (key, type, model, options) {
        _yuitest_coverfunc("./src/data/relation.js", "Relation", 72);
_yuitest_coverline("./src/data/relation.js", 73);
if ( !options ) {
            _yuitest_coverline("./src/data/relation.js", 74);
options = {} ;
        }
        _yuitest_coverline("./src/data/relation.js", 76);
this.key = key;
        _yuitest_coverline("./src/data/relation.js", 77);
this.type = type;
        _yuitest_coverline("./src/data/relation.js", 78);
this.model = model;
        _yuitest_coverline("./src/data/relation.js", 79);
this.defaultValue = options.defaultValue||null ;

        _yuitest_coverline("./src/data/relation.js", 81);
switch (type) {
            case 'belongs_to' :
                _yuitest_coverline("./src/data/relation.js", 83);
this.set = setHasOne.bind(this) ;        // force context === this
                _yuitest_coverline("./src/data/relation.js", 84);
this.defaultValue = options.defaultValue||null ;
                _yuitest_coverline("./src/data/relation.js", 85);
break ;
            case 'has_one':
                _yuitest_coverline("./src/data/relation.js", 87);
this.set = setHasOne.bind(this) ;
                _yuitest_coverline("./src/data/relation.js", 88);
this.defaultValue = options.defaultValue||null ;
                _yuitest_coverline("./src/data/relation.js", 89);
break ;
            case 'has_many':
                _yuitest_coverline("./src/data/relation.js", 91);
this.set = setHasMany.bind(this) ;
                _yuitest_coverline("./src/data/relation.js", 92);
this.defaultValue = options.defaultValue||[] ;
                _yuitest_coverline("./src/data/relation.js", 93);
break;
            case 'has_and_belongs_to_many':
                _yuitest_coverline("./src/data/relation.js", 95);
this.set = setHasMany.bind(this);
                _yuitest_coverline("./src/data/relation.js", 96);
this.defaultValue = options.defaultValue||[] ;
                _yuitest_coverline("./src/data/relation.js", 97);
break;
            default:
                _yuitest_coverline("./src/data/relation.js", 99);
this.set = function(){ _yuitest_coverfunc("./src/data/relation.js", "set", 99);
throw("Associtation " + type  + " is not supported");};
        }

        _yuitest_coverline("./src/data/relation.js", 102);
return Object.freeze(this);
    };

    _yuitest_coverline("./src/data/relation.js", 105);
Relation.prototype = {} ;

    /*
        @param {Object} self the object which receives the 'activeRecord'
        @param {String} key the property of self
        @param {Object} activeRecord the value to be set
     */
    _yuitest_coverline("./src/data/relation.js", 112);
function setHasOne(self, key, activeRecord) {
        _yuitest_coverfunc("./src/data/relation.js", "setHasOne", 112);
_yuitest_coverline("./src/data/relation.js", 113);
console.log(self.$className + ':' + key + ' has-one ' + activeRecord.$className) ;
        _yuitest_coverline("./src/data/relation.js", 114);
self.__data[key] = activeRecord ;
        _yuitest_coverline("./src/data/relation.js", 115);
setSelf2AR(self, key, activeRecord) ;
    }
    _yuitest_coverline("./src/data/relation.js", 117);
function setHasMany(self, key, activeRecord) {
        _yuitest_coverfunc("./src/data/relation.js", "setHasMany", 117);
_yuitest_coverline("./src/data/relation.js", 118);
console.log(self.$className + ':' + key + ' has-many ' + activeRecord.$className) ;
        _yuitest_coverline("./src/data/relation.js", 119);
var i;

        _yuitest_coverline("./src/data/relation.js", 121);
if ( Array.isArray(activeRecord) ) {
            _yuitest_coverline("./src/data/relation.js", 122);
self.__data[key] = activeRecord ;
            _yuitest_coverline("./src/data/relation.js", 123);
for( i = 0; i < activeRecord.length; i++) {
                _yuitest_coverline("./src/data/relation.js", 124);
setSelf2AR(self, key, activeRecord) ;
            }
        }
        else {_yuitest_coverline("./src/data/relation.js", 127);
if ( self.__data[key].indexOf(activeRecord) === -1 ) {
            _yuitest_coverline("./src/data/relation.js", 128);
self.__data[key].push(activeRecord) ;
            _yuitest_coverline("./src/data/relation.js", 129);
setSelf2AR(self, key, activeRecord) ;
        }}
    }

    _yuitest_coverline("./src/data/relation.js", 133);
function setSelf2AR(self, key, activeRecord) {
        _yuitest_coverfunc("./src/data/relation.js", "setSelf2AR", 133);
_yuitest_coverline("./src/data/relation.js", 134);
var otherField = activeRecord.constructor.__reverseRelation[self.$className] ;
        _yuitest_coverline("./src/data/relation.js", 135);
if ( otherField ) {
            _yuitest_coverline("./src/data/relation.js", 136);
if ( activeRecord[otherField.key] !== self ) {
                _yuitest_coverline("./src/data/relation.js", 137);
activeRecord[otherField.key] = self ;
            }
        }
        else {  // nope, no relation!!
            _yuitest_coverline("./src/data/relation.js", 141);
throw "No Relation defined for " + self.$className + ":belongs_to --> " + activeRecord.$className + ":???" ;
        }
    }

    _yuitest_coverline("./src/data/relation.js", 145);
ns.Relation = Relation;
})(window.Sway.data);
