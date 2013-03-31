describe("Sway.ActiveRecord", function() {
    "use strict" ;
    var Sway = window.Sway
        , it = window.it
        , expect = window.expect ;

  // demonstrates Sway.DataContainer is created/defined
  it("should exist", function() {
    expect(Sway.data.ActiveRecord).toBeDefined() ;
  });
});