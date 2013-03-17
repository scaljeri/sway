describe("Sway.DataContainer", function() {

  // demonstrates Sway.DataContainer is created/defined
  it("should exist", function() {
    expect(Sway.DataContainer).toBeDefined() ;
  });

  // demonstrates that the input is stored correctly, as a Blob
  it("should accept a string as input", function() {
    var input = "this is a test string" ;

    var c = new Sway.DataContainer(input) ;
    expect(c.getSize()).toEqual(21) ;

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

  it("should be able to calculate the number of bytes of the string", function() {
       var c = new Sway.DataContainer("This is a test string") ; // 21 bytes
       expect(c.getSize()).toEqual(21) ; // http://mothereff.in/byte-counter
  }) ;

  it("should compress the input string", function() {
      var input = [], i ;
      for( i = 0; i < 10000; i = i + 1 )
           input.push("this is part of a huge string!!") ;
      var c = new Sway.DataContainer(input.join('')) ;
      var size = c.getSize() ; // size in bytes of the uncompressed string

      var retval = null ;
      runs( function() {
        c.zip(function(status) { // it should return { status: true }
           retval = status ;
        }) ;
      }) ;
      waitsFor(function() { // latch function
          return retval !== null  ;
      }, "Zipping input string", 1000);

      runs(function() {
          expect(retval.status).toBeTruthy() ;
          expect(c.getState()).toEqual("compressed") ;
          expect(c.getSize()).toBeLessThan(size) ;
          expect(c.getSize()).toEqual(939) ;
      });
  }) ;

  it("should be able to uncompress the data", function() {
      var input = "this is a test string" ;
      var c = new Sway.DataContainer(input) ;

      var retval = null ;
      runs( function() {
          c.zip(function(status) { // it should return { status: true }
              retval = status ;
          }) ;
      }) ;
      waitsFor(function() { // latch function
          return retval !== null ;
      }, "Zipping input string", 1000);

      runs(function() { // data is compressed now
          // uncompress
          var output = null;
          runs(function() {
              c.read(function(str) {
                 output = str ;
              }) ;
          }) ;

          waitsFor(function(){
             return output !== null  ;
          }) ;

          runs(function() {
              expect(output).toEqual(input) ;
          })
      });
  }) ;

  //if("should")
});