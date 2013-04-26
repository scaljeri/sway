window.describe("Sway.DI", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , it            = window.it
        , ns             = {} ;

    // mock some classes
    ns.RealDataSource = function() {
    } ;

    ns.Consumer1 = function(data) {
        this.data = data ;
    };

    ns.Consumer2 = function(data, consumer) {
        this.data = data ;
        this.consumers = consumer ;
    };
    ns.Consumer3 = function(data, consumers) {
        this.data = data ;
        this.consumers = consumers ;
    };

    beforeEach(function() {
        // create DI
        ns.di = new Sway.DI() ;
    });

    it("should exist", function() {
        expect(Sway.DI).toBeDefined() ; // the class
        expect(ns.di).toBeDefined() ; // the instance
    });

    it("should be able to setup a contract", function() {
        expect(ns.di.getInstance("data")).toBeNull() ;

        // create "data" contract
        ns.di.register("data", ns.RealDataSource) ;
        var dataResource = ns.di.getInstance("data") ;
        expect( dataResource instanceof ns.RealDataSource).toBeTruthy() ;
        expect( dataResource !== ns.di.getInstance("data")).toBeTruthy() ;
    });

    it("should provide a signleton instance", function() {
        expect(ns.di.getInstance("data")).toBeNull() ;

        ns.di.register("data", ns.RealDataSource, { singleton: true } ) ;
        var dataResource = ns.di.getInstance("data") ;
        expect( dataResource instanceof ns.RealDataSource).toBe(true) ;
        expect( dataResource ).toEqual(ns.di.getInstance("data")) ; // ===
    });

    // test createInstance
    it("should create an instance for a contract", function() {
        ns.di.register("data", ns.RealDataSource, { singleton: true } ) ;
        ns.di.register("cons1", ns.Consumer1) ;
        ns.di.register("cons2", ns.Consumer2) ;

        expect(ns.di.createInstance.call(ns.di, "unknown", ["data", "cons1"])).toBeNull() ;
        var instance = ns.di.createInstance.call(ns.di, "cons2", ["data", "cons1"]) ;
        expect( instance.data instanceof ns.RealDataSource).toBeTruthy() ;
        expect( instance.consumers instanceof ns.Consumer1).toBeTruthy() ;
        expect( instance.data === ns.di.getInstance("data")).toBeTruthy() ;

        ns.di.register("cons2", ns.Consumer2) ;
    }) ;
    it("should inject dependecies for contract instance", function() {
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
