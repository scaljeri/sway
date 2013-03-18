window.Sway = window.Sway || {} ; // make sure it exists

(function(Ns, $){
    var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }

    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     *
     * // TODO: tell about namespaces
     *
     * @class Sway.EventHub
     * @constructor
     */
    var eh = function() {
        Object.defineProperty(this, '_events',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
    }

    eh.prototype = {
        /**
         * Trigger event
         *
         * @method trigger
         * @param {string} eventName
         * @param data
         * @example
            Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;
         */
       trigger: function(eventName, data){
            requestAnimFrame( triggerEvent.bind(this, data) ) ; // yield
        }
        /**
         * Register a callback to a specific event. Callbacks are executed in the order of
         * registration. Use the 'position' parameter to change this behavior. Note that "before" and "after" are just different
         * stacks, executed before/after the normal execution flow.
         *
         * @method on
         * @param {string} eventName
         * @param {boolean} [prepend] the callback is placed before all other registered callbacks. They will be executed in this
         * order when the event is trigger
         * @example
            Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;
            Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;
         */
       , on: function(eventName, callback, prepend) {
            var event = registerEvent.call(this, eventName) ;

            event.on[prepend ? 'unshift':'push'](callback) ;
        }
        /**
         * Register a callback to a specific event. This function is identical to {{#crossLink "Sway.EventHub/on:method"}}{{/crossLink}}
         * except that this callback is removed from the list after it is called
         *
         * @method one
         * @param {string} eventName
         * @param {boolean} [prepend] the callback is placed before all other registered callbacks. They will be executed in this
         * order when the event is trigger
         */
       , one: function(eventName, callback, prepend) {
            var callbacks = registerEvent.call(this, eventName) ;
            this.on(eventName, callback, position) ;
            event.one[prepend ? 'unshift':'push'](callback) ;
        }
        /**
         * Removes the given callback for a specific event.
         *
         * @method off
         * @param {string} eventName
         * @example
            Sway.eventHub.off('ui.update', this.update) ;
         */
       , off: function(eventName, callback) {
            var callbacks = registerEvent.call(this, eventName) ;
            removeCallback(callback, callbacks) ;
       }

    } ;

    /*
        Private helper function which removes a callback function for a specific event
     */
    function removeCallback(callback, callbacks) {
        var position = list.on.indexOf(callback) ;
        if ( position != -1 ) {
            list.on.before.splice(position, 1) ;
        }
        position = list.one.indexOf(callback) ;
        if ( position != -1 ) {
            list.one.before.splice(position, 1) ;
        }
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * eventName called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack.
     * Furthermore, it the eventName is new, it is created
     */
    function getCallbacks(eventName) {
        var parts,                  // hold the event namespaces
            events = this._events,  // used to create new namespaces
            i ;                     // for-loop var

        if ( str.match(/\./) ) { // namespaced event?
            parts = eventName.split('.') ;

            for(i = 0; i < parts.length ; i++) { // traverse the events object
                if ( !events[parts[i]] ) {
                    events[parts[i]] = {} ;
                }
                events = events[parts[i]] ;
            }
        }

        if ( !events.__stack) {
            event.__stack = {
                on: []
                , one: []
            } ;
        }
        return events ;
    }

    function triggerEvent(eventName, data) {
        var ns,
            namespaces = getCallbacks.call(this, eventName) ;

        for( ns in namespaces ) {
            doTriggerForNS.call(this, ns) ;
        }
    }

    /*
    Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
    To traverse this namespace, this function is called recursively.
     */
    function doTriggerForNS(namespace) {
        if ( namespace.on ) { // found the callbacks
            namespace.on.forEach( function(c, i) {
                c(data) ;
            }) ;
            namespace.one.forEach(function(c, i) {
                this.off(c) ;
            }.bind(this)) ;
        }
        else { // found a deeper nested namespace
            for( ns in namespaces ) {
                doTriggerForNS.call(this, ns) ;
            }
        }
    }

    Ns.EventHub = eh ;

})(window.Sway, jQuery) ;