describe("Sway.DI", function() {
    // mock some classes

    Sway.RealDataSource = function() {
    } ;

    Sway.Consumer1 = function(data) {
        this.data = data ;
    }

    Sway.Consumer2 = function(data, consumer) {
        this.data = data ;
        this.consumers = consumer ;
    }
    Sway.Consumer3 = function(data, consumers) {
        this.data = data ;
        this.consumers = consumers ;
    }

    beforeEach(function() {
	    // create DI
	    Sway.di = new Sway.DI() ;
    });

    it("should exist", function() {
        expect(Sway.DI).toBeDefined() ; // the class
        expect(Sway.di).toBeDefined() ; // the instance
    });

    it("should be able to setup a contract", function() {
        expect(Sway.di.getInstance("data")).toBeNull() ;

        // create "data" contract
        Sway.di.register("data", Sway.RealDataSource) ;
        var dataResource = Sway.di.getInstance("data") ;
        expect( dataResource instanceof Sway.RealDataSource).toBeTruthy() ;
        expect( dataResource !== Sway.di.getInstance("data")).toBeTruthy() ;
    });

    it("should provide a signleton instance", function() {
        expect(Sway.di.getInstance("data")).toBeNull() ;

        Sway.di.register("data", Sway.RealDataSource, { singleton: true } ) ;
        var dataResource = Sway.di.getInstance("data") ;
        expect( dataResource instanceof Sway.RealDataSource).toBe(true) ;
        expect( dataResource ).toEqual(Sway.di.getInstance("data")) ; // ===
    });

    // test createInstance
    it("should create an instance for a contract", function() {
        Sway.di.register("data", Sway.RealDataSource, { singleton: true } ) ;
        Sway.di.register("cons1", Sway.Consumer1) ;
        Sway.di.register("cons2", Sway.Consumer2) ;

        expect(Sway.di.createInstance.bind(Sway.di, "unknown", ["data", "cons1"])).toThrow('Unknown contract name "unknown"') ;
        var instance = Sway.di.createInstance.call(Sway.di, "cons2", ["data", "cons1"]) ;
        expect( instance.data instanceof Sway.RealDataSource).toBeTruthy() ;
        expect( instance.consumers instanceof Sway.Consumer1).toBeTruthy() ;
        expect( instance.data === Sway.di.getInstance("data")).toBeTruthy() ;

        Sway.di.register("cons2", Sway.Consumer2) ;
    }) ;
    it("should inject dependecies for contract instance", function() {
        // setup
        Sway.di.register("data", Sway.RealDataSource, { singleton: true } ) ;
        Sway.di.register("cons1", Sway.Consumer1, ["data"]) ;
        Sway.di.register("cons2", Sway.Consumer2, ["data", ["cons1", "cons1"]]) ;

        // a singleton dependency
        expect(Sway.di.getInstance("cons1").data instanceof Sway.RealDataSource).toBeTruthy();
        expect(Sway.di.getInstance("cons2").data).toEqual(Sway.di.getInstance("data")) ;

        // an array dependency
        expect(Sway.di.getInstance("cons1").consumer).not.toBeTruthy() ;
        expect(Array.isArray(Sway.di.getInstance("cons2").consumers)).toBeTruthy() ;
        expect(Sway.di.getInstance("cons2").consumers.length).toEqual(2) ;
        expect(Sway.di.getInstance("cons2").consumers[0] instanceof Sway.Consumer1 ).toBeTruthy() ;

        // an unknown dependency
        Sway.di.register("cons1", Sway.Consumer1, ["unknown"]) ;
        expect(Sway.di.getInstance("cons1").data).toBeNull() ;

    }) ;
    it("should detect circular dependencies", function() {
        Sway.di.register("data", Sway.RealDataSource, ["data"]) ;
        // simple circular dependency
        expect(Sway.di.getInstance.bind(Sway.di, "data")).toThrow("Circular dependency detected for contract data") ;

        // one level deeper circular dependency
        Sway.di.register("data", Sway.RealDataSource, ["cons1"]) ;
        Sway.di.register("cons1", Sway.Consumer1, ["data"]) ;
        expect(Sway.di.getInstance.bind(Sway.di, "data")).toThrow("Circular dependency detected for contract cons1") ;

        // circular dependency in array dependency
        Sway.di.register("data", Sway.RealDataSource, ["cons1"]) ;
        Sway.di.register("cons1", Sway.Consumer1, ["cons2", "cons3"]) ;
        Sway.di.register("cons2", Sway.Consumer1) ;
        Sway.di.register("cons3", Sway.Consumer1, [["cons2", "data"]]) ; // array dependency
        expect(Sway.di.getInstance.bind(Sway.di, "data")).toThrow("Circular dependency detected for contract cons1") ;
    }) ;
});
