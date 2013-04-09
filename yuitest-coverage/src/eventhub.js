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
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(Ns){","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too, checkout the jQuery <a href=\"http://docs.jquery.com/Namespaced_Events \">documentation</a> on how to use these namespaces.","     *","     * @class Sway.EventHub","     * @constructor","     */","    var eh = function() {","        Object.defineProperty(this, '_rootStack',","            {","                value: { __stack: {count: 0, triggers: 0} },","                enumerable: false // hide it","            }","        ) ;","    }","","    eh.prototype = {","        /**","         * Trigger one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName    name of the event or namespace","         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ; // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true} ) ;        // trigger all nested events and namespaces inside the 'ui' namespace","         */","        trigger: function(eventName, data){","            var list = getStack.call(this, eventName) ;                 // load the stack for this namespace","            return triggerEvent(list, data) ;                // triggerEvent does the work of triggering everything (nested events & namespaces)","        }","","        /**","         * Register a callback to a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others.","         *","         * @method on","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;","         */","        , on: function(eventName, callback, prepend) {","            return addCallbackToStack.call(this, eventName, callback, prepend) !== null ;","        }","","","        /**","         * Register a callback to a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         */","        , one: function(eventName, callback, prepend) {","            var stack = addCallbackToStack.call(this, eventName, callback, prepend) ;","            if ( stack ) { // if the stack exists, the callback was added to the 'on' list","                stack.__stack.one[prepend ? 'unshift':'push'](callback) ;   // and it should of course also be added to the 'one' list","                return true ;","            }","            return false ;","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method count","         * @param {sting} [eventName] if empty all registered callbacks are counted","         * @return {Number} the number of callback functions inside 'eventName'. Returns -1 if the event or namespace does not exists","         */","        , count: function(eventName) {","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, 'count') ;","        }","","        /**","         * Removes the given callback for a specific event.","         *","         * @method off","         * @param {string} eventName","         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function(eventName, callback) {","            var stack = getStack.call(this, eventName) ;","            return removeFromStack(stack, callback) ;","        }","","        /**","         * returns the the trigger count for this event","         * @method triggerCount","         * @param {sting} [eventName] the event name","         * @return {Number} trigger count. -1 is returned if the event name does not exist","         */","        , triggerCount: function(eventName) {","            var stack = getStack.call(this, eventName) ;","            return sumPropertyInNamespace(stack, 'triggers') ;","        }","    } ;","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    function sumPropertyInNamespace(stack, property) {","        var i","            , sum = 0 ;","","        for( i in stack ) {","            if ( i === \"__stack\" ) {","                sum += stack[i][property] ;","            }","            else {","                sum += sumPropertyInNamespace(stack[i], property) ;","            }","        }","        return sum ;","    }","","    function addCallbackToStack(eventName, callback, prepend) {","        var stack ;","","        if ( checkInput(eventName, callback)) {                             // validate input","            stack = createStack.call(this, eventName) ;                      // get stack of 'eventName'","            if ( stack.__stack.on.indexOf(callback) === -1 ) {               // check if the callback is not already added","                stack.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback","                stack.__stack.count ++ ;","                return stack ;","            }","        }","        return null ;","    }","","","    /* Validate the input for 'on' and 'one'.","        eventName: should be defined and of type \"string\"","        callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        if ( typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\" ) { // OK","            return true ;","        }","        else if ( Ns.DEBUG ) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\") ;","            return false ;","        }","    }","","","","    /*","        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","        is erased.","     */","    function removeFromStack(stack, callback) {","        var retVal = 0                                              // number of removed callbacks","            , callbacks                                             // a stack with 'on' and 'one' (maybe)","            , ns ;                                                  // loop var","","        if ( callback ) {                                           // remove a specific callback","            for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)","                callbacks = stack[ns] ;","                if ( callbacks.on ) {                               // are we there yet, are we there yet","                    retVal += removeCallback(callbacks.on,  callback) ; // YES","                    callbacks.count -= retVal ;","                    removeCallback(callbacks.one, callback) ; // YES","                }","                else {                                              // NO, its a namesapace -> recurstion","                   retVal += removeFromStack.call(this, stack[callbacks], callback ) ;","                }","            }","        }","        else { // remove a whole namespace (no callback defined)","            retVal += removeNameSpace.call(this, stack)   ;","        }","        return retVal ;                                         // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","       multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback){","        var position                                        // position on the stack","            , retVal = 0 ;                                  // number of removed callbacks","","        position = list.indexOf(callback) ;                 // is the callback in the callbacks list","        while( position > -1 ) {                            // but the callback can be present multiple times!","            retVal ++ ;                                     // found one match","            list.splice(position, 1) ;                      // remove callback from the stack","","            position = list.indexOf(callback) ;             // prepare the while check to see if more actions are required","        }","        return retVal ;","    }","","    /*","       Remove a whole namespace.","     */","    function removeNameSpace(stack) {","        var retVal = 0                                      // number of removed callbacks","            , i ;                                           // loop var","","        for( i in stack )  {                                // delete all elements from the stack (and we cannot do stack = {} ;)","            retVal += stack[i].count ;","            delete stack[i] ;                               // cleanup","        }","        return retVal ;","    }","","    /*","        This private function returns the callback stack matched by 'eventName'. If the eventName does","        not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","                , stack = this._rootStack                   // root of the callback stack","                , i ;                                       // loop index","","        for( i = 0; i < parts.length; i++ ) {","            if ( ! stack[parts[i]]) {","                return null ;                               // it does not exist -> done","            }","            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack","        }","        return stack ;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack. This function always increases the count for each namespace","     * because this function is only called when adding a new callback. Finally, if the namespace","     * does not exist, it is created.","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i ;                                           // loop index","","        for(i = 0; i < parts.length ; i++) {                // traverse the stack","            if ( !stack[parts[i]] ){                        // if not exists --> create it","                stack[parts[i]] = {","                    __stack: {                              // holds all info for this namespace (not the child namespaces)","                        on: []                              // callback stack","                        , one: []                           // callbacks which are triggered only once","                        , parent: stack                     // parent namespace/object","                        , count: 0                          // count callbacks in this namespace","                        , triggers: 0                      // count triggers","                    }","                } ;","            }","            stack = stack[parts[i]] ;                       // go into the (newly created) namespace","        }","        return stack ;","    }","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively.","     */","    function triggerEvent(namespaces, data) {","        var namespace                                               // current namespace in the loop","            , retVal = 0                                            // the number of called callback function","            , ns                                                    // loop index","            , i                                                     // loop index","            , callback ;                                            // callback from the on list","","        for( ns in namespaces ) {","            namespace = namespaces[ns] ;","","           if ( namespace.on ) {                                    // special namespace (it hold 'on' and 'one')","               namespace.triggers ++ ;","               for( i = namespace.on.length -1; i >= 0; i-- ) {     // loop through all callbacks","                  callback = namespace.on[i] ;","                  retVal ++ ;                                       // count this trigger","                  callback(data) ;                                  // call the callback","                   if ( namespace.one.indexOf(callback) > -1 ) {    // check if it is a 'one' callback","                       namespace.count -= removeCallback(namespace.on, callback) ;     // YES -> remove it from 'on'","                   }","               }","               namespace.one.length = 0 ;                           // all 'one' callbacks have been called --> cleanup","           }","           else {                                                   // found a deeper nested namespace","                retVal += triggerEvent(namespace, data) ;           // nested namespaces","           }","        }","        return retVal ;","    }","","    Ns.EventHub = eh ;","","})(window.Sway) ;"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"11":0,"12":0,"20":0,"34":0,"35":0,"51":0,"65":0,"66":0,"67":0,"68":0,"70":0,"81":0,"82":0,"98":0,"99":0,"109":0,"110":0,"116":0,"117":0,"120":0,"121":0,"122":0,"125":0,"128":0,"131":0,"132":0,"134":0,"135":0,"136":0,"137":0,"138":0,"139":0,"142":0,"150":0,"151":0,"152":0,"154":0,"155":0,"156":0,"167":0,"168":0,"172":0,"173":0,"174":0,"175":0,"176":0,"177":0,"178":0,"181":0,"186":0,"188":0,"194":0,"195":0,"198":0,"199":0,"200":0,"201":0,"203":0,"205":0,"211":0,"212":0,"215":0,"216":0,"217":0,"219":0,"226":0,"227":0,"231":0,"232":0,"233":0,"235":0,"237":0,"247":0,"248":0,"252":0,"253":0,"254":0,"264":0,"266":0,"273":0,"274":0,"280":0,"281":0,"283":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"290":0,"293":0,"296":0,"299":0,"302":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"eh:11":0,"trigger:33":0,"on:50":0,"one:64":0,"count:80":0,"off:97":0,"triggerCount:108":0,"sumPropertyInNamespace:116":0,"addCallbackToStack:131":0,"checkInput:150":0,"removeFromStack:167":0,"removeCallback:194":0,"removeNameSpace:211":0,"getStack:226":0,"createStack:247":0,"triggerEvent:273":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 97;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 17;
_yuitest_coverline("./src/eventhub.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/eventhub.js", 3);
(function(Ns){
    /**
     * EventHub facilitates event-based communication between different parts of an application (Event driven system).
     * Events can be namespaced too, checkout the jQuery <a href="http://docs.jquery.com/Namespaced_Events ">documentation</a> on how to use these namespaces.
     *
     * @class Sway.EventHub
     * @constructor
     */
    _yuitest_coverfunc("./src/eventhub.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/eventhub.js", 11);
var eh = function() {
        _yuitest_coverfunc("./src/eventhub.js", "eh", 11);
_yuitest_coverline("./src/eventhub.js", 12);
Object.defineProperty(this, '_rootStack',
            {
                value: { __stack: {count: 0, triggers: 0} },
                enumerable: false // hide it
            }
        ) ;
    }

    _yuitest_coverline("./src/eventhub.js", 20);
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
            _yuitest_coverfunc("./src/eventhub.js", "trigger", 33);
_yuitest_coverline("./src/eventhub.js", 34);
var list = getStack.call(this, eventName) ;                 // load the stack for this namespace
            _yuitest_coverline("./src/eventhub.js", 35);
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
            _yuitest_coverfunc("./src/eventhub.js", "on", 50);
_yuitest_coverline("./src/eventhub.js", 51);
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
            _yuitest_coverfunc("./src/eventhub.js", "one", 64);
_yuitest_coverline("./src/eventhub.js", 65);
var stack = addCallbackToStack.call(this, eventName, callback, prepend) ;
            _yuitest_coverline("./src/eventhub.js", 66);
if ( stack ) { // if the stack exists, the callback was added to the 'on' list
                _yuitest_coverline("./src/eventhub.js", 67);
stack.__stack.one[prepend ? 'unshift':'push'](callback) ;   // and it should of course also be added to the 'one' list
                _yuitest_coverline("./src/eventhub.js", 68);
return true ;
            }
            _yuitest_coverline("./src/eventhub.js", 70);
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
            _yuitest_coverfunc("./src/eventhub.js", "count", 80);
_yuitest_coverline("./src/eventhub.js", 81);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 82);
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
            _yuitest_coverfunc("./src/eventhub.js", "off", 97);
_yuitest_coverline("./src/eventhub.js", 98);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 99);
return removeFromStack(stack, callback) ;
        }

        /**
         * returns the the trigger count for this event
         * @method triggerCount
         * @param {sting} [eventName] the event name
         * @return {Number} trigger count. -1 is returned if the event name does not exist
         */
        , triggerCount: function(eventName) {
            _yuitest_coverfunc("./src/eventhub.js", "triggerCount", 108);
_yuitest_coverline("./src/eventhub.js", 109);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 110);
return sumPropertyInNamespace(stack, 'triggers') ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    _yuitest_coverline("./src/eventhub.js", 116);
function sumPropertyInNamespace(stack, property) {
        _yuitest_coverfunc("./src/eventhub.js", "sumPropertyInNamespace", 116);
_yuitest_coverline("./src/eventhub.js", 117);
var i
            , sum = 0 ;

        _yuitest_coverline("./src/eventhub.js", 120);
for( i in stack ) {
            _yuitest_coverline("./src/eventhub.js", 121);
if ( i === "__stack" ) {
                _yuitest_coverline("./src/eventhub.js", 122);
sum += stack[i][property] ;
            }
            else {
                _yuitest_coverline("./src/eventhub.js", 125);
sum += sumPropertyInNamespace(stack[i], property) ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 128);
return sum ;
    }

    _yuitest_coverline("./src/eventhub.js", 131);
function addCallbackToStack(eventName, callback, prepend) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 131);
_yuitest_coverline("./src/eventhub.js", 132);
var stack ;

        _yuitest_coverline("./src/eventhub.js", 134);
if ( checkInput(eventName, callback)) {                             // validate input
            _yuitest_coverline("./src/eventhub.js", 135);
stack = createStack.call(this, eventName) ;                      // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 136);
if ( stack.__stack.on.indexOf(callback) === -1 ) {               // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 137);
stack.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback
                _yuitest_coverline("./src/eventhub.js", 138);
stack.__stack.count ++ ;
                _yuitest_coverline("./src/eventhub.js", 139);
return stack ;
            }
        }
        _yuitest_coverline("./src/eventhub.js", 142);
return null ;
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 150);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 150);
_yuitest_coverline("./src/eventhub.js", 151);
if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            _yuitest_coverline("./src/eventhub.js", 152);
return true ;
        }
        else {_yuitest_coverline("./src/eventhub.js", 154);
if ( Ns.DEBUG ) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 155);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
            _yuitest_coverline("./src/eventhub.js", 156);
return false ;
        }}
    }



    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 167);
function removeFromStack(stack, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "removeFromStack", 167);
_yuitest_coverline("./src/eventhub.js", 168);
var retVal = 0                                              // number of removed callbacks
            , callbacks                                             // a stack with 'on' and 'one' (maybe)
            , ns ;                                                  // loop var

        _yuitest_coverline("./src/eventhub.js", 172);
if ( callback ) {                                           // remove a specific callback
            _yuitest_coverline("./src/eventhub.js", 173);
for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)
                _yuitest_coverline("./src/eventhub.js", 174);
callbacks = stack[ns] ;
                _yuitest_coverline("./src/eventhub.js", 175);
if ( callbacks.on ) {                               // are we there yet, are we there yet
                    _yuitest_coverline("./src/eventhub.js", 176);
retVal += removeCallback(callbacks.on,  callback) ; // YES
                    _yuitest_coverline("./src/eventhub.js", 177);
callbacks.count -= retVal ;
                    _yuitest_coverline("./src/eventhub.js", 178);
removeCallback(callbacks.one, callback) ; // YES
                }
                else {                                              // NO, its a namesapace -> recurstion
                   _yuitest_coverline("./src/eventhub.js", 181);
retVal += removeFromStack.call(this, stack[callbacks], callback ) ;
                }
            }
        }
        else { // remove a whole namespace (no callback defined)
            _yuitest_coverline("./src/eventhub.js", 186);
retVal += removeNameSpace.call(this, stack)   ;
        }
        _yuitest_coverline("./src/eventhub.js", 188);
return retVal ;                                         // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 194);
function removeCallback(list, callback){
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 194);
_yuitest_coverline("./src/eventhub.js", 195);
var position                                        // position on the stack
            , retVal = 0 ;                                  // number of removed callbacks

        _yuitest_coverline("./src/eventhub.js", 198);
position = list.indexOf(callback) ;                 // is the callback in the callbacks list
        _yuitest_coverline("./src/eventhub.js", 199);
while( position > -1 ) {                            // but the callback can be present multiple times!
            _yuitest_coverline("./src/eventhub.js", 200);
retVal ++ ;                                     // found one match
            _yuitest_coverline("./src/eventhub.js", 201);
list.splice(position, 1) ;                      // remove callback from the stack

            _yuitest_coverline("./src/eventhub.js", 203);
position = list.indexOf(callback) ;             // prepare the while check to see if more actions are required
        }
        _yuitest_coverline("./src/eventhub.js", 205);
return retVal ;
    }

    /*
       Remove a whole namespace.
     */
    _yuitest_coverline("./src/eventhub.js", 211);
function removeNameSpace(stack) {
        _yuitest_coverfunc("./src/eventhub.js", "removeNameSpace", 211);
_yuitest_coverline("./src/eventhub.js", 212);
var retVal = 0                                      // number of removed callbacks
            , i ;                                           // loop var

        _yuitest_coverline("./src/eventhub.js", 215);
for( i in stack )  {                                // delete all elements from the stack (and we cannot do stack = {} ;)
            _yuitest_coverline("./src/eventhub.js", 216);
retVal += stack[i].count ;
            _yuitest_coverline("./src/eventhub.js", 217);
delete stack[i] ;                               // cleanup
        }
        _yuitest_coverline("./src/eventhub.js", 219);
return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 226);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 226);
_yuitest_coverline("./src/eventhub.js", 227);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 231);
for( i = 0; i < parts.length; i++ ) {
            _yuitest_coverline("./src/eventhub.js", 232);
if ( ! stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 233);
return null ;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 235);
stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 237);
return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack. This function always increases the count for each namespace
     * because this function is only called when adding a new callback. Finally, if the namespace
     * does not exist, it is created.
     */
    _yuitest_coverline("./src/eventhub.js", 247);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 247);
_yuitest_coverline("./src/eventhub.js", 248);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 252);
for(i = 0; i < parts.length ; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 253);
if ( !stack[parts[i]] ){                        // if not exists --> create it
                _yuitest_coverline("./src/eventhub.js", 254);
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
            _yuitest_coverline("./src/eventhub.js", 264);
stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }
        _yuitest_coverline("./src/eventhub.js", 266);
return stack ;
    }

    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively.
     */
    _yuitest_coverline("./src/eventhub.js", 273);
function triggerEvent(namespaces, data) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 273);
_yuitest_coverline("./src/eventhub.js", 274);
var namespace                                               // current namespace in the loop
            , retVal = 0                                            // the number of called callback function
            , ns                                                    // loop index
            , i                                                     // loop index
            , callback ;                                            // callback from the on list

        _yuitest_coverline("./src/eventhub.js", 280);
for( ns in namespaces ) {
            _yuitest_coverline("./src/eventhub.js", 281);
namespace = namespaces[ns] ;

           _yuitest_coverline("./src/eventhub.js", 283);
if ( namespace.on ) {                                    // special namespace (it hold 'on' and 'one')
               _yuitest_coverline("./src/eventhub.js", 284);
namespace.triggers ++ ;
               _yuitest_coverline("./src/eventhub.js", 285);
for( i = namespace.on.length -1; i >= 0; i-- ) {     // loop through all callbacks
                  _yuitest_coverline("./src/eventhub.js", 286);
callback = namespace.on[i] ;
                  _yuitest_coverline("./src/eventhub.js", 287);
retVal ++ ;                                       // count this trigger
                  _yuitest_coverline("./src/eventhub.js", 288);
callback(data) ;                                  // call the callback
                   _yuitest_coverline("./src/eventhub.js", 289);
if ( namespace.one.indexOf(callback) > -1 ) {    // check if it is a 'one' callback
                       _yuitest_coverline("./src/eventhub.js", 290);
namespace.count -= removeCallback(namespace.on, callback) ;     // YES -> remove it from 'on'
                   }
               }
               _yuitest_coverline("./src/eventhub.js", 293);
namespace.one.length = 0 ;                           // all 'one' callbacks have been called --> cleanup
           }
           else {                                                   // found a deeper nested namespace
                _yuitest_coverline("./src/eventhub.js", 296);
retVal += triggerEvent(namespace, data) ;           // nested namespaces
           }
        }
        _yuitest_coverline("./src/eventhub.js", 299);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 302);
Ns.EventHub = eh ;

})(window.Sway) ;
