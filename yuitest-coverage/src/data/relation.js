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
_yuitest_coverage["./src/data/relation.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","","(function(ns){","    /**","     */","    /*","     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)","     has_one","     has_many","     has_many :through   (the thirt table is also a model)","     has_one :through    ( goes one-to-one through other model)","     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)","     */","","    /**","     * Sway.data.Relation defines the association between two {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}s. It is based on the Ruby on Rails (RoR)","     * <a href=\"http://guides.rubyonrails.org/association_basics.html\">ActiveRecord Associations</a>.<br>","     * The following associations are available:","     *","     * <h4>BELONGS_TO and HAS_ONE (THROUGH) Association</h4>","     * Assume an 'Account' <tt>belongs\\_to</tt> a 'Supplier'. Or the other way around, a Supplier <tt>has\\_one</tt> Account.","     * Furthermore, if an 'Account' and 'Supplier' both <tt>has\\_one</tt> 'AccountHistory', it will look like this","     *","     *      var Account = new Sway.data.ActiveRecord( 'Account', storage, [","     *            new Sway.data.Relation({ key: 'supplier', type: 'belongs_to', model: 'Supplier' }       // creates a field 'supplier_id'","     *            new Sway.data.Relation({ type: 'has_one', model: 'AccountHistory' }                     // AccountHistory should have a account_id field","     *            .....","     *      ]) ;","     *","     *      var Supplier = new Sway.data.ActiveRecord( 'Supplier', storage, [","     *           new Sway.data.Relation({ key: 'account', type: 'has_one', model: 'Account' })","     *           new Sway.data.Relation({ key: 'accountHistory', type: 'has_one', through: 'AccountHistory', model: 'Account' })","     *           ....","     *      ]) ;","     *","     *      var AccountHistory = new Sway.data.ActiveRecord( 'AccountHistory', storage, [","     *          new Sway.datat.Relation({ type: 'belongs_to', model: 'Account' })                          // creates an 'account_id' field","     *          ...","     *      ]) ;","     *","     *      ...","     *      supplierRecord.accountHistory = someAccountHistories","     *","     * An <tt>belongs_to</tt> field is always required!!","     *","     * <h4>HAS_MANY (THROUGH)</h4>","     * This association define a one-to-many or a many-to-many relationship.","     *","     *      new Sway.data.Relation({ key: 'orders', type: 'has_many', model: 'Order' }) ;            // one-to-many","     *      new Sway.data.Relation({ key: 'patients', type: 'has_many', through: 'Appointment', model: 'Patient' }) ;  // many-to-many","     *","     * <h4>HAS_AND_BELONGS_TO_MANY</h4>","     * This relation is identical to <tt>HAS\\_MANY THROUGH</tt> (many-to-many), except it doesn't have a third model","     *","     *      new Sway.data.Relation({ key: 'assemblies', type: 'has_and_belongs_to_many', model: 'Assembly' })","     *","     * And the association in the other moddel look like","     *","     *      new Sway.data.Relation({ key: 'parts', type: 'has_and_belongs_to_many', model: 'Part' })","     *","     * @class Sway.data.Relation","     * @constructor","     * @param {String} key","     * @param {String} type type of association","     * @param {String} model name of the model","     * @param {Object} [options]","     *          @param {String} [options.through] specifies a join model. Only available for <tt>HAS\\_ONE</tt> and <tt>HAS\\_MANY</tt> associations","     *          @param {String} [options.friendlyName] description of the field","     */","     var Relation = function( key, type, model, options) {","            this.key = key ;","            this.type = type ;","            this.model = model ;","","            // TODO process options","        } ;","","","    Relation.prototype = {","        isField: function() {","            return false ;","        }","    } ;","","    ns.Relation = Relation ;","})(window.Sway.data) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/relation.js"].lines = {"2":0,"3":0,"5":0,"72":0,"73":0,"74":0,"75":0,"81":0,"83":0,"87":0};
_yuitest_coverage["./src/data/relation.js"].functions = {"Relation:72":0,"isField:82":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/relation.js"].coveredLines = 10;
_yuitest_coverage["./src/data/relation.js"].coveredFunctions = 3;
_yuitest_coverline("./src/data/relation.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/relation.js", 3);
window.Sway.data = window.Sway.data || {} ;

_yuitest_coverline("./src/data/relation.js", 5);
(function(ns){
    /**
     */
    /*
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
var Relation = function( key, type, model, options) {
            _yuitest_coverfunc("./src/data/relation.js", "Relation", 72);
_yuitest_coverline("./src/data/relation.js", 73);
this.key = key ;
            _yuitest_coverline("./src/data/relation.js", 74);
this.type = type ;
            _yuitest_coverline("./src/data/relation.js", 75);
this.model = model ;

            // TODO process options
        } ;


    _yuitest_coverline("./src/data/relation.js", 81);
Relation.prototype = {
        isField: function() {
            _yuitest_coverfunc("./src/data/relation.js", "isField", 82);
_yuitest_coverline("./src/data/relation.js", 83);
return false ;
        }
    } ;

    _yuitest_coverline("./src/data/relation.js", 87);
ns.Relation = Relation ;
})(window.Sway.data) ;
