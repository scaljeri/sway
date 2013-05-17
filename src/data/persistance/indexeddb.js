/*
 var objectStore = thisDb.createObjectStore("note", { keyPath: "id", autoIncrement:true })
 */
(function(ns) {
    var DB_NAME = 'sway'
        , DB_VERSION = 1 ;

    /**
     * @class Sway.persistance.IndexedDb
     * @constructor
     */
    var IndexedDB = function() {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

        if (!window.indexedDB) {
            throw("IndexedDB not supported") ;
        }
    } ;

    ns.IndexedDB = IndexedDB ;
})(Sway) ;