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
_yuitest_coverage["./src/data/storage/base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/storage/base.js",
    code: []
};
_yuitest_coverage["./src/data/storage/base.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","window.Sway.data = window.Sway.data.storage || {} ;","","(function(ns){","    Base = function() {","","    } ;","","    Base.WebSqlResult = function(result) {","","    }","","    ns.Base = Base ;","","})(Sway.data.storage) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/storage/base.js"].lines = {"2":0,"3":0,"4":0,"6":0,"7":0,"11":0,"15":0};
_yuitest_coverage["./src/data/storage/base.js"].functions = {"(anonymous 1):6":0};
_yuitest_coverage["./src/data/storage/base.js"].coveredLines = 7;
_yuitest_coverage["./src/data/storage/base.js"].coveredFunctions = 1;
_yuitest_coverline("./src/data/storage/base.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/storage/base.js", 3);
window.Sway.data = window.Sway.data || {} ;
_yuitest_coverline("./src/data/storage/base.js", 4);
window.Sway.data = window.Sway.data.storage || {} ;

_yuitest_coverline("./src/data/storage/base.js", 6);
(function(ns){
    _yuitest_coverfunc("./src/data/storage/base.js", "(anonymous 1)", 6);
_yuitest_coverline("./src/data/storage/base.js", 7);
Base = function() {

    } ;

    _yuitest_coverline("./src/data/storage/base.js", 11);
Base.WebSqlResult = function(result) {

    }

    _yuitest_coverline("./src/data/storage/base.js", 15);
ns.Base = Base ;

})(Sway.data.storage) ;
