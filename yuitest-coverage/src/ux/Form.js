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
_yuitest_coverage["./src/ux/Form.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/ux/Form.js",
    code: []
};
_yuitest_coverage["./src/ux/Form.js"].code=["// Create the namespace -> JS load order independent","window.Sway = window.Sway || {} ;","window.Sway.ux = window.Sway.ux || {} ;","","(function(ns){","    /**","     * Form generator. This class provides a Fluent API to construct forms.","     *","     *      new Form(json)","     *          .fieldset()","     *          .label('username').text()","     *          .label('password').password()","     *          .submit(callback)","     *          .clear() ;","     *","     * @class Sway.ux.Form","     * @constructor","     */","    var Form = function(){","","   } ;","","   ns.Form = Form ;","})(window.Sway.ux) ;"];
// Create the namespace -> JS load order independent
_yuitest_coverage["./src/ux/Form.js"].lines = {"2":0,"3":0,"5":0,"19":0,"23":0};
_yuitest_coverage["./src/ux/Form.js"].functions = {"(anonymous 1):5":0};
_yuitest_coverage["./src/ux/Form.js"].coveredLines = 5;
_yuitest_coverage["./src/ux/Form.js"].coveredFunctions = 1;
_yuitest_coverline("./src/ux/Form.js", 2);
window.Sway = window.Sway || {} ;
_yuitest_coverline("./src/ux/Form.js", 3);
window.Sway.ux = window.Sway.ux || {} ;

_yuitest_coverline("./src/ux/Form.js", 5);
(function(ns){
    /**
     * Form generator. This class provides a Fluent API to construct forms.
     *
     *      new Form(json)
     *          .fieldset()
     *          .label('username').text()
     *          .label('password').password()
     *          .submit(callback)
     *          .clear() ;
     *
     * @class Sway.ux.Form
     * @constructor
     */
    _yuitest_coverfunc("./src/ux/Form.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/ux/Form.js", 19);
var Form = function(){

   } ;

   _yuitest_coverline("./src/ux/Form.js", 23);
ns.Form = Form ;
})(window.Sway.ux) ;
