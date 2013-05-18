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
_yuitest_coverage["./src/data/persistance/websqlresult.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/persistance/websqlresult.js",
    code: []
};
_yuitest_coverage["./src/data/persistance/websqlresult.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","window.Sway.data = window.Sway.data || {} ;","window.Sway.data.persistance = window.Sway.data.persistance || {} ;","","(function(ns){","    /**","     * @class Sway.data.persistance.WebSqlResult","     * @param {Object} WebSql result","     * @param {Object} [model]","     */","    var WebSqlResult = function(result, model) {","        this.result = result ;","        this.model  = model ;","        this.length = result.rows.length ;","","    } ;","    WebSqlResult.prototype = {","        /**","         * @method forEach","         * @param {Function} callback","         */","        forEach: function(callback) {","            for( var i = 0; i < this.result.rows.length; i++) {","                callback(this.model ? new this.model(this.result.rows.item(i)) : this.result.rows.item(i), i) ;","            }","        }","    } ;","","    ns.WebSqlResult = WebSqlResult ;","})(window.Sway.data.persistance) ;"];
_yuitest_coverage["./src/data/persistance/websqlresult.js"].lines = {"1":0,"2":0,"3":0,"5":0,"11":0,"12":0,"13":0,"14":0,"17":0,"23":0,"24":0,"29":0};
_yuitest_coverage["./src/data/persistance/websqlresult.js"].functions = {"WebSqlResult:11":0,"forEach:22":0,"(anonymous 1):5":0};
_yuitest_coverage["./src/data/persistance/websqlresult.js"].coveredLines = 12;
_yuitest_coverage["./src/data/persistance/websqlresult.js"].coveredFunctions = 3;
_yuitest_coverline("./src/data/persistance/websqlresult.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists
_yuitest_coverline("./src/data/persistance/websqlresult.js", 2);
window.Sway.data = window.Sway.data || {} ;
_yuitest_coverline("./src/data/persistance/websqlresult.js", 3);
window.Sway.data.persistance = window.Sway.data.persistance || {} ;

_yuitest_coverline("./src/data/persistance/websqlresult.js", 5);
(function(ns){
    /**
     * @class Sway.data.persistance.WebSqlResult
     * @param {Object} WebSql result
     * @param {Object} [model]
     */
    _yuitest_coverfunc("./src/data/persistance/websqlresult.js", "(anonymous 1)", 5);
_yuitest_coverline("./src/data/persistance/websqlresult.js", 11);
var WebSqlResult = function(result, model) {
        _yuitest_coverfunc("./src/data/persistance/websqlresult.js", "WebSqlResult", 11);
_yuitest_coverline("./src/data/persistance/websqlresult.js", 12);
this.result = result ;
        _yuitest_coverline("./src/data/persistance/websqlresult.js", 13);
this.model  = model ;
        _yuitest_coverline("./src/data/persistance/websqlresult.js", 14);
this.length = result.rows.length ;

    } ;
    _yuitest_coverline("./src/data/persistance/websqlresult.js", 17);
WebSqlResult.prototype = {
        /**
         * @method forEach
         * @param {Function} callback
         */
        forEach: function(callback) {
            _yuitest_coverfunc("./src/data/persistance/websqlresult.js", "forEach", 22);
_yuitest_coverline("./src/data/persistance/websqlresult.js", 23);
for( var i = 0; i < this.result.rows.length; i++) {
                _yuitest_coverline("./src/data/persistance/websqlresult.js", 24);
callback(this.model ? new this.model(this.result.rows.item(i)) : this.result.rows.item(i), i) ;
            }
        }
    } ;

    _yuitest_coverline("./src/data/persistance/websqlresult.js", 29);
ns.WebSqlResult = WebSqlResult ;
})(window.Sway.data.persistance) ;
