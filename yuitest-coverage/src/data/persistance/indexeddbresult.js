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
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/persistance/indexeddbresult.js",
    code: []
};
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","window.Sway.data = window.Sway.data || {} ; // make sure it exists","window.Sway.data.persistance = window.Sway.data.persistance || {} ; // make sure it exists","","(function(ns){","    /**","     * @class Sway.data.persistance.IndexedDbResult","     */","    var IndexedDbResult = function(result, model) {","        this.result = result ;","        this.model  = model ;","        this.length = 0 ; //TODO","    } ;","    IndexedDbResult.prototype = {","        /**","         * @method forEach","         * @param {Function} callback","         */","        forEach: function(callback) {","            // TODO","        }","    } ;","","    ns.IndexedDbResult =  IndexedDbResult;","})(window.Sway.data.persistance) ;"];
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"].lines = {"1":0,"2":0,"3":0,"5":0,"9":0,"10":0,"11":0,"12":0,"14":0,"24":0};
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"].functions = {"IndexedDbResult:9":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"].coveredLines = 10;
_yuitest_coverage["./src/data/persistance/indexeddbresult.js"].coveredFunctions = 2;
_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists
_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 2);
window.Sway.data = window.Sway.data || {} ; // make sure it exists
_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 3);
window.Sway.data.persistance = window.Sway.data.persistance || {} ; // make sure it exists

_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 5);
(function(ns){
    /**
     * @class Sway.data.persistance.IndexedDbResult
     */
    _yuitest_coverfunc("./src/data/persistance/indexeddbresult.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 9);
var IndexedDbResult = function(result, model) {
        _yuitest_coverfunc("./src/data/persistance/indexeddbresult.js", "IndexedDbResult", 9);
_yuitest_coverline("./src/data/persistance/indexeddbresult.js", 10);
this.result = result ;
        _yuitest_coverline("./src/data/persistance/indexeddbresult.js", 11);
this.model  = model ;
        _yuitest_coverline("./src/data/persistance/indexeddbresult.js", 12);
this.length = 0 ; //TODO
    } ;
    _yuitest_coverline("./src/data/persistance/indexeddbresult.js", 14);
IndexedDbResult.prototype = {
        /**
         * @method forEach
         * @param {Function} callback
         */
        forEach: function(callback) {
            // TODO
        }
    } ;

    _yuitest_coverline("./src/data/persistance/indexeddbresult.js", 24);
ns.IndexedDbResult =  IndexedDbResult;
})(window.Sway.data.persistance) ;
