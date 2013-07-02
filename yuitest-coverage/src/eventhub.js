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
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {}; // make sure it exists","","(function (ns, DEBUG) {","    var DEFAULTS = {","            /**","             * Contains available event modes. For example, if <tt>bar.foo</tt> is triggered, both event modes do the opposite","             *","             *                    | |                                     / \\","             *     ---------------| |-----------------     ---------------| |-----------------","             *     | bar          | |                |     | bar          | |                |","             *     |   -----------| |-----------     |     |   -----------| |-----------     |","             *     |   |bar.foo   \\ /          |     |     |   |bar.foo   | |          |     |","             *     |   -------------------------     |     |   -------------------------     |","             *     |        Event CAPTURING          |     |        Event BUBBLING           |","             *     -----------------------------------     -----------------------------------","             *","             * The event model implemented in this class does both, going from <tt>bubbling</tt> to the execution of all callbacks in <tt>bar.foo</tt>,","             * then back in <tt>capturing</tt> mode","             *","             *                                   | |  / \\","             *                  -----------------| |--| |-----------------","             *                  | bar            | |  | |                |","             *                  |   -------------| |--| |-----------     |","             *                  |   |bar.foo     \\ /  | |          |     |","             *                  |   --------------------------------     |","             *                  |               event model              |","             *                  ------------------------------------------","             *","             *     eventHub.on('bar.foo', myFunc1) ;","             *     eventHub.on('bar', myFunc2, { eventMode: Sway.EventHub.EVENT_MODE.CAPTURING }) ;","             *     eventHub.on('bar', myFunc3, { eventMode: Sway.EventHub.EVENT_MODE.BUBBLING }) ;","             *     eventHub.on('bar', myFunc4, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","             *     eventHub.trigger('bar.foo') ; // -> callback execution order: myFunc3, myFunc4, myFunc1, myFunc2 and myFunc4","             *","             * @property {Object} EVENT_MODE","             * @static","             * @example","             */","            EVENT_MODE: {","                /**","                 * Defines the capturing event mode","                 * @property {String} EVENT_MODE.CAPTURING","                 * @static","                 */","                CAPTURING: 'capture'           // event goes from root to target","                /**","                 * Defines the bubbling event mode","                 * @property {String} EVENT_MODE.BUBBLING","                 * @static","                 */","                , BUBBLING: 'bubble'            // event goes from target to root","                /**","                 * Represent both capturing and bubbling event modes","                 * @property {String} EVENT_MODE.BOTH","                 * @static","                 */","                , BOTH: 'both'","            }","            /* PRIVATE PROPERTY","             * Default setting, to allow the same callback to be registered multiple times to the same event","             */, ALLOW_MULTIPLE: true","        }","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too.","     *","     * Namespaces are separated by a dot, like","     *","     *     bar.foo1","     *     bar.foo2","     *     bar.bar1.foo1","     *","     * A Namespace and an Eventname are actually more or less the same thing:","     *","     *     eventHub.on('bar', myFunc1) ;","     *     eventHub.on('bar.foo1', myFunc2) ;","     *     eventHub.on('bar.bar1', myFunc3) ;","     *     eventHub.on('bar.bar1.foo1', myFunc4) ;","     *","     * The advantage of namespaced events is that it facilitates triggering groups of events","     *","     *     eventHub.trigger('bar') ;        // --> triggers: myFunc1, myFunc2, myFunc3 and myFunc4","     *     eventHub.trigger('bar.bar1');    // --> triggers: myFunc3 and myFunc4","     *","     * @class Sway.EventHub","     * @constructor","     * @param {Object} [options] configuration parameters","     *      @param {Boolean} [options.allowMultiple=TRUE] accept multiple registrations of the same function for the same event","     */","        , Eventhub = function (options) {","            Object.defineProperty(this, '_rootStack',","                {","                    value: { __stack: { triggers: 0, on: [], one: []} }, enumerable: false // hide it","                }","            );","            Object.defineProperty(this, '_eventNameIndex',","                {","                    value: 0, enumerable: false // hide it","                    , writable: true    // otherwise ++ will not work","                }","            );","            this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE;","        };","","    Eventhub.EVENT_MODE = DEFAULTS.EVENT_MODE;                   // set static properies","","    Eventhub.prototype = {","        /**","         * Generates an unique event name","         * @method generateUniqueEventName","         * @return {String} unique event name","         */","        generateUniqueEventName: function () {","            return '--eh--' + this._eventNameIndex++;     // first event-name will be: --eh--0","        }","","        /**","         *","         * @method setAllowMultiple","         * @chainable","         * @param {Boolean} state accept multiple registrations of the same function for the same event","         */","        , setAllowMultiple: function (state) {","            this.allowMultiple = state;","            return this;","        }","        /**","         * Enable an event name. See {{#crossLink \"Sway.EventHub/disable:method\"}}{{/crossLink}}","         * @method enable","         * @chainable","         * @param {String} eventName name of the event","         * @param {Object} [options] configuration","         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE","         */","        , enable: function (eventName, options) {","            var namespace = getStack.call(this, eventName);","","            changeStateEvent.call(this, namespace || {}, false, options || {});","            return this;","        }","        /**","         * Disable an event. All triggers on a disabled event are ignored and no event propagation takes place. For example","         *","         *     eventHub.on('bar', callback1, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","         *     eventHub.on('bar', callback2) ;","         *     eventHub.on('bar.foo', callback3, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","         *     eventHub.on('bar.foo', callback4) ;","         *     eventHub.on('bar.foo.do', callback5 { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;","         *     eventHub.on('bar.foo.do', callback6) ;","         *     eventHub.disable('bar') ;","         *","         *     eventHub.trigger('bar')          // -> no callbacks called","         *     eventHub.trigger('bar.foo')      // -> callback execution order: callback2, callback3, callback2","         *","         * @method disable","         * @chainable","         * @param {String} eventNname name of the event","         * @param {Object} [options] configuration","         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE","         */","        , disable: function (eventName, options) {","            var namespace = getStack.call(this, eventName);","","            changeStateEvent.call(this, namespace || {}, true, options || {});","            return this;","        }","        /**","         * check if a specific event is disabled.","         * @method isDisabled","         * @param {String} eventName name of the event","         * @return {Boolean} TRUE if the event is disabled. If the event does not exists, FALSE is returned","         */, isDisabled: function (eventName) {","            var namespace = getStack.call(this, eventName);","            return namespace ? namespace.__stack.disabled : false;","        }","","        /**","         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName name of the event or namespace","         * @param {*} data data passed to the triggered callback function","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.traverse=false] trigger all callbacks in nested namespaces","         *      @param {String}  [options.eventMode] define the event mode to be used","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update' ) ;                                      // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', null, {traverse: true} ) ;                     // trigger all nested events and namespaces inside the 'ui' namespace","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true}, {traverse: true} ) ;    // trigger all nested events and namespaces inside the 'ui' namespace","         */","        , trigger: function (eventName, data, options) {","            var retVal = 0","                , namespace;","            if ((namespace = getStack.call(this, eventName)) && !!!namespace.__stack.disabled) {  // check if the eventName exists and not being disabled","                retVal = triggerEventCapture.call(this, eventName || '', data, options||{}) +              // NOTE that eventName can be empty!","                    triggerEvent(namespace, data, options || {}) +","                    ((eventName || '').match(/\\./) !== null ? triggerEventBubble(namespace, data, options||{}) : 0);","","                namespace.__stack.triggers++;                                             // count the trigger","                namespace.__stack.one = [];                                                // cleanup","            }","            return retVal;                                                                 // return the number of triggered callback functions","        }","","        /**","         * Register a callback for a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others. With the 'options'","         * parameter it is also possible to execute the callback in a capturing or bubbling phase.","         *","         * @method on","         * @param {String} eventName","         * @param {Function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt>, <tt>bubble</tt> or both","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), {prepend: true, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING} ) ;","         */","        , on: function (eventName, callback, options) {","            return addCallbackToStack.call(this, eventName, callback, options || {}) !== null;","        }","","","        /**","         * Register a callback for a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {Object} [options] configuration","         *      @param {Boolean} [options.prepend] if TRUE, the callback is placed before all other registered callbacks.","         *      @param {String} [options.eventMode=null] the event mode for which the callback is triggered too. Available modes are","         *          <tt>capture</tt> and <tt>bubble</tt>","         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered","         */","        , one: function (eventName, callback, options) {","            var obj = addCallbackToStack.call(this, eventName, callback, options || {});","            if (obj) { // if obj exists, the callback was added.","                obj.isOne = true;","            }","            return obj !== null;","        }","","        /**","         * Removes the given callback for a specific event. However, if a callback is registered with an 'eventMode', the","         * callback can only be removed if that eventMode is specified too!","         *","         * @method off","         * @param {String} eventName","         * @param {Function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @param {Object} options configuration","         *      @param {Boolean} [options.traverse=false] traverse all nested namespaces","         *      @param {String} [options.eventMode=null] the event mode of the callback to be removed","         *      @param {Boolean} [options.isOne]","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui.update', this.update, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function (eventName, callback, options) {","            if ( typeof callback !== 'function' ) {                         // fix input","                options = callback ;","                callback = null ;","            }","            var stack = getStack.call(this, eventName);","            return removeFromNamespace(stack, callback, options || {});","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method countCallbacks","         * @param {Sting} eventName the event name for which all registered callbacks are counted (including nested event names).","         * @param {Object} [options] configuration","         *      @param {String} [options.eventMode] the event mode; Sway.EventHub.CAPTURING or Sway.EventHub.BUBBLE","         *      @param {Boolean} [options.traverse=false] traverse all nested namepsaces","         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists","         * TODO: etype is not used","         */","        , countCallbacks: function (eventName, options) {","            if (!eventName) { // => count all callback function within this namespace","                (options = options || {}).traverse = true;","            }","            var namespace = getStack.call(this, eventName);","            return sumPropertyInNamespace(namespace, getCallbackCount, options || {});","        }","","        /**","         * returns the the trigger count for this event","         * @method countTrigger","         * @param {sting} [eventName] the event name","         * @param {Object} [options]","         *      @param {Boolean} [options.traverse=false] traverse all nested namepsaces","         * @return {Number} trigger count. -1 is returned if the event name does not exist","         */","        , countTriggers: function (eventName, options) {","            if (!eventName) { // => count all triggers","                (options = options || {}).traverse = true;","            }","            var stack = getStack.call(this, eventName);","            return sumPropertyInNamespace(stack, getTriggerCount, options || {});","        }","    };","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    /*","     * An event can be in two states: disabled or enabled. The 'state' parameter holds the new state. This state","     * will be applied to all nested events.","     * @param {Object} namespace","     * @param {Boolean} state TRUE to disable the events","     */","    function changeStateEvent(namespace, state, options) {","        var i;","","        for (i in namespace) {","            if (i === '__stack') {","                namespace.__stack.disabled = state;","            }","            else if (options.traverse) {","                changeStateEvent.call(this, namespace[i], state, options);","            }","        }","    }","","    /*","     Returns the sum of a stack property. The specific property is implemented in propertyFunc","     */","    function sumPropertyInNamespace(namespace, propertyFunc, options) {","        var i","            , retVal = 0;","","        for (i in namespace) {","            if (i === '__stack') {","                retVal += propertyFunc(namespace.__stack, options);","            }","            else if (options.traverse === true) {","                retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options);","            }","        }","        return retVal;","    }","","    /*","     Returns the number of callback function present in this stack","     */","    function getCallbackCount(stack, options) {","        var i","            , retVal = 0;","        for (i in stack.on) {","            if (stack.on[i].eventMode === options.eventMode) {","                retVal++;","            }","        }","        return retVal;","    }","","    /*","     Returns the trigger count of this stack","     */","    function getTriggerCount(stack, options) {","        return stack.triggers;","    }","","    function addCallbackToStack(eventName, callback, options) {","        var obj = null","            , stack;","        if (checkInput(eventName, callback)) {                                     // validate input","            stack = createStack.call(this, eventName);                             // get stack of 'eventName'","            if (canAddCallback.call(this, stack.__stack.on, callback, options) === true) {                       // check if the callback is not already added","                obj = {","                    fn: callback,","                    eventMode: options.eventMode,","                    isOne: false","                };","                stack.__stack.on[options.prepend ? 'unshift' : 'push'](obj);","            }","        }","        return obj;","    }","","    /*","     determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true","     */","    function canAddCallback(callbacks, callback, options) {","        var i","            , retVal = true","            , eventMode = options.eventMode;//|| undefined ;","","        if (this.allowMultiple === false) {","            for (i = 0; i < callbacks.length; i++) {","                if (callbacks[i].fn === callback && (","                    callbacks[i].eventMode === eventMode ||                                 // they are identical","                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'","                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)","                    ) {","                    retVal = false;","                    break;","                }","            }","        }","        return retVal;","    }","","","    /* Validate the input for 'on' and 'one'.","     eventName: should be defined and of type \"string\"","     callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        var retVal = false;","        if (typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\") { // OK","            retVal = true;","        }","        else if (DEBUG) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\");","        }","        return retVal;","    }","","    /*","     Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","     can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","     is erased.","     */","    function removeFromNamespace(namespaces, callback, options) {","        var retVal = 0                                              // number of removed callbacks","            , namespace","            , i;                                                       // loop var","","        for (i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)","            namespace = namespaces[i];","            if (i === '__stack') {","                retVal += removeCallback(namespace.on, callback, options);","            }","            else if (options.traverse) {                              // NO, its a namesapace -> recursion","                retVal += removeFromNamespace.call(this, namespace, callback, options);","            }","        }","        return retVal;                                             // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","     multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback, options) {","        var i                                             // position on the stack","            , retVal = 0;","","        for (i = list.length - 1; i >= 0; i--) {","            if ((list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode","                && (options.isOne === list[i].isOne || options.isOne === undefined || options.isOne === null)","            /*","             && ( options.isOne === undefined || options.isOne === null || options.isOne === list[i].isOne","             || (options.isOne === false && list[i].isOne === undefined)","             )","             */","                ) {","                list.splice(i, 1);","                retVal++;","            }","        }","        return retVal;","    }","","    /*","     This private function returns the callback stack matched by 'eventName'. If the eventName does","     not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","            , stack = this._rootStack                   // root of the callback stack","            , i;                                       // loop index","","        for (i = 0; i < parts.length; i++) {","            if (!stack[parts[i]]) {","                return null;                               // it does not exist -> done","            }","            stack = stack[parts[i]];                       // traverse a level deeper into the stack","        }","        return stack;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack. This function always increases the count for each namespace","     * because this function is only called when adding a new callback. Finally, if the namespace","     * does not exist, it is created.","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i;                                           // loop index","","        for (i = 0; i < parts.length; i++) {                // traverse the stack","            if (!stack[parts[i]]) {                        // if not exists --> create it","                stack[parts[i]] = {","                    __stack: {                              // holds all info for this namespace (not the child namespaces)","                        on: []                              // callback stack","                        , parent: stack                     // parent namespace/object","                        , triggers: 0                       // count triggers","                        , disabled: false                   // by default the namespace/event is enabled","                    }","                };","            }","            stack = stack[parts[i]];                       // go into the (newly created) namespace","        }","        return stack;","    }","","    function triggerEventCapture(eventName, data, options) {","        var i","            , namespace = this._rootStack","            , parts = eventName.split('.') || []","            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING","            , retVal = 0; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root","","        if (parts.length > 1 && (!options.eventMode || options.eventMode === DEFAULTS.EVENT_MODE.BOTH || options.eventMode === DEFAULTS.EVENT_MODE.CAPTURING)) {","            for (i = 0; i < parts.length - 1; i++) {        // loop through namespace (not the last part)","                namespace = namespace[parts[i]];","                retVal += callCallbacks(namespace, data, eventMode);","            }","        }","        return retVal;","    }","","    function triggerEventBubble(namespace, data, options) {","        //var namespace = namespaces.__stack.parent ;","        var eventMode = DEFAULTS.EVENT_MODE.BUBBLING","            , retVal = 0;","","        if ( !options.eventMode || options.eventMode === DEFAULTS.EVENT_MODE.BOTH || options.eventMode === DEFAULTS.EVENT_MODE.BUBBLING) {","            while (namespace.__stack.parent) {","                namespace = namespace.__stack.parent;","                retVal += callCallbacks(namespace, data, eventMode);","            }","        }","        return retVal;","    }","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).","     */","    function triggerEvent(stack, data, options) {","        var retVal = 0","            , ns;                                                  // loop index","","        if (!stack.disabled) {                                    // if this node/event is disabled, don't traverse the namespace deeper","            for (ns in stack) {","                if (ns === \"__stack\") {","                    retVal += callCallbacks(stack, data);","                }","                else if (options.traverse) {                           // found a deeper nested namespace","                    retVal += triggerEvent(stack[ns], data, options);  // nested namespaces. NOTE that the 'eventName' is omitted!!","                }","            }","        }","        return retVal;","    }","","    /*","     This method triggers the callback for a given namespace. It does not traverse the namespaces, it only loops through","     the 'on' list and afterwards checks if there are callbacks which should be removed (checking the 'one' list)","     If the 'eventMode' is defined, it only triggers callbacks which accept the eventMode.","     @param {Object} namespace","     @param {Anything} data","     @param {String} eventMode accepted values","     */","    function callCallbacks(namespace, data, eventMode) {","        var i","            , retVal = 0","            , callback;","","        if (!namespace.__stack.disabled) {","            for (i = 0; i < namespace.__stack.on.length; i++) {           // loop through all callbacks","                callback = namespace.__stack.on[i];","                if (callback.eventMode === eventMode || eventMode && callback.eventMode === DEFAULTS.EVENT_MODE.BOTH ) { // trigger callbacks depending on their event-mode","                    retVal++;                                             // count this trigger","                    callback.fn(data);                                     // call the callback","                    if (callback.isOne) {","                        namespace.__stack.on.splice(i--, 1);               // remove callback for index is i, and afterwards fix loop index with i--","                    }","                }","            }","        }","        return retVal;","    }","","    ns.EventHub = Eventhub;","})(window.Sway, window.Sway.DEBUG);"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"4":0,"91":0,"96":0,"102":0,"105":0,"107":0,"114":0,"124":0,"125":0,"136":0,"138":0,"139":0,"162":0,"164":0,"165":0,"173":0,"174":0,"195":0,"197":0,"198":0,"202":0,"203":0,"205":0,"226":0,"244":0,"245":0,"246":0,"248":0,"270":0,"271":0,"272":0,"274":0,"275":0,"290":0,"291":0,"293":0,"294":0,"306":0,"307":0,"309":0,"310":0,"322":0,"323":0,"325":0,"326":0,"327":0,"329":0,"330":0,"338":0,"339":0,"342":0,"343":0,"344":0,"346":0,"347":0,"350":0,"356":0,"357":0,"359":0,"360":0,"361":0,"364":0,"370":0,"371":0,"374":0,"375":0,"377":0,"378":0,"379":0,"380":0,"385":0,"388":0,"394":0,"395":0,"399":0,"400":0,"401":0,"406":0,"407":0,"411":0,"419":0,"420":0,"421":0,"422":0,"424":0,"425":0,"427":0,"435":0,"436":0,"440":0,"441":0,"442":0,"443":0,"445":0,"446":0,"449":0,"455":0,"456":0,"459":0,"460":0,"468":0,"469":0,"472":0,"479":0,"480":0,"484":0,"485":0,"486":0,"488":0,"490":0,"500":0,"501":0,"505":0,"506":0,"507":0,"516":0,"518":0,"521":0,"522":0,"528":0,"529":0,"530":0,"531":0,"534":0,"537":0,"539":0,"542":0,"543":0,"544":0,"545":0,"548":0,"555":0,"556":0,"559":0,"560":0,"561":0,"562":0,"564":0,"565":0,"569":0,"580":0,"581":0,"585":0,"586":0,"587":0,"588":0,"589":0,"590":0,"591":0,"592":0,"597":0,"600":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"Eventhub:90":0,"generateUniqueEventName:113":0,"setAllowMultiple:123":0,"enable:135":0,"disable:161":0,"isDisabled:172":0,"trigger:194":0,"on:225":0,"one:243":0,"off:269":0,"countCallbacks:289":0,"countTriggers:305":0,"changeStateEvent:322":0,"sumPropertyInNamespace:338":0,"getCallbackCount:356":0,"getTriggerCount:370":0,"addCallbackToStack:374":0,"canAddCallback:394":0,"checkInput:419":0,"removeFromNamespace:435":0,"removeCallback:455":0,"getStack:479":0,"createStack:500":0,"triggerEventCapture:521":0,"triggerEventBubble:537":0,"triggerEvent:555":0,"callCallbacks:580":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 154;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 28;
_yuitest_coverline("./src/eventhub.js", 1);
window.Sway = window.Sway || {}; // make sure it exists

_yuitest_coverline("./src/eventhub.js", 3);
(function (ns, DEBUG) {
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
                CAPTURING: 'capture'           // event goes from root to target
                /**
                 * Defines the bubbling event mode
                 * @property {String} EVENT_MODE.BUBBLING
                 * @static
                 */
                , BUBBLING: 'bubble'            // event goes from target to root
                /**
                 * Represent both capturing and bubbling event modes
                 * @property {String} EVENT_MODE.BOTH
                 * @static
                 */
                , BOTH: 'both'
            }
            /* PRIVATE PROPERTY
             * Default setting, to allow the same callback to be registered multiple times to the same event
             */, ALLOW_MULTIPLE: true
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
     *      @param {Boolean} [options.allowMultiple=TRUE] accept multiple registrations of the same function for the same event
     */
        , Eventhub = function (options) {
            _yuitest_coverfunc("./src/eventhub.js", "Eventhub", 90);
_yuitest_coverline("./src/eventhub.js", 91);
Object.defineProperty(this, '_rootStack',
                {
                    value: { __stack: { triggers: 0, on: [], one: []} }, enumerable: false // hide it
                }
            );
            _yuitest_coverline("./src/eventhub.js", 96);
Object.defineProperty(this, '_eventNameIndex',
                {
                    value: 0, enumerable: false // hide it
                    , writable: true    // otherwise ++ will not work
                }
            );
            _yuitest_coverline("./src/eventhub.js", 102);
this.allowMultiple = options && typeof(options.allowMultiple) === 'boolean' ? options.allowMultiple : DEFAULTS.ALLOW_MULTIPLE;
        };

    _yuitest_coverline("./src/eventhub.js", 105);
Eventhub.EVENT_MODE = DEFAULTS.EVENT_MODE;                   // set static properies

    _yuitest_coverline("./src/eventhub.js", 107);
Eventhub.prototype = {
        /**
         * Generates an unique event name
         * @method generateUniqueEventName
         * @return {String} unique event name
         */
        generateUniqueEventName: function () {
            _yuitest_coverfunc("./src/eventhub.js", "generateUniqueEventName", 113);
_yuitest_coverline("./src/eventhub.js", 114);
return '--eh--' + this._eventNameIndex++;     // first event-name will be: --eh--0
        }

        /**
         *
         * @method setAllowMultiple
         * @chainable
         * @param {Boolean} state accept multiple registrations of the same function for the same event
         */
        , setAllowMultiple: function (state) {
            _yuitest_coverfunc("./src/eventhub.js", "setAllowMultiple", 123);
_yuitest_coverline("./src/eventhub.js", 124);
this.allowMultiple = state;
            _yuitest_coverline("./src/eventhub.js", 125);
return this;
        }
        /**
         * Enable an event name. See {{#crossLink "Sway.EventHub/disable:method"}}{{/crossLink}}
         * @method enable
         * @chainable
         * @param {String} eventName name of the event
         * @param {Object} [options] configuration
         *  @param {Boolean} [options.traverse=false] disable nested events as wel if set to TRUE
         */
        , enable: function (eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "enable", 135);
_yuitest_coverline("./src/eventhub.js", 136);
var namespace = getStack.call(this, eventName);

            _yuitest_coverline("./src/eventhub.js", 138);
changeStateEvent.call(this, namespace || {}, false, options || {});
            _yuitest_coverline("./src/eventhub.js", 139);
return this;
        }
        /**
         * Disable an event. All triggers on a disabled event are ignored and no event propagation takes place. For example
         *
         *     eventHub.on('bar', callback1, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;
         *     eventHub.on('bar', callback2) ;
         *     eventHub.on('bar.foo', callback3, { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;
         *     eventHub.on('bar.foo', callback4) ;
         *     eventHub.on('bar.foo.do', callback5 { eventMode: Sway.EventHub.EVENT_MODE.BOTH }) ;
         *     eventHub.on('bar.foo.do', callback6) ;
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
        , disable: function (eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "disable", 161);
_yuitest_coverline("./src/eventhub.js", 162);
var namespace = getStack.call(this, eventName);

            _yuitest_coverline("./src/eventhub.js", 164);
changeStateEvent.call(this, namespace || {}, true, options || {});
            _yuitest_coverline("./src/eventhub.js", 165);
return this;
        }
        /**
         * check if a specific event is disabled.
         * @method isDisabled
         * @param {String} eventName name of the event
         * @return {Boolean} TRUE if the event is disabled. If the event does not exists, FALSE is returned
         */, isDisabled: function (eventName) {
            _yuitest_coverfunc("./src/eventhub.js", "isDisabled", 172);
_yuitest_coverline("./src/eventhub.js", 173);
var namespace = getStack.call(this, eventName);
            _yuitest_coverline("./src/eventhub.js", 174);
return namespace ? namespace.__stack.disabled : false;
        }

        /**
         * Triggers one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and
         * namespaces will be triggered.
         *
         * @method trigger
         * @param {string} eventName name of the event or namespace
         * @param {*} data data passed to the triggered callback function
         * @param {Object} [options] configuration
         *      @param {Boolean} [options.traverse=false] trigger all callbacks in nested namespaces
         *      @param {String}  [options.eventMode] define the event mode to be used
         * @return {Number} the count of triggered callbacks
         * @example
         Sway.eventHub.trigger('ui.update' ) ;                                      // trigger the 'update' event inside the 'ui' namespace
         Sway.eventHub.trigger('ui', null, {traverse: true} ) ;                     // trigger all nested events and namespaces inside the 'ui' namespace
         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ;               // trigger the 'update' event inside the 'ui' namespace
         Sway.eventHub.trigger('ui', {authenticated: true}, {traverse: true} ) ;    // trigger all nested events and namespaces inside the 'ui' namespace
         */
        , trigger: function (eventName, data, options) {
            _yuitest_coverfunc("./src/eventhub.js", "trigger", 194);
_yuitest_coverline("./src/eventhub.js", 195);
var retVal = 0
                , namespace;
            _yuitest_coverline("./src/eventhub.js", 197);
if ((namespace = getStack.call(this, eventName)) && !!!namespace.__stack.disabled) {  // check if the eventName exists and not being disabled
                _yuitest_coverline("./src/eventhub.js", 198);
retVal = triggerEventCapture.call(this, eventName || '', data, options||{}) +              // NOTE that eventName can be empty!
                    triggerEvent(namespace, data, options || {}) +
                    ((eventName || '').match(/\./) !== null ? triggerEventBubble(namespace, data, options||{}) : 0);

                _yuitest_coverline("./src/eventhub.js", 202);
namespace.__stack.triggers++;                                             // count the trigger
                _yuitest_coverline("./src/eventhub.js", 203);
namespace.__stack.one = [];                                                // cleanup
            }
            _yuitest_coverline("./src/eventhub.js", 205);
return retVal;                                                                 // return the number of triggered callback functions
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
         *          <tt>capture</tt>, <tt>bubble</tt> or both
         * @return {Boolean} TRUE if the callback is registered successfully. It will fail if the callback was already registered
         * @example
         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;
         Sway.eventHub.on( 'ui.update', this.update.bind(this), {prepend: true, eventMode: Sway.EventHub.EVENT_MODE.CAPTURING} ) ;
         */
        , on: function (eventName, callback, options) {
            _yuitest_coverfunc("./src/eventhub.js", "on", 225);
_yuitest_coverline("./src/eventhub.js", 226);
return addCallbackToStack.call(this, eventName, callback, options || {}) !== null;
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
        , one: function (eventName, callback, options) {
            _yuitest_coverfunc("./src/eventhub.js", "one", 243);
_yuitest_coverline("./src/eventhub.js", 244);
var obj = addCallbackToStack.call(this, eventName, callback, options || {});
            _yuitest_coverline("./src/eventhub.js", 245);
if (obj) { // if obj exists, the callback was added.
                _yuitest_coverline("./src/eventhub.js", 246);
obj.isOne = true;
            }
            _yuitest_coverline("./src/eventhub.js", 248);
return obj !== null;
        }

        /**
         * Removes the given callback for a specific event. However, if a callback is registered with an 'eventMode', the
         * callback can only be removed if that eventMode is specified too!
         *
         * @method off
         * @param {String} eventName
         * @param {Function} [callback] the callback function to be removed. If omitted, all registered events and nested
         * namespaces inside 'eventName' are removed
         * @param {Object} options configuration
         *      @param {Boolean} [options.traverse=false] traverse all nested namespaces
         *      @param {String} [options.eventMode=null] the event mode of the callback to be removed
         *      @param {Boolean} [options.isOne]
         * @return {Number} the count of removed callback functions
         * @example
         Sway.eventHub.off('ui.update', this.update) ;
         Sway.eventHub.off('ui.update', this.update, {eventMode: Sway.EventHub.EVENT_MODE.CAPTURING}) ;
         Sway.eventHub.off('ui') ;
         */
        , off: function (eventName, callback, options) {
            _yuitest_coverfunc("./src/eventhub.js", "off", 269);
_yuitest_coverline("./src/eventhub.js", 270);
if ( typeof callback !== 'function' ) {                         // fix input
                _yuitest_coverline("./src/eventhub.js", 271);
options = callback ;
                _yuitest_coverline("./src/eventhub.js", 272);
callback = null ;
            }
            _yuitest_coverline("./src/eventhub.js", 274);
var stack = getStack.call(this, eventName);
            _yuitest_coverline("./src/eventhub.js", 275);
return removeFromNamespace(stack, callback, options || {});
        }

        /**
         * count the registered callbacks for an event or namespace
         *
         * @method countCallbacks
         * @param {Sting} eventName the event name for which all registered callbacks are counted (including nested event names).
         * @param {Object} [options] configuration
         *      @param {String} [options.eventMode] the event mode; Sway.EventHub.CAPTURING or Sway.EventHub.BUBBLE
         *      @param {Boolean} [options.traverse=false] traverse all nested namepsaces
         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists
         * TODO: etype is not used
         */
        , countCallbacks: function (eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "countCallbacks", 289);
_yuitest_coverline("./src/eventhub.js", 290);
if (!eventName) { // => count all callback function within this namespace
                _yuitest_coverline("./src/eventhub.js", 291);
(options = options || {}).traverse = true;
            }
            _yuitest_coverline("./src/eventhub.js", 293);
var namespace = getStack.call(this, eventName);
            _yuitest_coverline("./src/eventhub.js", 294);
return sumPropertyInNamespace(namespace, getCallbackCount, options || {});
        }

        /**
         * returns the the trigger count for this event
         * @method countTrigger
         * @param {sting} [eventName] the event name
         * @param {Object} [options]
         *      @param {Boolean} [options.traverse=false] traverse all nested namepsaces
         * @return {Number} trigger count. -1 is returned if the event name does not exist
         */
        , countTriggers: function (eventName, options) {
            _yuitest_coverfunc("./src/eventhub.js", "countTriggers", 305);
_yuitest_coverline("./src/eventhub.js", 306);
if (!eventName) { // => count all triggers
                _yuitest_coverline("./src/eventhub.js", 307);
(options = options || {}).traverse = true;
            }
            _yuitest_coverline("./src/eventhub.js", 309);
var stack = getStack.call(this, eventName);
            _yuitest_coverline("./src/eventhub.js", 310);
return sumPropertyInNamespace(stack, getTriggerCount, options || {});
        }
    };

    /* ******** PRIVATE HELPER FUNCTION *********** */

    /*
     * An event can be in two states: disabled or enabled. The 'state' parameter holds the new state. This state
     * will be applied to all nested events.
     * @param {Object} namespace
     * @param {Boolean} state TRUE to disable the events
     */
    _yuitest_coverline("./src/eventhub.js", 322);
function changeStateEvent(namespace, state, options) {
        _yuitest_coverfunc("./src/eventhub.js", "changeStateEvent", 322);
_yuitest_coverline("./src/eventhub.js", 323);
var i;

        _yuitest_coverline("./src/eventhub.js", 325);
for (i in namespace) {
            _yuitest_coverline("./src/eventhub.js", 326);
if (i === '__stack') {
                _yuitest_coverline("./src/eventhub.js", 327);
namespace.__stack.disabled = state;
            }
            else {_yuitest_coverline("./src/eventhub.js", 329);
if (options.traverse) {
                _yuitest_coverline("./src/eventhub.js", 330);
changeStateEvent.call(this, namespace[i], state, options);
            }}
        }
    }

    /*
     Returns the sum of a stack property. The specific property is implemented in propertyFunc
     */
    _yuitest_coverline("./src/eventhub.js", 338);
function sumPropertyInNamespace(namespace, propertyFunc, options) {
        _yuitest_coverfunc("./src/eventhub.js", "sumPropertyInNamespace", 338);
_yuitest_coverline("./src/eventhub.js", 339);
var i
            , retVal = 0;

        _yuitest_coverline("./src/eventhub.js", 342);
for (i in namespace) {
            _yuitest_coverline("./src/eventhub.js", 343);
if (i === '__stack') {
                _yuitest_coverline("./src/eventhub.js", 344);
retVal += propertyFunc(namespace.__stack, options);
            }
            else {_yuitest_coverline("./src/eventhub.js", 346);
if (options.traverse === true) {
                _yuitest_coverline("./src/eventhub.js", 347);
retVal += sumPropertyInNamespace(namespace[i], propertyFunc, options);
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 350);
return retVal;
    }

    /*
     Returns the number of callback function present in this stack
     */
    _yuitest_coverline("./src/eventhub.js", 356);
function getCallbackCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getCallbackCount", 356);
_yuitest_coverline("./src/eventhub.js", 357);
var i
            , retVal = 0;
        _yuitest_coverline("./src/eventhub.js", 359);
for (i in stack.on) {
            _yuitest_coverline("./src/eventhub.js", 360);
if (stack.on[i].eventMode === options.eventMode) {
                _yuitest_coverline("./src/eventhub.js", 361);
retVal++;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 364);
return retVal;
    }

    /*
     Returns the trigger count of this stack
     */
    _yuitest_coverline("./src/eventhub.js", 370);
function getTriggerCount(stack, options) {
        _yuitest_coverfunc("./src/eventhub.js", "getTriggerCount", 370);
_yuitest_coverline("./src/eventhub.js", 371);
return stack.triggers;
    }

    _yuitest_coverline("./src/eventhub.js", 374);
function addCallbackToStack(eventName, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 374);
_yuitest_coverline("./src/eventhub.js", 375);
var obj = null
            , stack;
        _yuitest_coverline("./src/eventhub.js", 377);
if (checkInput(eventName, callback)) {                                     // validate input
            _yuitest_coverline("./src/eventhub.js", 378);
stack = createStack.call(this, eventName);                             // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 379);
if (canAddCallback.call(this, stack.__stack.on, callback, options) === true) {                       // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 380);
obj = {
                    fn: callback,
                    eventMode: options.eventMode,
                    isOne: false
                };
                _yuitest_coverline("./src/eventhub.js", 385);
stack.__stack.on[options.prepend ? 'unshift' : 'push'](obj);
            }
        }
        _yuitest_coverline("./src/eventhub.js", 388);
return obj;
    }

    /*
     determines if a callback can be added to a stack. If this.allowMultiple === true, it will always return true
     */
    _yuitest_coverline("./src/eventhub.js", 394);
function canAddCallback(callbacks, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "canAddCallback", 394);
_yuitest_coverline("./src/eventhub.js", 395);
var i
            , retVal = true
            , eventMode = options.eventMode;//|| undefined ;

        _yuitest_coverline("./src/eventhub.js", 399);
if (this.allowMultiple === false) {
            _yuitest_coverline("./src/eventhub.js", 400);
for (i = 0; i < callbacks.length; i++) {
                _yuitest_coverline("./src/eventhub.js", 401);
if (callbacks[i].fn === callback && (
                    callbacks[i].eventMode === eventMode ||                                 // they are identical
                        callbacks[i].eventMode && eventMode === DEFAULTS.EVENT_MODE.BOTH ||     // both defined and one set to 'BOTH'
                        eventMode && callbacks[i].eventMode === DEFAULTS.EVENT_MODE.BOTH )      // idem (switched)
                    ) {
                    _yuitest_coverline("./src/eventhub.js", 406);
retVal = false;
                    _yuitest_coverline("./src/eventhub.js", 407);
break;
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 411);
return retVal;
    }


    /* Validate the input for 'on' and 'one'.
     eventName: should be defined and of type "string"
     callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 419);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 419);
_yuitest_coverline("./src/eventhub.js", 420);
var retVal = false;
        _yuitest_coverline("./src/eventhub.js", 421);
if (typeof(eventName) === "string" && callback && typeof(callback) === "function") { // OK
            _yuitest_coverline("./src/eventhub.js", 422);
retVal = true;
        }
        else {_yuitest_coverline("./src/eventhub.js", 424);
if (DEBUG) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 425);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")");
        }}
        _yuitest_coverline("./src/eventhub.js", 427);
return retVal;
    }

    /*
     Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
     can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
     is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 435);
function removeFromNamespace(namespaces, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "removeFromNamespace", 435);
_yuitest_coverline("./src/eventhub.js", 436);
var retVal = 0                                              // number of removed callbacks
            , namespace
            , i;                                                       // loop var

        _yuitest_coverline("./src/eventhub.js", 440);
for (i in namespaces) {                                         // so we loop through all namespaces (and __stack is one of them)
            _yuitest_coverline("./src/eventhub.js", 441);
namespace = namespaces[i];
            _yuitest_coverline("./src/eventhub.js", 442);
if (i === '__stack') {
                _yuitest_coverline("./src/eventhub.js", 443);
retVal += removeCallback(namespace.on, callback, options);
            }
            else {_yuitest_coverline("./src/eventhub.js", 445);
if (options.traverse) {                              // NO, its a namesapace -> recursion
                _yuitest_coverline("./src/eventhub.js", 446);
retVal += removeFromNamespace.call(this, namespace, callback, options);
            }}
        }
        _yuitest_coverline("./src/eventhub.js", 449);
return retVal;                                             // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
     multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 455);
function removeCallback(list, callback, options) {
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 455);
_yuitest_coverline("./src/eventhub.js", 456);
var i                                             // position on the stack
            , retVal = 0;

        _yuitest_coverline("./src/eventhub.js", 459);
for (i = list.length - 1; i >= 0; i--) {
            _yuitest_coverline("./src/eventhub.js", 460);
if ((list[i].fn === callback || !callback) && list[i].eventMode === options.eventMode
                && (options.isOne === list[i].isOne || options.isOne === undefined || options.isOne === null)
            /*
             && ( options.isOne === undefined || options.isOne === null || options.isOne === list[i].isOne
             || (options.isOne === false && list[i].isOne === undefined)
             )
             */
                ) {
                _yuitest_coverline("./src/eventhub.js", 468);
list.splice(i, 1);
                _yuitest_coverline("./src/eventhub.js", 469);
retVal++;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 472);
return retVal;
    }

    /*
     This private function returns the callback stack matched by 'eventName'. If the eventName does
     not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 479);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 479);
_yuitest_coverline("./src/eventhub.js", 480);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
            , stack = this._rootStack                   // root of the callback stack
            , i;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 484);
for (i = 0; i < parts.length; i++) {
            _yuitest_coverline("./src/eventhub.js", 485);
if (!stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 486);
return null;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 488);
stack = stack[parts[i]];                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 490);
return stack;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    _yuitest_coverline("./src/eventhub.js", 500);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 500);
_yuitest_coverline("./src/eventhub.js", 501);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 505);
for (i = 0; i < parts.length; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 506);
if (!stack[parts[i]]) {                        // if not exists --> create it
                _yuitest_coverline("./src/eventhub.js", 507);
stack[parts[i]] = {
                    __stack: {                              // holds all info for this namespace (not the child namespaces)
                        on: []                              // callback stack
                        , parent: stack                     // parent namespace/object
                        , triggers: 0                       // count triggers
                        , disabled: false                   // by default the namespace/event is enabled
                    }
                };
            }
            _yuitest_coverline("./src/eventhub.js", 516);
stack = stack[parts[i]];                       // go into the (newly created) namespace
        }
        _yuitest_coverline("./src/eventhub.js", 518);
return stack;
    }

    _yuitest_coverline("./src/eventhub.js", 521);
function triggerEventCapture(eventName, data, options) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventCapture", 521);
_yuitest_coverline("./src/eventhub.js", 522);
var i
            , namespace = this._rootStack
            , parts = eventName.split('.') || []
            , eventMode = DEFAULTS.EVENT_MODE.CAPTURING
            , retVal = 0; // callCallbacks(namespace, eventMode) ; -> because you cannot bind callbacks to the root

        _yuitest_coverline("./src/eventhub.js", 528);
if (parts.length > 1 && (!options.eventMode || options.eventMode === DEFAULTS.EVENT_MODE.BOTH || options.eventMode === DEFAULTS.EVENT_MODE.CAPTURING)) {
            _yuitest_coverline("./src/eventhub.js", 529);
for (i = 0; i < parts.length - 1; i++) {        // loop through namespace (not the last part)
                _yuitest_coverline("./src/eventhub.js", 530);
namespace = namespace[parts[i]];
                _yuitest_coverline("./src/eventhub.js", 531);
retVal += callCallbacks(namespace, data, eventMode);
            }
        }
        _yuitest_coverline("./src/eventhub.js", 534);
return retVal;
    }

    _yuitest_coverline("./src/eventhub.js", 537);
function triggerEventBubble(namespace, data, options) {
        //var namespace = namespaces.__stack.parent ;
        _yuitest_coverfunc("./src/eventhub.js", "triggerEventBubble", 537);
_yuitest_coverline("./src/eventhub.js", 539);
var eventMode = DEFAULTS.EVENT_MODE.BUBBLING
            , retVal = 0;

        _yuitest_coverline("./src/eventhub.js", 542);
if ( !options.eventMode || options.eventMode === DEFAULTS.EVENT_MODE.BOTH || options.eventMode === DEFAULTS.EVENT_MODE.BUBBLING) {
            _yuitest_coverline("./src/eventhub.js", 543);
while (namespace.__stack.parent) {
                _yuitest_coverline("./src/eventhub.js", 544);
namespace = namespace.__stack.parent;
                _yuitest_coverline("./src/eventhub.js", 545);
retVal += callCallbacks(namespace, data, eventMode);
            }
        }
        _yuitest_coverline("./src/eventhub.js", 548);
return retVal;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively (only if options.traverse === true).
     */
    _yuitest_coverline("./src/eventhub.js", 555);
function triggerEvent(stack, data, options) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 555);
_yuitest_coverline("./src/eventhub.js", 556);
var retVal = 0
            , ns;                                                  // loop index

        _yuitest_coverline("./src/eventhub.js", 559);
if (!stack.disabled) {                                    // if this node/event is disabled, don't traverse the namespace deeper
            _yuitest_coverline("./src/eventhub.js", 560);
for (ns in stack) {
                _yuitest_coverline("./src/eventhub.js", 561);
if (ns === "__stack") {
                    _yuitest_coverline("./src/eventhub.js", 562);
retVal += callCallbacks(stack, data);
                }
                else {_yuitest_coverline("./src/eventhub.js", 564);
if (options.traverse) {                           // found a deeper nested namespace
                    _yuitest_coverline("./src/eventhub.js", 565);
retVal += triggerEvent(stack[ns], data, options);  // nested namespaces. NOTE that the 'eventName' is omitted!!
                }}
            }
        }
        _yuitest_coverline("./src/eventhub.js", 569);
return retVal;
    }

    /*
     This method triggers the callback for a given namespace. It does not traverse the namespaces, it only loops through
     the 'on' list and afterwards checks if there are callbacks which should be removed (checking the 'one' list)
     If the 'eventMode' is defined, it only triggers callbacks which accept the eventMode.
     @param {Object} namespace
     @param {Anything} data
     @param {String} eventMode accepted values
     */
    _yuitest_coverline("./src/eventhub.js", 580);
function callCallbacks(namespace, data, eventMode) {
        _yuitest_coverfunc("./src/eventhub.js", "callCallbacks", 580);
_yuitest_coverline("./src/eventhub.js", 581);
var i
            , retVal = 0
            , callback;

        _yuitest_coverline("./src/eventhub.js", 585);
if (!namespace.__stack.disabled) {
            _yuitest_coverline("./src/eventhub.js", 586);
for (i = 0; i < namespace.__stack.on.length; i++) {           // loop through all callbacks
                _yuitest_coverline("./src/eventhub.js", 587);
callback = namespace.__stack.on[i];
                _yuitest_coverline("./src/eventhub.js", 588);
if (callback.eventMode === eventMode || eventMode && callback.eventMode === DEFAULTS.EVENT_MODE.BOTH ) { // trigger callbacks depending on their event-mode
                    _yuitest_coverline("./src/eventhub.js", 589);
retVal++;                                             // count this trigger
                    _yuitest_coverline("./src/eventhub.js", 590);
callback.fn(data);                                     // call the callback
                    _yuitest_coverline("./src/eventhub.js", 591);
if (callback.isOne) {
                        _yuitest_coverline("./src/eventhub.js", 592);
namespace.__stack.on.splice(i--, 1);               // remove callback for index is i, and afterwards fix loop index with i--
                    }
                }
            }
        }
        _yuitest_coverline("./src/eventhub.js", 597);
return retVal;
    }

    _yuitest_coverline("./src/eventhub.js", 600);
ns.EventHub = Eventhub;
})(window.Sway, window.Sway.DEBUG);
