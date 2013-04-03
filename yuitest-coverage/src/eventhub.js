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
_yuitest_coverage["./src/eventhub.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(Ns){","    /**","     * EventHub facilitates event-based communication between different parts of an application (Event driven system).","     * Events can be namespaced too, checkout the jQuery <a href=\"http://docs.jquery.com/Namespaced_Events \">documentation</a> on how to use these namespaces.","     *","     * @class Sway.EventHub","     * @constructor","     */","    var eh = function() {","        Object.defineProperty(this, '_rootStack',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","    }","","    eh.prototype = {","        /**","         * Trigger one or more events. One event is triggered if the 'eventName' parameter targets a specific event, but if this parameter is a namespace, all nested events and","         * namespaces will be triggered.","         *","         * @method trigger","         * @param {string} eventName    name of the event or namespace","         * @param {Object|Array|Number|String|Boolean|Function} [data]   data passed to the triggered callback function","         * @return {Number} the count of triggered callbacks","         * @example","         Sway.eventHub.trigger('ui.update', {authenticated: true} ) ; // trigger the 'update' event inside the 'ui' namespace","         Sway.eventHub.trigger('ui', {authenticated: true} ) ;        // trigger all nested events and namespaces inside the 'ui' namespace","         */","        trigger: function(eventName, data){","            var list = getStack.call(this, eventName) ;                 // load the stack for this namespace","            return triggerEvent(list, data) ;                // triggerEvent does the work of triggering everything (nested events & namespaces)","        }","","        /**","         * Register a callback to a specific event. Callbacks are executed in the order of","         * registration. Set 'prepend' to TRUE to add the callback in front of the others.","         *","         * @method on","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         * @example","         Sway.eventHub.on( 'ui.update', this.update.bind(this) ) ;","         Sway.eventHub.on( 'ui.update', this.update.bind(this), true ) ;","         */","        , on: function(eventName, callback, prepend) {","            return addCallbackToStack.call(this, eventName, callback, prepend) ;","        }","","","        /**","         * Register a callback to a specific event. This function is identical to {{#crossLink \"Sway.EventHub/on:method\"}}{{/crossLink}}","         * except that this callback is removed from the list after it has been triggered.","         *","         * @method one","         * @param {string} eventName","         * @param {function} callback","         * @param {boolean} [prepend] if TRUE, the callback is placed before all other registered callbacks.","         */","        , one: function(eventName, callback, prepend) {","            return addCallbackToStack.call(this, eventName, callback, prepend, true) ;","        }","","        /**","         * count the registered callbacks for an event or namespace","         *","         * @method count","         * @param {sting} [eventName] if empty all registered callbacks are counted","         * @return {Number} the count of callback functions inside 'eventName'","         */","        , count: function(eventName) {","            var list = getStack.call(this, eventName)","                , parts = eventName","","            // TODO","            return 10 ;","        }","","        /**","         * Removes the given callback for a specific event.","         *","         * @method off","         * @param {string} eventName","         * @param {function} [callback] the callback function to be removed. If omitted, all registered events and nested","         * namespaces inside 'eventName' are removed","         * @return {Number} the count of removed callback functions","         * @example","         Sway.eventHub.off('ui.update', this.update) ;","         Sway.eventHub.off('ui') ;","         */","        , off: function(eventName, callback) {","            var stack = getStack.call(this, eventName) ;","            return removeFromStack(stack, callback) ;","        }","    } ;","","    /* ******** PRIVATE HELPER FUNCTION *********** */","","    function addCallbackToStack(eventName, callback, prepend, isOne) {","        if ( checkInput(eventName, callback)) {                             // validate input","            var list = createStack.call(this, eventName) ;                  // get stack of 'eventName'","            if ( list.__stack.on.indexOf(callback) === -1 ) {                 // check if the callback is not already added","                list.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback","","                if ( isOne ) {                                              // if true, the callback is added to the 'one' list","                    list.__stack.one[prepend ? 'unshift':'push'](callback) ;// and only triggered once","                }","                return true ;                                               // callback is added","            }","        }","        return false ;                                                      // callback is not added","    }","","","    /* Validate the input for 'on' and 'one'.","        eventName: should be defined and of type \"string\"","        callback:  should be defined and of type \"function\"","     */","    function checkInput(eventName, callback) {","        if ( typeof(eventName) === \"string\" && callback && typeof(callback) === \"function\" ) { // OK","            return true ;","        }","        else if ( Ns.DEBUG ) { // Wrong...","            console.warn(\"Cannot bind the callback function to the event nam ( eventName=\" + eventName + \",  callback=\" + callback + \")\") ;","            return false ;","        }","    }","","","","    /*","        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces","        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack","        is erased.","     */","    function removeFromStack(stack, callback) {","        var retVal = 0                                              // number of removed callbacks","            , callbacks                                             // a stack with 'on' and 'one' (maybe)","            , ns ;                                                  // loop var","","        if ( !stack ) {                                             // no data available --> done","            return 0 ;                                              // and zero callbacks removed (no actions taken)","        }","","        if ( callback ) {                                           // remove a specific callback","            for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)","                callbacks = stack[ns] ;","                if ( callbacks.on ) {                               // are we there yet, are we there yet","                    retVal += removeCallback(callbacks.on,  callback) ; // YES","                    retVal += removeCallback(callbacks.one, callback) ; // YES","                }","                else {                                              // NO, its a namesapace -> recurstion","                   retVal += removeFromStack.call(this, stack[callbacks], callback ) ;","                }","            }","        }","        else { // remove a whole namespace (no callback defined)","            retVal += removeNameSpace.call(this, stack)   ;","        }","        return retVal ;                                         // a count of removed callback function","    }","","    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or","       multiple occurrences of the 'callback' function","     */","    function removeCallback(list, callback){","        var position                                            // position on the stack","            , retVal = 0 ;                                      // number of removed callbacks","","        position = list.indexOf(callback) ;         // is the callback in the callbacks list","        while( position > -1 ) {                        // but the callback can be present multiple times!","            retVal ++ ;                                // found one match","            list.splice(position, 1) ;              // remove callback from the stack","","            position = list.indexOf(callback) ;     // prepare the while check to see if more actions are required","        }","        return retVal ;","    }","","    /*","       Remove a whole namespace","     */","    function removeNameSpace(stack) {","        var retVal = 0                                      // number of removed callbacks","            , cb                                            // loop var","","        for( cb in stack )  {                               // delete all elements from the stack (and we cannot do stack = {} ;)","            retVal += this.count(callbacks[cb]) ;           // and count all callbacks in this namespace","            delete callbacks[cb] ;                          // cleanup","        }","","        return retVal ;","    }","","    /*","        This private function returns the callback stack matched by 'eventName'. If the eventName does","        not exist 'null' is returned","     */","    function getStack(namespace) {","        var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces","                , stack = this._rootStack                   // root of the callback stack","                , i ;                                       // loop index","","        for( i = 0; i < parts.length; i++ ) {","            if ( ! stack[parts[i]]) {","                return null ;                               // it does not exist -> done","            }","            stack = stack[parts[i]] ;                       // traverse a level deeper into the stack","        }","        return stack ;                                      // return the stack matched by 'eventName'","    }","","    /*","     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special","     * variable called '__stack'. So, when the eventName is 'doAction', internally this will","     * look like doAction.__stack.","     * Furthermore, it the eventName is new, it is created","     */","    function createStack(namespace) {","        var parts = namespace.split('.')                    // split the namespace","            , stack = this._rootStack                       // start at the root","            , i ;                                           // loop index","","        for(i = 0; i < parts.length ; i++) {                // traverse the stack","            if ( !stack[parts[i]] ){                        // if not exists","                stack[parts[i]] = {} ;                      // --> create it","            }","            stack = stack[parts[i]] ;                       // go into the (newly created) namespace","        }","","        if ( !stack.__stack) {                              // the namespace holding the callbacks is called __stack","            stack.__stack = {                               // These callbacks are stored into a list called","                on: []                                      // 'on' and","                , one: []                                   // 'one'","            } ;","        }","        return stack ;","    }","","","","    /*","     * Namespaces can in theory be many levels deep, like: \"aaaaa.bbbbbb.cccccc._stack\"","     * To traverse this namespace and trigger everything inside it, this function is called recursively.","     */","    function triggerEvent(namespaces, data) {","        var namespace                                           // current namespace in the loop","            , retVal = 0                                        // the number of called callback function","            , ns ;                                              // loop index","","        for( ns in namespaces ) {","            namespace = namespaces[ns] ;","","           if ( namespace.on ) {                                // special namespace (it hold 'on' and 'one')","               namespace.on.forEach( function(c) {              // loop through all callbacks","                   retVal++ ;                                   // count this trigger","                   c(data) ;                                    // call the callback","                   if ( namespace.one.indexOf(c) > -1 ) {       // check if it is a 'one' callback","                       removeCallback(namespace.on, c) ;        // YES -> remove it from 'on'","                   }","               }) ;","               namespace.one.length = 0 ;                       // all 'one' callbacks have been called --> cleanup","           }","           else {                                               // found a deeper nested namespace","                retVal += triggerEvent(namespace, data) ;       // nested namespaces","           }","        }","        return retVal ;","    }","","    Ns.EventHub = eh ;","","})(window.Sway) ;"];
_yuitest_coverage["./src/eventhub.js"].lines = {"1":0,"3":0,"11":0,"12":0,"20":0,"34":0,"35":0,"51":0,"65":0,"76":0,"80":0,"96":0,"97":0,"103":0,"104":0,"105":0,"106":0,"107":0,"109":0,"110":0,"112":0,"115":0,"123":0,"124":0,"125":0,"127":0,"128":0,"129":0,"140":0,"141":0,"145":0,"146":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"157":0,"162":0,"164":0,"170":0,"171":0,"174":0,"175":0,"176":0,"177":0,"179":0,"181":0,"187":0,"188":0,"191":0,"192":0,"193":0,"196":0,"203":0,"204":0,"208":0,"209":0,"210":0,"212":0,"214":0,"223":0,"224":0,"228":0,"229":0,"230":0,"232":0,"235":0,"236":0,"241":0,"250":0,"251":0,"255":0,"256":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"266":0,"269":0,"272":0,"275":0};
_yuitest_coverage["./src/eventhub.js"].functions = {"eh:11":0,"trigger:33":0,"on:50":0,"one:64":0,"count:75":0,"off:95":0,"addCallbackToStack:103":0,"checkInput:123":0,"removeFromStack:140":0,"removeCallback:170":0,"removeNameSpace:187":0,"getStack:203":0,"createStack:223":0,"(anonymous 2):259":0,"triggerEvent:250":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/eventhub.js"].coveredLines = 85;
_yuitest_coverage["./src/eventhub.js"].coveredFunctions = 16;
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
                value: {},
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
return addCallbackToStack.call(this, eventName, callback, prepend) ;
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
return addCallbackToStack.call(this, eventName, callback, prepend, true) ;
        }

        /**
         * count the registered callbacks for an event or namespace
         *
         * @method count
         * @param {sting} [eventName] if empty all registered callbacks are counted
         * @return {Number} the count of callback functions inside 'eventName'
         */
        , count: function(eventName) {
            _yuitest_coverfunc("./src/eventhub.js", "count", 75);
_yuitest_coverline("./src/eventhub.js", 76);
var list = getStack.call(this, eventName)
                , parts = eventName

            // TODO
            _yuitest_coverline("./src/eventhub.js", 80);
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
            _yuitest_coverfunc("./src/eventhub.js", "off", 95);
_yuitest_coverline("./src/eventhub.js", 96);
var stack = getStack.call(this, eventName) ;
            _yuitest_coverline("./src/eventhub.js", 97);
return removeFromStack(stack, callback) ;
        }
    } ;

    /* ******** PRIVATE HELPER FUNCTION *********** */

    _yuitest_coverline("./src/eventhub.js", 103);
function addCallbackToStack(eventName, callback, prepend, isOne) {
        _yuitest_coverfunc("./src/eventhub.js", "addCallbackToStack", 103);
_yuitest_coverline("./src/eventhub.js", 104);
if ( checkInput(eventName, callback)) {                             // validate input
            _yuitest_coverline("./src/eventhub.js", 105);
var list = createStack.call(this, eventName) ;                  // get stack of 'eventName'
            _yuitest_coverline("./src/eventhub.js", 106);
if ( list.__stack.on.indexOf(callback) === -1 ) {                 // check if the callback is not already added
                _yuitest_coverline("./src/eventhub.js", 107);
list.__stack.on[prepend ? 'unshift':'push'](callback) ;     // add callback

                _yuitest_coverline("./src/eventhub.js", 109);
if ( isOne ) {                                              // if true, the callback is added to the 'one' list
                    _yuitest_coverline("./src/eventhub.js", 110);
list.__stack.one[prepend ? 'unshift':'push'](callback) ;// and only triggered once
                }
                _yuitest_coverline("./src/eventhub.js", 112);
return true ;                                               // callback is added
            }
        }
        _yuitest_coverline("./src/eventhub.js", 115);
return false ;                                                      // callback is not added
    }


    /* Validate the input for 'on' and 'one'.
        eventName: should be defined and of type "string"
        callback:  should be defined and of type "function"
     */
    _yuitest_coverline("./src/eventhub.js", 123);
function checkInput(eventName, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "checkInput", 123);
_yuitest_coverline("./src/eventhub.js", 124);
if ( typeof(eventName) === "string" && callback && typeof(callback) === "function" ) { // OK
            _yuitest_coverline("./src/eventhub.js", 125);
return true ;
        }
        else {_yuitest_coverline("./src/eventhub.js", 127);
if ( Ns.DEBUG ) { // Wrong...
            _yuitest_coverline("./src/eventhub.js", 128);
console.warn("Cannot bind the callback function to the event nam ( eventName=" + eventName + ",  callback=" + callback + ")") ;
            _yuitest_coverline("./src/eventhub.js", 129);
return false ;
        }}
    }



    /*
        Removes the callback from the stack. However, a stack can contain other namespaces. And these namespaces
        can contain the callback too. Furthermore, the callback is optional, in which case the whole stack
        is erased.
     */
    _yuitest_coverline("./src/eventhub.js", 140);
function removeFromStack(stack, callback) {
        _yuitest_coverfunc("./src/eventhub.js", "removeFromStack", 140);
_yuitest_coverline("./src/eventhub.js", 141);
var retVal = 0                                              // number of removed callbacks
            , callbacks                                             // a stack with 'on' and 'one' (maybe)
            , ns ;                                                  // loop var

        _yuitest_coverline("./src/eventhub.js", 145);
if ( !stack ) {                                             // no data available --> done
            _yuitest_coverline("./src/eventhub.js", 146);
return 0 ;                                              // and zero callbacks removed (no actions taken)
        }

        _yuitest_coverline("./src/eventhub.js", 149);
if ( callback ) {                                           // remove a specific callback
            _yuitest_coverline("./src/eventhub.js", 150);
for( ns in stack) {                                     // so we loop through all namespaces (and __stack is one of them)
                _yuitest_coverline("./src/eventhub.js", 151);
callbacks = stack[ns] ;
                _yuitest_coverline("./src/eventhub.js", 152);
if ( callbacks.on ) {                               // are we there yet, are we there yet
                    _yuitest_coverline("./src/eventhub.js", 153);
retVal += removeCallback(callbacks.on,  callback) ; // YES
                    _yuitest_coverline("./src/eventhub.js", 154);
retVal += removeCallback(callbacks.one, callback) ; // YES
                }
                else {                                              // NO, its a namesapace -> recurstion
                   _yuitest_coverline("./src/eventhub.js", 157);
retVal += removeFromStack.call(this, stack[callbacks], callback ) ;
                }
            }
        }
        else { // remove a whole namespace (no callback defined)
            _yuitest_coverline("./src/eventhub.js", 162);
retVal += removeNameSpace.call(this, stack)   ;
        }
        _yuitest_coverline("./src/eventhub.js", 164);
return retVal ;                                         // a count of removed callback function
    }

    /* This function should only be called on a stack with the 'on' and 'one' lists. It will remove one or
       multiple occurrences of the 'callback' function
     */
    _yuitest_coverline("./src/eventhub.js", 170);
function removeCallback(list, callback){
        _yuitest_coverfunc("./src/eventhub.js", "removeCallback", 170);
_yuitest_coverline("./src/eventhub.js", 171);
var position                                            // position on the stack
            , retVal = 0 ;                                      // number of removed callbacks

        _yuitest_coverline("./src/eventhub.js", 174);
position = list.indexOf(callback) ;         // is the callback in the callbacks list
        _yuitest_coverline("./src/eventhub.js", 175);
while( position > -1 ) {                        // but the callback can be present multiple times!
            _yuitest_coverline("./src/eventhub.js", 176);
retVal ++ ;                                // found one match
            _yuitest_coverline("./src/eventhub.js", 177);
list.splice(position, 1) ;              // remove callback from the stack

            _yuitest_coverline("./src/eventhub.js", 179);
position = list.indexOf(callback) ;     // prepare the while check to see if more actions are required
        }
        _yuitest_coverline("./src/eventhub.js", 181);
return retVal ;
    }

    /*
       Remove a whole namespace
     */
    _yuitest_coverline("./src/eventhub.js", 187);
function removeNameSpace(stack) {
        _yuitest_coverfunc("./src/eventhub.js", "removeNameSpace", 187);
_yuitest_coverline("./src/eventhub.js", 188);
var retVal = 0                                      // number of removed callbacks
            , cb                                            // loop var

        _yuitest_coverline("./src/eventhub.js", 191);
for( cb in stack )  {                               // delete all elements from the stack (and we cannot do stack = {} ;)
            _yuitest_coverline("./src/eventhub.js", 192);
retVal += this.count(callbacks[cb]) ;           // and count all callbacks in this namespace
            _yuitest_coverline("./src/eventhub.js", 193);
delete callbacks[cb] ;                          // cleanup
        }

        _yuitest_coverline("./src/eventhub.js", 196);
return retVal ;
    }

    /*
        This private function returns the callback stack matched by 'eventName'. If the eventName does
        not exist 'null' is returned
     */
    _yuitest_coverline("./src/eventhub.js", 203);
function getStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "getStack", 203);
_yuitest_coverline("./src/eventhub.js", 204);
var parts = namespace ? namespace.split('.') : []   // parts of the event namespaces
                , stack = this._rootStack                   // root of the callback stack
                , i ;                                       // loop index

        _yuitest_coverline("./src/eventhub.js", 208);
for( i = 0; i < parts.length; i++ ) {
            _yuitest_coverline("./src/eventhub.js", 209);
if ( ! stack[parts[i]]) {
                _yuitest_coverline("./src/eventhub.js", 210);
return null ;                               // it does not exist -> done
            }
            _yuitest_coverline("./src/eventhub.js", 212);
stack = stack[parts[i]] ;                       // traverse a level deeper into the stack
        }
        _yuitest_coverline("./src/eventhub.js", 214);
return stack ;                                      // return the stack matched by 'eventName'
    }

    /*
     * Internally 'eventName' is always a namespace. Callbacks are placed inside a special
     * variable called '__stack'. So, when the eventName is 'doAction', internally this will
     * look like doAction.__stack.
     * Furthermore, it the eventName is new, it is created
     */
    _yuitest_coverline("./src/eventhub.js", 223);
function createStack(namespace) {
        _yuitest_coverfunc("./src/eventhub.js", "createStack", 223);
_yuitest_coverline("./src/eventhub.js", 224);
var parts = namespace.split('.')                    // split the namespace
            , stack = this._rootStack                       // start at the root
            , i ;                                           // loop index

        _yuitest_coverline("./src/eventhub.js", 228);
for(i = 0; i < parts.length ; i++) {                // traverse the stack
            _yuitest_coverline("./src/eventhub.js", 229);
if ( !stack[parts[i]] ){                        // if not exists
                _yuitest_coverline("./src/eventhub.js", 230);
stack[parts[i]] = {} ;                      // --> create it
            }
            _yuitest_coverline("./src/eventhub.js", 232);
stack = stack[parts[i]] ;                       // go into the (newly created) namespace
        }

        _yuitest_coverline("./src/eventhub.js", 235);
if ( !stack.__stack) {                              // the namespace holding the callbacks is called __stack
            _yuitest_coverline("./src/eventhub.js", 236);
stack.__stack = {                               // These callbacks are stored into a list called
                on: []                                      // 'on' and
                , one: []                                   // 'one'
            } ;
        }
        _yuitest_coverline("./src/eventhub.js", 241);
return stack ;
    }



    /*
     * Namespaces can in theory be many levels deep, like: "aaaaa.bbbbbb.cccccc._stack"
     * To traverse this namespace and trigger everything inside it, this function is called recursively.
     */
    _yuitest_coverline("./src/eventhub.js", 250);
function triggerEvent(namespaces, data) {
        _yuitest_coverfunc("./src/eventhub.js", "triggerEvent", 250);
_yuitest_coverline("./src/eventhub.js", 251);
var namespace                                           // current namespace in the loop
            , retVal = 0                                        // the number of called callback function
            , ns ;                                              // loop index

        _yuitest_coverline("./src/eventhub.js", 255);
for( ns in namespaces ) {
            _yuitest_coverline("./src/eventhub.js", 256);
namespace = namespaces[ns] ;

           _yuitest_coverline("./src/eventhub.js", 258);
if ( namespace.on ) {                                // special namespace (it hold 'on' and 'one')
               _yuitest_coverline("./src/eventhub.js", 259);
namespace.on.forEach( function(c) {              // loop through all callbacks
                   _yuitest_coverfunc("./src/eventhub.js", "(anonymous 2)", 259);
_yuitest_coverline("./src/eventhub.js", 260);
retVal++ ;                                   // count this trigger
                   _yuitest_coverline("./src/eventhub.js", 261);
c(data) ;                                    // call the callback
                   _yuitest_coverline("./src/eventhub.js", 262);
if ( namespace.one.indexOf(c) > -1 ) {       // check if it is a 'one' callback
                       _yuitest_coverline("./src/eventhub.js", 263);
removeCallback(namespace.on, c) ;        // YES -> remove it from 'on'
                   }
               }) ;
               _yuitest_coverline("./src/eventhub.js", 266);
namespace.one.length = 0 ;                       // all 'one' callbacks have been called --> cleanup
           }
           else {                                               // found a deeper nested namespace
                _yuitest_coverline("./src/eventhub.js", 269);
retVal += triggerEvent(namespace, data) ;       // nested namespaces
           }
        }
        _yuitest_coverline("./src/eventhub.js", 272);
return retVal ;
    }

    _yuitest_coverline("./src/eventhub.js", 275);
Ns.EventHub = eh ;

})(window.Sway) ;
