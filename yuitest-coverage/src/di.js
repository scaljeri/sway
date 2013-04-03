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
_yuitest_coverage["./src/di.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/di.js",
    code: []
};
_yuitest_coverage["./src/di.js"].code=["","(function(console, Ns) {","    \"use strict\" ;","	/**","		DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","        facilitating lazy initialization and loose coupling between classes.","","		@class Sway.DI","		@constructor","	**/","	var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","	} ;","","	di.prototype = {","		/**","		 * Register a class by creating a contract. Use {{#crossLink \"DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract/class. The injected dependencies, if any, will be used as constructor parameter","         * in the order provided by the dependencies array.","         *","		 * @method register","		 * @chainable","		 * @param {String} contract name of the contracta","		 * @param {Class} class the class bind to this contract","         * @param {Array} [dependencies] list of contracts; dependencies of this class","         * @param {Object} [options] addition setting used to create the instance.","         * @param {string} options.singleton set to TRUE if the class should be treated as a singleton class","		 * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", \"wsql\"], { singleton: true } ) ;","		**/","        register: function(contract, classRef, dependencies, options)","        {","            if ( !options && !Array.isArray(dependencies) ) { // fix input","                options = dependencies ;","                dependencies = [] ;","            }","            this._contracts[contract] = { classRef: classRef, dependencies: dependencies, options: options||{} } ;","            return this ;","        },","","        /**","         * Returns an instance for the given contract.","         *","         * @method geInstancet","         * @param  {string} contract name","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract) {","            if ( !this._contracts[contract] ) {","                return null ;","            }","","            if (this._contracts[contract].options.singleton )","            {","                //use existing instance","                return getSingletonInstance.call(this._contracts[contract]);","            } else //create a new instance every time","            {","                return this.createInstance(contract, this._contracts[contract].dependencies) ;","            }","        },","","        /**","            Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","            If one of the dependencies does not exists, 'null' is used instead.","","            @method createInstance","            @param {string} contract - the contract name","            @param {Array} dependencies - list of contracts passed to the constructor","            @returns {Object}","            @example","                try {","                    var storage = App.di.createInstance(\"data\", [\"compress\", \"websql\"]) ;","                }","                catch(e) { // will fail if contract does not exist","                    console.log(e.name + ': ' + e.message) ;","                }","        **/","        createInstance: function(contract, dependencies)","        {","            if ( !this._contracts[contract] ) {","                throw 'Unknown contract name \"' + contract + '\"' ;","            }","","            var self = this ;","            var cr = this._contracts[contract].classRef ;","","            function Fake(){","                cr.apply(this, createInstanceList.call(self, contract, dependencies||[])) ;","            }","            Fake.prototype = cr.prototype ; // Fix instanceof","            return new Fake() ;","        }","	} ;","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance() {","        if (this.instance === undefined) {","            this.instance = new this.classRef(this.dependencies);","        }","        return this.instance ;","    }","","    /* convert a list of contracts into a list of instances","    * A dependency list can contain arrays with dependencies too:","    *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","    * In this case, the constructor would, for example, look like this:","    *    function constructor(instance, array, instance) { .. }","    * */","    function createInstanceList(contract, dependencies) {","        var instances = [] ;","","        dependencies.forEach( function(c) {","            if ( Array.isArray(c)) {","                instances.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                if ( this._depCheck.indexOf(c) === -1 ) { // check for circular dependency","                    this._depCheck.push(c) ;","                    instances.push(this.getInstance(c)) ;","                    if ( !instances[instances.length-1]) {","                        console.warn(\"Dependency '\" + c + \"' does not exist!\") ;","                    }","                    this._depCheck.pop() ;","                }","                else { // fatal","                    this._depCheck.length = 0 ;","                    throw \"Circular dependency detected for contract \" + c ;","                }","            }","        }.bind(this)) ;","        return instances ;","    }","","	Ns.DI = di ;","","})(window.console, window.Sway) ;"];

_yuitest_coverage["./src/di.js"].lines = {"2":0,"3":0,"11":0,"13":0,"20":0,"28":0,"48":0,"49":0,"50":0,"52":0,"53":0,"66":0,"67":0,"70":0,"73":0,"76":0,"98":0,"99":0,"102":0,"103":0,"105":0,"106":0,"108":0,"109":0,"116":0,"117":0,"118":0,"120":0,"129":0,"130":0,"132":0,"133":0,"134":0,"137":0,"138":0,"139":0,"140":0,"141":0,"143":0,"146":0,"147":0,"151":0,"154":0};
_yuitest_coverage["./src/di.js"].functions = {"di:11":0,"register:46":0,"getInstance:65":0,"Fake:105":0,"createInstance:96":0,"getSingletonInstance:116":0,"(anonymous 2):132":0,"createInstanceList:129":0,"(anonymous 1):2":0};
_yuitest_coverage["./src/di.js"].coveredLines = 43;
_yuitest_coverage["./src/di.js"].coveredFunctions = 9;
_yuitest_coverline("./src/di.js", 2);
(function(console, Ns) {
    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 2);
_yuitest_coverline("./src/di.js", 3);
"use strict" ;
	/**
		DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
        facilitating lazy initialization and loose coupling between classes.

		@class Sway.DI
		@constructor
	**/
	_yuitest_coverline("./src/di.js", 11);
var di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 11);
_yuitest_coverline("./src/di.js", 13);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        _yuitest_coverline("./src/di.js", 20);
Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
	} ;

	_yuitest_coverline("./src/di.js", 28);
di.prototype = {
		/**
		 * Register a class by creating a contract. Use {{#crossLink "DI/getInstance:method"}}{{/crossLink}} to obtain
         * an instance from this contract/class. The injected dependencies, if any, will be used as constructor parameter
         * in the order provided by the dependencies array.
         *
		 * @method register
		 * @chainable
		 * @param {String} contract name of the contracta
		 * @param {Class} class the class bind to this contract
         * @param {Array} [dependencies] list of contracts; dependencies of this class
         * @param {Object} [options] addition setting used to create the instance.
         * @param {string} options.singleton set to TRUE if the class should be treated as a singleton class
		 * @example
         App.di.registerType("ajax", App.AJAX) ;
         App.di.registerType("ajax", App.AJAX, [], { singleton: true }) ;
         App.di.registerType("util", App.Util, ["compress", "wsql"], { singleton: true } ) ;
		**/
        register: function(contract, classRef, dependencies, options)
        {
            _yuitest_coverfunc("./src/di.js", "register", 46);
_yuitest_coverline("./src/di.js", 48);
if ( !options && !Array.isArray(dependencies) ) { // fix input
                _yuitest_coverline("./src/di.js", 49);
options = dependencies ;
                _yuitest_coverline("./src/di.js", 50);
dependencies = [] ;
            }
            _yuitest_coverline("./src/di.js", 52);
this._contracts[contract] = { classRef: classRef, dependencies: dependencies, options: options||{} } ;
            _yuitest_coverline("./src/di.js", 53);
return this ;
        },

        /**
         * Returns an instance for the given contract.
         *
         * @method geInstancet
         * @param  {string} contract name
         * @returns {Object} Class instance
         * @example
         var ajax = App.di.getInstance("ajax") ;
         **/
        getInstance: function(contract) {
            _yuitest_coverfunc("./src/di.js", "getInstance", 65);
_yuitest_coverline("./src/di.js", 66);
if ( !this._contracts[contract] ) {
                _yuitest_coverline("./src/di.js", 67);
return null ;
            }

            _yuitest_coverline("./src/di.js", 70);
if (this._contracts[contract].options.singleton )
            {
                //use existing instance
                _yuitest_coverline("./src/di.js", 73);
return getSingletonInstance.call(this._contracts[contract]);
            } else //create a new instance every time
            {
                _yuitest_coverline("./src/di.js", 76);
return this.createInstance(contract, this._contracts[contract].dependencies) ;
            }
        },

        /**
            Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.
            If one of the dependencies does not exists, 'null' is used instead.

            @method createInstance
            @param {string} contract - the contract name
            @param {Array} dependencies - list of contracts passed to the constructor
            @returns {Object}
            @example
                try {
                    var storage = App.di.createInstance("data", ["compress", "websql"]) ;
                }
                catch(e) { // will fail if contract does not exist
                    console.log(e.name + ': ' + e.message) ;
                }
        **/
        createInstance: function(contract, dependencies)
        {
            _yuitest_coverfunc("./src/di.js", "createInstance", 96);
_yuitest_coverline("./src/di.js", 98);
if ( !this._contracts[contract] ) {
                _yuitest_coverline("./src/di.js", 99);
throw 'Unknown contract name "' + contract + '"' ;
            }

            _yuitest_coverline("./src/di.js", 102);
var self = this ;
            _yuitest_coverline("./src/di.js", 103);
var cr = this._contracts[contract].classRef ;

            _yuitest_coverline("./src/di.js", 105);
function Fake(){
                _yuitest_coverfunc("./src/di.js", "Fake", 105);
_yuitest_coverline("./src/di.js", 106);
cr.apply(this, createInstanceList.call(self, contract, dependencies||[])) ;
            }
            _yuitest_coverline("./src/di.js", 108);
Fake.prototype = cr.prototype ; // Fix instanceof
            _yuitest_coverline("./src/di.js", 109);
return new Fake() ;
        }
	} ;

    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 116);
function getSingletonInstance() {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 116);
_yuitest_coverline("./src/di.js", 117);
if (this.instance === undefined) {
            _yuitest_coverline("./src/di.js", 118);
this.instance = new this.classRef(this.dependencies);
        }
        _yuitest_coverline("./src/di.js", 120);
return this.instance ;
    }

    /* convert a list of contracts into a list of instances
    * A dependency list can contain arrays with dependencies too:
    *    ["depA", ["depB", "depC"], "depE"]
    * In this case, the constructor would, for example, look like this:
    *    function constructor(instance, array, instance) { .. }
    * */
    _yuitest_coverline("./src/di.js", 129);
function createInstanceList(contract, dependencies) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 129);
_yuitest_coverline("./src/di.js", 130);
var instances = [] ;

        _yuitest_coverline("./src/di.js", 132);
dependencies.forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 132);
_yuitest_coverline("./src/di.js", 133);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 134);
instances.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 137);
if ( this._depCheck.indexOf(c) === -1 ) { // check for circular dependency
                    _yuitest_coverline("./src/di.js", 138);
this._depCheck.push(c) ;
                    _yuitest_coverline("./src/di.js", 139);
instances.push(this.getInstance(c)) ;
                    _yuitest_coverline("./src/di.js", 140);
if ( !instances[instances.length-1]) {
                        _yuitest_coverline("./src/di.js", 141);
console.warn("Dependency '" + c + "' does not exist!") ;
                    }
                    _yuitest_coverline("./src/di.js", 143);
this._depCheck.pop() ;
                }
                else { // fatal
                    _yuitest_coverline("./src/di.js", 146);
this._depCheck.length = 0 ;
                    _yuitest_coverline("./src/di.js", 147);
throw "Circular dependency detected for contract " + c ;
                }
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 151);
return instances ;
    }

	_yuitest_coverline("./src/di.js", 154);
Ns.DI = di ;

})(window.console, window.Sway) ;
