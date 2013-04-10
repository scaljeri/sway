window.Sway = window.Sway || {} ; // make sure it exists

(function(Ns){
    var DEFAULTS = {
        CAPTURING: 'capturing'
        , BUBBLING: 'bubbling'
    }
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
                value: { __stack: {count: 0, triggers: 0} }
                , enumerable: false // hide it
            }
        ) ;
        Object.defineProperty(this, '_eventType',
            {
                value: {}
                , enumerable: false // hide it
            }
        ) ;
    } ;

    eh.prototype = {
        /**
         * Change the behavior of an event. By default, only the callbacks registered to an event are triggered. But the event can
         * also be set to 'capturing' or 'bubbling' mode. Bubbling means the trigger starts at the root of the namespaces and bubbles
         * up to the event in question. Capturing does the opposite.
         *
         * @method defineEvent
         * @param eventName name of the event
         * @param etype event type. Supported options are: 'capturing' and 'bubbling'
         */
        defineEvent: function(eventName, etype) {
            if ( DEFAULTS.CAPTURING === etype || DEFAULTS.BUBBLING === etype ) {
                this._eventType[eventName] = etype ;
            }
            else {
                console.warn("Event type '" + etype + "' for '" + eventName + "' does not exist!") ;
            }
        }
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
        , trigger: function(eventName, data){
            var list = getStack.call(this, eventName) ;                 // load the stack for this namespace
            return triggerEvent(list, data) ;                // triggerEvent does the work of triggering everything (nested events & namespaces)
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
            return addCallbackToStack.call(this, eventName, callback, prepend) !== null ;
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
            var stack = addCallbackToStack.call(this, eventName, callback, prepend) ;
            if ( stack ) { // if the stack exists, the callback was added to the 'on' list
                stack.__stack.one[prepend ? 'unshift':'push'](callback) ;   // and it should of course also be added to the 'one' list
                return true ;
            }
            return false ;
        }

        /**
         * count the registered callbacks for an event or namespace
         *
         * @method count
         * @param {sting} [eventName] if empty all registered callbacks are counted
         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists
         */
        , count: function(eventName) {
            var stack = getStack.call(this, eventName) ;
            return sumPropertyInNamespace(stack, 'count') ;
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

        /**
         * returns the the trigger count for this event
         * @method triggerCount
         * @param {sting} [eventName] the event name
         * @return {Number} trigger count. -1 is returned if the event name does not exist
         */
        , triggerCount: function(eventName) {
            var stack = getStack.call(this, eventName) ;
            return sumPropertyInNamespace(stack, 'triggers') ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    function sumPropertyInNamespace(stack, property) {
        var i
            , sum = 0 ;

        for( i in stack ) {
            if ( i === "__stack" ) {
                sum += stack[i][property] ;
            }
            else {
                sum += sumPropertyInNamespace(stack[i], property) ;
            }
        }
        return sum ;
    }

    function addCallbackToStack(eventName, callback, prepend) {
        var stack ;

        if ( checkInput(eventName, callback)) {                             // validate input
            stack = createStack.call(this, eventName) ;                      // get stack of 'eventName'
            if ( stack.__stack.on.indexOf(callback) === -1 ) {               // check if the callback is not already added
                stack.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback
                stack.__stack.count ++ ;
                return stack ;
            }
        }
        return null ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    function checkInput(eventName, callback) {
        if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
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

        if ( callback ) {                                           // remove a specific callback
            for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)
                callbacks = stack[ns] ;
                if ( callbacks.on ) {                               // are we there yet, are we there yet
                    retVal += removeCallback(callbacks.on,  callback) ; // YES
                    callbacks.count -= retVal ;
                    removeCallback(callbacks.one, callback) ; // YES
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
        var position                                        // position on the stack
            , retVal = 0 ;                                  // number of removed callbacks

        position = list.indexOf(callback) ;                 // is the callback in the callbacks list
        while( position > -1 ) {                            // but the callback can be present multiple times!
            retVal ++ ;                                     // found one match
            list.splice(position, 1) ;                      // remove callback from the stack

            position = list.indexOf(callback) ;             // prepare the while check to see if more actions are required
        }
        return retVal ;
    }

    /*
       Remove a whole namespace.
     */
    function removeNameSpace(stack) {
        var retVal = 0                                      // number of removed callbacks
            , i ;                                           // loop var

        for( i in stack )  {                                // delete all elements from the stack (and we cannot do stack = {} ;)
            retVal += stack[i].count ;
            delete stack[i] ;                               // cleanup
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
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    function createStack(namespace) {
        var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        for(i = 0; i < parts.length ; i++) {                // traverse the stack
            if ( !stack[parts[i]] ){                        // if not exists --> create it
                stack[parts[i]] = {
                    __stack: {                              // holds all info for this namespace (not the child namespaces)
                        on: []                              // callback stack
                        , one: []                           // callbacks which are triggered only once
                        , parent: stack                     // parent namespace/object
                        , count: 0                          // count callbacks in this namespace
                        , triggers: 0                      // count triggers
                    }
                } ;
            }
            stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        return stack ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively.
     */
    function triggerEvent(namespaces, data) {
        var namespace                                               // current namespace in the loop
            , retVal = 0                                            // the number of called callback function
            , ns                                                    // loop index
            , i                                                     // loop index
            , callback ;                                            // callback from the on list

        for( ns in namespaces ) {
            namespace = namespaces[ns] ;

           if ( namespace.on ) {                                    // special namespace (it hold 'on' and 'one')
               namespace.triggers ++ ;
               for( i = namespace.on.length -1; i >= 0; i-- ) {     // loop through all callbacks
                  callback = namespace.on[i] ;
                  retVal ++ ;                                       // count this trigger
                  callback(data) ;                                  // call the callback
                   if ( namespace.one.indexOf(callback) > -1 ) {    // check if it is a 'one' callback
                       namespace.count -= removeCallback(namespace.on, callback) ;     // YES -> remove it from 'on'
                   }
               }
               namespace.one.length = 0 ;                           // all 'one' callbacks have been called --> cleanup
           }
           else {                                                   // found a deeper nested namespace
                retVal += triggerEvent(namespace, data) ;           // nested namespaces
           }
        }
        return retVal ;
    }

    Ns.EventHub = eh ;

})(window.Sway) ;