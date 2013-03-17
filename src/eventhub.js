window.Sway = window.Sway || {} ; // make sure it exists

(function(Ns, $){
    var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }

    /**
     * Manages Events in an Event-driven system.
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
         * @param {boolean} [prepend] if true, this callback is executed first if the event is triggered
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
         * @param {boolean} [prepend] if true, this callback is executed first if the event is triggered
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
     * Returns the callbacks for an eventName. If the eventName is not registered yet, it will
     * be added to this._events. If needed, namespaces are created too!
     */
    function getCallbacks(eventName) {
        var parts,                  // if the event is namespaced, it will hold all the namespaces
            events = this._events,  // used to create new namespaces (if needed)
            i ;                     // for-loop var

        if ( str.match(/\./) ) { // namespaced event?
            parts = eventName.split('.') ;
            eventName = parts.pop() ;

            for(i = 0; i < parts.length ; i++) { // traverse the events object
                if ( !events[parts[i]] ) {
                    events[parts[i]] = {} ;
                }
                events = events[parts[i]] ;
            }
        }

        if ( events[eventName]) {
            event[eventName] =  {
                on: []
                , one: []
            } ;
        }
        return events[eventName] ;
    }


    function triggerEvent(eventName, data) {
        // TODO: call all callbacks for "eventName"

    }

    Ns.EventHub = eh ;

})(window.Sway, jQuery) ;