
(function(console, Ns) {
    "use strict" ;
	/**
		DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
        facilitating lazy initialization and loose coupling between classes.

		@class Sway.DI
		@constructor
	**/
	var di = function() {
        // container for all registered classes
        Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
	} ;

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
            if ( !options && !Array.isArray(dependencies) ) { // fix input
                options = dependencies ;
                dependencies = [] ;
            }
            this._contracts[contract] = { classRef: classRef, dependencies: dependencies, options: options||{} } ;
            return this ;
        },

        /**
         * Returns an instance for the given contract.
         *
         * @method getInstancet
         * @param  {string} contract name
         * @returns {Object} Class instance
         * @example
         var ajax = App.di.getInstance("ajax") ;
         **/
        getInstance: function(contract) {
            var instance = null ;
            if ( this._contracts[contract] ) {
                if (this._contracts[contract].options.singleton )
                {
                    instance = getSingletonInstance.call(this._contracts[contract]);
                } else //create a new instance every time
                {
                    instance = this.createInstance(contract, this._contracts[contract].dependencies) ;
                }
            }
            return instance ;
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
            if ( !this._contracts[contract] ) {
                throw 'Unknown contract name "' + contract + '"' ;
            }

            var self = this ;
            var cr = this._contracts[contract].classRef ;

            function Fake(){
                cr.apply(this, createInstanceList.call(self, contract, dependencies||[])) ;
            }
            Fake.prototype = cr.prototype ; // Fix instanceof
            return new Fake() ;
        }
	} ;

    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    function getSingletonInstance() {
        if (this.instance === undefined) {
            this.instance = new this.classRef(this.dependencies);
        }
        return this.instance ;
    }

    /* convert a list of contracts into a list of instances
    * A dependency list can contain arrays with dependencies too:
    *    ["depA", ["depB", "depC"], "depE"]
    * In this case, the constructor would, for example, look like this:
    *    function constructor(instance, array, instance) { .. }
    * */
    function createInstanceList(contract, dependencies) {
        var instances = [] ;

        dependencies.forEach( function(c) {
            if ( Array.isArray(c)) {
                instances.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                if ( this._depCheck.indexOf(c) === -1 ) { // check for circular dependency
                    this._depCheck.push(c) ;
                    instances.push(this.getInstance(c)) ;
                    if ( !instances[instances.length-1]) {
                        console.warn("Dependency '" + c + "' does not exist!") ;
                    }
                    this._depCheck.pop() ;
                }
                else { // fatal
                    this._depCheck.length = 0 ;
                    throw "Circular dependency detected for contract " + c ;
                }
            }
        }.bind(this)) ;
        return instances ;
    }

	Ns.DI = di ;

})(window.console, window.Sway) ;
