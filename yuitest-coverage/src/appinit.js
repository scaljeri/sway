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
_yuitest_coverage["./src/appinit.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/appinit.js",
    code: []
};
_yuitest_coverage["./src/appinit.js"].code=["/**"," * Namespace"," * @class Sway"," */","window.Sway = window.Sway || {} ;","","/**","  * Version of the framework","  * @property VERSION","  * @type String","  **/","window.Sway.VERSION = '1.0alpha' ;","","/**","  * If TRUE, debugging is enabled. In PRODUCTION this property should be set to FALSE!!","  * @property DEBUG","  * @type boolean","  **/","window.Sway.DEBUG = true ;","","// zip.js settings","if ( !window.zip ){","    window.zip = {} ;","}","zip.useWebWorkers     = true ;","zip.workerScriptsPath = \"lib/zip.js/\" ;"];
/**
 * Namespace
 * @class Sway
 */
_yuitest_coverage["./src/appinit.js"].lines = {"5":0,"12":0,"19":0,"22":0,"23":0,"25":0,"26":0};
_yuitest_coverage["./src/appinit.js"].functions = {};
_yuitest_coverage["./src/appinit.js"].coveredLines = 7;
_yuitest_coverage["./src/appinit.js"].coveredFunctions = 0;
_yuitest_coverline("./src/appinit.js", 5);
window.Sway = window.Sway || {} ;

/**
  * Version of the framework
  * @property VERSION
  * @type String
  **/
_yuitest_coverline("./src/appinit.js", 12);
window.Sway.VERSION = '1.0alpha' ;

/**
  * If TRUE, debugging is enabled. In PRODUCTION this property should be set to FALSE!!
  * @property DEBUG
  * @type boolean
  **/
_yuitest_coverline("./src/appinit.js", 19);
window.Sway.DEBUG = true ;

// zip.js settings
_yuitest_coverline("./src/appinit.js", 22);
if ( !window.zip ){
    _yuitest_coverline("./src/appinit.js", 23);
window.zip = {} ;
}
_yuitest_coverline("./src/appinit.js", 25);
zip.useWebWorkers     = true ;
_yuitest_coverline("./src/appinit.js", 26);
zip.workerScriptsPath = "lib/zip.js/" ;
