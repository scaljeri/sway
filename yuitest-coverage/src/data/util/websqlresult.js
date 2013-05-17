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
_yuitest_coverage["./src/data/util/websqlresult.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/util/websqlresult.js",
    code: []
};
_yuitest_coverage["./src/data/util/websqlresult.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","window.Sway.data = window.Sway.data || {} ; // make sure it exists","window.Sway.data.util = window.Sway.data.util || {} ; // make sure it exists","","(function(ns){","    var WebSqlResult = function(result) {","        this.result = result ;","        this.length = result.rows.length ;","","    } ;","    WebSqlResult.prototype = {","        get: function(i) {","            return this.result.rows.item(i) ;","        }","    } ;","","    ns.WebSqlResult = WebSqlResult ;","})(window.Sway.data.util) ;"];
_yuitest_coverage["./src/data/util/websqlresult.js"].lines = {"1":0,"2":0,"3":0,"5":0,"6":0,"7":0,"8":0,"11":0,"13":0,"17":0};
_yuitest_coverage["./src/data/util/websqlresult.js"].functions = {"WebSqlResult:6":0,"get:12":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/util/websqlresult.js"].coveredLines = 10;
_yuitest_coverage["./src/data/util/websqlresult.js"].coveredFunctions = 3;
_yuitest_coverline("./src/data/util/websqlresult.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists
_yuitest_coverline("./src/data/util/websqlresult.js", 2);
window.Sway.data = window.Sway.data || {} ; // make sure it exists
_yuitest_coverline("./src/data/util/websqlresult.js", 3);
window.Sway.data.util = window.Sway.data.util || {} ; // make sure it exists

_yuitest_coverline("./src/data/util/websqlresult.js", 5);
(function(ns){
    _yuitest_coverfunc("./src/data/util/websqlresult.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/util/websqlresult.js", 6);
var WebSqlResult = function(result) {
        _yuitest_coverfunc("./src/data/util/websqlresult.js", "WebSqlResult", 6);
_yuitest_coverline("./src/data/util/websqlresult.js", 7);
this.result = result ;
        _yuitest_coverline("./src/data/util/websqlresult.js", 8);
this.length = result.rows.length ;

    } ;
    _yuitest_coverline("./src/data/util/websqlresult.js", 11);
WebSqlResult.prototype = {
        get: function(i) {
            _yuitest_coverfunc("./src/data/util/websqlresult.js", "get", 12);
_yuitest_coverline("./src/data/util/websqlresult.js", 13);
return this.result.rows.item(i) ;
        }
    } ;

    _yuitest_coverline("./src/data/util/websqlresult.js", 17);
ns.WebSqlResult = WebSqlResult ;
})(window.Sway.data.util) ;
