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
_yuitest_coverage["./src/data/relation.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {};","window.Sway.data = window.Sway.data || {};","","(function (ns) {","    /*","     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)","     has_one","     has_many","     has_many :through   (the thirt table is also a model)","     has_one :through    ( goes one-to-one through other model)","     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)","     */","","    /*","     * Sway.data.Relation defines the association between two {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}s. It is based on the Ruby on Rails (RoR)","     * <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>.<br>","     * The following associations are available:","     *","     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>","     * Assume an 'Account' <tt>belongs\\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\\_one</tt> Account.","     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\\_one</tt> 'AccountHistory', it will look like this","     *","     *      var Account = new Sway.data.ActiveRecord( 'Account', storage, [","     *            new Sway.data.Relation({ key: 'supplier', type: 'belongs_to', model: 'Supplier' }       // creates a field 'supplier_id'","     *            new Sway.data.Relation({ type: 'has_one', model: 'AccountHistory' }                     // AccountHistory should have a account_id field","     *            .....","     *      ]) ;","     *","     *      var Supplier = new Sway.data.ActiveRecord( 'Supplier', storage, [","     *           new Sway.data.Relation({ key: 'account', type: 'has_one', model: 'Account' })","     *           new Sway.data.Relation({ key: 'accountHistory', type: 'has_one', through: 'AccountHistory', model: 'Account' })","     *           ....","     *      ]) ;","     *","     *      var AccountHistory = new Sway.data.ActiveRecord( 'AccountHistory', storage, [","     *          new Sway.datat.Relation({ type: 'belongs_to', model: 'Account' })                          // creates an 'account_id' field","     *          ...","     *      ]) ;","     *","     *      ...","     *      supplierRecord.accountHistory = someAccountHistories","     *","     * An <tt>belongs_to</tt> field is always required!!","     *","     * <h4>HAS_MANY (THROUGH)</h4>","     * This association define a one-to-many or a many-to-many relationship.","     *","     *      new Sway.data.Relation({ key: 'orders', type: 'has_many', model: 'Order' }) ;            // one-to-many","     *      new Sway.data.Relation({ key: 'patients', type: 'has_many', through: 'Appointment', model: 'Patient' }) ;  // many-to-many","     *","     * <h4>HAS_AND_BELONGS_TO_MANY</h4>","     * This relation is identical to <tt>HAS\\_MANY THROUGH</tt> (many-to-many), except it doesn't have a third model","     *","     *      new Sway.data.Relation({ key: 'assemblies', type: 'has_and_belongs_to_many', model: 'Assembly' })","     *","     * And the association in the other moddel look like","     *","     *      new Sway.data.Relation({ key: 'parts', type: 'has_and_belongs_to_many', model: 'Part' })","     *","     * @class Sway.data.Relation","     * @constructor","     * @param {String} key","     * @param {String} type type of association","     * @param {String} model name of the model","     * @param {Object} [options]","     *          @param {String} [options.through] specifies a join model. Only available for <tt>HAS\\_ONE</tt> and <tt>HAS\\_MANY</tt> associations","     *          @param {String} [options.friendlyName] description of the field","     */","    var Relation = function (key, type, model, options) {","        if ( !options ) {","            options = {} ;","        }","        this.key = key;","        this.type = type;","        this.model = model;","        this.isSearchable = false ;","","        switch (type) {","            case 'belongs_to' :","                this.set = setBelongsTo.bind(this) ;        // force context === this","                break ;","            case 'has_one':","                this.set = options.through ? setHasOneThrough.bind(this) : setHasOne.bind(this) ;","                break ;","            case 'has_many':","                this.set = options.through ? setHasManyThrough.bind(this) : setHasMany.bind(this) ;","                break;","            case 'has_and_belongs_to_many':","                this.set = setHasAndBelongsToMany.bind(this);","                break;","            default:","                this.set = function(){ throw(\"Associtation \" + type  + \" is not supported\");};","        }","","        return Object.freeze(this);","    };","","    Relation.prototype = {} ;","","    function setBelongsTo(data, value) {","    }","    function setHasOne(data, value){","    }","    function setHasOneThrough(data, value){}","    function setHasMany(data, value) {}","    function setHasManyThrough(data, value) {}","    function setHasAndBelongsToMany(data, value) {}","","    ns.Relation = Relation;","})(window.Sway.data);"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/relation.js"].lines = {"2":0,"3":0,"5":0,"70":0,"71":0,"72":0,"74":0,"75":0,"76":0,"77":0,"79":0,"81":0,"82":0,"84":0,"85":0,"87":0,"88":0,"90":0,"91":0,"93":0,"96":0,"99":0,"101":0,"103":0,"105":0,"106":0,"107":0,"108":0,"110":0};
_yuitest_coverage["./src/data/relation.js"].functions = {"set:93":0,"Relation:70":0,"setBelongsTo:101":0,"setHasOne:103":0,"setHasOneThrough:105":0,"setHasMany:106":0,"setHasManyThrough:107":0,"setHasAndBelongsToMany:108":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/relation.js"].coveredLines = 29;
_yuitest_coverage["./src/data/relation.js"].coveredFunctions = 9;
_yuitest_coverline("./src/data/relation.js", 2);
window.Sway = window.Sway || {};
_yuitest_coverline("./src/data/relation.js", 3);
window.Sway.data = window.Sway.data || {};

_yuitest_coverline("./src/data/relation.js", 5);
(function (ns) {
    /*
     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)
     has_one
     has_many
     has_many :through   (the thirt table is also a model)
     has_one :through    ( goes one-to-one through other model)
     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)
     */

    /*
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
_yuitest_coverline("./src/data/relation.js", 70);
var Relation = function (key, type, model, options) {
        _yuitest_coverfunc("./src/data/relation.js", "Relation", 70);
_yuitest_coverline("./src/data/relation.js", 71);
if ( !options ) {
            _yuitest_coverline("./src/data/relation.js", 72);
options = {} ;
        }
        _yuitest_coverline("./src/data/relation.js", 74);
this.key = key;
        _yuitest_coverline("./src/data/relation.js", 75);
this.type = type;
        _yuitest_coverline("./src/data/relation.js", 76);
this.model = model;
        _yuitest_coverline("./src/data/relation.js", 77);
this.isSearchable = false ;

        _yuitest_coverline("./src/data/relation.js", 79);
switch (type) {
            case 'belongs_to' :
                _yuitest_coverline("./src/data/relation.js", 81);
this.set = setBelongsTo.bind(this) ;        // force context === this
                _yuitest_coverline("./src/data/relation.js", 82);
break ;
            case 'has_one':
                _yuitest_coverline("./src/data/relation.js", 84);
this.set = options.through ? setHasOneThrough.bind(this) : setHasOne.bind(this) ;
                _yuitest_coverline("./src/data/relation.js", 85);
break ;
            case 'has_many':
                _yuitest_coverline("./src/data/relation.js", 87);
this.set = options.through ? setHasManyThrough.bind(this) : setHasMany.bind(this) ;
                _yuitest_coverline("./src/data/relation.js", 88);
break;
            case 'has_and_belongs_to_many':
                _yuitest_coverline("./src/data/relation.js", 90);
this.set = setHasAndBelongsToMany.bind(this);
                _yuitest_coverline("./src/data/relation.js", 91);
break;
            default:
                _yuitest_coverline("./src/data/relation.js", 93);
this.set = function(){ _yuitest_coverfunc("./src/data/relation.js", "set", 93);
throw("Associtation " + type  + " is not supported");};
        }

        _yuitest_coverline("./src/data/relation.js", 96);
return Object.freeze(this);
    };

    _yuitest_coverline("./src/data/relation.js", 99);
Relation.prototype = {} ;

    _yuitest_coverline("./src/data/relation.js", 101);
function setBelongsTo(data, value) {
    }
    _yuitest_coverline("./src/data/relation.js", 103);
function setHasOne(data, value){
    }
    _yuitest_coverline("./src/data/relation.js", 105);
function setHasOneThrough(data, value){}
    _yuitest_coverline("./src/data/relation.js", 106);
function setHasMany(data, value) {}
    _yuitest_coverline("./src/data/relation.js", 107);
function setHasManyThrough(data, value) {}
    _yuitest_coverline("./src/data/relation.js", 108);
function setHasAndBelongsToMany(data, value) {}

    _yuitest_coverline("./src/data/relation.js", 110);
ns.Relation = Relation;
})(window.Sway.data);
