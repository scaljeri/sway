window.describe("Sway.DI", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , it            = window.it
        , ns             = {} ;

    // mock some classes
    ns.Obj1 = function() {
    } ;
    ns.Obj2 = function() {
        this.args = arguments ;
    };

    ns.Obj3 = function() {
        this.args = arguments ;
    };
    ns.Obj4 = function() {
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
        expect(ns.di.register("obj1", ns.Obj1)).toBe(ns.di) ;
        var instance = ns.di.getInstance("obj1") ;
        expect(instance).toBeInstanceof(ns.Obj1) ;
        expect(instance).not.toBe(ns.di.getInstance("obj1")) ;
    });

    it("should provide a signleton instance", function() {
        expect(ns.di.getInstance("obj1")).toBeNull() ;

        ns.di.register("obj1", ns.Obj1, { singleton: true } ) ;
        var instance = ns.di.getInstance("obj1") ;
        expect(instance).toBeInstanceof(ns.Obj1) ;
        expect(instance).not.toBeInstanceof(ns.Obj2) ;
        expect(instance).toBe(ns.di.getInstance("obj1")) ;
    });

    // test createInstance
    it("should create an instance for a contract", function() {
        ns.di.register("obj1",  ns.Obj1, { singleton: true } ) ;
        ns.di.register("obj2", ns.Obj2, ['obj1']) ;
        ns.di.register("obj3", ns.Obj3, ['obj1', [true, false], 'obj2', 10]) ;

        var instance = ns.di.createInstance("obj3") ;
        debugger ;
        expect(instance.args).toBeInstanceof(ns.Obj1) ;
        expect(instance.obj2).not.toBeDefined() ;
        expect(instance.obj1).toBe(ns.di.getInstance("obj1")) ;

        instance = ns.di.createInstance("obj3", ['obj2', "obj2"]) ;
        expect(instance.obj1).toBeInstanceof(ns.Obj1) ;
        expect(instance.obj2).toBeInstanceof(ns.Obj2) ;
        expect(instance.obj1).toBe(ns.di.getInstance("data")) ;

        //ns.di.register('cons3', )
        //ns.di.register("cons2", ns.Consumer2) ;
    }) ;
    xit("should inject dependencies for contract instance", function() {
        // setup
        ns.di.register("data", ns.RealDataSource, { singleton: true } ) ;
        ns.di.register("cons1", ns.Consumer1, ["data"]) ;
        ns.di.register("cons2", ns.Consumer2, ["data", ["cons1", "cons1"]]) ;

        // a singleton dependency
        expect(ns.di.getInstance("cons1").data instanceof ns.RealDataSource).toBeTruthy();
        expect(ns.di.getInstance("cons2").data).toEqual(ns.di.getInstance("data")) ;

        // an array dependency
        expect(ns.di.getInstance("cons1").consumer).not.toBeTruthy() ;
        expect(Array.isArray(ns.di.getInstance("cons2").consumers)).toBeTruthy() ;
        expect(ns.di.getInstance("cons2").consumers.length).toEqual(2) ;
        expect(ns.di.getInstance("cons2").consumers[0] instanceof ns.Consumer1 ).toBeTruthy() ;

        // an unknown dependency
        ns.di.register("cons1", ns.Consumer1, ["unknown"]) ;
        expect(ns.di.getInstance("cons1").data).toBe('unknown') ;

    }) ;
    xit("should create an instance with dependencies and normal parameters", function() {

    }) ;
    xit("should detect circular dependencies", function() {
        ns.di.register("data", ns.RealDataSource, ["data"]) ;
        // simple circular dependency
        expect(ns.di.getInstance.bind(ns.di, "data")).toThrow("Circular dependency detected for contract data") ;

        // one level deeper circular dependency
        ns.di.register("data", ns.RealDataSource, ["cons1"]) ;
        ns.di.register("cons1", ns.Consumer1, ["data"]) ;
        expect(ns.di.getInstance.bind(ns.di, "data")).toThrow("Circular dependency detected for contract cons1") ;

        // circular dependency in array dependency
        ns.di.register("data", ns.RealDataSource, ["cons1"]) ;
        ns.di.register("cons1", ns.Consumer1, ["cons2", "cons3"]) ;
        ns.di.register("cons2", ns.Consumer1) ;
        ns.di.register("cons3", ns.Consumer1, [["cons2", "data"]]) ; // array dependency
        expect(ns.di.getInstance.bind(ns.di, "data")).toThrow("Circular dependency detected for contract cons1") ;
    }) ;
});
