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
_yuitest_coverage["./src/data/mode.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/mode.js",
    code: []
};
_yuitest_coverage["./src/data/mode.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.data = window.Sway.data || {} ;","",".data);"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/data/mode.js"].lines = {"2":0,"3":0};
_yuitest_coverage["./src/data/mode.js"].functions = {};
_yuitest_coverage["./src/data/mode.js"].coveredLines = 2;
_yuitest_coverage["./src/data/mode.js"].coveredFunctions = 0;
_yuitest_coverline("./src/data/mode.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/data/mode.js", 3);
window.Sway.data = window.Sway.data || {} ;

.data);
