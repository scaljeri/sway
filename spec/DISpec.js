describe("Scaljeri.DI", function() {
    // mock some classes
    (function() {
        var dataInstanceCount = 0 ;
        Scaljeri.RealDataSource = function() {
            this.instanceId = ++dataInstanceCount;
        } ;

        Scaljeri.RealDataSource.prototype.getData = function() {
            return "this is data coming from the realDataSource (#" + this.instanceId + ")";
        }
    })() ;

    Scaljeri.Consumer1 = function(data) {
        this.data = data ;
    }

    Scaljeri.Consumer2 = function(data, consumer) {
        this.data = data ;
        this.consumer = consumer ;
    }

    beforeEach(function() {
	    // create DI
	    Scaljeri.di = new Scaljeri.DI() ;
    });

    it("should exist", function() {
        expect(Scaljeri.DI).toBeDefined() ; // the class
        expect(Scaljeri.di).toBeDefined() ; // the instance
    });

    it("should be able to setup a contract", function() {
        expect(Scaljeri.di.getInstance("data")).toBeNull() ;

        // create "data" contract
        Scaljeri.di.register("data", Scaljeri.RealDataSource) ;
        var dataResource = Scaljeri.di.getInstance("data") ;
        expect( dataResource instanceof Scaljeri.RealDataSource).toBeTruthy() ;
        expect( dataResource ).not.toEqual(Scaljeri.di.getInstance("data")) ;
    });

    it("should provide a signleton instance", function() {
        expect(Scaljeri.di.getInstance("data")).toBeNull() ;

        Scaljeri.di.register("data", Scaljeri.RealDataSource, { singleton: true } ) ;
        var dataResource = Scaljeri.di.getInstance("data") ;
        expect( dataResource instanceof Scaljeri.RealDataSource).toBe(true) ;
        expect( dataResource ).toEqual(Scaljeri.di.getInstance("data")) ;
    });

    // test createInstance
    it("should create an instance with given dependencies", function() {
        Scaljeri.di.register("data", Scaljeri.RealDataSource, { singleton: true } ) ;
        Scaljeri.di.register("cons1", Scaljeri.Consumer1) ;
        Scaljeri.di.register("cons2", Scaljeri.Consumer2) ;

        expect(Scaljeri.di.createInstance.bind(Scaljeri.di, "unknown", ["data", "cons1"])).toThrow('Unknown contract name "unknown"') ;
        var instance = Scaljeri.di.createInstance.call(Scaljeri.di, "cons2", ["data", "cons1"]) ;
        expect( instance.data instanceof Scaljeri.RealDataSource).toBeTruthy() ;
        expect( instance.consumer instanceof Scaljeri.Consumer1).toBeTruthy() ;
        expect( instance.data === Scaljeri.di.getInstance("data")).toBeTruthy() ;
    }) ;
});
