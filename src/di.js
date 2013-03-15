"use strict" ;

(function(Ns) {
	/**
		DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
        facilitating lazy initialization and loose coupling between classes.

		@class DI
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
			Register a class by creating a contract. Use {{#crossLink "DI/getDependency:method"}}{{/crossLink}} to obtain
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
            this._contracts[contract] = { classRef: classRef, dependencies: dependencies, options: options||{} } ;
		    return this ;
        },
			
        /**
         * Returns an instance for a contract.
         *
         * @method getDependency
         * @param  {string} contract name
         * @returns {Object} Class instance
         * @example
            var ajax = App.di.getDependency("ajax") ;
         **/
        getDependency: function(contract) {
            if ( !this._contracts[contract] ) {
                return null ;
            }

            if (this._contracts[contract].options.singleton )
            {
                //use existing instance
                return getSingletonInstance.call(this, contract);
            } else //create a new instance every time
            {
                return this.createInstance(contract, this._contracts[contract].options) ;
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
                throw this.parts[contract] ? 'Cannot create instance for this contract' : 'Unknown contract name "' + contract + '"' ;

            var cr = this._contracts[contract].classRef ;
            function Fake(){
                cr.apply(this, dependencies) ;
            }
            Fake.prototype = cr.prototype // Fix instanceof
            return new Fake ;
        }
	} ;

    /* private helper
        Create or reuse a singleton instance
     */
    function getSingletonInstance(contract) {

        if (this._contracts[contract].instance == undefined)
            {
            	this._contracts[contract].instance = new this._contracts[contract]._contracts(this.types.options);
            }
       	return this._contracts[contract].instance ;
    }

	Ns.DI = di ;
})(window.Scaljeri) ;
