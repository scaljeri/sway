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
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(ns){","    var DEFAULTS = {","        /**","         * Contains available event modes. For example, if <tt>bar.foo</tt> is triggered, both event modes do the opposite","         *","         *                    | |                                     / \\","         *     ---------------| |-----------------     ---------------| |-----------------","         *     | bar          | |                |     | bar          | |                |","         *     |   -----------| |-----------     |     |   -----------| |-----------     |","         *     |   |bar.foo   \\ /          |     |     |   |bar.foo   | |          |     |","         *     |   -------------------------     |     |   -------------------------     |","         *     |        Event CAPTURING          |     |        Event BUBBLING           |","         *     -----------------------------------     -----------------------------------","         *","         * The event model implemented in this class does both, going from <tt>bubbling</tt> to the execution of all callbacks in <tt>bar.foo</tt>,","         * then back in <tt>capturing</tt> mode","         *","         *                                   | |  / \\","         *                  -----------------| |--| |-----------------","         *                  | bar            | |  | |                |","         *                  |   -------------| |--| |-----------     |","         *                  |   |bar.foo     \\ /  | |          |     |","         *                  |   --------------------------------     |","         *                  |               event model              |","         *                  ------------------------------------------","         *","         *     eventHub.on('bar.foo', myFunc1) ;","         *     eventHub.on('bar', myFunc2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }) ;","         *     eventHub.on('bar', myFunc3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }) ;","         *     eventHub.on('bar', myFunc4, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","         *     eventHub.trigger('bar.foo') ; // -> callback execution order: myFunc3, myFunc4, myFunc1, myFunc2 and myFunc4","         *","         * @property {Object} EVENT_MODE","         * @static","         * @example","         */","        EVENT_MODE: {","            /**","             * Defines the capturing event mode","             * @property {String} EVENT_MODE.CAPTURING","             * @static","             */","            CAPTURING:  'capture'           // event goes from root to target","            /**","             * Defines the bubbling event mode","             * @property {String} EVENT_MODE.BUBBLING","             * @static","             */","            , BUBBLING: 'bubble'            // event goes from target to root","            /**","             * Represent both capturing and bubbling event modes","             * @property {String} EVENT_MODE.ALL","             * @static","             */","            , BOTH: 'both'","        }","        /* PRIVATE PROPERTY","         * Default setting, to allow the same callback to be registered multiple times to the same event","         */","        , ALLOW_MULTIPLE: true","    }","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too.","     *","     * Namespaces are separated by a dot, like","     *","     *     bar.foo1","     *     bar.foo2","     *     bar.bar1.foo1","     *","     * A Namespace and an Eventname are actually more or less the same thing:","     *","     *     eventHub.on('bar', myFunc1) ;","     *     eventHub.on('bar.foo1', myFunc2) ;","     *     eventHub.on('bar.bar1', myFunc3) ;","     *     eventHub.on('bar.bar1.foo1', myFunc4) ;","     *","     * The advantage of namespaced events is that it facilitates triggering groups of events","     *","     *     eventHub.trigger('bar') ;        // --> triggers: myFunc1, myFunc2, myFunc3 and myFunc4","     *     eventHub.trigger('bar.bar1');    // --> triggers: myFunc3 and myFunc4","     *","     * @class Sway.EventHub","     * @constructor","     * @param {Object} [options] configuration parameters","     *      @param {Boolean} [options.allowMultiple] accept multiple registrations of the same function for the same event","     */","        , Eventhub = function(options) {","            Object.defineProperty(this, '_rootStack',","                {","                    value: { __stack: { triggers: 0, on:[], one:[]} }","                    , enumerable: false // hide it","                }","            ) ;","            Object.defineProperty(this, '_eventNameIndex',","                {","                    value: 0","                    , enumerable: false // hide it","                    , writable: true    // otherwise ++ will not work","                }","            ) ;","            this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE ;","        } ;","","    Eventhub.EVENT_MODE = DEFAULTS.EVENT_MODE ;                   // set static properies","","    Eventhub.prototype = {","        /**","         * Generates an unique event name","         * @method generateUniqueEventName","         * @return {String} unique event name","         */","        generateUniqueEventName: function() {","            return '--eh--' + this._eventNameIndex++ ;     // first event-name will be: --eh--0","        }","","        /**","         *","         * @method setAllowMultiple","         * @chainable","         * @param {Boolean} state accept multiple registrations of the same function for the same event","         */","        , setAllowMultiple: function(state) {","            this.allowMultiple = state ;","            return this ;","        }","        /**","         * Enable an event name. See {{#crossLink \"Sway.EventHub/disable:method\"}}{{/crossLink}}","         * @method enable","         * @chainable","         * @param {String} eventName name of the event","         * @param {Object} [options] configuration","         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE","         */","        , enable: function(eventName, options) {","            var namespace = getStack.call(this, eventName) ;","","            changeStateEvent.call(this, namespace||{}, false, options||{}) ;","            return this ;","        }","        /**","         * Disable an event. All triggers on a disabled event are ignored and no event propagation takes place. For example","         *","         *     eventHub.on('bar', callback1) ;","         *     eventHub.on('bar', callback2, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","         *     eventHub.on('bar.foo', callback3) ;","         *     eventHub.disable('bar') ;","         *","         *     eventHub.trigger('bar')          // -> no callbacks called","         *     eventHub.trigger('bar.foo')      // -> callback execution order: callback2, callback3, callback2","         *","         * @method disable","         * @chainable","         * @param {String} eventNname name of the event","         * @param {Object} [options] configuration","         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE","         */","        , disable: function(eventName, options) {","            var namespace = getStack.call(this, eventName) ;","","            changeStateEvent.call(this, namespace||{}, true, options||{}) ;","            return this ;","        }","        /**","         * check if a specific event is disabled.","         * @method isDisabled","         * @param {String} eventName name of the event","         * @return {Boolean} TRUE if the event is disabled. If the event does not exists, FALSE is returned","         */","        , isDisabled: function(eventName) {","            var namespace = getStack.call(this, eventName) ;","            return namespace ? namespace.__stack.disabled : false ;","        }","","        /**","         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName    name of the event or namespace","         * @param {*} [data]   data passed to the triggered callback function","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.traverse=false] trigger all callbacks in nested namespaces","         *      @param {Boolean} [options.eventModes=true] run the BUBBLE and CAPTURE event modes","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true} ) ;                      // trigger all nested events and namespaces inside the 'ui' namespace","         */","        , trigger: function(eventName, data, options){","            var retVal = 0","                , namespace ;","            if ( (namespace = getStack.call(this, eventName)) && !!!namespace.__stack.disabled ) {  // check if the eventName exists and not being disabled","                retVal = triggerEventCapture.call(this, eventName||'', data) +              // NOTE that eventName can be empty!","                         triggerEvent(namespace, data, options||{}) +","                         ((eventName||'').match(/\\./) !== null ? triggerEventBubble(namespace, data) : 0) ;","","                namespace.__stack.triggers ++ ;                                             // count the trigger","                namespace.__stack.one = [] ;                                                // cleanup","            }","            return retVal ;                                                                 // return the number of triggered callback functions","        }","","        /**","         * Register a callback for a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others. With the 'options'","         * parameter it is also possible to execute the callback in a capturing or bubbling phase.","         *","         * @method on","         * @param {String} eventName","         * @param {Function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt> and <tt>bubble</tt>","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), {prepend: true, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING} ) ;","         */","        , on: function(eventName, callback, options) {","            return addCallbackToStack.call(this, eventName, callback, options||{}) !== null ;","        }","","","        /**","         * Register a callback for a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt> and <tt>bubble</tt>","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         */","        , one: function(eventName, callback, options) {","            var obj = addCallbackToStack.call(this, eventName, callback, options||{}) ;","            if ( obj ) { // if obj exists, the callback was added.","                obj.isOne = true ;","            }","            return obj !== null ;","        }","","        /**","         * Removes the given callback for a specific event. However, if a callback is registered with an 'eventMode', the","         * callback can only be removed if that eventMode is specified too!","         *","         * @method off","         * @param {string} eventName","         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @param {Object}","         *      @param {Boolean} [traverse=false] traverse all nested namespaces","         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui.update', this.update, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function(eventName, callback, options) {","            var stack = getStack.call(this, eventName) ;","            return removeFromNamespace(stack, callback, options||{}) ;","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method countCallbacks","         * @param {Sting} eventName the event name for which all registered callbacks are counted (including nested event names).","         * @param {Object} [options] determine the count behavior","         *      @param {String} [eventMode] the event mode; Sway.EventHub.CAPTURING or Sway.EventHub.BUBBLE","         *      @param {Boolean} [traverse=false] traverse all nested namepsaces","         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists","         * TODO: etype is not used","         */","        , countCallbacks: function(eventName, options) {","            if ( !eventName ) { // => count all callback function within this namespace","                (options = options||{}).traverse = true ;","            }","            var namespace = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(namespace, getCallbackCount, options||{}) ;","        }","","        /**","         * returns the the trigger count for this event","         * @method countTrigger","         * @param {sting} [eventName] the event name","         * @param {Object} [options]","         *      @param {Boolean} [traverse=false] traverse all nested namepsaces","         * @return {Number} trigger count. -1 is returned if the event name does not exist","         */","        , countTriggers: function(eventName, options) {","            if ( !eventName ) { // => count all triggers","                (options = options||{}).traverse = true ;","            }","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, getTriggerCount, options||{}) ;","        }","    } ;","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    /*","     * An event can be in two states: disabled or enabled. The 'state' parameter holds the new state. This state","     * will be applied to all nested events.","     * @param {Object} namespace","     * @param {Boolean} state TRUE to disable the events","     */","    function changeStateEvent(namespace, state, options) {","        var i ;","","        for( i in namespace ) {","            if ( i === '__stack') {","                namespace.__stack.disabled = state ;","            }","            else if ( options.traverse ) {","                changeStateEvent.call(this, namespace[i], state) ;","            }","        }","    }","    /*","        Returns the sum of a stack property. The specific property is implemented in propertyFunc","     */","    function sumPropertyInNamespace(namespace, propertyFunc, options) {","        var i","            , retVal = 0 ;","","        for( i in namespace ) {","            if ( i === '__stack' ) {","                retVal += propertyFunc(namespace.__stack, options) ;","            }","            else if ( options.traverse === true  ) {","                retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options) ;","            }","        }","        return retVal ;","    }","","    /*","        Returns the number of callback function present in this stack","     */","    function getCallbackCount(stack, options) {","        var i","            , retVal = 0 ;","        for ( i in stack.on ) {","            if ( stack.on[i].eventMode === options.eventMode ) {","                retVal ++ ;","            }","        }","        return retVal ;","    }","","    /*","        Returns the trigger count of this stack","     */","    function getTriggerCount(stack, options) {","        return stack.triggers ;","    }","","    function addCallbackToStack(eventName, callback, options) {","        var obj = null","            , stack ;","        if ( checkInput(eventName, callback)) {                                     // validate input","            stack = createStack.call(this, eventName) ;                             // get stack of 'eventName'","            if ( canAddCallback.call(this, stack.__stack.on, callback, options) === true ) {                       // check if the callback is not already added","                obj = { fn: callback, eventMode: options.eventMode } ;","                stack.__stack.on[options.prepend ? 'unshift':'push'](obj) ;","            }","        }","        return obj ;","    }","","    /*","        determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true","     */","    function canAddCallback(callbacks, callback, options) {","        var i","            , retVal = true","            , eventMode = options.eventMode ;//|| undefined ;","","        if (this.allowMultiple === false ) {","            for( i = 0; i < callbacks.length; i++ ) {","                if ( callbacks[i].fn === callback && (","                        callbacks[i].eventMode === eventMode ||                                 // they are identical","                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'","                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)","                    ) {","                        retVal = false ;","                        break ;","                }","            }","        }","        return retVal ;","    }","","","    /* Validate the input for 'on' and 'one'.","        eventName: should be defined and of type \"string\"","        callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        var retVal = false ;","        if ( typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\" ) { // OK","            retVal = true ;","        }","        else if ( ns.DEBUG ) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\") ;","        }","        return retVal ;","    }","","    /*","        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","        is erased.","     */","    function removeFromNamespace(namespaces, callback, options) {","            var retVal = 0                                              // number of removed callbacks","            , namespace","            , i ;                                                       // loop var","","        for( i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)","            namespace = namespaces[i] ;","            if ( i === '__stack') {","                    retVal += removeCallback(namespace.on, callback, options) ;","            }","            else if ( options.traverse ) {                              // NO, its a namesapace -> recursion","               retVal += removeFromNamespace.call(this, namespace, callback, options ) ;","            }","        }","        return retVal ;                                             // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","       multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback, options){","        var i                                             // position on the stack","            , retVal = 0 ;","","        for( i = list.length-1; i >= 0; i-- ){","            if ( (list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode ) {","                list.splice(i, 1) ;","                retVal ++ ;","            }","        }","        return retVal ;","    }","","    /*","        This private function returns the callback stack matched by 'eventName'. If the eventName does","        not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","                , stack = this._rootStack                   // root of the callback stack","                , i ;                                       // loop index","","        for( i = 0; i < parts.length; i++ ) {","            if ( ! stack[parts[i]]) {","                return null ;                               // it does not exist -> done","            }","            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack","        }","        return stack ;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack. This function always increases the count for each namespace","     * because this function is only called when adding a new callback. Finally, if the namespace","     * does not exist, it is created.","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i ;                                           // loop index","","        for(i = 0; i < parts.length ; i++) {                // traverse the stack","            if ( !stack[parts[i]] ){                        // if not exists --> create it","                stack[parts[i]] = {","                    __stack: {                              // holds all info for this namespace (not the child namespaces)","                        on: []                              // callback stack","                        , parent: stack                     // parent namespace/object","                        , triggers: 0                       // count triggers","                        , disabled: false                   // by default the namespace/event is enabled","                    }","                } ;","            }","            stack = stack[parts[i]] ;                       // go into the (newly created) namespace","        }","        return stack ;","    }","","    function triggerEventCapture(eventName, data) {","        var i","            , namespace = this._rootStack","            , parts = eventName.split('.') || []","            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING","            , retVal = 0 ; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root","","        if ( parts.length > 1 ) {","            for( i = 0; i < parts.length -1; i++ ) {        // loop through namespace (not the last part)","                namespace = namespace[parts[i]] ;","                retVal += callCallbacks(namespace, data, eventMode) ;","            }","        }","        return retVal ;","    }","","    function triggerEventBubble(namespace, data) {","        //var namespace = namespaces.__stack.parent ;","        var eventMode = DEFAULTS.EVENT_MODE.BUBBLING","            , retVal = 0 ;","","        while( namespace.__stack.parent ) {","            namespace = namespace.__stack.parent ;","            retVal += callCallbacks(namespace, data, eventMode) ;","        }","        return retVal ;","    }","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).","     */","    function triggerEvent(stack, data, options) {","        var  retVal = 0","            , ns ;                                                  // loop index","","        if ( !stack.disabled ) {                                    // if this node/event is disabled, don't traverse the namespace deeper","            for( ns in stack ) {","                if ( ns === \"__stack\" ) {","                    retVal += callCallbacks(stack, data) ;","                }","                else if ( options.traverse ) {                           // found a deeper nested namespace","                    retVal += triggerEvent(stack[ns], data, options) ;  // nested namespaces. NOTE that the 'eventName' is omitted!!","                }","            }","        }","        return retVal ;","    }","","    /*","        This method triggers the callback for a given namespace. It does not traverse the namespaces, it only loops through","        the 'on' list and afterwards checks if there are callbacks which should be removed (checking the 'one' list)","        If the 'eventMode' is defined, it only triggers callbacks which accept the eventMode.","        @param {Object} namespace","        @param {Anything} data","        @param {String} eventMode accepted values","     */","    function callCallbacks(namespace, data, eventMode) {","        var i","            , retVal = 0","            , callback ;","","        for( i = 0; i < namespace.__stack.on.length ; i++ ) {           // loop through all callbacks","            callback = namespace.__stack.on[i] ;","            if ( callback.eventMode === eventMode ) {                   // trigger callbacks depending on their event-mode","                retVal ++ ;                                             // count this trigger","                callback.fn(data) ;                                     // call the callback","                if ( callback.isOne ) {","                    namespace.__stack.on.splice(i--, 1) ;               // remove callback for index is i, and afterwards fix loop index with i--","                }","            }","        }","        return retVal ;","    }","","    ns.EventHub = Eventhub ;","","})(window.Sway) ;"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"4":0,"92":0,"98":0,"105":0,"108":0,"110":0,"117":0,"127":0,"128":0,"139":0,"141":0,"142":0,"162":0,"164":0,"165":0,"174":0,"175":0,"194":0,"196":0,"197":0,"201":0,"202":0,"204":0,"225":0,"243":0,"244":0,"245":0,"247":0,"268":0,"269":0,"284":0,"285":0,"287":0,"288":0,"300":0,"301":0,"303":0,"304":0,"316":0,"317":0,"319":0,"320":0,"321":0,"323":0,"324":0,"331":0,"332":0,"335":0,"336":0,"337":0,"339":0,"340":0,"343":0,"349":0,"350":0,"352":0,"353":0,"354":0,"357":0,"363":0,"364":0,"367":0,"368":0,"370":0,"371":0,"372":0,"373":0,"374":0,"377":0,"383":0,"384":0,"388":0,"389":0,"390":0,"395":0,"396":0,"400":0,"408":0,"409":0,"410":0,"411":0,"413":0,"414":0,"416":0,"424":0,"425":0,"429":0,"430":0,"431":0,"432":0,"434":0,"435":0,"438":0,"444":0,"445":0,"448":0,"449":0,"450":0,"451":0,"454":0,"461":0,"462":0,"466":0,"467":0,"468":0,"470":0,"472":0,"482":0,"483":0,"487":0,"488":0,"489":0,"498":0,"500":0,"503":0,"504":0,"510":0,"511":0,"512":0,"513":0,"516":0,"519":0,"521":0,"524":0,"525":0,"526":0,"528":0,"535":0,"536":0,"539":0,"540":0,"541":0,"542":0,"544":0,"545":0,"549":0,"560":0,"561":0,"565":0,"566":0,"567":0,"568":0,"569":0,"570":0,"571":0,"575":0,"578":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"Eventhub:91":0,"generateUniqueEventName:116":0,"setAllowMultiple:126":0,"enable:138":0,"disable:161":0,"isDisabled:173":0,"trigger:193":0,"on:224":0,"one:242":0,"off:267":0,"countCallbacks:283":0,"countTriggers:299":0,"changeStateEvent:316":0,"sumPropertyInNamespace:331":0,"getCallbackCount:349":0,"getTriggerCount:363":0,"addCallbackToStack:367":0,"canAddCallback:383":0,"checkInput:408":0,"removeFromNamespace:424":0,"removeCallback:444":0,"getStack:461":0,"createStack:482":0,"triggerEventCapture:503":0,"triggerEventBubble:519":0,"triggerEvent:535":0,"callCallbacks:560":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 149;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 28;
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
         * The event model implemented in this class does both, going from <tt>bubbling</tt> to the execution of all callbacks in <tt>bar.foo</tt>,
         * then back in <tt>capturing</tt> mode
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
         *     eventHub.on('bar', myFunc2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }) ;
         *     eventHub.on('bar', myFunc3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }) ;
         *     eventHub.on('bar', myFunc4, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;
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
     *      @param {Boolean} [options.allowMultiple] accept multiple registrations of the same function for the same event
     */
        , Eventhub = function(options) {
            _yuitest_coverfunc("./src/eventhub.js", "Eventhub", 91);
_yuitest_coverline("./src/eventhub.js", 92);
Object.defineProperty(this, '_rootStack',
                {
                    value: { __stack: { triggers: 0, on:[], one:[]} }
                    , enumerable: false // hide it
                }
            ) ;
            _yuitest_coverline("./src/eventhub.js", 98);
Object.defineProperty(this, '_eventNameIndex',
                {
                    value: 0
                    , enumerable: false // hide it
                    , writable: true    // otherwise ++ will not work
                }
            ) ;
            _yuitest_coverline("./src/eventhub.js", 105);
this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE ;
        } ;

    _yuitest_coverline("./src/eventhub.js", 108);
Eventhub.EVENT_MODE = DEFAULTS.EVENT_MODE ;                   // set static properies

    _yuitest_coverline("./src/eventhub.js", 110);
Eventhub.prototype = {
        /**
         * Generates an unique event name
         * @method generateUniqueEventName
         * @return {String} unique event name
         */
        generateUniqueEventName: function() {
            _yuitest_coverfunc("./src/eventhub.js", "generateUniqueEventName", 116);
_yuitest_coverline("./src/eventhub.js", 117);
return '--eh--' + this._eventNameIndex++ ;     // first event-name will be: --eh--0
        }

        /**
         *
         * @method setAllowMultiple
         * @chainable
         * @param {Boolean} state accept multiple registrations of the same function for the same event
         */
        , setAllowMultiple: function(state) {
            _yuitest_coverfunc("./src/eventhub.js", "setAllowMultiple", 126);
_yuitest_coverline("./src/eventhub.js", 127);
this.allowMultiple = state ;
            _yuitest_coverline("./src/eventhub.js", 128);
return this ;
        }
        /**
         * Enable an event name. See {{#crossLink "Sway.EventHub/disable:method"}}{{/crossLink}}
         * @method enable
         * @chainable
         * @param {String} eventName name of the event
         * @param {Object} [options] configuration
         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE
         */
        , enable: function(eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "enable", 138);
_yuitest_coverline("./src/eventhub.js", 139);
var namespace = getStack.call(this, eventName) ;

            _yuitest_coverline("./src/eventhub.js", 141);
changeStateEvent.call(this, namespace||{}, false, options||{}) ;
            _yuitest_coverline("./src/eventhub.js", 142);
return this ;
        }
        /**
         * Disable an event. All triggers on a disabled event are ignored and no event propagation takes place. For example
         *
         *     eventHub.on('bar', callback1) ;
         *     eventHub.on('bar', callback2, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;
         *     eventHub.on('bar.foo', callback3) ;
         *     eventHub.disable('bar') ;
         *
         *     eventHub.trigger('bar')          // -> no callbacks called
         *     eventHub.trigger('bar.foo')      // -> callback execution order: callback2, callback3, callback2
         *
         * @method disable
         * @chainable
         * @param {String} eventNname name of the event
         * @param {Object} [options] configuration
         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE
         */
        , disable: function(eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "disable", 161);
_yuitest_coverline("./src/eventhub.js", 162);
var namespace = getStack.call(this, eventName) ;

            _yuitest_coverline("./src/eventhub.js", 164);
changeStateEvent.call(this, namespace||{}, true, options||{}) ;
            _yuitest_coverline("./src/eventhub.js", 165);
return this ;
        }
        /**
         * check if a specific event is disabled.
         * @method isDisabled
         * @param {String} eventName name of the event
         * @return {Boolean} TRUE if the event is disabled. If the event does not exists, FALSE is returned
         */
        , isDisabled: function(eventName) {
            _yuitest_coverfunc("./src/eventhub.js", "isDisabled", 173);
_yuitest_coverline("./src/eventhub.js", 174);
var namespace = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 175);
return namespace ? namespace.__stack.disabled : false ;
        }

        /**
         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and
         * namespaces will be triggered.
         *
         * @method trigger
         * @param {string} eventName    name of the event or namespace
         * @param {*} [data]   data passed to the triggered callback function
         * @param {Object} [options] configuration
         *      @param {Boolean} [options.traverse=false] trigger all callbacks in nested namespaces
         *      @param {Boolean} [options.eventModes=true] run the BUBBLE and CAPTURE event modes
         * @return {Number} the count of triggered callbacks
         * @example
         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace
         Sway.eventHub.trigger('ui', {authenticated: true} ) ;                      // trigger all nested events and namespaces inside the 'ui' namespace
         */
        , trigger: function(eventName, data, options){
            _yuitest_coverfunc("./src/eventhub.js", "trigger", 193);
_yuitest_coverline("./src/eventhub.js", 194);
var retVal = 0
                , namespace ;
            _yuitest_coverline("./src/eventhub.js", 196);
if ( (namespace = getStack.call(this, eventName)) && !!!namespace.__stack.disabled ) {  // check if the eventName exists and not being disabled
                _yuitest_coverline("./src/eventhub.js", 197);
retVal = triggerEventCapture.call(this, eventName||'', data) +              // NOTE that eventName can be empty!
                         triggerEvent(namespace, data, options||{}) +
                         ((eventName||'').match(/\./) !== null ? triggerEventBubble(namespace, data) : 0) ;

                _yuitest_coverline("./src/eventhub.js", 201);
namespace.__stack.triggers ++ ;                                             // count the trigger
                _yuitest_coverline("./src/eventhub.js", 202);
namespace.__stack.one = [] ;                                                // cleanup
            }
            _yuitest_coverline("./src/eventhub.js", 204);
return retVal ;                                                                 // return the number of triggered callback functions
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
            _yuitest_coverfunc("./src/eventhub.js", "on", 224);
_yuitest_coverline("./src/eventhub.js", 225);
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
            _yuitest_coverfunc("./src/eventhub.js", "one", 242);
_yuitest_coverline("./src/eventhub.js", 243);
var obj = addCallbackToStack.call(this, eventName, callback, options||{}) ;
            _yuitest_coverline("./src/eventhub.js", 244);
if ( obj ) { // if obj exists, the callback was added.
                _yuitest_coverline("./src/eventhub.js", 245);
obj.isOne = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 247);
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
            _yuitest_coverfunc("./src/eventhub.js", "off", 267);
_yuitest_coverline("./src/eventhub.js", 268);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 269);
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
            _yuitest_coverfunc("./src/eventhub.js", "countCallbacks", 283);
_yuitest_coverline("./src/eventhub.js", 284);
if ( !eventName ) { // => count all callback function within this namespace
                _yuitest_coverline("./src/eventhub.js", 285);
(options = options||{}).traverse = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 287);
var namespace = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 288);
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
            _yuitest_coverfunc("./src/eventhub.js", "countTriggers", 299);
_yuitest_coverline("./src/eventhub.js", 300);
if ( !eventName ) { // => count all triggers
                _yuitest_coverline("./src/eventhub.js", 301);
(options = options||{}).traverse = true ;
            }
            _yuitest_coverline("./src/eventhub.js", 303);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 304);
return sumPropertyInNamespace(stack, getTriggerCount, options||{}) ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    /*
     * An event can be in two states: disabled or enabled. The 'state' parameter holds the new state. This state
     * will be applied to all nested events.
     * @param {Object} namespace
     * @param {Boolean} state TRUE to disable the events
     */
    _yuitest_coverline("./src/eventhub.js", 316);
function changeStateEvent(namespace, state, options) {
        _yuitest_coverfunc("./src/eventhub.js", "changeStateEvent", 316);
_yuitest_coverline("./src/eventhub.js", 317);
var i ;

        _yuitest_coverline("./src/eventhub.js", 319);
for( i in namespace ) {
            _yuitest_coverline("./src/eventhub.js", 320);
if ( i === '__stack') {
                _yuitest_coverline("./src/eventhub.js", 321);
namespace.__stack.disabled = state ;
            }
            else {_yuitest_coverline("./src/eventhub.js", 323);
if ( options.traverse ) {
                _yuitest_coverline("./src/eventhub.js", 324);
changeStateEvent.call(this, namespace[i], state) ;
            }}
        }
    }
    /*
        Returns the sum of a stack property. The specific property is implemented in propertyFunc
     */
    _yuitest_coverline("./src/eventhub.js", 331);
function sumPropertyInNamespace(namespace, propertyFunc, options) {
        _yuitest_coverfunc("./src/eventhub.js", "sumPropertyInNamespace", 331);
_yuitest_coverline("./src/eventhub.js", 332);
var i
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 335);
for( i in namespace ) {
            _yuitest_coverline("./src/eventhub.js", 336);
if ( i === '__stack' ) {
                _yuitest_coverline("./src/eventhub.js", 337);
retVal += propertyFunc(namespace.__stack, options) ;
            }
            else {_yuitest_coverline("./src/eventhub.js", 339);
if ( options.traverse === true  ) {
                _yuitest_coverline("./src/eventhub.js", 340);
retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options) ;
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 343);
return retVal ;
    }

    /*
        Returns the number of callback function present in this stack
     */
    _yuitest_coverline("./src/eventhub.js", 349);
function getCallbackCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getCallbackCount", 349);
_yuitest_coverline("./src/eventhub.js", 350);
var i
            , retVal = 0 ;
        _yuitest_coverline("./src/eventhub.js", 352);
for ( i in stack.on ) {
            _yuitest_coverline("./src/eventhub.js", 353);
if ( stack.on[i].eventMode === options.eventMode ) {
                _yuitest_coverline("./src/eventhub.js", 354);
retVal ++ ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 357);
return retVal ;
    }

    /*
        Returns the trigger count of this stack
     */
    _yuitest_coverline("./src/eventhub.js", 363);
function getTriggerCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getTriggerCount", 363);
_yuitest_coverline("./src/eventhub.js", 364);
return stack.triggers ;
    }

    _yuitest_coverline("./src/eventhub.js", 367);
function addCallbackToStack(eventName, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 367);
_yuitest_coverline("./src/eventhub.js", 368);
var obj = null
            , stack ;
        _yuitest_coverline("./src/eventhub.js", 370);
if ( checkInput(eventName, callback)) {                                     // validate input
            _yuitest_coverline("./src/eventhub.js", 371);
stack = createStack.call(this, eventName) ;                             // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 372);
if ( canAddCallback.call(this, stack.__stack.on, callback, options) === true ) {                       // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 373);
obj = { fn: callback, eventMode: options.eventMode } ;
                _yuitest_coverline("./src/eventhub.js", 374);
stack.__stack.on[options.prepend ? 'unshift':'push'](obj) ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 377);
return obj ;
    }

    /*
        determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true
     */
    _yuitest_coverline("./src/eventhub.js", 383);
function canAddCallback(callbacks, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "canAddCallback", 383);
_yuitest_coverline("./src/eventhub.js", 384);
var i
            , retVal = true
            , eventMode = options.eventMode ;//|| undefined ;

        _yuitest_coverline("./src/eventhub.js", 388);
if (this.allowMultiple === false ) {
            _yuitest_coverline("./src/eventhub.js", 389);
for( i = 0; i < callbacks.length; i++ ) {
                _yuitest_coverline("./src/eventhub.js", 390);
if ( callbacks[i].fn === callback && (
                        callbacks[i].eventMode === eventMode ||                                 // they are identical
                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'
                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)
                    ) {
                        _yuitest_coverline("./src/eventhub.js", 395);
retVal = false ;
                        _yuitest_coverline("./src/eventhub.js", 396);
break ;
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 400);
return retVal ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 408);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 408);
_yuitest_coverline("./src/eventhub.js", 409);
var retVal = false ;
        _yuitest_coverline("./src/eventhub.js", 410);
if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            _yuitest_coverline("./src/eventhub.js", 411);
retVal = true ;
        }
        else {_yuitest_coverline("./src/eventhub.js", 413);
if ( ns.DEBUG ) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 414);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
        }}
        _yuitest_coverline("./src/eventhub.js", 416);
return retVal ;
    }

    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 424);
function removeFromNamespace(namespaces, callback, options) {
            _yuitest_coverfunc("./src/eventhub.js", "removeFromNamespace", 424);
_yuitest_coverline("./src/eventhub.js", 425);
var retVal = 0                                              // number of removed callbacks
            , namespace
            , i ;                                                       // loop var

        _yuitest_coverline("./src/eventhub.js", 429);
for( i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)
            _yuitest_coverline("./src/eventhub.js", 430);
namespace = namespaces[i] ;
            _yuitest_coverline("./src/eventhub.js", 431);
if ( i === '__stack') {
                    _yuitest_coverline("./src/eventhub.js", 432);
retVal += removeCallback(namespace.on, callback, options) ;
            }
            else {_yuitest_coverline("./src/eventhub.js", 434);
if ( options.traverse ) {                              // NO, its a namesapace -> recursion
               _yuitest_coverline("./src/eventhub.js", 435);
retVal += removeFromNamespace.call(this, namespace, callback, options ) ;
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 438);
return retVal ;                                             // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 444);
function removeCallback(list, callback, options){
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 444);
_yuitest_coverline("./src/eventhub.js", 445);
var i                                             // position on the stack
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 448);
for( i = list.length-1; i >= 0; i-- ){
            _yuitest_coverline("./src/eventhub.js", 449);
if ( (list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode ) {
                _yuitest_coverline("./src/eventhub.js", 450);
list.splice(i, 1) ;
                _yuitest_coverline("./src/eventhub.js", 451);
retVal ++ ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 454);
return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 461);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 461);
_yuitest_coverline("./src/eventhub.js", 462);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 466);
for( i = 0; i < parts.length; i++ ) {
            _yuitest_coverline("./src/eventhub.js", 467);
if ( ! stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 468);
return null ;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 470);
stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 472);
return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    _yuitest_coverline("./src/eventhub.js", 482);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 482);
_yuitest_coverline("./src/eventhub.js", 483);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 487);
for(i = 0; i < parts.length ; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 488);
if ( !stack[parts[i]] ){                        // if not exists --> create it
                _yuitest_coverline("./src/eventhub.js", 489);
stack[parts[i]] = {
                    __stack: {                              // holds all info for this namespace (not the child namespaces)
                        on: []                              // callback stack
                        , parent: stack                     // parent namespace/object
                        , triggers: 0                       // count triggers
                        , disabled: false                   // by default the namespace/event is enabled
                    }
                } ;
            }
            _yuitest_coverline("./src/eventhub.js", 498);
stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        _yuitest_coverline("./src/eventhub.js", 500);
return stack ;
    }

    _yuitest_coverline("./src/eventhub.js", 503);
function triggerEventCapture(eventName, data) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventCapture", 503);
_yuitest_coverline("./src/eventhub.js", 504);
var i
            , namespace = this._rootStack
            , parts = eventName.split('.') || []
            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING
            , retVal = 0 ; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root

        _yuitest_coverline("./src/eventhub.js", 510);
if ( parts.length > 1 ) {
            _yuitest_coverline("./src/eventhub.js", 511);
for( i = 0; i < parts.length -1; i++ ) {        // loop through namespace (not the last part)
                _yuitest_coverline("./src/eventhub.js", 512);
namespace = namespace[parts[i]] ;
                _yuitest_coverline("./src/eventhub.js", 513);
retVal += callCallbacks(namespace, data, eventMode) ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 516);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 519);
function triggerEventBubble(namespace, data) {
        //var namespace = namespaces.__stack.parent ;
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventBubble", 519);
_yuitest_coverline("./src/eventhub.js", 521);
var eventMode = DEFAULTS.EVENT_MODE.BUBBLING
            , retVal = 0 ;

        _yuitest_coverline("./src/eventhub.js", 524);
while( namespace.__stack.parent ) {
            _yuitest_coverline("./src/eventhub.js", 525);
namespace = namespace.__stack.parent ;
            _yuitest_coverline("./src/eventhub.js", 526);
retVal += callCallbacks(namespace, data, eventMode) ;
        }
        _yuitest_coverline("./src/eventhub.js", 528);
return retVal ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).
     */
    _yuitest_coverline("./src/eventhub.js", 535);
function triggerEvent(stack, data, options) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 535);
_yuitest_coverline("./src/eventhub.js", 536);
var  retVal = 0
            , ns ;                                                  // loop index

        _yuitest_coverline("./src/eventhub.js", 539);
if ( !stack.disabled ) {                                    // if this node/event is disabled, don't traverse the namespace deeper
            _yuitest_coverline("./src/eventhub.js", 540);
for( ns in stack ) {
                _yuitest_coverline("./src/eventhub.js", 541);
if ( ns === "__stack" ) {
                    _yuitest_coverline("./src/eventhub.js", 542);
retVal += callCallbacks(stack, data) ;
                }
                else {_yuitest_coverline("./src/eventhub.js", 544);
if ( options.traverse ) {                           // found a deeper nested namespace
                    _yuitest_coverline("./src/eventhub.js", 545);
retVal += triggerEvent(stack[ns], data, options) ;  // nested namespaces. NOTE that the 'eventName' is omitted!!
                }}
            }
        }
        _yuitest_coverline("./src/eventhub.js", 549);
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
    _yuitest_coverline("./src/eventhub.js", 560);
function callCallbacks(namespace, data, eventMode) {
        _yuitest_coverfunc("./src/eventhub.js", "callCallbacks", 560);
_yuitest_coverline("./src/eventhub.js", 561);
var i
            , retVal = 0
            , callback ;

        _yuitest_coverline("./src/eventhub.js", 565);
for( i = 0; i < namespace.__stack.on.length ; i++ ) {           // loop through all callbacks
            _yuitest_coverline("./src/eventhub.js", 566);
callback = namespace.__stack.on[i] ;
            _yuitest_coverline("./src/eventhub.js", 567);
if ( callback.eventMode === eventMode ) {                   // trigger callbacks depending on their event-mode
                _yuitest_coverline("./src/eventhub.js", 568);
retVal ++ ;                                             // count this trigger
                _yuitest_coverline("./src/eventhub.js", 569);
callback.fn(data) ;                                     // call the callback
                _yuitest_coverline("./src/eventhub.js", 570);
if ( callback.isOne ) {
                    _yuitest_coverline("./src/eventhub.js", 571);
namespace.__stack.on.splice(i--, 1) ;               // remove callback for index is i, and afterwards fix loop index with i--
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 575);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 578);
ns.EventHub = Eventhub ;

})(window.Sway) ;
