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
_yuitest_coverage["./src/bindable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/bindable.js",
    code: []
};
_yuitest_coverage["./src/bindable.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(ns) {","    /**","     * @class Sway.Bindable","     * @constructor","     */","   var Bindable = function() {};","","   Bindable.prototype = {","       /**","        * @method bind","        * @param object","        * @param property","        * @param callback","        */","      bind: function(object, property, callback){}","       /**","        * @method bind2DOM","        */","      , bind2DOM: function(dom) {}","       /**","        * @method bind2Storage","        */","       , bind2Storage: function(dom) {}","   } ;","","   ns.Bindable = Bindable ;","})(window.Sway) ;"];
_yuitest_coverage["./src/bindable.js"].lines = {"1":0,"3":0,"8":0,"10":0,"28":0};
_yuitest_coverage["./src/bindable.js"].functions = {"(anonymous 1):3":0};
_yuitest_coverage["./src/bindable.js"].coveredLines = 5;
_yuitest_coverage["./src/bindable.js"].coveredFunctions = 1;
_yuitest_coverline("./src/bindable.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/bindable.js", 3);
(function(ns) {
    /**
     * @class Sway.Bindable
     * @constructor
     */
   _yuitest_coverfunc("./src/bindable.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/bindable.js", 8);
var Bindable = function() {};

   _yuitest_coverline("./src/bindable.js", 10);
Bindable.prototype = {
       /**
        * @method bind
        * @param object
        * @param property
        * @param callback
        */
      bind: function(object, property, callback){}
       /**
        * @method bind2DOM
        */
      , bind2DOM: function(dom) {}
       /**
        * @method bind2Storage
        */
       , bind2Storage: function(dom) {}
   } ;

   _yuitest_coverline("./src/bindable.js", 28);
ns.Bindable = Bindable ;
})(window.Sway) ;
