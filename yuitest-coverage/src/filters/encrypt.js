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
_yuitest_coverage["./src/filters/encrypt.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/filters/encrypt.js",
    code: []
};
_yuitest_coverage["./src/filters/encrypt.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","window.Sway = window.Sway.filter || {} ; // make sure it exists","","(function(Ns) {","    \"use strict\" ;","","    var defaults = {","    }","","    /**","     * Encrypt and decrypt a given string","     *","     * @class Sway.filter.Encrypt","     * @constructor","     */","     , enc = function() {} ;","","    Ns.Encrypt = enc ;","","})(window.Sway.filter) ;"];
_yuitest_coverage["./src/filters/encrypt.js"].lines = {"1":0,"2":0,"4":0,"5":0,"7":0,"18":0};
_yuitest_coverage["./src/filters/encrypt.js"].functions = {"(anonymous 1):4":0};
_yuitest_coverage["./src/filters/encrypt.js"].coveredLines = 6;
_yuitest_coverage["./src/filters/encrypt.js"].coveredFunctions = 1;
_yuitest_coverline("./src/filters/encrypt.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists
_yuitest_coverline("./src/filters/encrypt.js", 2);
window.Sway = window.Sway.filter || {} ; // make sure it exists

_yuitest_coverline("./src/filters/encrypt.js", 4);
(function(Ns) {
    _yuitest_coverfunc("./src/filters/encrypt.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/filters/encrypt.js", 5);
"use strict" ;

    _yuitest_coverline("./src/filters/encrypt.js", 7);
var defaults = {
    }

    /**
     * Encrypt and decrypt a given string
     *
     * @class Sway.filter.Encrypt
     * @constructor
     */
     , enc = function() {} ;

    _yuitest_coverline("./src/filters/encrypt.js", 18);
Ns.Encrypt = enc ;

})(window.Sway.filter) ;
