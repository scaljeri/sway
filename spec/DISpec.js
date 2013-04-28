window.describe("Sway.DI", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , it            = window.it
        , ns             = {} ;

    // mock some classes
    ns.Obj1 = function(a) {
        if ( a )
            this.args = arguments ;
    } ;
    ns.Obj2 = function(a) {
        if ( a )
            this.args = arguments ;
    };

    ns.Obj3 = function(a) {
        if ( a )
            this.args = arguments ;
    };
    ns.Obj4 = function(a) {
        if ( a )
            this.args = arguments ;
    };

    beforeEach(function() {
        // create DI
        ns.di = new Sway.DI() ;
    });

    it("should exist", function() {
        expect(Sway.DI).toBeDefined() ; // the class
        expect(ns.di).toBeDefined() ;   // the instance
    });

    it("should be able to setup a contract", function() {
        expect(ns.di.getInstance("obj1")).toBeNull() ;

        // create contract
        expect(ns.di.register("obj1", ns.Obj1, ['a', 'b'], {singleton:true} )).toBe(ns.di) ;
        expect(Object.keys(ns.di._contracts).length).toEqual(1) ;
        expect(ns.di._contracts['obj1'].classRef).toBe(ns.Obj1) ;
        expect(ns.di._contracts['obj1'].params).toEqual(['a', 'b']) ;
        expect(ns.di._contracts['obj1'].options).toEqual({singleton:true}) ;

        expect(ns.di.register("obj2", ns.Obj2, {singleton:true} )).toBe(ns.di) ;
        expect(Object.keys(ns.di._contracts).length).toEqual(2) ;
        expect(ns.di._contracts['obj2'].classRef).toBe(ns.Obj2) ;
        expect(ns.di._contracts['obj2'].params).toEqual([]) ;
        expect(ns.di._contracts['obj2'].options).toEqual({singleton:true}) ;

        expect(ns.di.register("obj3", ns.Obj3)).toBe(ns.di) ;
        expect(Object.keys(ns.di._contracts).length).toEqual(3) ;
        expect(ns.di._contracts['obj3'].classRef).toBe(ns.Obj3) ;
        expect(ns.di._contracts['obj3'].params).toEqual([]) ;
        expect(ns.di._contracts['obj3'].options).toEqual({}) ;
    });

    // test createInstance
    it("should create an instance for a contract", function() {
        ns.di.register("obj1",  ns.Obj1) ;
        ns.di.register("obj2", ns.Obj2, ['obj1']) ;
        ns.di.register("obj3", ns.Obj3, ['obj1', [true, false], 'obj2', 10]) ;

        var instance = ns.di.getInstance("obj1") ;
        expect(instance).toBeInstanceof(ns.Obj1) ;
        expect(instance.args).toBeUndefined() ;
        expect(instance).not.toBe(ns.di.getInstance("obj1")) ;

        instance = ns.di.getInstance("obj2") ;
        expect(instance).toBeInstanceof(ns.Obj2) ;
        expect(instance.args).toBeDefined() ;
        expect(instance.args[0]).toBeInstanceof(ns.Obj1) ;
        expect(instance).not.toBe(ns.di.getInstance("obj2")) ;

        instance = ns.di.getInstance("obj3") ;
        expect(instance).toBeInstanceof(ns.Obj3) ;
        expect(instance.args).toBeDefined() ;
        expect(instance.args[0]).toBeInstanceof(ns.Obj1) ;
        expect(instance.args[1]).toEqual([true, false]) ;
        expect(instance.args[2]).toBeInstanceof(ns.Obj2) ;
        expect(instance.args[3]).toEqual(10) ;
        expect(instance).not.toBe(ns.di.getInstance("obj3")) ;
    }) ;

    it("should provide a signleton instance", function() {
        ns.di.register("obj1",  ns.Obj1, {singleton:true}) ;
        ns.di.register("obj2", ns.Obj2, ['obj1'], {singleton:true}) ;
        ns.di.register("obj3", ns.Obj3, ['obj1', [true, false], 'obj2', 10], {singleton:true}) ;

        var instance = ns.di.getInstance("obj1") ;
        expect(instance).toBeInstanceof(ns.Obj1) ;
        expect(instance.args).toBeUndefined() ;
        expect(instance).toBe(ns.di.getInstance("obj1")) ;

        instance = ns.di.getInstance("obj2") ;
        expect(instance).toBeInstanceof(ns.Obj2) ;
        expect(instance.args).toBeDefined() ;
        expect(instance.args[0]).toBeInstanceof(ns.Obj1) ;
        expect(instance).toBe(ns.di.getInstance("obj2")) ;

        instance = ns.di.getInstance("obj3") ;
        expect(instance).toBeInstanceof(ns.Obj3) ;
        expect(instance.args).toBeDefined() ;
        expect(instance.args[0]).toBeInstanceof(ns.Obj1) ;
        expect(instance.args[1]).toEqual([true, false]) ;
        expect(instance.args[2]).toBeInstanceof(ns.Obj2) ;
        expect(instance.args[3]).toEqual(10) ;
        expect(instance).toBe(ns.di.getInstance("obj3")) ;
    });

    it("should inject dependencies for contract instance", function() {
        // setup
        ns.di.register("obj1", ns.Obj1, [1,2,3], {singleton:true} ) ;
        ns.di.register("obj2", ns.Obj2, ['obj1']) ;
        ns.di.register("obj3", ns.Obj3, ['obj1', 1000, 'obj2']) ;

        var obj1 = ns.di.getInstance('obj1')
            , obj3 = ns.di.getInstance('obj3')
            , obj2a = ns.di.getInstance('obj2', [4,5,6]) ;  // overwrite default params ['obj1'] with [4,5,6]

        expect(obj3).toBeInstanceof(ns.Obj3) ;
        expect(obj3.args[0]).toBe(obj1) ;
        expect(obj3.args[0].args[0]).toEqual(1) ;
        expect(obj3.args[0].args[1]).toEqual(2) ;
        expect(obj3.args[0].args[2]).toEqual(3) ;

        expect(obj3.args[2]).toBeInstanceof(ns.Obj2) ;
        expect(obj3.args[2].args[0]).toBe(obj1) ;           // obj1 is a singelton
        expect(obj3.args[2].args[0].args[0]).toEqual(1) ;

        expect(obj2a.args[0]).toEqual(4) ;                  // important is that 'obj2' and this object are different
        expect(obj2a.args[1]).toEqual(5) ;
        expect(obj2a.args[2]).toEqual(6) ;
    }) ;
    it("should detect circular dependencies", function() {
        ns.di.register("obj1", ns.Obj1, ["obj2"]) ;
        ns.di.register("obj2", ns.Obj1, ["obj3"]) ;
        ns.di.register("obj3", ns.Obj1, [1,2, "obj1"]) ;

        // simple circular dependency
        expect(ns.di.getInstance.bind(ns.di, "obj1")).toThrow("Circular dependency detected for contract obj1") ;
        expect(ns.di.getInstance.bind(ns.di, "obj2")).toThrow("Circular dependency detected for contract obj2") ;
        expect(ns.di.getInstance.bind(ns.di, "obj3")).toThrow("Circular dependency detected for contract obj3") ;
    }) ;
});
