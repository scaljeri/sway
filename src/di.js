"use strict" ;

(function(Ns) {
	/**
		Manages classes and/or instances, with each being accessible by a contract. Two types of contracts are available, a contract for instances and classes
        For registered classes, instances are created when requested (lazy initialization). Also, dependencies are injected (DI) when these instances are
        created, facilitating loose coupling between classes.

		@class DI
		@constructor
	**/
	var di = function() {
		this.parts = []; 
       		this.types = {} 
	} ;

	di.prototype = {
		/**
			Register a class and create the contract. For this type of contract use {{#crossLink "DI/getDependency:method"}}{{/crossLink}}
			to retrieve the instance. Depending on the policy, this class can be used as a singleton too.

			@method registerType
			@chainable 
			@param {String} contract name of the contracta
			@param {Class} type class name
    			@param {string} [policy] - determines if the class is a singleton (single) or not
			@example 
				App.di.registerType("ajax", App.AJAX) ;
				App.di.registerType("util", App.Util, "single") ;
		**/
        registerType: function(contract, type, policy, options)
        {
            this.types[contract] = { policy: policy, type: type, options: options } ;
		    return this ;
        },
			
		/**
			Register an instance and adds it to the contract. This type of contract can hold many instances, which can be
            retrieved using {{#crossLink "DI/getDependencies:method"}}{{/crossLink}}

			@method registerInstance
			@chainable 
			@param {string} contract - name of the contract.
    			@param {Object} instance - an instance
			@example
				App.di.registerInstance("tile", new App.Twitter) ;
				App.di.registerInstance("tile", new App.Clock) ;
		**/
        registerInstance: function(contract, instance)
        {
            if (this.parts[contract] == undefined)
            {
                this.parts[contract] = [];
            }
            this.parts[contract].push(instance);
			return this ;
       	},
			
        /**
           Returns the results for a contract. For both contracts an array is return containing one or more instances

           @method getDependencies
           @param {string} contract - name of the contract.
		   @return {Array} - list of instances
		   @example
		    var tiles = App.di.getDependencies("tile") ;
        **/
        getDependencies: function(contract)
        {
        	if ( this.parts[contract] instanceof Array)
           	{
           		//instances registered
           		return this.parts[contract] ;
        	}
        	else if ( this.types[contract] )
        	{
                //type registered
               	if (this.types[contract].policy == 'single')
               	{
                    //use existing instance
               		return getSingletonInstance.call(this, contract);
               	} else //create a new instance every time
                {
               	    return new this.types[contract].type(this.types.options);
               	}
            }
			return null ;
        },

        /**
         * Returns only one result for a contract.
         *
         * @method getDependency
         * @param contract
         * @returns {Object}
         * @example
            var ajax = App.di.getDependency("ajax") ;
         */
        getDependency: function(contract) {
            var result = this.getDependencies(contract) ;
            return result && Array.isArray(result) ? result[0] : result ;
        },

        /**
            Returns a new instance of the class matched by the contract.

            @method createInstance
            @param {string} contract - the contract name
            @param {Array} args - parameters for the constructor
            @returns {Object}
        **/
        createInstance: function(contract, args) {
            var constructor = this
            function Fake(){
                constructor.apply(this, args) ;
            }
            Fake.prototype = constructor.prototype // Fake inhertis from classname
            return new Fake ;
        }
	} ;

    /* private helper
        Create a singleton instance
     */
    function getSingletonInstance(contract) {

        if (this.types[contract].instance == undefined)
            {
            	this.types[contract].instance = new this.types[contract].type(this.types.options);
            }
       	return this.types[contract].instance ;
    }

	Ns.DI = di ;
})(window.Scaljeri) ;
