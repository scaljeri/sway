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
_yuitest_coverage["./src/data/util/indexeddbresult.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/util/indexeddbresult.js",
    code: []
};
_yuitest_coverage["./src/data/util/indexeddbresult.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","window.Sway.utils = window.Sway.utils || {} ; // make sure it exists","","(function(ns){","    var IndexedDbResult = function(result) {","        this.result = result ;","        this.length = result.rows.length ;","","    } ;","    IndexedDbResult.prototype = {","        get: function(i) {","            return this.result.rows.item(i) ;","        }","    } ;","","    ns.IndexedDbResult =  IndexedDbResult;","})(window.Sway.utils) ;"];
_yuitest_coverage["./src/data/util/indexeddbresult.js"].lines = {"1":0,"2":0,"4":0,"5":0,"6":0,"7":0,"10":0,"12":0,"16":0};
_yuitest_coverage["./src/data/util/indexeddbresult.js"].functions = {"IndexedDbResult:5":0,"get:11":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/util/indexeddbresult.js"].coveredLines = 9;
_yuitest_coverage["./src/data/util/indexeddbresult.js"].coveredFunctions = 3;
_yuitest_coverline("./src/data/util/indexeddbresult.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists
_yuitest_coverline("./src/data/util/indexeddbresult.js", 2);
window.Sway.utils = window.Sway.utils || {} ; // make sure it exists

_yuitest_coverline("./src/data/util/indexeddbresult.js", 4);
(function(ns){
    _yuitest_coverfunc("./src/data/util/indexeddbresult.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/util/indexeddbresult.js", 5);
var IndexedDbResult = function(result) {
        _yuitest_coverfunc("./src/data/util/indexeddbresult.js", "IndexedDbResult", 5);
_yuitest_coverline("./src/data/util/indexeddbresult.js", 6);
this.result = result ;
        _yuitest_coverline("./src/data/util/indexeddbresult.js", 7);
this.length = result.rows.length ;

    } ;
    _yuitest_coverline("./src/data/util/indexeddbresult.js", 10);
IndexedDbResult.prototype = {
        get: function(i) {
            _yuitest_coverfunc("./src/data/util/indexeddbresult.js", "get", 11);
_yuitest_coverline("./src/data/util/indexeddbresult.js", 12);
return this.result.rows.item(i) ;
        }
    } ;

    _yuitest_coverline("./src/data/util/indexeddbresult.js", 16);
ns.IndexedDbResult =  IndexedDbResult;
})(window.Sway.utils) ;
