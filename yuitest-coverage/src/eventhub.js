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
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(Ns){","    var DEFAULTS = {","        CAPTURING:  'capturing'             // event goes from top to bottom","        , BUBBLING: 'bubbling'              // event goes from bottom to top","    }","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too, checkout the jQuery <a href=\"http://docs.jquery.com/Namespaced_Events \">documentation</a> on how to use these namespaces.","     *","     * @class Sway.EventHub","     * @constructor","     */","        , eh = function() {","            Object.defineProperty(this, '_rootStack',","                {","                    value: { __stack: {count: 0, triggers: 0} }","                    , enumerable: false // hide it","                }","            ) ;","            Object.defineProperty(this, '_eventType',","                {","                    value: {}","                    , enumerable: false // hide it","                }","            ) ;","        } ;","","    eh.prototype = {","        /**","         * Change the behavior of an event. By default, only the callbacks registered to an event are triggered. But the event can","         * also be set to 'capturing' or 'bubbling' mode. Bubbling means the trigger starts at the root of the namespaces and bubbles","         * up to the event in question. Capturing does the opposite.","         *","         * @method defineEvent","         * @param eventName name of the event","         * @param etype event type. Supported options are: 'capturing' and 'bubbling'","         */","        defineEvent: function(eventName, etype) {","            if ( DEFAULTS.CAPTURING === etype || DEFAULTS.BUBBLING === etype ) {","                this._eventType[eventName] = etype ;","            }","            else {","                console.warn(\"Event type '\" + etype + \"' for '\" + eventName + \"' does not exist!\") ;","            }","        }","        ","        /**","         * Trigger one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName    name of the event or namespace","         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ; // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true} ) ;        // trigger all nested events and namespaces inside the 'ui' namespace","         */","        , trigger: function(eventName, data){","            var list = getStack.call(this, eventName) ;                 // load the stack for this namespace","            return triggerEvent(list, data) ;                // triggerEvent does the work of triggering everything (nested events & namespaces)","        }","","        /**","         * Register a callback to a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others.","         *","         * @method on","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;","         */","        , on: function(eventName, callback, prepend) {","            return addCallbackToStack.call(this, eventName, callback, prepend) !== null ;","        }","","","        /**","         * Register a callback to a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         */","        , one: function(eventName, callback, prepend) {","            var stack = addCallbackToStack.call(this, eventName, callback, prepend) ;","            if ( stack ) { // if the stack exists, the callback was added to the 'on' list","                stack.__stack.one[prepend ? 'unshift':'push'](callback) ;   // and it should of course also be added to the 'one' list","                return true ;","            }","            return false ;","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method count","         * @param {sting} [eventName] if empty all registered callbacks are counted","         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists","         */","        , count: function(eventName) {","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, 'count') ;","        }","","        /**","         * Removes the given callback for a specific event.","         *","         * @method off","         * @param {string} eventName","         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function(eventName, callback) {","            var stack = getStack.call(this, eventName) ;","            return removeFromStack(stack, callback) ;","        }","","        /**","         * returns the the trigger count for this event","         * @method triggerCount","         * @param {sting} [eventName] the event name","         * @return {Number} trigger count. -1 is returned if the event name does not exist","         */","        , triggerCount: function(eventName) {","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, 'triggers') ;","        }","    } ;","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    function sumPropertyInNamespace(stack, property) {","        var i","            , sum = 0 ;","","        for( i in stack ) {","            if ( i === \"__stack\" ) {","                sum += stack[i][property] ;","            }","            else {","                sum += sumPropertyInNamespace(stack[i], property) ;","            }","        }","        return sum ;","    }","","    function addCallbackToStack(eventName, callback, prepend) {","        var stack ;","","        if ( checkInput(eventName, callback)) {                             // validate input","            stack = createStack.call(this, eventName) ;                      // get stack of 'eventName'","            if ( stack.__stack.on.indexOf(callback) === -1 ) {               // check if the callback is not already added","                stack.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback","                stack.__stack.count ++ ;","                return stack ;","            }","        }","        return null ;","    }","","","    /* Validate the input for 'on' and 'one'.","        eventName: should be defined and of type \"string\"","        callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        if ( typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\" ) { // OK","            return true ;","        }","        else if ( Ns.DEBUG ) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\") ;","            return false ;","        }","    }","","","","    /*","        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","        is erased.","     */","    function removeFromStack(stack, callback) {","        var retVal = 0                                              // number of removed callbacks","            , callbacks                                             // a stack with 'on' and 'one' (maybe)","            , ns ;                                                  // loop var","","        if ( callback ) {                                           // remove a specific callback","            for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)","                callbacks = stack[ns] ;","                if ( callbacks.on ) {                               // are we there yet, are we there yet","                    retVal += removeCallback(callbacks.on,  callback) ; // YES","                    callbacks.count -= retVal ;","                    removeCallback(callbacks.one, callback) ; // YES","                }","                else {                                              // NO, its a namesapace -> recurstion","                   retVal += removeFromStack.call(this, stack[callbacks], callback ) ;","                }","            }","        }","        else { // remove a whole namespace (no callback defined)","            retVal += removeNameSpace.call(this, stack)   ;","        }","        return retVal ;                                         // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","       multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback){","        var position                                        // position on the stack","            , retVal = 0 ;                                  // number of removed callbacks","","        position = list.indexOf(callback) ;                 // is the callback in the callbacks list","        while( position > -1 ) {                            // but the callback can be present multiple times!","            retVal ++ ;                                     // found one match","            list.splice(position, 1) ;                      // remove callback from the stack","","            position = list.indexOf(callback) ;             // prepare the while check to see if more actions are required","        }","        return retVal ;","    }","","    /*","       Remove a whole namespace.","     */","    function removeNameSpace(stack) {","        var retVal = 0                                      // number of removed callbacks","            , i ;                                           // loop var","","        for( i in stack )  {                                // delete all elements from the stack (and we cannot do stack = {} ;)","            retVal += stack[i].count ;","            delete stack[i] ;                               // cleanup","        }","        return retVal ;","    }","","    /*","        This private function returns the callback stack matched by 'eventName'. If the eventName does","        not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","                , stack = this._rootStack                   // root of the callback stack","                , i ;                                       // loop index","","        for( i = 0; i < parts.length; i++ ) {","            if ( ! stack[parts[i]]) {","                return null ;                               // it does not exist -> done","            }","            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack","        }","        return stack ;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack. This function always increases the count for each namespace","     * because this function is only called when adding a new callback. Finally, if the namespace","     * does not exist, it is created.","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i ;                                           // loop index","","        for(i = 0; i < parts.length ; i++) {                // traverse the stack","            if ( !stack[parts[i]] ){                        // if not exists --> create it","                stack[parts[i]] = {","                    __stack: {                              // holds all info for this namespace (not the child namespaces)","                        on: []                              // callback stack","                        , one: []                           // callbacks which are triggered only once","                        , parent: stack                     // parent namespace/object","                        , count: 0                          // count callbacks in this namespace","                        , triggers: 0                      // count triggers","                    }","                } ;","            }","            stack = stack[parts[i]] ;                       // go into the (newly created) namespace","        }","        return stack ;","    }","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively.","     */","    function triggerEvent(namespaces, data) {","        var namespace                                               // current namespace in the loop","            , retVal = 0                                            // the number of called callback function","            , ns                                                    // loop index","            , i                                                     // loop index","            , callback ;                                            // callback from the on list","","        for( ns in namespaces ) {","            namespace = namespaces[ns] ;","","           if ( namespace.on ) {                                    // special namespace (it hold 'on' and 'one')","               namespace.triggers ++ ;","               for( i = namespace.on.length -1; i >= 0; i-- ) {     // loop through all callbacks","                  callback = namespace.on[i] ;","                  retVal ++ ;                                       // count this trigger","                  callback(data) ;                                  // call the callback","                   if ( namespace.one.indexOf(callback) > -1 ) {    // check if it is a 'one' callback","                       namespace.count -= removeCallback(namespace.on, callback) ;     // YES -> remove it from 'on'","                   }","               }","               namespace.one.length = 0 ;                           // all 'one' callbacks have been called --> cleanup","           }","           else {                                                   // found a deeper nested namespace","                retVal += triggerEvent(namespace, data) ;           // nested namespaces","           }","        }","        return retVal ;","    }","","    Ns.EventHub = eh ;","","})(window.Sway) ;"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"4":0,"16":0,"22":0,"30":0,"41":0,"42":0,"45":0,"62":0,"63":0,"79":0,"93":0,"94":0,"95":0,"96":0,"98":0,"109":0,"110":0,"126":0,"127":0,"137":0,"138":0,"144":0,"145":0,"148":0,"149":0,"150":0,"153":0,"156":0,"159":0,"160":0,"162":0,"163":0,"164":0,"165":0,"166":0,"167":0,"170":0,"178":0,"179":0,"180":0,"182":0,"183":0,"184":0,"195":0,"196":0,"200":0,"201":0,"202":0,"203":0,"204":0,"205":0,"206":0,"209":0,"214":0,"216":0,"222":0,"223":0,"226":0,"227":0,"228":0,"229":0,"231":0,"233":0,"239":0,"240":0,"243":0,"244":0,"245":0,"247":0,"254":0,"255":0,"259":0,"260":0,"261":0,"263":0,"265":0,"275":0,"276":0,"280":0,"281":0,"282":0,"292":0,"294":0,"301":0,"302":0,"308":0,"309":0,"311":0,"312":0,"313":0,"314":0,"315":0,"316":0,"317":0,"318":0,"321":0,"324":0,"327":0,"330":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"eh:15":0,"defineEvent:40":0,"trigger:61":0,"on:78":0,"one:92":0,"count:108":0,"off:125":0,"triggerCount:136":0,"sumPropertyInNamespace:144":0,"addCallbackToStack:159":0,"checkInput:178":0,"removeFromStack:195":0,"removeCallback:222":0,"removeNameSpace:239":0,"getStack:254":0,"createStack:275":0,"triggerEvent:301":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 101;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 18;
_yuitest_coverline("./src/eventhub.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/eventhub.js", 3);
(function(Ns){
    _yuitest_coverfunc("./src/eventhub.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/eventhub.js", 4);
var DEFAULTS = {
        CAPTURING:  'capturing'             // event goes from top to bottom
        , BUBBLING: 'bubbling'              // event goes from bottom to top
    }
    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     * Events can be namespaced too, checkout the jQuery <a href="http://docs.jquery.com/Namespaced_Events ">documentation</a> on how to use these namespaces.
     *
     * @class Sway.EventHub
     * @constructor
     */
        , eh = function() {
            _yuitest_coverfunc("./src/eventhub.js", "eh", 15);
_yuitest_coverline("./src/eventhub.js", 16);
Object.defineProperty(this, '_rootStack',
                {
                    value: { __stack: {count: 0, triggers: 0} }
                    , enumerable: false // hide it
                }
            ) ;
            _yuitest_coverline("./src/eventhub.js", 22);
Object.defineProperty(this, '_eventType',
                {
                    value: {}
                    , enumerable: false // hide it
                }
            ) ;
        } ;

    _yuitest_coverline("./src/eventhub.js", 30);
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
            _yuitest_coverfunc("./src/eventhub.js", "defineEvent", 40);
_yuitest_coverline("./src/eventhub.js", 41);
if ( DEFAULTS.CAPTURING === etype || DEFAULTS.BUBBLING === etype ) {
                _yuitest_coverline("./src/eventhub.js", 42);
this._eventType[eventName] = etype ;
            }
            else {
                _yuitest_coverline("./src/eventhub.js", 45);
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
            _yuitest_coverfunc("./src/eventhub.js", "trigger", 61);
_yuitest_coverline("./src/eventhub.js", 62);
var list = getStack.call(this, eventName) ;                 // load the stack for this namespace
            _yuitest_coverline("./src/eventhub.js", 63);
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
            _yuitest_coverfunc("./src/eventhub.js", "on", 78);
_yuitest_coverline("./src/eventhub.js", 79);
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
            _yuitest_coverfunc("./src/eventhub.js", "one", 92);
_yuitest_coverline("./src/eventhub.js", 93);
var stack = addCallbackToStack.call(this, eventName, callback, prepend) ;
            _yuitest_coverline("./src/eventhub.js", 94);
if ( stack ) { // if the stack exists, the callback was added to the 'on' list
                _yuitest_coverline("./src/eventhub.js", 95);
stack.__stack.one[prepend ? 'unshift':'push'](callback) ;   // and it should of course also be added to the 'one' list
                _yuitest_coverline("./src/eventhub.js", 96);
return true ;
            }
            _yuitest_coverline("./src/eventhub.js", 98);
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
            _yuitest_coverfunc("./src/eventhub.js", "count", 108);
_yuitest_coverline("./src/eventhub.js", 109);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 110);
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
            _yuitest_coverfunc("./src/eventhub.js", "off", 125);
_yuitest_coverline("./src/eventhub.js", 126);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 127);
return removeFromStack(stack, callback) ;
        }

        /**
         * returns the the trigger count for this event
         * @method triggerCount
         * @param {sting} [eventName] the event name
         * @return {Number} trigger count. -1 is returned if the event name does not exist
         */
        , triggerCount: function(eventName) {
            _yuitest_coverfunc("./src/eventhub.js", "triggerCount", 136);
_yuitest_coverline("./src/eventhub.js", 137);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 138);
return sumPropertyInNamespace(stack, 'triggers') ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    _yuitest_coverline("./src/eventhub.js", 144);
function sumPropertyInNamespace(stack, property) {
        _yuitest_coverfunc("./src/eventhub.js", "sumPropertyInNamespace", 144);
_yuitest_coverline("./src/eventhub.js", 145);
var i
            , sum = 0 ;

        _yuitest_coverline("./src/eventhub.js", 148);
for( i in stack ) {
            _yuitest_coverline("./src/eventhub.js", 149);
if ( i === "__stack" ) {
                _yuitest_coverline("./src/eventhub.js", 150);
sum += stack[i][property] ;
            }
            else {
                _yuitest_coverline("./src/eventhub.js", 153);
sum += sumPropertyInNamespace(stack[i], property) ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 156);
return sum ;
    }

    _yuitest_coverline("./src/eventhub.js", 159);
function addCallbackToStack(eventName, callback, prepend) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 159);
_yuitest_coverline("./src/eventhub.js", 160);
var stack ;

        _yuitest_coverline("./src/eventhub.js", 162);
if ( checkInput(eventName, callback)) {                             // validate input
            _yuitest_coverline("./src/eventhub.js", 163);
stack = createStack.call(this, eventName) ;                      // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 164);
if ( stack.__stack.on.indexOf(callback) === -1 ) {               // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 165);
stack.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback
                _yuitest_coverline("./src/eventhub.js", 166);
stack.__stack.count ++ ;
                _yuitest_coverline("./src/eventhub.js", 167);
return stack ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 170);
return null ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 178);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 178);
_yuitest_coverline("./src/eventhub.js", 179);
if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            _yuitest_coverline("./src/eventhub.js", 180);
return true ;
        }
        else {_yuitest_coverline("./src/eventhub.js", 182);
if ( Ns.DEBUG ) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 183);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
            _yuitest_coverline("./src/eventhub.js", 184);
return false ;
        }}
    }



    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 195);
function removeFromStack(stack, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "removeFromStack", 195);
_yuitest_coverline("./src/eventhub.js", 196);
var retVal = 0                                              // number of removed callbacks
            , callbacks                                             // a stack with 'on' and 'one' (maybe)
            , ns ;                                                  // loop var

        _yuitest_coverline("./src/eventhub.js", 200);
if ( callback ) {                                           // remove a specific callback
            _yuitest_coverline("./src/eventhub.js", 201);
for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)
                _yuitest_coverline("./src/eventhub.js", 202);
callbacks = stack[ns] ;
                _yuitest_coverline("./src/eventhub.js", 203);
if ( callbacks.on ) {                               // are we there yet, are we there yet
                    _yuitest_coverline("./src/eventhub.js", 204);
retVal += removeCallback(callbacks.on,  callback) ; // YES
                    _yuitest_coverline("./src/eventhub.js", 205);
callbacks.count -= retVal ;
                    _yuitest_coverline("./src/eventhub.js", 206);
removeCallback(callbacks.one, callback) ; // YES
                }
                else {                                              // NO, its a namesapace -> recurstion
                   _yuitest_coverline("./src/eventhub.js", 209);
retVal += removeFromStack.call(this, stack[callbacks], callback ) ;
                }
            }
        }
        else { // remove a whole namespace (no callback defined)
            _yuitest_coverline("./src/eventhub.js", 214);
retVal += removeNameSpace.call(this, stack)   ;
        }
        _yuitest_coverline("./src/eventhub.js", 216);
return retVal ;                                         // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 222);
function removeCallback(list, callback){
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 222);
_yuitest_coverline("./src/eventhub.js", 223);
var position                                        // position on the stack
            , retVal = 0 ;                                  // number of removed callbacks

        _yuitest_coverline("./src/eventhub.js", 226);
position = list.indexOf(callback) ;                 // is the callback in the callbacks list
        _yuitest_coverline("./src/eventhub.js", 227);
while( position > -1 ) {                            // but the callback can be present multiple times!
            _yuitest_coverline("./src/eventhub.js", 228);
retVal ++ ;                                     // found one match
            _yuitest_coverline("./src/eventhub.js", 229);
list.splice(position, 1) ;                      // remove callback from the stack

            _yuitest_coverline("./src/eventhub.js", 231);
position = list.indexOf(callback) ;             // prepare the while check to see if more actions are required
        }
        _yuitest_coverline("./src/eventhub.js", 233);
return retVal ;
    }

    /*
       Remove a whole namespace.
     */
    _yuitest_coverline("./src/eventhub.js", 239);
function removeNameSpace(stack) {
        _yuitest_coverfunc("./src/eventhub.js", "removeNameSpace", 239);
_yuitest_coverline("./src/eventhub.js", 240);
var retVal = 0                                      // number of removed callbacks
            , i ;                                           // loop var

        _yuitest_coverline("./src/eventhub.js", 243);
for( i in stack )  {                                // delete all elements from the stack (and we cannot do stack = {} ;)
            _yuitest_coverline("./src/eventhub.js", 244);
retVal += stack[i].count ;
            _yuitest_coverline("./src/eventhub.js", 245);
delete stack[i] ;                               // cleanup
        }
        _yuitest_coverline("./src/eventhub.js", 247);
return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 254);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 254);
_yuitest_coverline("./src/eventhub.js", 255);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 259);
for( i = 0; i < parts.length; i++ ) {
            _yuitest_coverline("./src/eventhub.js", 260);
if ( ! stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 261);
return null ;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 263);
stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 265);
return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    _yuitest_coverline("./src/eventhub.js", 275);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 275);
_yuitest_coverline("./src/eventhub.js", 276);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 280);
for(i = 0; i < parts.length ; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 281);
if ( !stack[parts[i]] ){                        // if not exists --> create it
                _yuitest_coverline("./src/eventhub.js", 282);
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
            _yuitest_coverline("./src/eventhub.js", 292);
stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        _yuitest_coverline("./src/eventhub.js", 294);
return stack ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively.
     */
    _yuitest_coverline("./src/eventhub.js", 301);
function triggerEvent(namespaces, data) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 301);
_yuitest_coverline("./src/eventhub.js", 302);
var namespace                                               // current namespace in the loop
            , retVal = 0                                            // the number of called callback function
            , ns                                                    // loop index
            , i                                                     // loop index
            , callback ;                                            // callback from the on list

        _yuitest_coverline("./src/eventhub.js", 308);
for( ns in namespaces ) {
            _yuitest_coverline("./src/eventhub.js", 309);
namespace = namespaces[ns] ;

           _yuitest_coverline("./src/eventhub.js", 311);
if ( namespace.on ) {                                    // special namespace (it hold 'on' and 'one')
               _yuitest_coverline("./src/eventhub.js", 312);
namespace.triggers ++ ;
               _yuitest_coverline("./src/eventhub.js", 313);
for( i = namespace.on.length -1; i >= 0; i-- ) {     // loop through all callbacks
                  _yuitest_coverline("./src/eventhub.js", 314);
callback = namespace.on[i] ;
                  _yuitest_coverline("./src/eventhub.js", 315);
retVal ++ ;                                       // count this trigger
                  _yuitest_coverline("./src/eventhub.js", 316);
callback(data) ;                                  // call the callback
                   _yuitest_coverline("./src/eventhub.js", 317);
if ( namespace.one.indexOf(callback) > -1 ) {    // check if it is a 'one' callback
                       _yuitest_coverline("./src/eventhub.js", 318);
namespace.count -= removeCallback(namespace.on, callback) ;     // YES -> remove it from 'on'
                   }
               }
               _yuitest_coverline("./src/eventhub.js", 321);
namespace.one.length = 0 ;                           // all 'one' callbacks have been called --> cleanup
           }
           else {                                                   // found a deeper nested namespace
                _yuitest_coverline("./src/eventhub.js", 324);
retVal += triggerEvent(namespace, data) ;           // nested namespaces
           }
        }
        _yuitest_coverline("./src/eventhub.js", 327);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 330);
Ns.EventHub = eh ;

})(window.Sway) ;
