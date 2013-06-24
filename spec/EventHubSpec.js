describe("Sway.EventHub", function() {

    // globals
    var eh
        , cbs = {
            cb1: function(data) {
                if ( data && Array.isArray(data)  )
                    data.push('cb1') ;
            }
            , cb2: function(data) {
                if ( data && Array.isArray(data)  )
                    data.push('cb2') ;
            }
            , cb3: function(data) {
                if ( data && Array.isArray(data)  )
                    data.push('cb3') ;
            }
            , cb4: function(data) {
                if ( data && Array.isArray(data)  )
                    data.push('cb4') ;
            }
        } ;


    // mock some functions
    beforeEach(function() {
        // create DI
        eh = new Sway.EventHub() ;

        // Mocking
        spyOn(cbs, 'cb1').andCallThrough() ;
        spyOn(cbs, 'cb2').andCallThrough() ;
        spyOn(cbs, 'cb3').andCallThrough() ;
        spyOn(cbs, 'cb4').andCallThrough() ;

        var on = [
            { fn: cbs.cb1,   isOne: false }
            , { fn: cbs.cb1, isOne: true  }
            , { fn: cbs.cb2, isOne: false }
            , { fn: cbs.cb2, isOne: true  }
            , { fn: cbs.cb2, isOne: true,  eventMode: Sway.EventHub.EVENT_MODE.BOTH      }
            , { fn: cbs.cb3, isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }
            , { fn: cbs.cb3, isOne: true,  eventMode: Sway.EventHub.EVENT_MODE.BUBBLING  }
        ] ;

        // create event 'bar'
        eh._rootStack.bar = {
            __stack: {
                on: on                              // callback stack
                , parent: eh._rootStack             // parent namespace/object
                , triggers: 0                       // count triggers
                , disabled: false                   // by default the namespace/event is enabled
            }
        } ;

    });

    // javascript should work (syntax check)
    it("should exist", function() {
        expect(Sway.EventHub).toBeDefined() ;   // the class
        expect(eh).toBeDefined() ;              // the instance
    });
    it("should handle triggers for invalid event names", function() {
        expect(eh.trigger("go")).toEqual(0) ;
        expect(eh.trigger("forum.go")).toEqual(0) ;
        expect(eh.trigger()).toEqual(0) ;
    }) ;
    it("should generate unique event names", function() {
        expect(eh.generateUniqueEventName()).toEqual('--eh--0') ;
        expect(eh.generateUniqueEventName()).toEqual('--eh--1') ;
        expect(eh.generateUniqueEventName()).toEqual('--eh--2') ;
    }) ;

    // events without a namespace
    describe("should register callbacks for simple events (not namespaced)", function() {
        describe("using 'on'", function(){
            it("without options", function() {
                eh.on("go", cbs.cb1) ;
                eh.on("go", cbs.cb2) ;
                expect(eh._rootStack.go.__stack.on.length).toEqual(2) ;
                expect(eh._rootStack.go.__stack.disabled).toBeFalsy() ;             // check if stack is created correctly
                expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;        // check if callback is registered correctly
                expect(eh._rootStack.go.__stack.on[0].eventMode).toBeUndefined() ;
                expect(eh._rootStack.go.__stack.on[0].isOne).toBeFalsy() ;
                expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb2) ;
            }) ;
            it("with the 'eventMode' option", function(){
                eh.on("go", cbs.cb1) ;
                eh.on("go", cbs.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BOTH}) ;
                eh.on("go", cbs.cb3, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
                eh.on("go", cbs.cb4, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;

                expect(eh._rootStack.go.__stack.on.length).toEqual(4) ;

                expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
                expect(eh._rootStack.go.__stack.on[0].eventMode).toBeUndefined() ;

                expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb2) ;
                expect(eh._rootStack.go.__stack.on[1].eventMode).toEqual(Sway.EventHub.EVENT_MODE.BOTH) ;

                expect(eh._rootStack.go.__stack.on[2].fn).toEqual(cbs.cb3) ;
                expect(eh._rootStack.go.__stack.on[2].eventMode).toEqual(Sway.EventHub.EVENT_MODE.CAPTURING) ;

                expect(eh._rootStack.go.__stack.on[3].fn).toEqual(cbs.cb4) ;
                expect(eh._rootStack.go.__stack.on[3].eventMode).toEqual(Sway.EventHub.EVENT_MODE.BUBBLING) ;
            }) ;
            it("with the 'prepend' option", function(){
                expect(eh.on("go", cbs.cb1)).toBeTruthy() ;
                expect(eh.on("go", cbs.cb2, { prepend: false})).toBeTruthy() ;
                expect(eh.on("go", cbs.cb3, { prepend: true })).toBeTruthy() ;
                expect(eh.on("go", cbs.cb4, { prepend: true })).toBeTruthy() ;

                expect(eh._rootStack.go.__stack.on.length).toEqual(4) ;
                expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb4) ;
                expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb3) ;
                expect(eh._rootStack.go.__stack.on[2].fn).toEqual(cbs.cb1) ;
                expect(eh._rootStack.go.__stack.on[3].fn).toEqual(cbs.cb2) ;
            }) ;
            it("with 'allowMultiple' set to TRUE", function(){
                expect(eh.allowMultiple).toBeTruthy() ;                                 // by default this value is set to TRUE
                expect(eh.setAllowMultiple(true)).toBe(eh) ;                            // chainable
                expect(eh.on( "go", cbs.cb1)).toBeTruthy() ;                           // default behavior is to accept
                expect(eh.on( "go", cbs.cb1)).toBeTruthy() ;                           // the same callback multiple times
                expect(eh._rootStack.go.__stack.on.length).toEqual(2) ;                // check the internal stack
            }) ;
            it("with 'allowMultiple' set to FALSE", function(){
                expect(eh.setAllowMultiple(false)).toBe(eh) ;                           // chainable
                expect(eh.on( "go", cbs.cb2)).toBeTruthy() ;
                expect(eh.on( "go", cbs.cb2)).toBeFalsy() ;                            // nope, its registered already
                expect(eh.on( "go", cbs.cb2, {})).toBeFalsy() ;                        // idem
                expect(eh.on( "go", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeTruthy() ;      // accepted, because it has an event-mode defined
                expect(eh.on( "go", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.BOTH})).toBeFalsy() ;            // falsy, because 'BOTH' includes 'CAPTURING' too
                expect(eh.on( "go", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeFalsy() ;       // nope
                expect(eh.on( "go", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toBeTruthy() ;       // different event mode

                expect(eh.on( "go", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.BOTH})).toBeTruthy() ;
                expect(eh.on( "go", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeFalsy() ;       // 'BOTH' includes 'CAPTURING'
                expect(eh.on( "go", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toBeFalsy() ;        // and 'BUBBLING'
                expect(eh.on( "go", cbs.cb3)).toBeTruthy() ;                                                       // true because no event mode is defined
            }) ;
        }) ;
        it("using 'one'", function(){
            eh.one("go", cbs.cb1) ;
            expect(eh._rootStack.go.__stack.on.length).toEqual(1) ;
            expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
            expect(eh._rootStack.go.__stack.on[0].isOne).toBeTruthy() ;
        }) ;
        it("with a correct callback count", function(){
            expect(eh.countCallbacks('bar')).toEqual(4) ;
            expect(eh.countCallbacks('bar', { eventMode: Sway.EventHub.EVENT_MODE.BOTH })).toEqual(1) ;
            expect(eh.countCallbacks('bar', { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING })).toEqual(1) ;
            expect(eh.countCallbacks('bar', { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING })).toEqual(1) ;
        }) ;
        it("and be able to remove callbacks using 'off'", function() {
            var on = eh._rootStack.bar.__stack.on ;

            expect(eh.off('bar', cbs.cb1)).toEqual(2) ;
            expect(on[0].fn).toBe(cbs.cb2) ;
            expect(eh.off('bar', cbs.cb2)).toEqual(2) ;
            expect(on[0].fn).toBe(cbs.cb2) ;
            expect(eh.off('bar', cbs.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BOTH })).toEqual(1) ;
            expect(eh.off('bar', cbs.cb3, { isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING })).toEqual(1) ;
            expect(eh.off('bar', cbs.cb3, { isOne: false, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING })).toEqual(0) ;
            expect(eh.off('bar', cbs.cb3, { isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING })).toEqual(1) ;
            expect(on.length).toEqual(0) ;

        }) ;
        /*
         var on = [
         { fn: cbs.cb1,   isOne: false }
         , { fn: cbs.cb1, isOne: true  }
         , { fn: cbs.cb2, isOne: false }
         , { fn: cbs.cb2, isOne: true  }
         , { fn: cbs.cb2, isOne: true,  eventMode: Sway.EventHub.EVENT_MODE.BOTH      }
         , { fn: cbs.cb3, isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }
         , { fn: cbs.cb3, isOne: true,  eventMode: Sway.EventHub.EVENT_MODE.BUBBLING  }
         ] ;
         */
        describe("and triggers them", function(){
            it("without an event mode", function(){
                expect('bar.foo', { eventMode: null })
            }) ;
            it("in the Capturing event mode", function(){
                eh.one("go", cbs.cb1) ;
                expect(eh._rootStack.go.__stack.on.length).toEqual(1) ;
                expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
                expect(eh._rootStack.go.__stack.on[0].isOne).toBeTruthy() ;
            });
            it("in the Bubbling event mode", function(){}) ;
            it("in the Capturing and Bubbling event mode (BOTH)", function(){}) ;

            it("and validate the trigger count", function(){

            });
        });
    });

        // events without a namespace
        describe("should register callbacks for namespaced events", function() {
            beforeEach(function(){ // NOTE That the event 'bar' is already set by the first 'beforeEach'!
                var onFoo1 = [
                        { fn: cbs.cb1,   isOne: false }
                        , { fn: cbs.cb1,   isOne: true }
                        , { fn: cbs.cb2, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BOTH }
                        , { fn: cbs.cb3, isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }
                        , { fn: cbs.cb4, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }
                    ]
                    , onFoo2 = [
                        { fn: cbs.cb1,   isOne: true }
                        , { fn: cbs.cb1,   isOne: false }
                        , { fn: cbs.cb2, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BOTH }
                        , { fn: cbs.cb3, isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }
                        , { fn: cbs.cb4, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }
                    ] ;
                eh._rootStack.bar.foo1 = {
                    __stack: {
                        on: onFoo1                          // callback stack
                        , parent: eh._rootStack.bar         // parent namespace/object
                        , triggers: 0                       // count triggers
                        , disabled: false                   // by default the namespace/event is enabled
                    }
                } ;
                eh._rootStack.bar.foo = {
                    __stack: {
                        on: onFoo2                          // callback stack
                        , parent: eh._rootStack.bar         // parent namespace/object
                        , triggers: 0                       // count triggers
                        , disabled: false                   // by default the namespace/event is enabled
                    }
                } ;
            });
            describe("using 'on'", function(){
                it("without options", function() {
                    eh.on("go", cbs.cb1) ;
                    eh.on("go", cbs.cb2) ;
                    expect(eh._rootStack.go.__stack.on.length).toEqual(2) ;
                    expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
                    expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb2) ;
                }) ;
                it("with the 'eventMode' option", function(){
                    eh.on("go", cbs.cb1) ;
                    eh.on("go", cbs.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BOTH}) ;
                    eh.on("go", cbs.cb3, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
                    eh.on("go", cbs.cb4, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;

                    expect(eh._rootStack.go.__stack.on.length).toEqual(4) ;

                    expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
                    expect(eh._rootStack.go.__stack.on[0].eventMode).toBeUndefined() ;

                    expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb2) ;
                    expect(eh._rootStack.go.__stack.on[1].eventMode).toEqual(Sway.EventHub.EVENT_MODE.BOTH) ;

                    expect(eh._rootStack.go.__stack.on[2].fn).toEqual(cbs.cb3) ;
                    expect(eh._rootStack.go.__stack.on[2].eventMode).toEqual(Sway.EventHub.EVENT_MODE.CAPTURING) ;

                    expect(eh._rootStack.go.__stack.on[3].fn).toEqual(cbs.cb4) ;
                    expect(eh._rootStack.go.__stack.on[3].eventMode).toEqual(Sway.EventHub.EVENT_MODE.BUBBLING) ;
                }) ;
                it("with the 'prepend' option", function(){
                    expect(eh.on("go", cbs.cb1)).toBeTruthy() ;
                    expect(eh.on("go", cbs.cb2, { prepend: false})).toBeTruthy() ;
                    expect(eh.on("go", cbs.cb3, { prepend: true })).toBeTruthy() ;
                    expect(eh.on("go", cbs.cb4, { prepend: true })).toBeTruthy() ;

                    expect(eh._rootStack.go.__stack.on.length).toEqual(4) ;
                    expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb4) ;
                    expect(eh._rootStack.go.__stack.on[1].fn).toEqual(cbs.cb3) ;
                    expect(eh._rootStack.go.__stack.on[2].fn).toEqual(cbs.cb1) ;
                    expect(eh._rootStack.go.__stack.on[3].fn).toEqual(cbs.cb2) ;
                }) ;
                it("with 'allowMultiple' set to TRUE", function(){
                    expect(eh.allowMultiple).toBeTruthy() ;                                 // by default this value is set to TRUE
                    expect(eh.setAllowMultiple(true)).toBe(eh) ;                            // chainable
                    expect(eh.on( "bar", cbs.cb1)).toBeTruthy() ;                           // default behavior is to accept
                    expect(eh.on( "bar", cbs.cb1)).toBeTruthy() ;                           // the same callback multiple times
                    expect(eh._rootStack.bar.__stack.on.length).toEqual(2) ;                // check the internal stack
                }) ;
                it("with 'allowMultiple' set to FALSE", function(){
                    expect(eh.setAllowMultiple(false)).toBe(eh) ;                           // chainable
                    expect(eh.on( "bar", cbs.cb2)).toBeTruthy() ;
                    expect(eh.on( "bar", cbs.cb2)).toBeFalsy() ;                            // nope, its registered already
                    expect(eh.on( "bar", cbs.cb2, {})).toBeFalsy() ;                        // idem
                    expect(eh.on( "bar", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeTruthy() ;      // accepted, because it has an event-mode defined
                    expect(eh.on( "bar", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.BOTH})).toBeFalsy() ;            // falsy, because 'BOTH' includes 'CAPTURING' too
                    expect(eh.on( "bar", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeFalsy() ;       // nope
                    expect(eh.on( "bar", cbs.cb2, {eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toBeTruthy() ;       // different event mode

                    expect(eh.on( "bar", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.BOTH})).toBeTruthy() ;
                    expect(eh.on( "bar", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toBeFalsy() ;       // 'BOTH' includes 'CAPTURING'
                    expect(eh.on( "bar", cbs.cb3, {eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toBeFalsy() ;        // and 'BUBBLING'
                    expect(eh.on( "bar", cbs.cb3)).toBeTruthy() ;                                                       // true because no event mode is defined
                }) ;

            }) ;
            it("using 'one'", function(){

            }) ;
            it("with a correct callback count", function(){
                /*
                 Sway.eventHub.on("go", Sway.callbacks.cb1) ;
                 Sway.eventHub.on("go", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
                 Sway.eventHub.on("go", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
                 Sway.eventHub.on("go", Sway.callbacks.cb3) ;
                 Sway.eventHub.on("go", Sway.callbacks.cb4) ;

                 expect(Sway.eventHub.countCallbacks()).toEqual(3) ;
                 expect(Sway.eventHub.countCallbacks("go")).toEqual(3) ;
                 expect(Sway.eventHub.countCallbacks("", { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toEqual(1) ;
                 expect(Sway.eventHub.countCallbacks("go", { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toEqual(1) ;
                 expect(Sway.eventHub.countCallbacks("", { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toEqual(1) ;
                 expect(Sway.eventHub.countCallbacks("go", { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toEqual(1) ;

                 expect(Sway.eventHub.trigger("go")).toEqual(3) ;
                 expect(Sway.eventHub.countTriggers()).toEqual(1) ;
                 expect(Sway.eventHub.countTriggers("go")).toEqual(1) ;
                 */
            }) ;
            it("and be able to remove callbacks using 'off'", function() {
                var on = [
                    { fn: cbs.cb1,   isOne: false }
                    , { fn: cbs.cb1, isOne: true }
                    , { fn: cbs.cb2, isOne: false }
                    , { fn: cbs.cb2, isOne: true }
                    , { fn: cbs.cb2, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BOTH }
                    , { fn: cbs.cb3, isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }
                    , { fn: cbs.cb3, isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }
                ] ;
                eh._rootStack.bar = {
                    __stack: {
                        on: on                              // callback stack
                        , parent: eh._rootStack             // parent namespace/object
                        , triggers: 0                       // count triggers
                        , disabled: false                   // by default the namespace/event is enabled
                    }
                } ;

                expect(eh.off('bar', cbs.cb1)).toEqual(2) ;
                expect(eh.off('bar', cbs.cb1)).toEqual(0) ;
                expect(on[0].fn).toBe(cbs.cb2) ;

                expect(eh.off('bar', cbs.cb2, { isOne: false})).toEqual(1) ;
                expect(on[0].fn).toBe(cbs.cb2) ;
                expect(on[0].isOne).toBeTruthy() ;
                expect(eh.off('bar', cbs.cb2, { isOne: false, eventMode: Sway.EventHub.EVENT_MODE.BOTH })).toEqual(0) ;
                expect(eh.off('bar', cbs.cb2, { isOne: true, eventMode: Sway.EventHub.EVENT_MODE.BOTH })).toEqual(1) ;
                expect(on[0].fn).toBe(cbs.cb2) ;
                expect(on[0].isOne).toBeTruthy() ;

                expect(eh.off('bar', cbs.cb3, { isOne: false})).toEqual(0) ;
                expect(eh.off('bar', cbs.cb3, { isOne: false, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING })).toEqual(1) ;

                expect(eh.off('bar', cbs.cb3, { isOne: false, eventMode: Sway.EventHub.EVENT_MODE.BUBBLING })).toEqual(0) ;
                expect(eh.off('bar', cbs.cb3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING })).toEqual(1) ;

                expect(eh._rootStack.bar.__stack.on.length).toEqual(1) ;
            }) ;
            describe("and triggers them", function(){

                it("without an event mode", function(){
                    expect('bar.foo', { eventMode: null });
                }) ;
                it("in the Capturing event mode", function(){
                    eh.one("go", cbs.cb1) ;
                    expect(eh._rootStack.go.__stack.on.length).toEqual(1) ;
                    expect(eh._rootStack.go.__stack.on[0].fn).toEqual(cbs.cb1) ;
                    expect(eh._rootStack.go.__stack.on[0].isOne).toBeTruthy() ;
                });
                it("in the Bubbling event mode", function(){}) ;
                it("in the Capturing and Bubbling event mode (BOTH)", function(){}) ;

                it("and validate the trigger count", function(){

                });
            });
        });

            /*
        describe("with triggers for", function(){


            describe("registered callbacks", function() {
                it("without an event-mode definition", function() {});
                it("with  callbacks forthe capturing and bubbling phase", function() {}) ;
                it("the capturing and bubbling phase", function() {}) ;
                //expect(eh.countCallbacks('bar')).toEqual(3) ;
            }) ;

        }) ;

        it("with a correct callback/trigger count", function() {
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.on("go", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("go", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.on("go", Sway.callbacks.cb4) ;

            expect(Sway.eventHub.countCallbacks()).toEqual(3) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(3) ;
            expect(Sway.eventHub.countCallbacks("", { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toEqual(1) ;
            expect(Sway.eventHub.countCallbacks("go", { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING})).toEqual(1) ;
            expect(Sway.eventHub.countCallbacks("", { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toEqual(1) ;
            expect(Sway.eventHub.countCallbacks("go", { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING})).toEqual(1) ;

            expect(Sway.eventHub.trigger("go")).toEqual(3) ;
            expect(Sway.eventHub.countTriggers()).toEqual(1) ;
            expect(Sway.eventHub.countTriggers("go")).toEqual(1) ;
        }) ;
        it("with correct capturing and bubbling behavior", function(){
            Sway.eventHub.on( "bar", Sway.callbacks.cb1) ;
            Sway.eventHub.one("bar", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.one("bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.one("bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on( "bar", Sway.callbacks.cb4, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }) ;
            Sway.eventHub.on( "bar", Sway.callbacks.cb4) ;

            expect(Sway.eventHub.trigger("bar", [])).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(['cb1','cb4']) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
        }) ;
        it("with disable/enable functionality", function(){
            Sway.eventHub.on( "bar", Sway.callbacks.cb1) ;
            Sway.eventHub.disable('bar') ;
            expect(Sway.eventHub.trigger("bar", [])).toEqual(0) ;
            Sway.eventHub.enable('bar') ;
            expect(Sway.eventHub.trigger("bar", [])).toEqual(1) ;
        }) ;
    });

    // events with a namespace
    describe("should handle namespaced events", function() {
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
           expect(Sway.eventHub.trigger("forum", 2, {traverse: true} )).toEqual(2) ;
           expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
           expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
           expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;

           expect(Sway.eventHub.trigger("forum", 2, {traverse: true} )).toEqual(1) ;
           expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
           expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
       }) ;
       it("with a correct callback / trigger count", function() {
           // TODO: count for specific event-modes
            Sway.eventHub.on("go", Sway.callbacks.cb1) ;
            Sway.eventHub.one("go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("go", Sway.callbacks.cb3) ;
            Sway.eventHub.one("go.now", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(3) ;
            expect(Sway.eventHub.countCallbacks("go", {traverse: true})).toEqual(4) ;
            Sway.eventHub.trigger('go') ;
            Sway.eventHub.trigger('go.now') ;
            Sway.eventHub.trigger('go') ;
            expect(Sway.eventHub.countCallbacks("go")).toEqual(2) ;
            expect(Sway.eventHub.countCallbacks("go", {traverse: true})).toEqual(2) ;
            expect(Sway.eventHub.countCallbacks("go.now")).toEqual(0) ;
            expect(Sway.eventHub.countTriggers('go')).toEqual(2) ;
            expect(Sway.eventHub.countTriggers('go', {traverse: true})).toEqual(3) ;
            expect(Sway.eventHub.countTriggers('go.now')).toEqual(1) ;
        }) ;
        it("with correct capturing and bubbling behavior", function(){
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;                                                       // not called
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;                                                       // not called
            Sway.eventHub.one("bar", Sway.callbacks.cb1, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;    // called
            Sway.eventHub.one("bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;     // called
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4) ;                                                   // called
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4) ;                                                   // called
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ; // not called
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;  // not called
            expect(Sway.eventHub.trigger("bar.foo", [])).toEqual(4) ;
            expect(Sway.callbacks.cb1.calls.length).toEqual(1) ;        // only in capturing phase
            expect(Sway.callbacks.cb3.calls.length).toEqual(1) ;        // only in capturing phase
            expect(Sway.callbacks.cb4.calls.length).toEqual(2) ;        // only in capturing phase
            expect(Sway.callbacks.cb1).toHaveBeenCalledWith(['cb1','cb4', 'cb4', 'cb3']) ;
        }) ;
        it("with disable/enable functionality", function(){
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb4) ;
            Sway.eventHub.disable("bar", {traverse: true}) ;
            expect(Sway.eventHub.trigger("bar", [])).toEqual(0) ;
            expect(Sway.eventHub.trigger("bar.foo", [])).toEqual(0) ;

            Sway.eventHub.enable("bar.foo") ;
            expect(Sway.eventHub.isDisabled("bar")).toBeTruthy() ;
            expect(Sway.eventHub.isDisabled("bar.foo")).toBeFalsy() ;
            expect(Sway.eventHub.trigger("bar.foo", [])).toEqual(1) ;

            Sway.eventHub.disable("bar.foo") ;
            Sway.eventHub.enable("bar") ;
            expect(Sway.eventHub.trigger("bar", null, {traverse:true})).toEqual(1) ;
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
            Sway.eventHub.one("forum.go1", Sway.callbacks.cb1) ;
            Sway.eventHub.on("forum.go1.now", Sway.callbacks.cb2) ;

            Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
            Sway.eventHub.one("forum.go2", Sway.callbacks.cb4) ;

            expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb1)).toEqual(2) ;
            expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toEqual(1) ;

            expect(Sway.eventHub._rootStack['forum']['go1']['__stack']['on'].length).toEqual(0) ;
            expect(Sway.eventHub._rootStack['forum']['go2']['__stack']['on'].length).toEqual(1) ;
            expect(Sway.eventHub._rootStack['forum']['go2']['__stack']['on'].length).toEqual(1) ;

            expect(Sway.eventHub.off("forum.go1", null, {traverse:true})).toEqual(1) ;

        }) ;

        it("for triggers by namespace", function() {
            Sway.eventHub.on("forum.go1", Sway.callbacks.cb1) ;
            Sway.eventHub.one("forum.go2", Sway.callbacks.cb2) ;
            Sway.eventHub.on("forum.go2", Sway.callbacks.cb3) ;
            Sway.eventHub.one("forum.go1", Sway.callbacks.cb4) ;
            expect(Sway.eventHub.off("forum.go2", Sway.callbacks.cb3)).toBeTruthy() ;
            expect(Sway.eventHub.off("forum.go1", Sway.callbacks.cb4)).toBeTruthy() ;
            expect(Sway.eventHub.trigger("forum", 2, {traverse:true})).toEqual(2) ;
            expect(Sway.callbacks.cb1).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb2).toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb4).not.toHaveBeenCalled() ;

            expect(Sway.eventHub.trigger("forum", 2, {traverse:true} )).toEqual(1) ;
            expect(Sway.callbacks.cb1.callCount).toEqual(2) ;
            expect(Sway.callbacks.cb2.callCount).toEqual(1) ;
        }) ;
        it("with a correct callback / trigger count", function() {
            // TODO: count for specific event-modes
            Sway.eventHub.on("lets", Sway.callbacks.cb1) ;
            Sway.eventHub.on("lets.go", Sway.callbacks.cb2) ;
            Sway.eventHub.on("lets.go.now", Sway.callbacks.cb3) ;
            Sway.eventHub.on("lets.go.now", Sway.callbacks.cb4) ;
            Sway.eventHub.on("lets.go.now", Sway.callbacks.cb4) ;
            Sway.eventHub.on("lets.go.for", Sway.callbacks.cb4) ;

            // count callbacks
            expect(Sway.eventHub.countCallbacks()).toEqual(6) ;
            expect(Sway.eventHub.countCallbacks('lets')).toEqual(1) ;
            expect(Sway.eventHub.countCallbacks('lets.go')).toEqual(1) ;
            expect(Sway.eventHub.countCallbacks('lets.go.now')).toEqual(3) ;
            expect(Sway.eventHub.countCallbacks('lets.go.for')).toEqual(1) ;

            expect(Sway.eventHub.countCallbacks('', {traverse: true})).toEqual(6) ;
            expect(Sway.eventHub.countCallbacks(null, {traverse: true})).toEqual(6) ;
            expect(Sway.eventHub.countCallbacks('lets', {traverse: true})).toEqual(6) ;
            expect(Sway.eventHub.countCallbacks('lets.go', {traverse: true})).toEqual(5) ;
            expect(Sway.eventHub.countCallbacks('lets.go.now', {traverse: true})).toEqual(3) ;
            expect(Sway.eventHub.countCallbacks('lets.go.for', {traverse: true})).toEqual(1) ;

            // count triggers
            Sway.eventHub.trigger('lets') ;
            Sway.eventHub.trigger('lets.go') ;
            Sway.eventHub.trigger('lets.go') ;
            Sway.eventHub.trigger('lets.go.now') ;
            Sway.eventHub.trigger('lets.go.for') ;

            expect(Sway.eventHub.countTriggers()).toEqual(5) ;
            expect(Sway.eventHub.countTriggers('lets')).toEqual(1) ;
            expect(Sway.eventHub.countTriggers('lets.go')).toEqual(2) ;
            expect(Sway.eventHub.countTriggers('lets.go.now')).toEqual(1) ;
            expect(Sway.eventHub.countTriggers('lets.go.for')).toEqual(1) ;

            expect(Sway.eventHub.countTriggers(null, {traverse: true})).toEqual(5) ;
            expect(Sway.eventHub.countTriggers('', {traverse: true})).toEqual(5) ;
            expect(Sway.eventHub.countTriggers('lets', {traverse: true})).toEqual(5) ;
            expect(Sway.eventHub.countTriggers('lets.go', {traverse: true})).toEqual(4) ;
            expect(Sway.eventHub.countTriggers('lets.go.now', {traverse: true})).toEqual(1) ;
            expect(Sway.eventHub.countTriggers('lets.go.for', {traverse: true})).toEqual(1) ;
        }) ;
        it("with correct capturing and bubbling behavior", function(){
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb1, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb1, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb3) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb3) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;

            expect(Sway.eventHub.trigger("bar", [])).toEqual(2) ;
            expect(Sway.callbacks.cb1.calls.length).toEqual(2) ;
            expect(Sway.callbacks.cb2).not.toHaveBeenCalled() ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;

            expect(Sway.eventHub.trigger("bar.foo", [])).toEqual(4) ;
            expect(Sway.callbacks.cb1.calls.length).toEqual(4) ;
            expect(Sway.callbacks.cb2.calls.length).toEqual(2) ;
            expect(Sway.callbacks.cb2).toHaveBeenCalledWith(['cb1','cb2', 'cb2', 'cb1']) ;
            expect(Sway.callbacks.cb3).not.toHaveBeenCalled() ;

            expect(Sway.eventHub.trigger("bar.foo.bar", [])).toEqual(6) ;
            expect(Sway.callbacks.cb1.calls.length).toEqual(6) ;
            expect(Sway.callbacks.cb2.calls.length).toEqual(4) ;
            expect(Sway.callbacks.cb3.calls.length).toEqual(2) ;
            expect(Sway.callbacks.cb3).toHaveBeenCalledWith(['cb1','cb2', 'cb3', 'cb3', 'cb2', 'cb1']) ;
        }) ;
        it("with disable/enable functionality", function(){
            Sway.eventHub.on("bar", Sway.callbacks.cb1) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb1, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar", Sway.callbacks.cb1, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
            Sway.eventHub.on("bar.foo", Sway.callbacks.cb2, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING}) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb3) ;
            Sway.eventHub.on("bar.foo.bar", Sway.callbacks.cb4, { eventMode: Sway.EventHub.EVENT_MODE.BOTH}) ;

            Sway.eventHub.disable("bar", { traverse: true}) ;                           // disable everything
            expect(Sway.eventHub.trigger("bar")).toEqual(0) ;
            expect(Sway.eventHub.trigger("bar.foo")).toEqual(0) ;
            expect(Sway.eventHub.trigger("bar.foo.bar")).toEqual(0) ;
            expect(Sway.eventHub.isDisabled("bar")).toBeTruthy() ;
            expect(Sway.eventHub.isDisabled("bar.foo")).toBeTruthy() ;
            expect(Sway.eventHub.isDisabled("bar.foo.bar")).toBeTruthy() ;

            Sway.eventHub.enable("bar.foo") ;                                           // only enable bar.foo
            expect(Sway.eventHub.isDisabled("bar")).toBeTruthy() ;
            expect(Sway.eventHub.isDisabled("bar.foo")).toBeFalsy() ;                   // it should be enabled
            expect(Sway.eventHub.isDisabled("bar.foo.bar")).toBeTruthy() ;
            expect(Sway.eventHub.trigger("bar", null, {traverse: true})).toEqual(0) ;         // still disabled
            expect(Sway.eventHub.trigger("bar.foo", null, {traverse: true})).toEqual(1) ;     // should only trigger cb2 (once)

            Sway.eventHub.enable("bar") ;
            expect(Sway.eventHub.trigger("bar", null, {traverse: true})).toEqual(2) ;
            expect(Sway.eventHub.trigger("bar.foo", null, {traverse: true})).toEqual(3) ;
            expect(Sway.eventHub.trigger("bar.foo.bar", null, {traverse: true})).toEqual(0) ;

            Sway.eventHub.enable("bar", {traverse: true}) ;
            expect(Sway.eventHub.isDisabled("bar.foo.bar")).toBeFalsy() ;
            expect(Sway.eventHub.trigger("bar", null, {traverse: true})).toEqual(3) ;
        }) ;
    }) ;
    */
});
