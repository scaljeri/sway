describe("Scaljeri.WebSql", function() {

    beforeEach(function() {
    });

    it("should be able to create a database connection", function() {
        expect(new Scaljeri.Wsql()).toBeDefined() ;
        expect(new Scaljeri.Wsql("test-db")).toBeDefined() ;
        expect(new Scaljeri.Wsql("test-db", 3)).toBeDefined() ;
        expect(new Scaljeri.Wsql("test-db", 3, { description: "a db for testing only!"})).toBeDefined() ;
    });
});