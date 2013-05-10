window.describe("Sway.data.util.WebSqlResult", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , spyOn         = window.spyOn
        , it            = window.it
        , ns = {} ;

    ns.db = openDatabase('jasmineTEST', '1.0', 'jasmine unit test db', 1 * 1024 * 1024);

    beforeEach(function() {
        if ( ns.db ) {
            ns.db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS foo');
                tx.executeSql('CREATE TABLE foo (id unique, integer)');
                tx.executeSql('INSERT INTO foo (id) SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5') ;
                }, function(err){   // error
                    console.log(err.message) ;
            }, function(){}     // success
            );
        }
        else {
            console.log("Ooops no WebSqlsupport") ;
        }
    });

    it("should exist", function() {
        expect(Sway.data.util.WebSqlResult).toBeDefined() ; // the class
    }) ;
    it("should give access to the websql result object", function(){
        var webSqlResult
            , resultSet
            , isReady = false ;

        runs(function() {                                   // doing the same
            console.log("DO") ;
            ns.db.transaction(function(tx) {
                console.log("OJ SO FAR") ;
               tx.executeSql('SELECT * from foo WHERE id > 2', [],
                   function(t, r){
                       console.log("READYYY") ;
                       debugger ;
                        webSqlResult = r ;
                        isReady = true ;
                   }
               )
            })  ;
        }) ;

        waitsFor(function(){ // waitsFor will stop if isReady === TRUE
            return isReady ;
        }, "a db select query", 500) ;

        runs(function() {   // after waitsFor is ready this function will run
            resultSet = new Sway.data.util.WebSqlResult(webSqlResult) ;
            expect(resultSet.length).toEqual(3) ;
        }) ;
    }) ;
}) ;
