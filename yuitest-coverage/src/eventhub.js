if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["./src/eventhub.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/eventhub.js",
    code: []
};
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(ns){","    var DEFAULTS = {","        /**","         * Contains available event modes. For example, if <tt>bar.foo</tt> is triggered, both event modes do the opposite","         *","         *                    | |                                     / \\","         *     ---------------| |-----------------     ---------------| |-----------------","         *     | bar          | |                |     | bar          | |                |","         *     |   -----------| |-----------     |     |   -----------| |-----------     |","         *     |   |bar.foo   \\ /          |     |     |   |bar.foo   | |          |     |","         *     |   -------------------------     |     |   -------------------------     |","         *     |        Event CAPTURING          |     |        Event BUBBLING           |","         *     -----------------------------------     -----------------------------------","         *","         * The event model implemented in this class does both, going from <tt>bubbling</tt> to the execution of all callbacks in <tt>bar.foo</tt>, then back in <tt>capturing</tt> mode","         *","         *                                   | |  / \\","         *                  -----------------| |--| |-----------------","         *                  | bar            | |  | |                |","         *                  |   -------------| |--| |-----------     |","         *                  |   |bar.foo     \\ /  | |          |     |","         *                  |   --------------------------------     |","         *                  |               event model              |","         *                  ------------------------------------------","         *","         *     eventHub.on('bar.foo', myFunc1) ;","         *     eventHub.on('bar', myFunc2, Sway.EventHub.EVENT_MODE.CAPTURING) ;","         *     eventHub.on('bar', myFunc3, Sway.EventHub.EVENT_MODE.BUBBLING) ;","         *     eventHub.on('bar', myFunc4, Sway.EventHub.EVENT_MODE.BOTH) ;","         *     eventHub.trigger('bar.foo') ; // -> callback execution order: myFunc3, myFunc4, myFunc1, myFunc2 and myFunc4","         *","         * @property {Object} EVENT_MODE","         * @static","         * @example","         */","        EVENT_MODE: {","            /**","             * Defines the capturing event mode","             * @property {String} EVENT_MODE.CAPTURING","             * @static","             */","            CAPTURING:  'capture'           // event goes from root to target","            /**","             * Defines the bubbling event mode","             * @property {String} EVENT_MODE.BUBBLING","             * @static","             */","            , BUBBLING: 'bubble'            // event goes from target to root","            /**","             * Represent both capturing and bubbling event modes","             * @property {String} EVENT_MODE.ALL","             * @static","             */","            , BOTH: 'both'","        }","        /* PRIVATE PROPERTY","         * Default setting, to allow the same callback to be registered multiple times to the same event","         */","        , ALLOW_MULTIPLE: true","    }","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too.","     *","     * Namespaces are separated by a dot, like","     *","     *     bar.foo1","     *     bar.foo2","     *     bar.bar1.foo1","     *","     * A Namespace and an Eventname are actually more or less the same thing:","     *","     *     eventHub.on('bar', myFunc1) ;","     *     eventHub.on('bar.foo1', myFunc2) ;","     *     eventHub.on('bar.bar1', myFunc3) ;","     *     eventHub.on('bar.bar1.foo1', myFunc4) ;","     *","     * The advantage of namespaced events is that it facilitates triggering groups of events","     *","     *     eventHub.trigger('bar') ;        // --> triggers: myFunc1, myFunc2, myFunc3 and myFunc4","     *     eventHub.trigger('bar.bar1');    // --> triggers: myFunc3 and myFunc4","     *","     * @class Sway.EventHub","     * @constructor","     * @param {Object} [options] configuration parameters","     *      @param {Boolean} [options.allowMultiple] accept multiple registrations of a function for the same event name","     */","        , eh = function(options) {","            Object.defineProperty(this, '_rootStack',","                {","                    value: { __stack: { triggers: 0, on:[], one:[]} }","                    , enumerable: false // hide it","                }","            ) ;","            Object.defineProperty(this, '_eventNameIndex',","                {","                    value: 0","                    , enumerable: false // hide it","                    , writable: true    // otherwise ++ will not work","                }","            ) ;","            this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE ;","        } ;","","    eh.EVENT_MODE = DEFAULTS.EVENT_MODE ;                   // set static properies","","    eh.prototype = {","        /**","         * Generates an unique event name","         * @method generateUniqueEventName","         * @return {String}","         */","        generateUniqueEventName: function() {","            return '--eh--' + this._eventNameIndex++ ;     // first event-name will be: --eh--0","        }","","        , setAllowMultiple: function(state) {","            this.allowMultiple = state ;","        }","        /**","         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName    name of the event or namespace","         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function","         * @param {Opbject} [options] configuration","         *      @param {String} [options.traverse=false] trigger all callbacks in nested namespaces","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true} ) ;                      // trigger all nested events and namespaces inside the 'ui' namespace","         */","        , trigger: function(eventName, data, options){","            var retVal = 0","                , namespace ;","            if ( (namespace = getStack.call(this, eventName)) ) {                   // check if the eventName exists","                retVal = triggerEventCapture.call(this, eventName||'', data) +      // NOTE that eventName can be empty!","                         triggerEvent(namespace, data, options||{}) +","                        ((eventName||'').match(/\\./) !== null ? triggerEventBubble(namespace, data) : 0) ;","","                namespace.__stack.triggers ++ ;                                     // count the trigger","                namespace.__stack.one = [] ;                                        // cleanup","            }","            return retVal ;                                                         // return the number of triggered callback functions","        }","","        /**","         * Register a callback for a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others. With the 'options'","         * parameter it is also possible to execute the callback in a capturing or bubbling phase.","         *","         * @method on","         * @param {String} eventName","         * @param {Function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt> and <tt>bubble</tt>","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), {prepend: true, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING} ) ;","         */","        , on: function(eventName, callback, options) {","            return addCallbackToStack.call(this, eventName, callback, options||{}) !== null ;","        }","","","        /**","         * Register a callback for a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt> and <tt>bubble</tt>","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         */","        , one: function(eventName, callback, options) {","            var obj = addCallbackToStack.call(this, eventName, callback, options||{}) ;","            if ( obj ) { // if obj exists, the callback was added.","                obj.isOne = true ;","            }","            return obj !== null ;","        }","","        /**","         * Removes the given callback for a specific event. However, if a callback is registered with an 'eventMode', the","         * callback can only be removed if that eventMode is specified too!","         *","         * @method off","         * @param {string} eventName","         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @param {Object}","         *      @param {Boolean} [traverse=false] traverse all nested namespaces","         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui.update', this.update, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function(eventName, callback, options) {","            var stack = getStack.call(this, eventName) ;","            return removeFromNamespace(stack, callback, options||{}) ;","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method countCallbacks","         * @param {Sting} eventName the event name for which all registered callbacks are counted (including nested event names).","         * @param {Object} [options] determine the count behavior","         *      @param {String} [eventMode] the event mode; Sway.EventHub.CAPTURING or Sway.EventHub.BUBBLE","         *      @param {Boolean} [traverse=false] traverse all nested namepsaces","         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists","         * TODO: etype is not used","         */","        , countCallbacks: function(eventName, options) {","            if ( !eventName ) { // => count all callback function within this namespace","                (options = options||{}).traverse = true ;","            }","            var namespace = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(namespace, getCallbackCount, options||{}) ;","        }","","        /**","         * returns the the trigger count for this event","         * @method countTrigger","         * @param {sting} [eventName] the event name","         * @param {Object} [options]","         *      @param {Boolean} [traverse=false] traverse all nested namepsaces","         * @return {Number} trigger count. -1 is returned if the event name does not exist","         */","        , countTriggers: function(eventName, options) {","            if ( !eventName ) { // => count all triggers","                (options = options||{}).traverse = true ;","            }","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, getTriggerCount, options||{}) ;","        }","    } ;","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    /*","        Returns the sum of a stack property. The specific property is implemented in propertyFunc","     */","    function sumPropertyInNamespace(namespace, propertyFunc, options) {","        var i","            , retVal = 0 ;","","        for( i in namespace ) {","            if ( i === '__stack' ) {","                retVal += propertyFunc(namespace.__stack, options) ;","            }","            else if ( options.traverse === true  ) {","                retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options) ;","            }","        }","        return retVal ;","    }","","    /*","        Returns the number of callback function present in this stack","     */","    function getCallbackCount(stack, options) {","        var i","            , retVal = 0 ;","        for ( i in stack.on ) {","            if ( stack.on[i].eventMode === options.eventMode ) {","                retVal ++ ;","            }","        }","        return retVal ;","    }","","    /*","        Returns the trigger count of this stack","     */","    function getTriggerCount(stack, options) {","        return stack.triggers ;","    }","","    function addCallbackToStack(eventName, callback, options) {","        var obj","            , stack ;","        if ( checkInput(eventName, callback)) {                                     // validate input","            stack = createStack.call(this, eventName) ;                             // get stack of 'eventName'","            if ( canAddCallback.call(this, stack.__stack.on, callback, options) === true ) {                       // check if the callback is not already added","                obj = { fn: callback, eventMode: options.eventMode } ;","                stack.__stack.on[options.prepend ? 'unshift':'push'](obj) ;","                return obj ;","            }","        }","        return null ;","    }","","    /*","        determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true","     */","    function canAddCallback(callbacks, callback, options) {","        var i","            , retVal = true","            , eventMode = options.eventMode ;//|| undefined ;","","        if (this.allowMultiple === false ) {","            for( i = 0; i < callbacks.length; i++ ) {","                if ( callbacks[i].fn === callback && (","                        callbacks[i].eventMode === eventMode ||                                 // they are identical","                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'","                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)","                    ) {","                        retVal = false ;","                        break ;","                }","            }","        }","        return retVal ;","    }","","","    /* Validate the input for 'on' and 'one'.","        eventName: should be defined and of type \"string\"","        callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        var retVal = false ;","        if ( typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\" ) { // OK","            retVal = true ;","        }","        else if ( ns.DEBUG ) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\") ;","        }","        return retVal ;","    }","","    /*","        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","        is erased.","     */","    function removeFromNamespace(namespaces, callback, options) {","            var retVal = 0                                              // number of removed callbacks","            , namespace","            , i ;                                                       // loop var","","        for( i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)","            namespace = namespaces[i] ;","            if ( i === '__stack') {","                    retVal += removeCallback(namespace.on, callback, options) ;","            }","            else if ( options.traverse ) {                              // NO, its a namesapace -> recursion","               retVal += removeFromNamespace.call(this, namespace, callback, options ) ;","            }","        }","        return retVal ;                                             // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","       multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback, options){","        var i                                             // position on the stack","            , retVal = 0 ;","","        for( i = list.length-1; i >= 0; i-- ){","            if ( (list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode ) {","                list.splice(i, 1) ;","                retVal ++ ;","            }","        }","        return retVal ;","    }","","    /*","        This private function returns the callback stack matched by 'eventName'. If the eventName does","        not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","                , stack = this._rootStack                   // root of the callback stack","                , i ;                                       // loop index","","        for( i = 0; i < parts.length; i++ ) {","            if ( ! stack[parts[i]]) {","                return null ;                               // it does not exist -> done","            }","            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack","        }","        return stack ;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack. This function always increases the count for each namespace","     * because this function is only called when adding a new callback. Finally, if the namespace","     * does not exist, it is created.","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i ;                                           // loop index","","        for(i = 0; i < parts.length ; i++) {                // traverse the stack","            if ( !stack[parts[i]] ){                        // if not exists --> create it","                stack[parts[i]] = {","                    __stack: {                              // holds all info for this namespace (not the child namespaces)","                        on: []                              // callback stack","                        , parent: stack                     // parent namespace/object","                        , triggers: 0                       // count triggers","                    }","                } ;","            }","            stack = stack[parts[i]] ;                       // go into the (newly created) namespace","        }","        return stack ;","    }","","    function triggerEventCapture(eventName, data) {","        var i","            , namespace = this._rootStack","            , parts = eventName.split('.') || []","            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING","            , retVal = 0 ; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root","","        if ( parts.length > 1 ) {","            for( i = 0; i < parts.length -1; i++ ) { // loop through namespace (not the last part)","                namespace = namespace[parts[i]] ;","                retVal += callCallbacks(namespace, data, eventMode) ;","            }","        }","        return retVal ;","    }","","    function triggerEventBubble(namespace, data) {","        //var namespace = namespaces.__stack.parent ;","        var eventMode = DEFAULTS.EVENT_MODE.BUBBLING","            , retVal = 0 ;","","        while( namespace.__stack.parent ) {","            namespace = namespace.__stack.parent ;","            retVal += callCallbacks(namespace, data, eventMode) ;","        }","        return retVal ;","    }","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).","     */","    function triggerEvent(stack, data, options) {","        var  retVal = 0","            , ns ;                                                  // loop index","","        for( ns in stack ) {","            if ( ns === \"__stack\" ) {","               retVal += callCallbacks(stack, data) ;","           }","           else if ( options.traverse ) {                           // found a deeper nested namespace","                retVal += triggerEvent(stack[ns], data, options) ;  // nested namespaces. NOTE that the 'eventName' is omitted!!","           }","        }","        return retVal ;","    }","","    /*","        This method triggers the callback for a given namespace. It does not traverse the namespaces, it only loops through","        the 'on' list and afterwards checks if there are callbacks which should be removed (checking the 'one' list)","        If the 'eventMode' is defined, it only triggers callbacks which accept the eventMode.","        @param {Object} namespace","        @param {Anything} data","        @param {String} eventMode accepted values","     */","    function callCallbacks(namespace, data, eventMode) {","        var i","            , retVal = 0","            , callback ;","","        for( i = 0; i < namespace.__stack.on.length ; i++ ) {           // loop through all callbacks","            callback = namespace.__stack.on[i] ;","            if ( callback.eventMode === eventMode ) {                   // trigger callbacks depending on their event-mode","                retVal ++ ;                                             // count this trigger","                callback.fn(data) ;                                     // call the callback","                if ( callback.isOne ) {","                    namespace.__stack.on.splice(i--, 1) ;               // remove callback for index is i, and afterwards fix loop index with i--","                }","            }","        }","        return retVal ;","    }","","    ns.EventHub = eh ;","","})(window.Sway) ;"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"4":0,"91":0,"97":0,"104":0,"107":0,"109":0,"116":0,"120":0,"137":0,"139":0,"140":0,"144":0,"145":0,"147":0,"168":0,"186":0,"187":0,"188":0,"190":0,"211":0,"212":0,"227":0,"228":0,"230":0,"231":0,"243":0,"244":0,"246":0,"247":0,"256":0,"257":0,"260":0,"261":0,"262":0,"264":0,"265":0,"268":0,"274":0,"275":0,"277":0,"278":0,"279":0,"282":0,"288":0,"289":0,"292":0,"293":0,"295":0,"296":0,"297":0,"298":0,"299":0,"300":0,"303":0,"309":0,"310":0,"314":0,"315":0,"316":0,"321":0,"322":0,"326":0,"334":0,"335":0,"336":0,"337":0,"339":0,"340":0,"342":0,"350":0,"351":0,"355":0,"356":0,"357":0,"358":0,"360":0,"361":0,"364":0,"370":0,"371":0,"374":0,"375":0,"376":0,"377":0,"380":0,"387":0,"388":0,"392":0,"393":0,"394":0,"396":0,"398":0,"408":0,"409":0,"413":0,"414":0,"415":0,"423":0,"425":0,"428":0,"429":0,"435":0,"436":0,"437":0,"438":0,"441":0,"444":0,"446":0,"449":0,"450":0,"451":0,"453":0,"460":0,"461":0,"464":0,"465":0,"466":0,"468":0,"469":0,"472":0,"483":0,"484":0,"488":0,"489":0,"490":0,"491":0,"492":0,"493":0,"494":0,"498":0,"501":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"eh:90":0,"generateUniqueEventName:115":0,"setAllowMultiple:119":0,"trigger:136":0,"on:167":0,"one:185":0,"off:210":0,"countCallbacks:226":0,"countTriggers:242":0,"sumPropertyInNamespace:256":0,"getCallbackCount:274":0,"getTriggerCount:288":0,"addCallbackToStack:292":0,"canAddCallback:309":0,"checkInput:334":0,"removeFromNamespace:350":0,"removeCallback:370":0,"getStack:387":0,"createStack:408":0,"triggerEventCapture:428":0,"triggerEventBubble:444":0,"triggerEvent:460":0,"callCallbacks:483":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 133;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 24;
_yuitest_coverline("./src/eventhub.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/eventhub.js", 3);
(function(ns){
    _yuitest_coverfunc("./src/eventhub.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/eventhub.js", 4);
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
            _yuitest_coverfunc("./src/eventhub.js", "eh", 90);
_yuitest_coverline("./src/eventhub.js", 91);
Object.defineProperty(this, '_rootStack',
                {
                    value: { __stack: { triggers: 0, on:[], one:[]} }
                    , enumerable: false // hide it
                }
            ) ;
            _yuitest_coverline("./src/eventhub.js", 97);
Object.defineProperty(this, '_eventNameIndex',
                {
                    value: 0
                    , enumerable: false // hide it
                    , writable: true    // otherwise ++ will not work
                }
            ) ;
            _yuitest_coverline("./src/eventhub.js", 104);
this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE ;
        } ;

    _yuitest_coverline("./src/eventhub.js", 107);
eh.EVENT_MODE = DEFAULTS.EVENT_MODE ;                   // set static properies

    _yuitest_coverline("./src/eventhub.js", 109);
eh.prototype = {
        /**
         * Generates an unique event name
         * @method generateUniqueEventName
         * @return {String}
         */
        generateUniqueEventName: function() {
            _yuitest_coverfunc("./src/eventhub.js", "generateUniqueEventName", 115);
_yuitest_coverline("./src/eventhub.js", 116);
return '--eh--' + this._eventNameIndex++ ;     // first event-name will be: --eh--0
        }

        , setAllowMultiple: function(state) {
            _yuitest_coverfunc("./src/eventhub.js", "setAllowMultiple", 119);
_yuitest_coverline("./src/eventhub.js", 120);
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
            _yuitest_coverfunc("./src/eventhub.js", "trigger", 136);
_yuitest_coverline("./src/eventhub.js", 137);
var retVal = 0
                , namespace ;
            _yuitest_coverline("./src/eventhub.js", 139);
if ( (namespace = getStack.call(this, eventName)) ) {                   // check if the eventName exists
                _yuitest_coverline("./src/eventhub.js", 140);
retVal = triggerEventCapture.call(this, eventName||'', data) +      // NOTE that eventName can be empty!
                         triggerEvent(namespace, data, options||{}) +
                        ((eventName||'').match(/\./) !== null ? triggerEventBubble(namespace, data) : 0) ;

                _yuitest_coverline("./src/eventhub.js", 144);
namespace.__stack.triggers ++ ;                                     // count the trigger
                _yuitest_coverline("./src/eventhub.js", 145);
namespace.__stack.one = [] ;                                        // cleanup
            }
            _yuitest_coverline("./src/eventhub.js", 147);
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
            _yuitest_coverfunc("./src/eventhub.js", "on", 167);
_yuitest_coverline("./src/eventhub.js", 168);
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
            _yuitest_coverfunc("./src/eventhub.js", "one", 185);
_yuitest_coverline("./src/eventhub.js", 186);
var obj = addCallbackToStack.call(this, eventName, callback, options||{}) ;
            _yuitest_coverline("./src/eventhub.js", 187);
if ( obj ) { // if obj exists, the callback was added.
                _yuitest_coverline("./src/eventhub.js", 188);
obj.isOne = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 190);
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
            _yuitest_coverfunc("./src/eventhub.js", "off", 210);
_yuitest_coverline("./src/eventhub.js", 211);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 212);
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
            _yuitest_coverfunc("./src/eventhub.js", "countCallbacks", 226);
_yuitest_coverline("./src/eventhub.js", 227);
if ( !eventName ) { // => count all callback function within this namespace
                _yuitest_coverline("./src/eventhub.js", 228);
(options = options||{}).traverse = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 230);
var namespace = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 231);
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
            _yuitest_coverfunc("./src/eventhub.js", "countTriggers", 242);
_yuitest_coverline("./src/eventhub.js", 243);
if ( !eventName ) { // => count all triggers
                _yuitest_coverline("./src/eventhub.js", 244);
(options = options||{}).traverse = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 246);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 247);
return sumPropertyInNamespace(stack, getTriggerCount, options||{}) ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    /*
        Returns the sum of a stack property. The specific property is implemented in propertyFunc
     */
    _yuitest_coverline("./src/eventhub.js", 256);
function sumPropertyInNamespace(namespace, propertyFunc, options) {
        _yuitest_coverfunc("./src/eventhub.js", "sumPropertyInNamespace", 256);
_yuitest_coverline("./src/eventhub.js", 257);
var i
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 260);
for( i in namespace ) {
            _yuitest_coverline("./src/eventhub.js", 261);
if ( i === '__stack' ) {
                _yuitest_coverline("./src/eventhub.js", 262);
retVal += propertyFunc(namespace.__stack, options) ;
            }
            else {_yuitest_coverline("./src/eventhub.js", 264);
if ( options.traverse === true  ) {
                _yuitest_coverline("./src/eventhub.js", 265);
retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options) ;
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 268);
return retVal ;
    }

    /*
        Returns the number of callback function present in this stack
     */
    _yuitest_coverline("./src/eventhub.js", 274);
function getCallbackCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getCallbackCount", 274);
_yuitest_coverline("./src/eventhub.js", 275);
var i
            , retVal = 0 ;
        _yuitest_coverline("./src/eventhub.js", 277);
for ( i in stack.on ) {
            _yuitest_coverline("./src/eventhub.js", 278);
if ( stack.on[i].eventMode === options.eventMode ) {
                _yuitest_coverline("./src/eventhub.js", 279);
retVal ++ ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 282);
return retVal ;
    }

    /*
        Returns the trigger count of this stack
     */
    _yuitest_coverline("./src/eventhub.js", 288);
function getTriggerCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getTriggerCount", 288);
_yuitest_coverline("./src/eventhub.js", 289);
return stack.triggers ;
    }

    _yuitest_coverline("./src/eventhub.js", 292);
function addCallbackToStack(eventName, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 292);
_yuitest_coverline("./src/eventhub.js", 293);
var obj
            , stack ;
        _yuitest_coverline("./src/eventhub.js", 295);
if ( checkInput(eventName, callback)) {                                     // validate input
            _yuitest_coverline("./src/eventhub.js", 296);
stack = createStack.call(this, eventName) ;                             // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 297);
if ( canAddCallback.call(this, stack.__stack.on, callback, options) === true ) {                       // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 298);
obj = { fn: callback, eventMode: options.eventMode } ;
                _yuitest_coverline("./src/eventhub.js", 299);
stack.__stack.on[options.prepend ? 'unshift':'push'](obj) ;
                _yuitest_coverline("./src/eventhub.js", 300);
return obj ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 303);
return null ;
    }

    /*
        determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true
     */
    _yuitest_coverline("./src/eventhub.js", 309);
function canAddCallback(callbacks, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "canAddCallback", 309);
_yuitest_coverline("./src/eventhub.js", 310);
var i
            , retVal = true
            , eventMode = options.eventMode ;//|| undefined ;

        _yuitest_coverline("./src/eventhub.js", 314);
if (this.allowMultiple === false ) {
            _yuitest_coverline("./src/eventhub.js", 315);
for( i = 0; i < callbacks.length; i++ ) {
                _yuitest_coverline("./src/eventhub.js", 316);
if ( callbacks[i].fn === callback && (
                        callbacks[i].eventMode === eventMode ||                                 // they are identical
                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'
                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)
                    ) {
                        _yuitest_coverline("./src/eventhub.js", 321);
retVal = false ;
                        _yuitest_coverline("./src/eventhub.js", 322);
break ;
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 326);
return retVal ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 334);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 334);
_yuitest_coverline("./src/eventhub.js", 335);
var retVal = false ;
        _yuitest_coverline("./src/eventhub.js", 336);
if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            _yuitest_coverline("./src/eventhub.js", 337);
retVal = true ;
        }
        else {_yuitest_coverline("./src/eventhub.js", 339);
if ( ns.DEBUG ) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 340);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
        }}
        _yuitest_coverline("./src/eventhub.js", 342);
return retVal ;
    }

    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 350);
function removeFromNamespace(namespaces, callback, options) {
            _yuitest_coverfunc("./src/eventhub.js", "removeFromNamespace", 350);
_yuitest_coverline("./src/eventhub.js", 351);
var retVal = 0                                              // number of removed callbacks
            , namespace
            , i ;                                                       // loop var

        _yuitest_coverline("./src/eventhub.js", 355);
for( i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)
            _yuitest_coverline("./src/eventhub.js", 356);
namespace = namespaces[i] ;
            _yuitest_coverline("./src/eventhub.js", 357);
if ( i === '__stack') {
                    _yuitest_coverline("./src/eventhub.js", 358);
retVal += removeCallback(namespace.on, callback, options) ;
            }
            else {_yuitest_coverline("./src/eventhub.js", 360);
if ( options.traverse ) {                              // NO, its a namesapace -> recursion
               _yuitest_coverline("./src/eventhub.js", 361);
retVal += removeFromNamespace.call(this, namespace, callback, options ) ;
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 364);
return retVal ;                                             // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 370);
function removeCallback(list, callback, options){
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 370);
_yuitest_coverline("./src/eventhub.js", 371);
var i                                             // position on the stack
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 374);
for( i = list.length-1; i >= 0; i-- ){
            _yuitest_coverline("./src/eventhub.js", 375);
if ( (list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode ) {
                _yuitest_coverline("./src/eventhub.js", 376);
list.splice(i, 1) ;
                _yuitest_coverline("./src/eventhub.js", 377);
retVal ++ ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 380);
return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 387);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 387);
_yuitest_coverline("./src/eventhub.js", 388);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 392);
for( i = 0; i < parts.length; i++ ) {
            _yuitest_coverline("./src/eventhub.js", 393);
if ( ! stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 394);
return null ;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 396);
stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 398);
return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    _yuitest_coverline("./src/eventhub.js", 408);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 408);
_yuitest_coverline("./src/eventhub.js", 409);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 413);
for(i = 0; i < parts.length ; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 414);
if ( !stack[parts[i]] ){                        // if not exists --> create it
                _yuitest_coverline("./src/eventhub.js", 415);
stack[parts[i]] = {
                    __stack: {                              // holds all info for this namespace (not the child namespaces)
                        on: []                              // callback stack
                        , parent: stack                     // parent namespace/object
                        , triggers: 0                       // count triggers
                    }
                } ;
            }
            _yuitest_coverline("./src/eventhub.js", 423);
stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        _yuitest_coverline("./src/eventhub.js", 425);
return stack ;
    }

    _yuitest_coverline("./src/eventhub.js", 428);
function triggerEventCapture(eventName, data) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventCapture", 428);
_yuitest_coverline("./src/eventhub.js", 429);
var i
            , namespace = this._rootStack
            , parts = eventName.split('.') || []
            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING
            , retVal = 0 ; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root

        _yuitest_coverline("./src/eventhub.js", 435);
if ( parts.length > 1 ) {
            _yuitest_coverline("./src/eventhub.js", 436);
for( i = 0; i < parts.length -1; i++ ) { // loop through namespace (not the last part)
                _yuitest_coverline("./src/eventhub.js", 437);
namespace = namespace[parts[i]] ;
                _yuitest_coverline("./src/eventhub.js", 438);
retVal += callCallbacks(namespace, data, eventMode) ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 441);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 444);
function triggerEventBubble(namespace, data) {
        //var namespace = namespaces.__stack.parent ;
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventBubble", 444);
_yuitest_coverline("./src/eventhub.js", 446);
var eventMode = DEFAULTS.EVENT_MODE.BUBBLING
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 449);
while( namespace.__stack.parent ) {
            _yuitest_coverline("./src/eventhub.js", 450);
namespace = namespace.__stack.parent ;
            _yuitest_coverline("./src/eventhub.js", 451);
retVal += callCallbacks(namespace, data, eventMode) ;
        }
        _yuitest_coverline("./src/eventhub.js", 453);
return retVal ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).
     */
    _yuitest_coverline("./src/eventhub.js", 460);
function triggerEvent(stack, data, options) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 460);
_yuitest_coverline("./src/eventhub.js", 461);
var  retVal = 0
            , ns ;                                                  // loop index

        _yuitest_coverline("./src/eventhub.js", 464);
for( ns in stack ) {
            _yuitest_coverline("./src/eventhub.js", 465);
if ( ns === "__stack" ) {
               _yuitest_coverline("./src/eventhub.js", 466);
retVal += callCallbacks(stack, data) ;
           }
           else {_yuitest_coverline("./src/eventhub.js", 468);
if ( options.traverse ) {                           // found a deeper nested namespace
                _yuitest_coverline("./src/eventhub.js", 469);
retVal += triggerEvent(stack[ns], data, options) ;  // nested namespaces. NOTE that the 'eventName' is omitted!!
           }}
        }
        _yuitest_coverline("./src/eventhub.js", 472);
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
    _yuitest_coverline("./src/eventhub.js", 483);
function callCallbacks(namespace, data, eventMode) {
        _yuitest_coverfunc("./src/eventhub.js", "callCallbacks", 483);
_yuitest_coverline("./src/eventhub.js", 484);
var i
            , retVal = 0
            , callback ;

        _yuitest_coverline("./src/eventhub.js", 488);
for( i = 0; i < namespace.__stack.on.length ; i++ ) {           // loop through all callbacks
            _yuitest_coverline("./src/eventhub.js", 489);
callback = namespace.__stack.on[i] ;
            _yuitest_coverline("./src/eventhub.js", 490);
if ( callback.eventMode === eventMode ) {                   // trigger callbacks depending on their event-mode
                _yuitest_coverline("./src/eventhub.js", 491);
retVal ++ ;                                             // count this trigger
                _yuitest_coverline("./src/eventhub.js", 492);
callback.fn(data) ;                                     // call the callback
                _yuitest_coverline("./src/eventhub.js", 493);
if ( callback.isOne ) {
                    _yuitest_coverline("./src/eventhub.js", 494);
namespace.__stack.on.splice(i--, 1) ;               // remove callback for index is i, and afterwards fix loop index with i--
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 498);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 501);
ns.EventHub = eh ;

})(window.Sway) ;
