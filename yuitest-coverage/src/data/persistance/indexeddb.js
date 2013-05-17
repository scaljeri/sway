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
_yuitest_coverage["./src/data/persistance/indexeddb.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/persistance/indexeddb.js",
    code: []
};
_yuitest_coverage["./src/data/persistance/indexeddb.js"].code=["/*"," var objectStore = thisDb.createObjectStore(\"note\", { keyPath: \"id\", autoIncrement:true })"," */","(function(ns) {","    var DB_NAME = 'sway'","        , DB_VERSION = 1 ;","","    /**","     * @class Sway.persistance.IndexedDb","     * @constructor","     */","    var IndexedDB = function() {","        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;","        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;","        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange","","        if (!window.indexedDB) {","            throw(\"IndexedDB not supported\") ;","        }","    } ;","","    ns.IndexedDB = IndexedDB ;","})(Sway) ;"];
/*
 var objectStore = thisDb.createObjectStore("note", { keyPath: "id", autoIncrement:true })
 */
_yuitest_coverage["./src/data/persistance/indexeddb.js"].lines = {"4":0,"5":0,"12":0,"13":0,"14":0,"15":0,"17":0,"18":0,"22":0};
_yuitest_coverage["./src/data/persistance/indexeddb.js"].functions = {"IndexedDB:12":0,"(anonymous 1):4":0};
_yuitest_coverage["./src/data/persistance/indexeddb.js"].coveredLines = 9;
_yuitest_coverage["./src/data/persistance/indexeddb.js"].coveredFunctions = 2;
_yuitest_coverline("./src/data/persistance/indexeddb.js", 4);
(function(ns) {
    _yuitest_coverfunc("./src/data/persistance/indexeddb.js", "(anonymous 1)", 4);
_yuitest_coverline("./src/data/persistance/indexeddb.js", 5);
var DB_NAME = 'sway'
        , DB_VERSION = 1 ;

    /**
     * @class Sway.persistance.IndexedDb
     * @constructor
     */
    _yuitest_coverline("./src/data/persistance/indexeddb.js", 12);
var IndexedDB = function() {
        _yuitest_coverfunc("./src/data/persistance/indexeddb.js", "IndexedDB", 12);
_yuitest_coverline("./src/data/persistance/indexeddb.js", 13);
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        _yuitest_coverline("./src/data/persistance/indexeddb.js", 14);
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        _yuitest_coverline("./src/data/persistance/indexeddb.js", 15);
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

        _yuitest_coverline("./src/data/persistance/indexeddb.js", 17);
if (!window.indexedDB) {
            _yuitest_coverline("./src/data/persistance/indexeddb.js", 18);
throw("IndexedDB not supported") ;
        }
    } ;

    _yuitest_coverline("./src/data/persistance/indexeddb.js", 22);
ns.IndexedDB = IndexedDB ;
})(Sway) ;
