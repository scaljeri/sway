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

    describe("should register callbacks for an event", function() {
        it("using 'on'", function() {
        }) ;
        it("using 'one'", function() {
        }) ;
        it("using 'on' and 'one'", function() {
        }) ;
    });
    describe("should register callbacks for an namespaced event", function() {
       it("using 'on'", function() {
       }) ;
       it("using 'one'", function() {
       }) ;
       it("using 'on' and 'one'", function() {
       }) ;
    }) ;
});
