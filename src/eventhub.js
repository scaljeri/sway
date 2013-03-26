window.Sway = window.Sway || {} ; // make sure it exists

(function(Ns){
    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     * Events can be namespaced too, checkout the jQuery <a href="http://docs.jquery.com/Namespaced_Events ">documentation</a> on how to use these namespaces.
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
         * Trigger one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and
         * namespaces will be triggered.
         *
         * @method trigger
         * @param {string} eventName    name of the event or namespace
         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function
         * @return {Number} the count of triggered callbacks
         * @example
         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ; // trigger the 'update' event inside the 'ui' namespace
         Sway.eventHub.trigger('ui', {authenticated: true} ) ;        // trigger all nested events and namespaces inside the 'ui' namespace
         */
        trigger: function(eventName, data){
            var list = getStack.call(this, eventName) ;                 // load the stack for this namespace
            return triggerEvent.call(this, list, data) ;                // triggerEvent does the work of triggering everything (nested events & namespaces)
        }

        /**
         * Register a callback to a specific event. Callbacks are executed in the order of
         * registration. Set 'prepend' to TRUE to add the callback in front of the others.
         *
         * @method on
         * @param {string} eventName
         * @param {function} callback
         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.
         * @example
         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;
         Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;
         */
        , on: function(eventName, callback, prepend) {
            if ( checkInput(eventName, callback) ) { // just to make sure
                var list = createStack.call(this, eventName) ;

                list.__stack.on[prepend ? 'unshift':'push'](callback) ;
            }
        }

        /**
         * Register a callback to a specific event. This function is identical to {{#crossLink "Sway.EventHub/on:method"}}{{/crossLink}}
         * except that this callback is removed from the list after it has been triggered.
         *
         * @method one
         * @param {string} eventName
         * @param {function} callback
         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.
         */
        , one: function(eventName, callback, prepend) {
            if ( checkInput(eventName, callback)) {
                var list = createStack.call(this, eventName) ;
                list.__stack.on[prepend ? 'unshift':'push'](callback) ;

                // the 'one' stack is used to determine (after a trigger) which callbacks to remove from the 'on' stack
                list.__stack.one[prepend ? 'unshift':'push'](callback) ;
            }
        }

        /**
         * count the registered callbacks for an event or namespace
         *
         * @method count
         * @param {sting} [eventName] if empty all registered callbacks are counted
         * @return {Number} the count of callback functions inside 'eventName'
         */
        , count: function(eventName) {
            var list = getStack.call(this, eventName)
                , parts = eventName

            // TODO
            return 10 ;
        }

        /**
         * Removes the given callback for a specific event.
         *
         * @method off
         * @param {string} eventName
         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested
         * namespaces inside 'eventName' are removed
         * @return {Number} the count of removed callback functions
         * @example
         Sway.eventHub.off('ui.update', this.update) ;
         Sway.eventHub.off('ui') ;
         */
        , off: function(eventName, callback) {
            var stack = getStack.call(this, eventName) ;
            return removeFromStack(stack, callback) ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    function checkInput(eventName, callback) {
        if ( !!eventName === true && typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            return true ;
        }
        else if ( Ns.DEBUG ) { // Wrong...
            console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
            return false ;
        }
    }

    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    function removeFromStack(stack, callback) {
        var retVal = 0                                              // number of removed callbacks
            , callbacks                                             // a stack with 'on' and 'one' (maybe)
            , ns ;                                                  // loop var

        if ( !stack ) {                                             // no data available --> done
            return 0 ;                                              // and zero callbacks removed (no actions taken)
        }

        if ( callback ) {                                           // remove a specific callback
            for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)
                callbacks = stack[ns] ;
                if ( callbacks.on ) {                               // are we there yet, are we there yet
                    retVal += removeCallback(callbacks.on,  callback) ; // YES
                    retVal += removeCallback(callbacks.one, callback) ; // YES
                }
                else {                                              // NO, its a namesapace -> recurstion
                   retVal += removeFromStack.call(this, stack[callbacks], callback ) ;
                }
            }
        }
        else { // remove a whole namespace (no callback defined)
            retVal += removeNameSpace.call(this, stack)   ;
        }
        return retVal ;                                         // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    function removeCallback(list, callback){
        var position                                            // position on the stack
            , retVal = 0 ;                                      // number of removed callbacks

        position = list.indexOf(callback) ;         // is the callback in the callbacks list
        while( position > -1 ) {                        // but the callback can be present multiple times!
            retVal ++ ;                                // found one match
            list.splice(position, 1) ;              // remove callback from the stack

            position = list.indexOf(callback) ;     // prepare the while check to see if more actions are required
        }
    }

    function removeNameSpace(stack) {
        var retVal = 0                                      // number of removed callbacks
            , cb                                            // loop var

        for( cb in stack )  {                               // delete all elements from the stack (and we cannot do stack = {} ;)
            retVal += this.count(callbacks[cb]) ;           // and count all callbacks in this namespace
            delete callbacks[cb] ;                          // cleanup
        }

        return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    function getStack(namespace) {
        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        for( i = 0; i < parts.length; i++ ) {
            if ( ! stack[parts[i]]) {
                return null ;                               // it does not exist -> done
            }
            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack.
     * Furthermore, it the eventName is new, it is created
     */
    function createStack(namespace) {
        var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        for(i = 0; i < parts.length ; i++) {                // traverse the stack
            if ( !stack[parts[i]] ){                        // if not exists
                stack[parts[i]] = {} ;                      // --> create it
            }
            stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }

        if ( !stack.__stack) {                              // the namespace holding the callbacks is called __stack
            stack.__stack = {                               // These callbacks are stored into a list called
                on: []                                      // 'on' and
                , one: []                                   // 'one'
            } ;
        }
        return stack ;
    }



    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively.
     */
    function triggerEvent(namespace, data) {
        var retVal = 0 ;                                // the number of called callback function
        if ( namespace ) {
            if ( namespace.on ) {                       // found a namespace with callbacks (if any)
                namespace.on.forEach( function(c, i) {  // loop through all callbacks
                    retVal++ ;                          // count the number of triggered callbacks
                    c(data) ;                           // trigger each callback function
                }) ;
                namespace.one.length = 0 ;              // all 'one' callbacks have been called --> cleanup
            }
            else {                                      // found a deeper nested namespace
                for( ns in namespace ) {
                    retVal += triggerEvent.call(this, namespace[ns], data) ;
                }
            }
        }
        return retVal ;
    }

    Ns.EventHub = eh ;

})(window.Sway) ;