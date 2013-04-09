describe("Sway.WebSql", function() {

    beforeEach(function() {
    });

    it("should be able to create a database connection", function() {
        expect(new Sway.Wsql()).toBeDefined() ;
        expect(new Sway.Wsql("test-db")).toBeDefined() ;
        expect(new Sway.Wsql("test-db", 3)).toBeDefined() ;
        expect(new Sway.Wsql("test-db", 3, { description: "a db for testing only!"})).toBeDefined() ;
    });
});