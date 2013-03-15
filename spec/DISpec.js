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
        this.foo = function() {
            alert('consumer 1: ' + this.data.getData());
        }
    }

    Scaljeri.Consumer2 = function(data) {
        this.data = data ;
        this.foo = function() {
            alert('consumer 2 ' + this.data.getData());
        }
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
        expect(Scaljeri.di.getDependency("data")).toBeNull() ;

        // add data service
        Scaljeri.di.register("data", Scaljeri.RealDataSource) ;
        var dataResource = Scaljeri.di.getDependency("data") ;
        expect( dataResource instanceof Scaljeri.RealDataSource).toBeTruthy() ;
        expect( dataResource ).not.toEqual(Scaljeri.di.getDependency("data")) ;
    });

    it("should provide a signleton instance", function() {
        expect(Scaljeri.di.getDependency("data")).toBeNull() ;

        Scaljeri.di.register("data", Scaljeri.RealDataSource, "single") ;
        var dataResource = Scaljeri.di.getDependency("data") ;
        expect( dataResource instanceof Scaljeri.RealDataSource).toBe(true) ;
        expect( dataResource ).toEqual(Scaljeri.di.getDependency("data")) ;
    });

    // test createInstance
    it("should create an instance with given dependencies", function() {
        Scaljeri.di.register("data", Scaljeri.RealDataSource, "single") ;
        Scaljeri.di.register("cons1", Scaljeri.Consumer1) ;
        //Scaljeri.di.registerInstance("cons2", new Scaljeri.Consumer2()) ;

        expect(Scaljeri.di.createInstance.bind(Scaljeri.di, "unknown", ["data", "cons1"])).toThrow('Unknown contract name "unknown"') ;
        expect(Scaljeri.di.createInstance.bind(Scaljeri.di, "cons2", ["data", "cons1"])).toThrow('Cannot create instance for this contract') ;
    }) ;
});
