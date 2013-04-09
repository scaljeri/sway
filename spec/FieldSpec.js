window.describe("Sway.data.Field", function() {
    "use strict";

    var Sway            = window.Sway
        , beforeEach    = window.beforeEach
        , expect        = window.expect
        , it            = window.it ;

    // mock some classes

    beforeEach(function() {
        // create DI
        //Sway.di = new Sway.DI() ;
    });

    it("should exist", function() {
        expect(Sway.data.Field).toBeDefined() ; // the class
    });
});
