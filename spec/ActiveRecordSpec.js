window.describe("Sway.data.ActiveRecord", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , it            = window.it
        , ns

    // mock and stub
        , persistance = {}

        , Field = function(options){
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
    });

    it("should accept fields", function() {

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

    it("should be able to manipulate fields", function() {
        var msg = "this is a test" ;

        ns.ar.setField("id", ns.field1);
        ns.ar.setField("data", ns.field2);

        ns.field1.value = msg ;
        ns.field2.value = msg + "." ;
        expect(ns.ar.getField("id").value).toEqual(msg) ;
        expect(ns.ar.getField("id").value).not.toEqual(ns.ar.getField("data").value) ;
        expect(ns.ar.getSize()).toEqual(20) ;
    }) ;
}) ;
