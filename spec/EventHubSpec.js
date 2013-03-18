describe("Sway.EventHub", function() {
    // mock some classes
    beforeEach(function() {
	    // create DI
	    Sway.eventHub = new Sway.EventHub() ;
    });

    it("should exist", function() {
        expect(Sway.EventHub).toBeDefined() ; // the class
        expect(Sway.eventHub).toBeDefined() ; // the instance
    });
});
