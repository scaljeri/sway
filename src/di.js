"use strict" ;

(function(Ns) {
	/**
		DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
        facilitating lazy initialization and loose coupling between classes.

		@class Sway.DI
		@constructor
	**/
	var di = function() {
        Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
	} ;

	di.prototype = {
		/**
			Register a class by creating a contract. Use {{#crossLink "DI/getInstance:method"}}{{/crossLink}} to obtain
            an instance from this contract/class. The injected dependencies, if any, will be used as constructor parameter
            in the order provided by the dependencies array.

			@method register
			@chainable 
			@param {String} contract name of the contracta
			@param {Class} class the class bind to this contract
    		@param {Array} [dependencies] list of contracts; dependencies of this class
            @param {Object} [options] addition setting used to create the instance.
                @param {string} options.singleton set to TRUE if the class should be treated as a singleton class
			@example
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
         * @method geInstancet
         * @param  {string} contract name
         * @returns {Object} Class instance
         * @example
            var ajax = App.di.getInstance("ajax") ;
         **/
        getInstance: function(contract) {
            if ( !this._contracts[contract] ) {
                return null ;
            }

            if (this._contracts[contract].options.singleton )
            {
                //use existing instance
                return getSingletonInstance.call(this._contracts[contract]);
            } else //create a new instance every time
            {
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
                catch(e) {
                    console.log(e.name + ': ' + e.message) ;
                }
        **/
        createInstance: function(contract, dependencies) {
            if ( !this._contracts[contract] )
                throw 'Unknown contract name "' + contract + '"' ;

            var self = this ;
            var cr = this._contracts[contract].classRef ;

            function Fake(){
                cr.apply(this, createInstanceList.call(self, dependencies)) ;
            }
            Fake.prototype = cr.prototype // Fix instanceof
            return new Fake ;
        }
	} ;

    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    function getSingletonInstance() {

        if (this.instance == undefined)
            {
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
    function createInstanceList(dependencies) {
        if ( !dependencies )
            return [] ;

        var instances = [] ;
        dependencies.forEach(function(c, i) {
            if ( Array.isArray(c)) {
               instance.push( createInstanceList.call(this, c) ) ;
            }
            else {
                instances.push(this.getInstance(c)) ;
            }
        }.bind(this)) ;

        return instances ;
    }

	Ns.DI = di ;
})(window.Sway) ;
