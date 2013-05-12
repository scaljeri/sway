window.describe("Sway.data.util.WebSqlResult", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , afterEach     = window.beforeEach
        , expect        = window.expect
        , it            = window.it
        , ns = {} ;

    ns.db = openDatabase('jasmineTEST', '1.0', 'jasmine unit test db', 1 * 1024 * 1024);

    beforeEach(function() {
        if ( ns.db ) {
            ns.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id integer, msg text)');
                tx.executeSql('INSERT INTO foo (id, msg) SELECT 1, "a" UNION SELECT 2, "b" UNION SELECT 3, "c" UNION SELECT 4, "d" UNION SELECT 5, "e"') ;
                }, function(err){   // error
                    console.log(err.message) ;
            }, function(){}     // success
            );
        }
    });
    afterEach(function(){
        if ( ns.db ) {
            ns.db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS foo');
            }) ;
        }
    }) ;

    it("should exist", function() {
        expect(ns.db).toBeDefined() ;
        expect(Sway.data.util.WebSqlResult).toBeDefined() ; // the class
    }) ;
    it("should give access to the websql result object", function(){
        var webSqlResult
            , resultSet
            , isReady = false ;

        runs(function() {                                   // doing the same
            ns.db.transaction(function(tx) {
               tx.executeSql('SELECT * from foo WHERE id > 2 ORDER BY id', [],
                   function(t, r){
                        webSqlResult = r ;                  // store result
                        isReady = true ;                    // ready -> coninue testing
                   }
               ) ;
            }) ;
        }) ;

        waitsFor(function(){ // waitsFor will stop if isReady === TRUE
            return isReady ;
        }, "a db select query", 500) ;

        runs(function() {   // after waitsFor is ready this function will run and perform the tests
            resultSet = new Sway.data.util.WebSqlResult(webSqlResult) ;
            expect(resultSet.length).toEqual(3) ;
            expect(resultSet.get(0).id).toEqual(3) ;
            expect(resultSet.get(0).msg).toEqual('c') ;
            expect(resultSet.get(1).id).toEqual(4) ;
            expect(resultSet.get(1).msg).toEqual('d') ;
            expect(resultSet.get(2).id).toEqual(5) ;
            expect(resultSet.get(2).msg).toEqual('e') ;
        }) ;
    }) ;
}) ;
