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
_yuitest_coverage["./src/data/storage/cookie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/storage/cookie.js",
    code: []
};
_yuitest_coverage["./src/data/storage/cookie.js"].code=["(function(Sway) {","    /**","     * @class Sway.persistance.Cookie","     * @constructor","     */","    var Cookie = function() {}","})(Sway) ;"];
_yuitest_coverage["./src/data/storage/cookie.js"].lines = {"1":0,"6":0};
_yuitest_coverage["./src/data/storage/cookie.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["./src/data/storage/cookie.js"].coveredLines = 2;
_yuitest_coverage["./src/data/storage/cookie.js"].coveredFunctions = 1;
_yuitest_coverline("./src/data/storage/cookie.js", 1);
(function(Sway) {
    /**
     * @class Sway.persistance.Cookie
     * @constructor
     */
    _yuitest_coverfunc("./src/data/storage/cookie.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/data/storage/cookie.js", 6);
var Cookie = function() {}
})(Sway) ;
