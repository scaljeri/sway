describe("The DI", function() {

  beforeEach(function() {
	// create some resources here
	App.di = new App.DI() ;

	(function() {
        	var dataInstanceCount = 0 ;
                App.RealDataSource = function() {
               		this.instanceId = ++dataInstanceCount;
                } ;

                App.RealDataSource.prototype.getData = function() {
                	return "this is data coming from the realDataSource (#" + this.instanceId + ")";
                }
        })() ;

        App.Consumer1 = function(container) {
        	this.data = container.getDependency("data");
        	this.foo = function() {
        		alert('consumer 1: ' + this.data.getData());
        	}
        }

        App.Consumer2 = function(container) {
        	this.data = container.getDependency("data");
        	this.foo = function() {
        		alert('consumer 2 ' + this.data.getData());
        	}
        }

  });

  it("should exist", function() {
    expect(App.DI).toBeDefined() ;
    expect(App.di).toBeDefined()
  });

  it("should be able to setup a contract", function() {
    expect(App.di.getDependency("data")).toBeNull() ;

    // add data service
    App.di.registerType("data", App.RealDataSource) ; ;
    var dataResource = App.di.getDependency("data") ;
    expect( dataResource instanceof App.RealDataSource).toBeTruthy() ;
    expect( dataResource ).not.toEqual(App.di.getDependency("data")) ;
  });

  it("should provide a signleton instance", function() {
    expect(App.di.getDependency("data")).toBeNull() ;

    App.di.registerType("data", App.RealDataSource, "single") ;
    var dataResource = App.di.getDependency("data") ;
    expect( dataResource instanceof App.RealDataSource).toBe(true) ;
    expect( dataResource ).toEqual(App.di.getDependency("data")) ;
  });
});
