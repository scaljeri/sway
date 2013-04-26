(function(console, Ns) {
    /**
     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
     *  facilitating lazy initialization and loose coupling between classes.
     *
     *      Sway.di.register( 'user'
     *                        , Sway.data.ActiveRecord
     *                        , [ 'User', 'webSql', ['username', 'password', 'accountInfo'], 'websql' ]
     *                        , { singleton: TRUE }
     *                      )
     *             .register( 'userNameField'
     *                        , Sway.data.Field
     *                        , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]
     *                        , {singleton: TRUE}
     *                      )
     *             .register( 'accountInfoField',
     *                        , Sway.data.Field
     *                        , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }
     *                            , ['encryptFilter', 'compressFilter']
     *                          ]
     *                        , { singleton: TRUE}
     *                      ) ;
     *
     * Now, everywhere in the application where a User model is required simply do
     *
     *       var User = Sway.di.getInstance('user') ;
     *
     * Doing the same without Sway.DI, you will have to keep track of a lot more variables
     *
     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;
     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }
     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;
     *
     * And finally, to create a User model
     *
     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, accountInfoField] ) ;
     *
     * is definitely more tightly coupled code!
     *
     * @class Sway.DI
     * @constructor
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
         * an instance from this contract. The <tt>param</tt> parameter is a list of contracts,  and, if needed,  mixed
         * with other constructor parameters. These are the constructor parameters.
         *
         * @method register
         * @chainable
         * @param {String} contract name of the contracta
         * @param {Class} classRef the class bind to this contract
         * @param {Array} [params] list of constructor parameters. If a parameter is a string matching a contract, it
         * will be replaced with the corresponding instance
         * @param {Object} [options] configuration
         *      @param {string} [options.singleton=false] create a new instance every time
         * @example
         App.di.registerType("ajax", App.AJAX) ;
         App.di.registerType("ajax", App.AJAX, [], { singleton: true }) ;
         App.di.registerType("util", App.Util, ["compress", true, ["wsql", "ls"] ], { singleton: true } ) ;
         **/
        register: function(contract, classRef, params, options)
        {
            if ( !options && !Array.isArray(params) ) { // fix input
                options = params ;
                params = [] ;
            }
            this._contracts[contract] = { classRef: classRef, dependencies: params||[], options: options||{} } ;
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
            if ( this._contracts[contract] ) {                                          // it should exist
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
         * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.
         * If one of the dependencies does not exists, 'null' is used instead.
         *
         * @method createInstance
         * @param {string} contract - the contract name
         * @param {Array} dependencies - list of contracts passed to the constructor
         * @returns {Object}
         * @example
         try {
             var storage = App.di.createInstance("data", ["compress", "websql"]) ;
         }
         catch(e) { // will fail if contract does not exist
             console.log(e.name + ': ' + e.message) ;
         }
         **/
        createInstance: function(contract, params)
        {
            var instance = null
                , self = this
                , cr ;

            function Fake(){
                cr.apply(this, createInstanceList.call(self, contract, params||[])) ;
            }

            if ( this._contracts[contract]) {   // contract should exist
                cr = this._contracts[contract].classRef ;

                Fake.prototype = cr.prototype ; // Fix instanceof
                instance = new Fake() ;
            }
            else {
                console.warn( 'Contract ' + contract + ' does not exist') ;
            }
            return instance ;
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
    function createInstanceList(contract, params) {
        var constParams = [] ;

        params.forEach( function(c) {
            if ( Array.isArray(c)) {
                constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        return constParams ;
    }

    function createInstanceIfContract(contract) {
        var constParam = contract ;
        if ( typeof(contract) === 'string' && this._contracts[contract] ) { // is 'contract' just a contructor parameter or a contract?
            if ( this._depCheck.indexOf(contract) === -1 ) {                // check for circular dependency
                this._depCheck.push(contract) ;                                    // add contract to circular dependency check list
                constParam = this.getInstance(contract) ;                     // create the instance
                this._depCheck.pop() ;                                      // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP
                this._depCheck.length = 0 ;
                throw "Circular dependency detected for contract " + contract ;
            }
        }
        return constParam ;
    }

    Ns.DI = di ;

})(window.console, window.Sway) ;
