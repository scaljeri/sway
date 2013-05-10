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
_yuitest_coverage["./src/ux/d3carousel.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/ux/d3carousel.js",
    code: []
};
_yuitest_coverage["./src/ux/d3carousel.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.ux = window.Sway.ux || {} ;","","(function(ns){","    /**","     * 3D carousel like https://market.sencha.com/extensions/ext-ux-cover","     * @class Sway.ux.D3Carousel","     * @constructor","     */","    var D3Carousel = function(){","","   } ;","","   ns.D3Carousel = D3Carousel ;","})(window.Sway.ux) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/ux/d3carousel.js"].lines = {"2":0,"3":0,"5":0,"11":0,"15":0};
_yuitest_coverage["./src/ux/d3carousel.js"].functions = {"(anonymous 1):5":0};
_yuitest_coverage["./src/ux/d3carousel.js"].coveredLines = 5;
_yuitest_coverage["./src/ux/d3carousel.js"].coveredFunctions = 1;
_yuitest_coverline("./src/ux/d3carousel.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/ux/d3carousel.js", 3);
window.Sway.ux = window.Sway.ux || {} ;

_yuitest_coverline("./src/ux/d3carousel.js", 5);
(function(ns){
    /**
     * 3D carousel like https://market.sencha.com/extensions/ext-ux-cover
     * @class Sway.ux.D3Carousel
     * @constructor
     */
    _yuitest_coverfunc("./src/ux/d3carousel.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/ux/d3carousel.js", 11);
var D3Carousel = function(){

   } ;

   _yuitest_coverline("./src/ux/d3carousel.js", 15);
ns.D3Carousel = D3Carousel ;
})(window.Sway.ux) ;
