window.Sway = window.Sway || {} ; // make sure it exists

(function(ns){
    var DEFAULTS = {
        /**
         * Contains available event modes. For example, if <tt>bar.foo</tt> is triggered, both event modes do the opposite
         *
         *                    | |                                     / \
         *     ---------------| |-----------------     ---------------| |-----------------
         *     | bar          | |                |     | bar          | |                |
         *     |   -----------| |-----------     |     |   -----------| |-----------     |
         *     |   |bar.foo   \ /          |     |     |   |bar.foo   | |          |     |
         *     |   -------------------------     |     |   -------------------------     |
         *     |        Event CAPTURING          |     |        Event BUBBLING           |
         *     -----------------------------------     -----------------------------------
         *
         * The event model implemented in this class does both, going from <tt>bubbling</tt> to the execution of all callbacks in <tt>bar.foo</tt>, then back in <tt>capturing</tt> mode
         *
         *                                   | |  / \
         *                  -----------------| |--| |-----------------
         *                  | bar            | |  | |                |
         *                  |   -------------| |--| |-----------     |
         *                  |   |bar.foo     \ /  | |          |     |
         *                  |   --------------------------------     |
         *                  |               event model              |
         *                  ------------------------------------------
         *
         *     eventHub.on('bar.foo', myFunc1) ;
         *     eventHub.on('bar', myFunc2, Sway.EventHub.EVENT_MODE.CAPTURING) ;
         *     eventHub.on('bar', myFunc3, Sway.EventHub.EVENT_MODE.BUBBLING) ;
         *     eventHub.on('bar', myFunc4, Sway.EventHub.EVENT_MODE.BOTH) ;
         *     eventHub.trigger('bar.foo') ; // -> callback execution order: myFunc3, myFunc4, myFunc1, myFunc2 and myFunc4
         *
         * @property {Object} EVENT_MODE
         * @static
         * @example
         */
        EVENT_MODE: {
            /**
             * Defines the capturing event mode
             * @property {String} EVENT_MODE.CAPTURING
             * @static
             */
            CAPTURING:  'capture'           // event goes from root to target
            /**
             * Defines the bubbling event mode
             * @property {String} EVENT_MODE.BUBBLING
             * @static
             */
            , BUBBLING: 'bubble'            // event goes from target to root
            /**
             * Represent both capturing and bubbling event modes
             * @property {String} EVENT_MODE.ALL
             * @static
             */
            , BOTH: 'both'
        }
        /* PRIVATE PROPERTY
         * Default setting, to allow the same callback to be registered multiple times to the same event
         */
        , ALLOW_MULTIPLE: true
    }
    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     * Events can be namespaced too.
     *
     * Namespaces are separated by a dot, like
     *
     *     bar.foo1
     *     bar.foo2
     *     bar.bar1.foo1
     *
     * A Namespace and an Eventname are actually more or less the same thing:
     *
     *     eventHub.on('bar', myFunc1) ;
     *     eventHub.on('bar.foo1', myFunc2) ;
     *     eventHub.on('bar.bar1', myFunc3) ;
     *     eventHub.on('bar.bar1.foo1', myFunc4) ;
     *
     * The advantage of namespaced events is that it facilitates triggering groups of events
     *
     *     eventHub.trigger('bar') ;        // --> triggers: myFunc1, myFunc2, myFunc3 and myFunc4
     *     eventHub.trigger('bar.bar1');    // --> triggers: myFunc3 and myFunc4
     *
     * @class Sway.EventHub
     * @constructor
     * @param {Object} [options] configuration parameters
     *      @param {Boolean} [options.allowMultiple] accept multiple registrations of a function for the same event name
     */
        , eh = function(options) {
            Object.defineProperty(this, '_rootStack',
                {
                    value: { __stack: { triggers: 0, on:[], one:[]} }
                    , enumerable: false // hide it
                }
            ) ;
            Object.defineProperty(this, '_eventNameIndex',
                {
                    value: 0
                    , enumerable: false // hide it
                    , writable: true    // otherwise ++ will not work
                }
            ) ;
            this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE ;
        } ;

    eh.EVENT_MODE = DEFAULTS.EVENT_MODE ;                   // set static properies

    eh.prototype = {
        /**
         * Generates an unique event name
         * @method generateUniqueEventName
         * @return {String}
         */
        generateUniqueEventName: function() {
            return '--eh--' + this._eventNameIndex++ ;     // first event-name will be: --eh--0
        }

        , setAllowMultiple: function(state) {
            this.allowMultiple = state ;
        }
        /**
         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and
         * namespaces will be triggered.
         *
         * @method trigger
         * @param {string} eventName    name of the event or namespace
         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function
         * @param {Opbject} [options] configuration
         *      @param {String} [options.traverse=false] trigger all callbacks in nested namespaces
         * @return {Number} the count of triggered callbacks
         * @example
         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace
         Sway.eventHub.trigger('ui', {authenticated: true} ) ;                      // trigger all nested events and namespaces inside the 'ui' namespace
         */
        , trigger: function(eventName, data, options){
            var retVal = 0
                , namespace ;
            if ( (namespace = getStack.call(this, eventName)) ) {                   // check if the eventName exists
                retVal = triggerEventCapture.call(this, eventName||'', data) +      // NOTE that eventName can be empty!
                         triggerEvent(namespace, data, options||{}) +
                        ((eventName||'').match(/\./) !== null ? triggerEventBubble(namespace, data) : 0) ;

                namespace.__stack.triggers ++ ;                                     // count the trigger
                namespace.__stack.one = [] ;                                        // cleanup
            }
            return retVal ;                                                         // return the number of triggered callback functions
        }

        /**
         * Register a callback for a specific event. Callbacks are executed in the order of
         * registration. Set 'prepend' to TRUE to add the callback in front of the others. With the 'options'
         * parameter it is also possible to execute the callback in a capturing or bubbling phase.
         *
         * @method on
         * @param {String} eventName
         * @param {Function} callback
         * @param {Object} [options] configuration
         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.
         *      @param {String} [options.eventMode] the event mode for which the callback is triggered too. Available modes are
         *          <tt>capture</tt> and <tt>bubble</tt>
         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered
         * @example
         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;
         Sway.eventHub.on( 'ui.update', this.update.bind(this), {prepend: true, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING} ) ;
         */
        , on: function(eventName, callback, options) {
            return addCallbackToStack.call(this, eventName, callback, options||{}) !== null ;
        }


        /**
         * Register a callback for a specific event. This function is identical to {{#crossLink "Sway.EventHub/on:method"}}{{/crossLink}}
         * except that this callback is removed from the list after it has been triggered.
         *
         * @method one
         * @param {string} eventName
         * @param {function} callback
         * @param {Object} [options] configuration
         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.
         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are
         *          <tt>capture</tt> and <tt>bubble</tt>
         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered
         */
        , one: function(eventName, callback, options) {
            var obj = addCallbackToStack.call(this, eventName, callback, options||{}) ;
            if ( obj ) { // if obj exists, the callback was added.
                obj.isOne = true ;
            }
            return obj !== null ;
        }

        /**
         * Removes the given callback for a specific event. However, if a callback is registered with an 'eventMode', the
         * callback can only be removed if that eventMode is specified too!
         *
         * @method off
         * @param {string} eventName
         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested
         * namespaces inside 'eventName' are removed
         * @param {Object}
         *      @param {Boolean} [traverse=false] traverse all nested namespaces
         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are
         * @return {Number} the count of removed callback functions
         * @example
         Sway.eventHub.off('ui.update', this.update) ;
         Sway.eventHub.off('ui.update', this.update, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
         Sway.eventHub.off('ui') ;
         */
        , off: function(eventName, callback, options) {
            var stack = getStack.call(this, eventName) ;
            return removeFromNamespace(stack, callback, options||{}) ;
        }

        /**
         * count the registered callbacks for an event or namespace
         *
         * @method countCallbacks
         * @param {Sting} eventName the event name for which all registered callbacks are counted (including nested event names).
         * @param {Object} [options] determine the count behavior
         *      @param {String} [eventMode] the event mode; Sway.EventHub.CAPTURING or Sway.EventHub.BUBBLE
         *      @param {Boolean} [traverse=false] traverse all nested namepsaces
         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists
         * TODO: etype is not used
         */
        , countCallbacks: function(eventName, options) {
            if ( !eventName ) { // => count all callback function within this namespace
                (options = options||{}).traverse = true ;
            }
            var namespace = getStack.call(this, eventName) ;
            return sumPropertyInNamespace(namespace, getCallbackCount, options||{}) ;
        }

        /**
         * returns the the trigger count for this event
         * @method countTrigger
         * @param {sting} [eventName] the event name
         * @param {Object} [options]
         *      @param {Boolean} [traverse=false] traverse all nested namepsaces
         * @return {Number} trigger count. -1 is returned if the event name does not exist
         */
        , countTriggers: function(eventName, options) {
            if ( !eventName ) { // => count all triggers
                (options = options||{}).traverse = true ;
            }
            var stack = getStack.call(this, eventName) ;
            return sumPropertyInNamespace(stack, getTriggerCount, options||{}) ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    /*
        Returns the sum of a stack property. The specific property is implemented in propertyFunc
     */
    function sumPropertyInNamespace(namespace, propertyFunc, options) {
        var i
            , retVal = 0 ;

        for( i in namespace ) {
            if ( i === '__stack' ) {
                retVal += propertyFunc(namespace.__stack, options) ;
            }
            else if ( options.traverse === true  ) {
                retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options) ;
            }
        }
        return retVal ;
    }

    /*
        Returns the number of callback function present in this stack
     */
    function getCallbackCount(stack, options) {
        var i
            , retVal = 0 ;
        for ( i in stack.on ) {
            if ( stack.on[i].eventMode === options.eventMode ) {
                retVal ++ ;
            }
        }
        return retVal ;
    }

    /*
        Returns the trigger count of this stack
     */
    function getTriggerCount(stack, options) {
        return stack.triggers ;
    }

    function addCallbackToStack(eventName, callback, options) {
        var obj = null
            , stack ;
        if ( checkInput(eventName, callback)) {                                     // validate input
            stack = createStack.call(this, eventName) ;                             // get stack of 'eventName'
            if ( canAddCallback.call(this, stack.__stack.on, callback, options) === true ) {                       // check if the callback is not already added
                obj = { fn: callback, eventMode: options.eventMode } ;
                stack.__stack.on[options.prepend ? 'unshift':'push'](obj) ;
            }
        }
        return obj ;
    }

    /*
        determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true
     */
    function canAddCallback(callbacks, callback, options) {
        var i
            , retVal = true
            , eventMode = options.eventMode ;//|| undefined ;

        if (this.allowMultiple === false ) {
            for( i = 0; i < callbacks.length; i++ ) {
                if ( callbacks[i].fn === callback && (
                        callbacks[i].eventMode === eventMode ||                                 // they are identical
                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'
                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)
                    ) {
                        retVal = false ;
                        break ;
                }
            }
        }
        return retVal ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    function checkInput(eventName, callback) {
        var retVal = false ;
        if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            retVal = true ;
        }
        else if ( ns.DEBUG ) { // Wrong...
            console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
        }
        return retVal ;
    }

    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    function removeFromNamespace(namespaces, callback, options) {
            var retVal = 0                                              // number of removed callbacks
            , namespace
            , i ;                                                       // loop var

        for( i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)
            namespace = namespaces[i] ;
            if ( i === '__stack') {
                    retVal += removeCallback(namespace.on, callback, options) ;
            }
            else if ( options.traverse ) {                              // NO, its a namesapace -> recursion
               retVal += removeFromNamespace.call(this, namespace, callback, options ) ;
            }
        }
        return retVal ;                                             // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    function removeCallback(list, callback, options){
        var i                                             // position on the stack
            , retVal = 0 ;

        for( i = list.length-1; i >= 0; i-- ){
            if ( (list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode ) {
                list.splice(i, 1) ;
                retVal ++ ;
            }
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
                        , parent: stack                     // parent namespace/object
                        , triggers: 0                       // count triggers
                    }
                } ;
            }
            stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        return stack ;
    }

    function triggerEventCapture(eventName, data) {
        var i
            , namespace = this._rootStack
            , parts = eventName.split('.') || []
            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING
            , retVal = 0 ; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root

        if ( parts.length > 1 ) {
            for( i = 0; i < parts.length -1; i++ ) { // loop through namespace (not the last part)
                namespace = namespace[parts[i]] ;
                retVal += callCallbacks(namespace, data, eventMode) ;
            }
        }
        return retVal ;
    }

    function triggerEventBubble(namespace, data) {
        //var namespace = namespaces.__stack.parent ;
        var eventMode = DEFAULTS.EVENT_MODE.BUBBLING
            , retVal = 0 ;

        while( namespace.__stack.parent ) {
            namespace = namespace.__stack.parent ;
            retVal += callCallbacks(namespace, data, eventMode) ;
        }
        return retVal ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).
     */
    function triggerEvent(stack, data, options) {
        var  retVal = 0
            , ns ;                                                  // loop index

        for( ns in stack ) {
            if ( ns === "__stack" ) {
               retVal += callCallbacks(stack, data) ;
           }
           else if ( options.traverse ) {                           // found a deeper nested namespace
                retVal += triggerEvent(stack[ns], data, options) ;  // nested namespaces. NOTE that the 'eventName' is omitted!!
           }
        }
        return retVal ;
    }

    /*
        This method triggers the callback for a given namespace. It does not traverse the namespaces, it only loops through
        the 'on' list and afterwards checks if there are callbacks which should be removed (checking the 'one' list)
        If the 'eventMode' is defined, it only triggers callbacks which accept the eventMode.
        @param {Object} namespace
        @param {Anything} data
        @param {String} eventMode accepted values
     */
    function callCallbacks(namespace, data, eventMode) {
        var i
            , retVal = 0
            , callback ;

        for( i = 0; i < namespace.__stack.on.length ; i++ ) {           // loop through all callbacks
            callback = namespace.__stack.on[i] ;
            if ( callback.eventMode === eventMode ) {                   // trigger callbacks depending on their event-mode
                retVal ++ ;                                             // count this trigger
                callback.fn(data) ;                                     // call the callback
                if ( callback.isOne ) {
                    namespace.__stack.on.splice(i--, 1) ;               // remove callback for index is i, and afterwards fix loop index with i--
                }
            }
        }
        return retVal ;
    }

    ns.EventHub = eh ;

})(window.Sway) ;