describe("App.DataContainer", function() {

  // demonstrates App.DataContainer is created/defined
  it("should exist", function() {
    expect(App.DataContainer).toBeDefined() ;
  });

  // demonstrates that the input is stored correctly, as a Blob
  it("should accept a string as input", function() {
    var input = "this is a test string" ;
    var c = new App.DataContainer(input) ;

    // read back the string
    var retVal = null ;
    runs( function() {
        c.read(function(output) {
            retVal = output
        })
    } ) ;

    waitsFor(function() { // latch function
          return retVal;
    }, "Reading the data back", 500);

    runs(function() {
        expect(retVal).toEqual(input)
    });

  });

//  it("should compress the input string", function() {
//      var input = "this is a test string" ;
//      var c = new App.DataContainer(input) ;
//      var status = false ;
//      runs( function() {
//        c.zip(function(retVal) {
//           status = retVal.status ;
//        }) ;
//      }) ;
//      waitsFor(function() { // latch function
//          return status;
//      }, "Zipping input string", 9000);
//      runs(function() {
//          expect(status).toBeTruthy() ;
//          debugger ;
//      });
//
//  }) ;

  //if("should")
});