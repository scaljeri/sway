window.describe("Sway.data.ActiveRecord", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , spyOn         = window.spyOn
        , it            = window.it
        , ns = {} ;

    beforeEach(function() {
        // create DI
        ns.persistance = {
            find: function(record, callback){
                var json = [{username: (record.username||'John'), password: (record.password||'Secret'), birthday: new Date(79,5,24), __id__: 1}] ;
                if ( !record.password )  {
                    json = [
                        {username: (record.username||'John'), password: 'Secret1', birthday: new Date(79,5,24), __id__: 1}
                        , {username: (record.username||'John'), password: 'Secret2', birthday: new Date(80,5,24), __id__: 2}
                    ];
                }
                if ( callback ) {
                    setTimeout(function(){ // fake async
                        callback(json) ;
                    }, 1) ;
                }
                return json ;
            }
            , save: function(record, callback) {
                // TODO
            }
        } ;
        spyOn(ns.persistance, 'find').andCallThrough() ;
        spyOn(ns.persistance, 'save').andCallThrough() ;

        ns.persistanceAsync = {
            find: function(record, callback){
                setTimeout( function() {
                    callback({username: (record.username||'John'), password: (record.password||'Secret'), __id__: 2} ) ;
                }, 10) ;
            }
            , save: function(record) {
               // TODO
            }
        } ;

        ns.Field = function(key, options) {
            if ( !options ) {
                options = {} ;
            }
            if ( options.type ) {
                options.type = 'TEXT' ;
            }

            this.key = key ;
            for( var i in options)   {
                this[i] = options[i] ;
            }
            this.load = function(key, callback) { // fake loading an Address record
                this[key] = new ns.Address( { address: '350 Fifth Avenue'}) ;
                callback(this) ;
            } ;
            this.transform = function(value, callback) {
                setTimeout(function(){callback(value + '-transformed');},1) ; // modify value by adding '-transformed'
            } ;
            this.validate = function() {
                return true ;
            } ;
            return Object.freeze(this) ;
        } ;
        spyOn(ns.persistanceAsync, 'find').andCallThrough(); // andReturn({username: 'John', password: 'Secret'}) ;
        spyOn(ns.persistanceAsync, 'save').andCallThrough();

        ns.field0 = new ns.Field('address', {friendlyName: 'Address'});
        ns.Address = new Sway.data.ActiveRecord( 'Address', ns.persistance, [ns.field0] ) ;

        ns.field1 = new ns.Field('username', {friendlyName: 'User name'});
        ns.field2 = new ns.Field('password', {friendlyName: 'Password'}) ;
        ns.field3 = new ns.Field('birthday', {type: 'DATE', friendlyName: 'Birthday'}) ;
        ns.field4 = new ns.Field('address', {FK: { model: ns.Address, key: 'address'}, friendlyName: 'Address'}) ;

        ns.User = new Sway.data.ActiveRecord( 'User', ns.persistance, [ns.field1, ns.field2, ns.field3, ns.field4] ) ;
        ns.UserAsync = new Sway.data.ActiveRecord( 'User', ns.persistanceAsync, [ns.field1, ns.field2, ns.field3, ns.field4] ) ;
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

    it("should find 1 stored record without callbacks", function() {
        var newRec = null
            , newRec1 = null  ;

        newRec = ns.User.find({username:'John', password: 'Secret'}) ;      // not async
        expect(newRec).toBeDefined() ;
        expect(newRec.birthday).toBeDefined() ;
        expect(newRec.birthday).toBeInstanceof(Date) ;
        expect(newRec.birthday).toEqual(new Date(79,5,24)) ;

        newRec.username = 'Sue' ;
        newRec1 = ns.User.find(newRec) ;
        expect(newRec1.username).toEqual('Sue') ;
        expect(newRec1.password).toEqual('Secret') ;
        expect(newRec.birthday).toBeInstanceof(Date) ;
        expect(newRec.birthday).toEqual(new Date(79,5,24)) ;
    }) ;

    it("should find/load multiple stored record", function() {
        var newRec = null
            , newRec1 = null  ;

        newRec = ns.User.find({username:'John'}) ;      // not async
        expect(newRec.getLength()).toEqual(2) ;
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
