window.Scaljeri = window.Scaljeri || {} ; // make sure it exists

(function(Ns, $){
    var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }

    var eh = function() {
        Object.defineProperty(this, '_events',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
    }

    eh.prototype = {
       register: function(eventName) {
            this._event[eventName] = { before: [], normal: [], after: [] } ;
       }
       , trigger: function(eventName, data){
            requestAnimFrame( triggerEvent.bind(this, data) ) ; // yield
        }
       , on: function(eventName, position) {}
    } ;

    function triggerEvent(eventName, data) {
        // TODO: call all callbacks for "eventName"
    }

    Ns.EventHub = eh ;

})(window.Scaljeri, jQuery) ;