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
_yuitest_coverage["./src/data/relation.js"].code=["(function(ns){","    /**","     */","    /*","     belongs_to ( === foreign key ) (http://stackoverflow.com/questions/3808926/whats-the-difference-between-belongs-to-and-has-one)","     has_one","     has_many","     has_many :through   (the thirt table is also a model)","     has_one :through    ( goes one-to-one through other model)","     has_and_belongs_to_many    // simple linker table (http://stackoverflow.com/questions/2780798/has-and-belongs-to-many-vs-has-many-through)","     */","    var DEFAULTS = {","            HAS_MANY: 'has_many'","            ,HAS_ONE: 'has_one'","            , BELONGS_TO: 'belongs_to'","            , HAS_MANY: 'has_many'","            , HAS_AND_BELONGS_TO_MANY: 'has_and_belngs_to_many'","","        }","    /**","     * A Relation defines the relation between {{#crossLink \"Sway.data.Model\"}}{{/crossLink}}s. The following relations types","     * are available","     * <ul>","     *      <li>HAS_MANY</li>","     *      <li>HAS_ONE</li>","     *      <li>BELONGS_TO</li>","     *      <li>HAS_MANY</li>","     *      <li>HAS_AND_BELONGS_TO_MANY</li>","     * </ul>","     * @class Sway.data.Relation","     * @constructor","     * @param {String} key","     * @param {RelationType} relation type of relation. Available relations are","     * @param {Object} options","     * @example","     var relation = new Sway.Relation(Sway.Relation.HAS_ONE, { model: Sway.Account, key: id }) ;","     */","        , Relation = function( key,  relation, options) {","","        } ;","","    for ( var i in DEFAULTS ) {","        Relation[i] = DEFAULTS[i] ;","    }","","    ns.Relation = Relation ;","})(Sway.data) ;"];
_yuitest_coverage["./src/data/relation.js"].lines = {"1":0,"12":0,"42":0,"43":0,"46":0};
_yuitest_coverage["./src/data/relation.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["./src/data/relation.js"].coveredLines = 5;
_yuitest_coverage["./src/data/relation.js"].coveredFunctions = 1;
_yuitest_coverline("./src/data/relation.js", 1);
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
    _yuitest_coverfunc("./src/data/relation.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/data/relation.js", 12);
var DEFAULTS = {
            HAS_MANY: 'has_many'
            ,HAS_ONE: 'has_one'
            , BELONGS_TO: 'belongs_to'
            , HAS_MANY: 'has_many'
            , HAS_AND_BELONGS_TO_MANY: 'has_and_belngs_to_many'

        }
    /**
     * A Relation defines the relation between {{#crossLink "Sway.data.Model"}}{{/crossLink}}s. The following relations types
     * are available
     * <ul>
     *      <li>HAS_MANY</li>
     *      <li>HAS_ONE</li>
     *      <li>BELONGS_TO</li>
     *      <li>HAS_MANY</li>
     *      <li>HAS_AND_BELONGS_TO_MANY</li>
     * </ul>
     * @class Sway.data.Relation
     * @constructor
     * @param {String} key
     * @param {RelationType} relation type of relation. Available relations are
     * @param {Object} options
     * @example
     var relation = new Sway.Relation(Sway.Relation.HAS_ONE, { model: Sway.Account, key: id }) ;
     */
        , Relation = function( key,  relation, options) {

        } ;

    _yuitest_coverline("./src/data/relation.js", 42);
for ( var i in DEFAULTS ) {
        _yuitest_coverline("./src/data/relation.js", 43);
Relation[i] = DEFAULTS[i] ;
    }

    _yuitest_coverline("./src/data/relation.js", 46);
ns.Relation = Relation ;
})(Sway.data) ;
