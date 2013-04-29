window.describe("Sway.data.ActiveRecord", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , spyOn         = window.spyOn
        , it            = window.it
        , ns

    // mock and stub
        , persistance = {}

        , Field = function(){
            this.getSize = function() { return 10; } ;
        } ;

    beforeEach(function() {
        // create DI
        ns = {
            ar: new Sway.data.ActiveRecord(persistance)
            , field1: new Field()
            , field2: new Field()
        } ;
    });

    it("should exist", function() {
        expect(Sway.data.ActiveRecord).toBeDefined() ; // the class
        expect(ns.ar).toBeDefined() ; // the instance

        var User = new Sway.data.ActiveRecord( 'User', null, [
                          new Sway.data.Field( {type: 'TEXT', key: 'username', friendlyName: 'User name'})
                        , new Sway.data.Field( {type: 'TEXT', key: 'password', friendlyName: 'Password'})
                        , new Sway.data.Field( {type: 'DATE', key: 'birthday', friendlyName: 'Birthday'})
                  ]) ;
        var u = new User( {username: 'Lucas', password: 'Calje', birthday: new Date()}) ;
        u.transformed(true) ;
        debugger ;
    });

    xit("should accept fields", function() {

        ns.ar.setField("id", ns.field1);
        expect(ns.ar._field.length).toEqual(1) ;
        expect(ns.ar._field[0].field).toEqual(ns.field1) ;
        expect(ns.ar._field[0].key).toEqual("id") ;
        expect(ns.ar._fieldLookup.id).toEqual(0) ;

        ns.ar.setField("data", ns.field2);
        expect(ns.ar._field.length).toEqual(2) ;
        expect(ns.ar._field[1].field).toEqual(ns.field2) ;
        expect(ns.ar._field[1].key).toEqual("data") ;
        expect(ns.ar._fieldLookup.data).toEqual(1) ;

        expect(ns.ar._field[0].field !== ns.ar._field[1].field).toBeTruthy() ;
    }) ;

    xit("should be able to manipulate fields", function() {
        var msg = "this is a test" ;

        ns.ar.setField("id", ns.field1);
        ns.ar.setField("data", ns.field2);

        ns.field1.value = msg ;
        ns.field2.value = msg + "." ;
        expect(ns.ar.getField("id").value).toEqual(msg) ;
        expect(ns.ar.getField("id").value).not.toEqual(ns.ar.getField("data").value) ;
        expect(ns.ar.getSize("id")).toEqual(10) ;
        expect(ns.ar.getSize()).toEqual(20) ;
    }) ;

    xit("should bless objects/models", function() {
        var model1 = Object.create(null)
           , model2 = Object.create(null)
           , field1 = new Field()
           , field2 = new Field() ;

        spyOn(ns.ar, 'save').andCallThrough() ;                     // make sure this function is called on blessed objects

        // bless "model1"
        expect(ns.ar.bless(model1) === ns.ar).toBeTruthy() ;
        model1.save() ;
        expect(model1.save).toHaveBeenCalled() ;                    // was ns.ar.save called ?

        ns.ar.setField("id", field1) ;
        ns.ar.setField("value", field2) ;

        // bless model2 with 2 fields
        expect(ns.ar.bless(model2) === ns.ar).toBeTruthy() ;
        expect(model1._field.length).toEqual(0) ;                   // model1 was blessed before the fields were added to ns.ar
        expect(model2._field.length).toEqual(2) ;                   // should have 2 fields
        expect(model2._field[0] !== ns.ar._field[0]).toBeTruthy() ; // the fields should be different from ns.ar
    }) ;
}) ;
