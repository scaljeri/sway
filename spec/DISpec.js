describe("The DI", function() {

  beforeEach(function() {
	// create some resources here
	Scaljeri.di = new Scaljeri.DI() ;

	(function() {
        	var dataInstanceCount = 0 ;
                Scaljeri.RealDataSource = function() {
               		this.instanceId = ++dataInstanceCount;
                } ;

                Scaljeri.RealDataSource.prototype.getData = function() {
                	return "this is data coming from the realDataSource (#" + this.instanceId + ")";
                }
        })() ;

        Scaljeri.Consumer1 = function(container) {
        	this.data = container.getDependency("data");
        	this.foo = function() {
        		alert('consumer 1: ' + this.data.getData());
        	}
        }

        Scaljeri.Consumer2 = function(container) {
        	this.data = container.getDependency("data");
        	this.foo = function() {
        		alert('consumer 2 ' + this.data.getData());
        	}
        }

  });

  it("should exist", function() {
    expect(Scaljeri.DI).toBeDefined() ;
    expect(Scaljeri.di).toBeDefined()
  });

  it("should be able to setup a contract", function() {
    expect(Scaljeri.di.getDependency("data")).toBeNull() ;

    // add data service
    Scaljeri.di.registerType("data", Scaljeri.RealDataSource) ; ;
    var dataResource = Scaljeri.di.getDependency("data") ;
    expect( dataResource instanceof Scaljeri.RealDataSource).toBeTruthy() ;
    expect( dataResource ).not.toEqual(Scaljeri.di.getDependency("data")) ;
  });

  it("should provide a signleton instance", function() {
    expect(Scaljeri.di.getDependency("data")).toBeNull() ;

    Scaljeri.di.registerType("data", Scaljeri.RealDataSource, "single") ;
    var dataResource = Scaljeri.di.getDependency("data") ;
    expect( dataResource instanceof Scaljeri.RealDataSource).toBe(true) ;
    expect( dataResource ).toEqual(Scaljeri.di.getDependency("data")) ;
  });
});
