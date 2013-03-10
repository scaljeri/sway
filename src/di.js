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
			Register a class and setup a contract. {{#crossLink "ServiceLocator/getDependency:method"}}{{/crossLink}}	
			will return an instance of this class. Depending on the policy, this class can be used as a singleton.

			@method registerType
			@chainable 
			@param {String} contract name of the contracta
			@param {Class} type class name
    			@param {string} [policy] - determines if the class is a singleton (single) or not
			@example 
				App.locator.registerType("ajax", App.AJAX) ;
				App.locator.registerType("util", App.Util, "single") ;
		**/
        	registerType: function(contract, type, policy, options)
        	{
               		this.types[contract] = { policy: policy, type: type, options: options } ;
			return this ;
        	},
			
		/**
			Register an instance and setup a contract. For this type of contract {{#crossLink "ServiceLocator/getDependency:method"}}{{/crossLink}}
			will return an array of registered instances

			@method registerInstance
			@chainable 
			@param {string} contract - name of the contract.
    			@param {Object} instance - an instance
			@example
				App.locator.registerInstance("tile", new App.Twitter) ;
				App.locator.registerInstance("tile", new App.Clock) ;
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
                	Retrieve the result of a contract. Depending on the type of contract, one instance or an array of instances is returned

                	@method getDependency
                	@param {string} contract - name of the contract.
			@return {object|Array} - instance
			@example 
				var tiles = App.locator.getDependency("tile") ;
				var ajax = App.locator.getDependency("ajax") ;
        	**/
        	getDependency: function(contract)
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
               			} else { //create a new instance every time
               				return new this.types[contract].type(this.types.options);
               			}
               		}
			return null ;
        	}
	} ;

    //private helper
    function getSingletonInstance(contract) {
        if (this.types[contract].instance == undefined)
            {
            	this.types[contract].instance = new this.types[contract].type(this.types.options);
            }
       	return this.types[contract].instance ;
    }

	Ns.DI = di ;
})(window.Scaljeri) ;
