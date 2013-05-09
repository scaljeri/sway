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

    for ( var i in DEFAULTS ) {
        Relation[i] = DEFAULTS[i] ;
    }

    ns.Relation = Relation ;
})(Sway.data) ;