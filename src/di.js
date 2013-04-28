(function(console, ns) {
    /**
     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
     * facilitating lazy initialization and loose coupling between classes.
     *
     * As an example, register all contracts during the application initialization
     *
     *      var di = new Sway.DI() ;
     *      di.register( 'User'                                                                                 // contract name
     *                   , Sway.data.ActiveRecord                                                               // class definiton
     *                   , [ 'User', 'webSql', ['userNameField', 'passwordField', 'accountInfo'], 'websql' ]    // constructor parameters
     *                   , { singleton: TRUE }                                                                  // configuration: create a singleton
     *                 )
     *        .register( 'userNameField'
     *                   , Sway.data.Field
     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]
     *                   , {singleton: TRUE}
     *                 )
     *        .register( 'accountInfoField',
     *                   , Sway.data.Field
     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }
     *                        , ['encryptFilter', 'compressFilter']
     *                     ]
     *                   , { singleton: TRUE}
     *                 )
     *        .register( 'userRecord'
     *                   , di.register('User')  // create the User model!!
     *                 )
     *        ...
     *
     * Now everywhere in the application create the instances as follows
     *
     *       var User = Sway.di.getInstance('User') ;
     *       userRecord = new User({ username: 'John', password: 'Secret' }) ;
     *       // or
     *       userRecord = Sway.di.getInstance('userRecord', [{username: 'John', password: 'Secret'}]) ;
     *
     * To give an idea of what this does, below is an example doing the exact same thing but without Sway.DI
     *
     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;
     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }
     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;
     *       ...
     *
     * And create instances like
     *
     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, passwordField, accountInfoField] ) ;
     *       var userRecord = new User({username: 'John', password: 'Secret'}) ;
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
         * Register a class by creating a contract. Use {{#crossLink "Sway.DI/getInstance:method"}}{{/crossLink}} to obtain
         * an instance from this contract. The <tt>params</tt> parameter is a list of contracts,  and, if needed, normal
         * constructor parameters can be mixed in.
         *
         * @method register
         * @chainable
         * @param {String} contract name of the contract
         * @param {Class} classRef the class bind to this contract
         * @param {Array} [params] list of constructor parameters. Only if a parameter is a string and matches a contract, it
         * will be replaced with the corresponding instance
         * @param {Object} [options] configuration
         *      @param {string} [options.singleton=false] create a new instance every time
         * @return {Object} this
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

            if ( !classRef ) {
                console.warn('the Class is undefined for contract ' + contract ) ;
            }
            else {
                this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;
            }
            return this ;
        },

        /**
         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default
         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.
         *
         * @method getInstance
         * @param  {String} contract name
         * @param  {Array} [params] constructor parameters
         * @returns {Object} Class instance
         * @example
         var ajax = App.di.getInstance("ajax") ;
         **/
        getInstance: function(contract, params) {
            var instance = null ;

            if ( this._contracts[contract]  ) {                                      // it should exist
                if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!
                {
                    instance = getSingletonInstance.call(this, contract) ;
                } else //create a new instance every time
                {
                    instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;
                }
            }
            return instance ;
        },
    } ;


    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    function getSingletonInstance(contract) {
        var config = this._contracts[contract] ;

        if ( config.instance === undefined ) {
            config.instance = createInstance.call(this, contract, config.params);
        }
        return config.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    function createInstanceList(contract, params) {
        var constParams = [] ;

        (params||this._contracts[contract].params||[]).forEach( function(c) {
            if ( Array.isArray(c)) {
                constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        return constParams ;
    }

    function createInstanceIfContract(contract) { // is a contract
        var constParam = contract
            , problemContract ;
        if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?
            if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency
                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list
                constParam = this.getInstance(contract) ;                       // create the instance
                this._depCheck.pop() ;                                          // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!
                problemContract = this._depCheck[0] ;
                this._depCheck.length = 0 ;                                     // cleanup
                throw "Circular dependency detected for contract " + problemContract ;
            }
        }
        return constParam ;
    }

    /*
     * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.
     *
     * @method createInstance
     * @param {string} contract - the contract name
     * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or
     * an unknown contract, is passed as-is to the constructor
     *
     * @returns {Object}
     * @example
     var storage = App.di.createInstance("data", ["compress", true, "websql"]) ;
     **/
    function createInstance(contract, params)
    {
        var instance = null
            , self = this
            , cr ;

        function Dependency(){
            cr.apply(this, createInstanceList.call(self, contract, params)) ;
        }

        if ( this._contracts[contract]) {           // contract should exist
            cr = this._contracts[contract].classRef ;

            this._depCheck.push(contract) ;
            Dependency.prototype = cr.prototype ;   // Fix instanceof
            instance = new Dependency() ;           // done
            this._depCheck.pop() ;
        }
        else {
            console.warn( 'Contract ' + contract + ' does not exist') ;
        }
        return instance ;
    }

    ns.DI = di ;

})(window.console, window.Sway) ;
