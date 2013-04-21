/*
    TODO: test for 'prepend'
 */
window.describe("Sway.EventHub", function() {
    "use strict" ;

    var beforeEach = window.beforeEach
        , describe = window.describe
        , it = window.it
        , expect = window.expect
        , spyOn = window.spyOn
        , Sway = window.Sway ;

    // mock some classes
    beforeEach(function() {
        // create DI
        Sway.eventHub = new Sway.EventHub() ;

        // The callbacks modify the data parameter, which is used to determine the order in which they are executed
        Sway.callbacks = {
            cb1: function(data) {
                if ( data && data.order )
                    data.order *= 10 ;
            },
            cb2: function(data) {
                if ( data && data.order )
                    data.order *= 10 ;
            },
            cb3: function(data) {
                if ( data && data.order )
                    data.order *= 10 ;
            },
            cb4: function(data) {
                if ( data && data.order )
                    data.order *= 10 ;
            }
        };

        spyOn(Sway.callbacks, 'cb1') ;
        spyOn(Sway.callbacks, 'cb2') ;
        spyOn(Sway.callbacks, 'cb3') ;
        spyOn(Sway.callbacks, 'cb4') ;
    });

    // javascript should work (syntax check)
    it("should exist", function() {
        expect(Sway.EventHub).toBeDefined() ; // the class
        expect(Sway.eventHub).toBeDefined() ; // the instance
    });
    it("should handle triggers for invalid event names", function() {
        expect(Sway.eventHub.trigger("go")).toEqual(0) ;
        expect(Sway.eventHub.trigger("forum.go")).toEqual(0) ;
        expect(Sway.eventHub.trigger()).toEqual(0) ;
    }) ;
    it("should generate unique event names", function() {
        expect(Sway.eventHub.generateUniqueEventName()).toEqual('--eh--0') ;
        expect(Sway.eventHub.generateUniqueEventName()).toEqual('--eh--1') ;
        expect(Sway.eventHub.generateUniqueEventName()).toEqual('--eh--2') ;
    }) ;

    // events withput a namespace
    describe("should handle normal events", function() {
        it("for callbacks registered with 'on'", function() {
           expect(Sway.eventHub.on("go", Sway.callbacks.cb1)).toBeTruthy() ;
           expect(Sway.eventHub.on("go", Sway.callbacks.cb1)).toBeFalsy() ;
           expect(Sway.eventHub.trigger("go", 1)).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
           Sway.eventHub.trigger("go", 2 ) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(2) ;
        }) ;
        it("for callbacks registered with 'one'", function() {
            expect(Sway.eventHub.one("go", Sway.callbacks.cb1)).toBeTruthy() ;
            expect(Sway.eventHub.one("go", Sway.callbacks.cb1)).toBeFalsy() ;
            expect(Sway.eventHub.trigger("go", 1 )).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
            Sway.eventHub.trigger("go", 2 ) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
        }) ;
        it("for callbacks registered with both, 'on' and 'one'", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            expect(Sway.eventHub.one("go", Sway.callbacks.cb2)).toBeTruthy() ;
            expect(Sway.eventHub.one("go", Sway.callbacks.cb2)).toBeFalsy() ;
            expect(Sway.eventHub.trigger("go", 1 )).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
            expect(Sway.callbacks.cb2).toHaveBeenCalledWith(1) ;
            expect(Sway.eventHub.trigger("go", 2 )).toEqual(1) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
        }) ;
        it("for callbacks removed using 'off'", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.one("go", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.off("go", Sway.callbacks.cb3)).toBeTruthy() ;
            expect(Sway.eventHub.off("go", Sway.callbacks.cb4)).toBeTruthy() ;
            expect(Sway.eventHub.trigger("go", 2 )).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;
        }) ;
        it("with a correct callback/trigger count", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.one("go", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.countTriggers("go")).toEqual(0) ;
            expect(Sway.eventHub.countTriggers()).toEqual(0) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(4) ;
            expect(Sway.eventHub.countCallbacks()).toEqual(4) ;
            expect(Sway.eventHub.trigger("go")).toEqual(4) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(2) ;
            expect(Sway.eventHub.countTriggers("go")).toEqual(1) ;
            expect(Sway.eventHub.countTriggers()).toEqual(1) ;
        }) ;
        it("with correct capturing and bubbling behavior", function(){
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;
            Sway.eventHub.one("bar", Sway.callbacks.cb2, { etype: 'capture'}) ;
            Sway.eventHub.one("bar", Sway.callbacks.cb3, { etype: 'bubble'}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4) ;
            debugger ;
            expect(Sway.eventHub.trigger("bar.foo", { order: 1 })).toEqual(2) ;
            expect(Sway.callbacks.cb1).not.toHaveBeenCalled() ;

        }) ;
    });

    // events with a namespace
    describe("should handle one level deep namespaced events", function() {
       it("for callbacks registered with 'on'", function() {
           expect(Sway.eventHub.on("forum.go", Sway.callbacks.cb1)).toBeTruthy() ;
           expect(Sway.eventHub.trigger("forum.go", 1 )).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
           expect(Sway.eventHub.trigger("forum.go", 2 )).toEqual(1) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(2) ;
       }) ;
       it("for callbacks registered with 'one'", function() {
           expect(Sway.eventHub.one("forum.go", Sway.callbacks.cb1)).toBeTruthy() ;
           expect(Sway.eventHub.one("forum.go", Sway.callbacks.cb1)).toBeFalsy() ;
           expect(Sway.eventHub.trigger("forum.go", 1 )).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
           expect(Sway.eventHub.trigger("forum.go", 2)).toEqual(0) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
       }) ;
       it("for callbacks registered with both, 'on' and 'one'", function() {
           Sway.eventHub.on("forum.go", Sway.callbacks.cb1) ;
           Sway.eventHub.one("forum.go", Sway.callbacks.cb2) ;
           expect(Sway.eventHub.on("forum.go", Sway.callbacks.cb1)).toBeFalsy() ;
           expect(Sway.eventHub.trigger("forum.go", 1 )).toEqual(2);
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
           expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
           expect(Sway.callbacks.cb2).toHaveBeenCalledWith(1) ;
           expect(Sway.eventHub.trigger("forum.go", 2 )).toEqual(1) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
           expect(Sway.callbacks.cb2.callCount).toEqual(1) ;

           // add cb2 again, which should work because it is already removed
           expect(Sway.eventHub.one("forum.go", Sway.callbacks.cb2)).toBeTruthy() ;
           expect(Sway.eventHub.trigger("forum.go", 2 )).toEqual(2) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(3) ;
           expect(Sway.callbacks.cb2.callCount).toEqual(2) ;
       }) ;
       it("for callbacks removed with 'off'", function() {
           Sway.eventHub.on("forum.go1", Sway.callbacks.cb1) ;
           Sway.eventHub.one("forum.go2", Sway.callbacks.cb2) ;
           Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
           Sway.eventHub.one("forum.go1", Sway.callbacks.cb4) ;
           expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toBeTruthy() ;
           expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb4)).toBeTruthy() ;
           expect(Sway.eventHub.trigger("forum.go1", 2 )).toEqual(1) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb2).not.toHaveBeenCalled() ;
           expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
           expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;
       }) ;

       it("for triggers by namespace", function() {
           Sway.eventHub.on("forum.go1", Sway.callbacks.cb1) ;
           Sway.eventHub.one("forum.go2", Sway.callbacks.cb2) ;
           Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
           Sway.eventHub.one("forum.go1", Sway.callbacks.cb4) ;
           expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toBeTruthy() ;
           expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb4)).toBeTruthy() ;
           expect(Sway.eventHub.trigger("forum", 2 )).toEqual(2) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
           expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;

           expect(Sway.eventHub.trigger("forum", 2 )).toEqual(1) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
           expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
       }) ;
       it("with a correct callback / trigger count", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.one("go", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(4) ;
           // TODO: trigger count
        }) ;
        it("with correct capturing and bubbling behavior", function(){

        }) ;
    }) ;

    describe("should handle two level deep namespaced event", function() {
        it("for callbacks registered with 'on'", function() {
            Sway.eventHub.on("forum.go", Sway.callbacks.cb1) ;
            Sway.eventHub.trigger("forum.go", 1 ) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
            Sway.eventHub.trigger("forum.go", 2 ) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(2) ;
        }) ;
        it("for callbacks registered with 'one'", function() {
            Sway.eventHub.one("forum.go", Sway.callbacks.cb1) ;
            Sway.eventHub.trigger("forum.go", 1 ) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
            Sway.eventHub.trigger("forum.go", 2 ) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
        }) ;
        it("for callbacks registered using both, 'on' and 'one'", function() {
            Sway.eventHub.on("forum.go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("forum.go", Sway.callbacks.cb2) ;
            Sway.eventHub.trigger("forum.go", 1 ) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb1.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(1) ;
            expect(Sway.callbacks.cb2).toHaveBeenCalledWith(1) ;
            Sway.eventHub.trigger("forum.go", 2 ) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
        }) ;
        it("for callbacks removed with 'off'", function() {
            Sway.eventHub.on("forum.go1", Sway.callbacks.cb1) ;
            Sway.eventHub.one("forum.go2", Sway.callbacks.cb2) ;
            Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
            Sway.eventHub.one("forum.go1", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toBeTruthy() ;
            expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb4)).toBeTruthy() ;
            Sway.eventHub.trigger("forum.go1", 2 ) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;
        }) ;

        it("for triggers by namespace", function() {
            Sway.eventHub.on("forum.go1", Sway.callbacks.cb1) ;
            Sway.eventHub.one("forum.go2", Sway.callbacks.cb2) ;
            Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
            Sway.eventHub.one("forum.go1", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toBeTruthy() ;
            expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb4)).toBeTruthy() ;
            expect(Sway.eventHub.trigger("forum", 2 )).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;

            expect(Sway.eventHub.trigger("forum", 2 )).toEqual(1) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
        }) ;
        it("with a correct callback / trigger count", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.one("go", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(4) ;
            // TODO: trigger count
        }) ;
        it("with correct capturing and bubbling behavior", function(){

        }) ;
    }) ;
});
