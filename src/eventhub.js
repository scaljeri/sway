window.Sway = window.Sway || {} ; // make sure it exists

(function(Ns){
    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     *
     * // TODO: tell about namespaces
     *
     * @class Sway.EventHub
     * @constructor
     */
    var eh = function() {
        Object.defineProperty(this, '_rootStack',
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
            var list = getCallbackStack.call(this, eventName) ;
            return triggerEvent.call(this, list, data) ;
        }
        /**
         * Register a callback to a specific event. Callbacks are executed in the order of
         * registration. Use the 'position' parameter to change this behavior. Note that "before" and "after" are just different
         * stacks, executed before/after the normal execution flow.
         *
         * @method on
         * @param {string} eventName
         * @param {function} callback
         * @param {boolean} [prepend] the callback is placed before all other registered callbacks. They will be executed in this
         * order when the event is trigger
         * @example
            Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;
            Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;
         */
        , on: function(eventName, callback, prepend) {
            var list = createCallBackStack.call(this, eventName) ;

            list.__stack.on[prepend ? 'unshift':'push'](callback) ;
        }
        /**
         * Register a callback to a specific event. This function is identical to {{#crossLink "Sway.EventHub/on:method"}}{{/crossLink}}
         * except that this callback is removed from the list after it is called
         *
         * @method one
         * @param {string} eventName
         * @param {function} callback
         * @param {boolean} [prepend] the callback is placed before all other registered callbacks. They will be executed in this
         * order when the event is trigger
         */
        , one: function(eventName, callback, prepend) {
            var list = createCallBackStack.call(this, eventName) ;
            list.__stack.on[prepend ? 'unshift':'push'](callback) ;

            // the 'one' stack is used to determine (after a trigger) which callbacks to remove from the 'on' stack
            list.__stack.one[prepend ? 'unshift':'push'](callback) ;
        }
        /**
         * Removes the given callback for a specific event.
         *
         * // TODO: should be possible to remove namespaces too, which makes the param 'callback' optional!
         *
         * @method off
         * @param {string} eventName
         * @param {function} callback
         * @example
            Sway.eventHub.off('ui.update', this.update) ;
         */
        , off: function(eventName, callback) {
            var i, retVal = false
                , list = createCallBackStack.call(this, eventName) ;

            return removeCallback(callback, list) ;

            /*
            for( i = 0; i < list.length; i++ ) {
               if ( list && list.__stack ) {
                   if ( removeCallback.call(this, callback, list.__stack) ) {
                       retVal = true ;
                   }
               }
               else {

               }
            }
            if ( list && list.__stack ) {
            }
            return false ; // could not remove callback
            */
        }
    } ;

    /*
        Private helper function which removes a callback function for a specific event
     */
    function removeCallback(callback, callbacks) {
        var position, cb, retVal = 0 ;

        if ( callbacks && callbacks.on ) {
            position = callbacks.on.indexOf(callback) ;
            while( position != -1 ) {
                retVal  ++ ;
                callbacks.on.splice(position, 1) ;
                position = callbacks.one.indexOf(callback) ;
                if ( position != -1 ) {
                    callbacks.one.splice(position, 1) ;
                }
                position = callbacks.on.indexOf(callback) ;
            }
        }
        else {
           for( cb in callbacks ) {
               retVal += removeCallback.call(this, callback, callbacks[cb]) ;
           }
        }
        return retVal ;
    }

    function getCallbackStack(eventName) {
        var parts = eventName.split('.')
            , stack = this._rootStack
            , i ;

        for( i = 0; i < parts.length; i++ ) {
            stack = stack[parts[i]] ;
        }
        return stack ;
    }
    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack.
     * Furthermore, it the eventName is new, it is created
     */
    function createCallBackStack(eventName) {
        var parts = eventName.split('.'),                  // hold the event namespaces
            stack = this._rootStack,  // used to create new namespaces
            i ;                     // for-loop var

        for(i = 0; i < parts.length ; i++) { // traverse the events object
            if ( !stack[parts[i]] ){
                stack[parts[i]] = {} ;
            }
            stack = stack[parts[i]] ;
        }

        if ( !stack.__stack) {
            stack.__stack = {
                on: []
                , one: []
            } ;
        }
        return stack ;
    }



    /*
    Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
    To traverse this namespace, this function is called recursively.
     */
    function triggerEvent(namespace, data) {
        var retVal = 0 ;
        if ( namespace ) {
            if ( namespace.on ) {
                namespace.on.forEach( function(c, i) { // trigger each callback function
                    retVal++ ;
                    c(data) ;
                }) ;
                namespace.one.forEach(function(c, i) { // remove 'one' callbacks
                    removeCallback.call(this, c, namespace) ;
                }.bind(this)) ;
            }
            else { // found a deeper nested namespace
                for( ns in namespace ) {
                    retVal += triggerEvent.call(this, namespace[ns], data) ;
                }
            }
        }
        return retVal ;
    }

    Ns.EventHub = eh ;

})(window.Sway) ;