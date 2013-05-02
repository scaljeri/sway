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
        var persistance = { find: function(record){

            }
        } ;
        spyOn(persistance, 'find').andReturn({username: 'John', password: 'Secret'}) ;

        ns = {
            field1: new Sway.data.Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
            , field2: new Sway.data.Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
            , field3: new Sway.data.Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
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
        expect(rec2.username).toEqual('John') ;
        expect(rec2.password).toEqual('Secret') ;
        expect(rec2.birthday).toBe(date) ;
    }) ;

    it("should find/load a stored record", function() {
        var rec = ns.User.find({username: 'John'}) ;
    }) ;
    it("should persist a record", function() {
    }) ;
    it("should transform the data", function() {

    }) ;
}) ;
