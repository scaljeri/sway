window.describe("Sway.data.ActiveRecord", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , spyOn         = window.spyOn
        , it            = window.it
        , ns ;

    beforeEach(function() {
        // create DI
        var persistance = { find: function(record, callback){
               var json = {username: (record.username||'John'), password: (record.password||'Secret'), __id__: 1} ;
               if ( callback ) {
                    callback(json) ;
               }
               return json ;
            }
            , save: function(record) {
                // TODO
            }
        }
            , persistanceAsync = { find: function(record, callback){
                    setTimeout( function() {
                        callback({username: (record.username||'John'), password: (record.password||'Secret'), __id__: 2} ) ;
                    }, 10) ;
                }
                , save: function(record) {
                    // TODO
                }
        } ;
        spyOn(persistance, 'find').andCallThrough(); // andReturn({username: 'John', password: 'Secret'}) ;
        spyOn(persistance, 'save').andCallThrough();

        ns = {
            field1: {type: 'TEXT', key: 'username', friendlyName: 'User name'}
            , field2: {type: 'TEXT', key: 'password', friendlyName: 'Password'}
            , field3: {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'}
        } ;
        ns.User = new Sway.data.ActiveRecord( 'User', persistance, [ns.field1, ns.field2, ns.field3] ) ;
    });

    it("should exist", function() {
        expect(Sway.data.ActiveRecord).toBeDefined() ; // the class
    }) ;

    it("should create a model class", function(){
        expect(ns.User).toBeDefined() ;
        expect(ns.User.fields).toBeDefined() ;
        expect(ns.User.fields['username']).toBe(ns.field1) ;
        expect(ns.User.fields['password']).toBe(ns.field2) ;
        expect(ns.User.fields['birthday']).toBe(ns.field3) ;
    });

    it("should create a record", function() {
        var rec1 = new ns.User( {username: 'John', password: 'Secret'} )
            , rec2
            , date = new Date() ;

        expect(rec1).toBeDefined() ;
        expect(rec1.username).toEqual('John') ;
        expect(rec1.password).toEqual('Secret') ;
        rec1.birthday = date ;
        expect(rec1.birthday).toBe(date) ;

        rec2 = new ns.User(rec1) ;              // this also test the toJSON function
        expect(rec2).toBeDefined() ;
        expect(rec2).not.toBe(rec1) ;
        expect(rec2).toBeInstanceof(ns.User) ;
        expect(rec2.username).toEqual('John') ;
        expect(rec2.password).toEqual('Secret') ;
        expect(rec2.birthday).toBe(date) ;
    }) ;

    it("should find/load a stored record without callbacks", function() {
        var newRec = null
            , newRec1 = null  ;

        newRec = ns.User.find({username:'John'}) ;      // not async
        expect(newRec).toBeDefined() ;
        expect(newRec.password).toEqual('Secret') ;         // it worked :)


        newRec.username = 'Sue' ;
        newRec1 = ns.User.find(newRec) ;
        expect(newRec1.username).toEqual('Sue') ;
        expect(newRec1.password).toEqual('Secret') ;
    }) ;

    xit("should find/load a stored record with callbacks", function() {
        var newRec = null
            , isReady = false ;

        runs(function() {                                   // doing the same
            ns.User.find({username: 'John'}, function(r){
                newRec = r ;
                isReady = true ;            // ready, this will stop 'waitsFor'
            }) ;
        }) ;

        waitsFor(function(){ // waitsFor will stop if isReady === TRUE
           return isReady ;
        }, "a record search using JSON", 500) ;

        runs(function() {   // after waitsFor is ready this function will run
            expect(newRec).toBeDefined() ;
            expect(newRec.password).toEqual('Secret') ;

            newRec.username = 'Sue' ;
            isReady = false ;
            ns.User.find(newRec, function(r){
                newRec = r ;
                isReady = true ;            // ready, this will stop 'waitsFor'
            }) ;
        }) ;

        waitsFor(function() {
            return isReady ;
        }, "a record search using record object", 500 ) ;
        runs(function() {
            expect(newRec.username).toEqual('Sue') ;
            expect(newRec.password).toEqual('Secret') ;
        }) ;
    }) ;
    xit("should save a new record", function() {
        var rec = new ns.User( { username: 'John', password: 'Secret'}) ;
    }) ;
    xit("should update a record", function() {
        var rec = new ns.User( { username: 'John', password: 'Secret'}) ;
    }) ;
}) ;
