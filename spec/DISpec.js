describe("Sway.DI", function() {
    // mock some classes
    (function() {
        var dataInstanceCount = 0 ;
        Sway.RealDataSource = function() {
            this.instanceId = ++dataInstanceCount;
        } ;

        Sway.RealDataSource.prototype.getData = function() {
            return "this is data coming from the realDataSource (#" + this.instanceId + ")";
        }
    })() ;

    Sway.Consumer1 = function(data) {
        this.data = data ;
    }

    Sway.Consumer2 = function(data, consumer) {
        this.data = data ;
        this.consumer = consumer ;
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
        expect( dataResource ).not.toEqual(Sway.di.getInstance("data")) ;
    });

    it("should provide a signleton instance", function() {
        expect(Sway.di.getInstance("data")).toBeNull() ;

        Sway.di.register("data", Sway.RealDataSource, { singleton: true } ) ;
        var dataResource = Sway.di.getInstance("data") ;
        expect( dataResource instanceof Sway.RealDataSource).toBe(true) ;
        expect( dataResource ).toEqual(Sway.di.getInstance("data")) ;
    });

    // test createInstance
    it("should create an instance with given dependencies", function() {
        Sway.di.register("data", Sway.RealDataSource, { singleton: true } ) ;
        Sway.di.register("cons1", Sway.Consumer1) ;
        Sway.di.register("cons2", Sway.Consumer2) ;

        expect(Sway.di.createInstance.bind(Sway.di, "unknown", ["data", "cons1"])).toThrow('Unknown contract name "unknown"') ;
        var instance = Sway.di.createInstance.call(Sway.di, "cons2", ["data", "cons1"]) ;
        expect( instance.data instanceof Sway.RealDataSource).toBeTruthy() ;
        expect( instance.consumer instanceof Sway.Consumer1).toBeTruthy() ;
        expect( instance.data === Sway.di.getInstance("data")).toBeTruthy() ;
    }) ;
});
