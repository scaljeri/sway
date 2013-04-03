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
_yuitest_coverage["./src/filters/chain.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/filters/chain.js",
    code: []
};
_yuitest_coverage["./src/filters/chain.js"].code=["window.Sway = window.Sway || {filter: {}} ;     // make sure it exists","window.Sway.filter = window.Sway.filter || {} ; // make sure it exists","","(function(Ns){","","    var c = function(filters) {","        // setup the filter chain","        Object.defineProperty(this, '_chain',","            {","                value: filters||[]","                , enumerable: false // hide it","            }","        ) ;","    } ;","","    c.prototype = {","        add: function(filter, index) {","","        },","        remove: function(index) {","","        },","        apply: function(data, callback) {","        },","","        undo: function(data, callback) {","","        }","    } ;","})(window.Sway.filter) ;"];
_yuitest_coverage["./src/filters/chain.js"].lines = {"1":0,"2":0,"4":0,"6":0,"8":0,"16":0};
_yuitest_coverage["./src/filters/chain.js"].functions = {"c:6":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/filters/chain.js"].coveredLines = 6;
_yuitest_coverage["./src/filters/chain.js"].coveredFunctions = 2;
_yuitest_coverline("./src/filters/chain.js", 1);
window.Sway = window.Sway || {filter: {}} ;     // make sure it exists
_yuitest_coverline("./src/filters/chain.js", 2);
window.Sway.filter = window.Sway.filter || {} ; // make sure it exists

_yuitest_coverline("./src/filters/chain.js", 4);
(function(Ns){

    _yuitest_coverfunc("./src/filters/chain.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/filters/chain.js", 6);
var c = function(filters) {
        // setup the filter chain
        _yuitest_coverfunc("./src/filters/chain.js", "c", 6);
_yuitest_coverline("./src/filters/chain.js", 8);
Object.defineProperty(this, '_chain',
            {
                value: filters||[]
                , enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/filters/chain.js", 16);
c.prototype = {
        add: function(filter, index) {

        },
        remove: function(index) {

        },
        apply: function(data, callback) {
        },

        undo: function(data, callback) {

        }
    } ;
})(window.Sway.filter) ;
