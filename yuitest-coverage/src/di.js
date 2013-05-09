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
_yuitest_coverage["./src/di.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(console, ns) {","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     * facilitating lazy initialization and loose coupling between classes.","     *","     * As an example, register all contracts during the application initialization","     *","     *      var di = new Sway.DI() ;","     *      di.register( 'User'                                                                                 // contract name","     *                   , Sway.data.ActiveRecord                                                               // class definiton","     *                   , [ 'User', 'webSql', ['userNameField', 'passwordField', 'accountInfo'], 'websql' ]    // constructor parameters","     *                   , { singleton: TRUE }                                                                  // configuration: create a singleton","     *                 )","     *        .register( 'userNameField'","     *                   , Sway.data.Field","     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                   , {singleton: TRUE}","     *                 )","     *        .register( 'accountInfoField',","     *                   , Sway.data.Field","     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                        , ['encryptFilter', 'compressFilter']","     *                     ]","     *                   , { singleton: TRUE}","     *                 )","     *        .register( 'userRecord'","     *                   , di.register('User')  // create the User model!!","     *                 )","     *        ...","     *","     * Now everywhere in the application create the instances as follows","     *","     *       var User = Sway.di.getInstance('User') ;","     *       userRecord = new User({ username: 'John', password: 'Secret' }) ;","     *       // or","     *       userRecord = Sway.di.getInstance('userRecord', [{username: 'John', password: 'Secret'}]) ;","     *","     * To give an idea of what this does, below is an example doing the exact same thing but without Sway.DI","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *       ...","     *","     * And create instances like","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, passwordField, accountInfoField] ) ;","     *       var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *","     * @class Sway.DI","     * @constructor","     **/","    var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"Sway.DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>params</tt> parameter is a list of contracts,  and, if needed, normal","         * constructor parameters can be mixed in.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contract","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. Only if a parameter is a string and matches a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {string} [options.singleton=false] create a new instance every time","         * @return {Object} this","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( !options && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","","            if ( !classRef ) {","                console.warn('the Class is undefined for contract ' + contract ) ;","            }","            else {","                this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;","            }","            return this ;","        },","","        /**","         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default","         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.","         *","         * @method getInstance","         * @param  {String} contract name","         * @param  {Array} [params] constructor parameters","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract, params) {","            var instance = null ;","","            if ( this._contracts[contract]  ) {                                      // it should exist","                if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!","                {","                    instance = getSingletonInstance.call(this, contract) ;","                } else //create a new instance every time","                {","                    instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;","                }","            }","            return instance ;","        },","    } ;","","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance(contract) {","        var config = this._contracts[contract] ;","","        if ( config.instance === undefined ) {","            config.instance = createInstance.call(this, contract, config.params);","        }","        return config.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        (params||this._contracts[contract].params||[]).forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) { // is a contract","        var constParam = contract","            , problemContract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?","            if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency","                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                       // create the instance","                this._depCheck.pop() ;                                          // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!","                problemContract = this._depCheck[0] ;","                this._depCheck.length = 0 ;                                     // cleanup","                throw \"Circular dependency detected for contract \" + problemContract ;","            }","        }","        return constParam ;","    }","","    /*","     * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","     *","     * @method createInstance","     * @param {string} contract - the contract name","     * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or","     * an unknown contract, is passed as-is to the constructor","     *","     * @returns {Object}","     * @example","     var storage = App.di.createInstance(\"data\", [\"compress\", true, \"websql\"]) ;","     **/","    function createInstance(contract, params)","    {","        var instance = null","            , self = this","            , cr ;","","        function Dependency(){","            cr.apply(this, createInstanceList.call(self, contract, params)) ;","        }","","        if ( this._contracts[contract]) {           // contract should exist","            cr = this._contracts[contract].classRef ;","","            this._depCheck.push(contract) ;","            Dependency.prototype = cr.prototype ;   // Fix instanceof","            instance = new Dependency() ;           // done","            this._depCheck.pop() ;","        }","        else {","            console.warn( 'Contract ' + contract + ' does not exist') ;","        }","        return instance ;","    }","","    ns.DI = di ;","","})(window.console, window.Sway) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"3":0,"55":0,"57":0,"64":0,"72":0,"94":0,"95":0,"96":0,"99":0,"100":0,"103":0,"105":0,"120":0,"122":0,"123":0,"125":0,"128":0,"131":0,"139":0,"140":0,"142":0,"143":0,"145":0,"154":0,"155":0,"157":0,"158":0,"159":0,"162":0,"165":0,"168":0,"169":0,"171":0,"172":0,"174":0,"175":0,"178":0,"179":0,"180":0,"183":0,"198":0,"200":0,"204":0,"205":0,"208":0,"209":0,"211":0,"212":0,"213":0,"214":0,"217":0,"219":0,"222":0};
_yuitest_coverage["./src/di.js"].functions = {"di:55":0,"register:92":0,"getInstance:119":0,"getSingletonInstance:139":0,"(anonymous 2):157":0,"createInstanceList:154":0,"createInstanceIfContract:168":0,"Dependency:204":0,"createInstance:198":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/di.js"].coveredLines = 54;
_yuitest_coverage["./src/di.js"].coveredFunctions = 10;
_yuitest_coverline("./src/di.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/di.js", 3);
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
    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/di.js", 55);
var di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 55);
_yuitest_coverline("./src/di.js", 57);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        _yuitest_coverline("./src/di.js", 64);
Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/di.js", 72);
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
            _yuitest_coverfunc("./src/di.js", "register", 92);
_yuitest_coverline("./src/di.js", 94);
if ( !options && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 95);
options = params ;
                _yuitest_coverline("./src/di.js", 96);
params = [] ;
            }

            _yuitest_coverline("./src/di.js", 99);
if ( !classRef ) {
                _yuitest_coverline("./src/di.js", 100);
console.warn('the Class is undefined for contract ' + contract ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 103);
this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;
            }
            _yuitest_coverline("./src/di.js", 105);
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
            _yuitest_coverfunc("./src/di.js", "getInstance", 119);
_yuitest_coverline("./src/di.js", 120);
var instance = null ;

            _yuitest_coverline("./src/di.js", 122);
if ( this._contracts[contract]  ) {                                      // it should exist
                _yuitest_coverline("./src/di.js", 123);
if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!
                {
                    _yuitest_coverline("./src/di.js", 125);
instance = getSingletonInstance.call(this, contract) ;
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 128);
instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;
                }
            }
            _yuitest_coverline("./src/di.js", 131);
return instance ;
        },
    } ;


    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 139);
function getSingletonInstance(contract) {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 139);
_yuitest_coverline("./src/di.js", 140);
var config = this._contracts[contract] ;

        _yuitest_coverline("./src/di.js", 142);
if ( config.instance === undefined ) {
            _yuitest_coverline("./src/di.js", 143);
config.instance = createInstance.call(this, contract, config.params);
        }
        _yuitest_coverline("./src/di.js", 145);
return config.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 154);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 154);
_yuitest_coverline("./src/di.js", 155);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 157);
(params||this._contracts[contract].params||[]).forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 157);
_yuitest_coverline("./src/di.js", 158);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 159);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 162);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 165);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 168);
function createInstanceIfContract(contract) { // is a contract
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 168);
_yuitest_coverline("./src/di.js", 169);
var constParam = contract
            , problemContract ;
        _yuitest_coverline("./src/di.js", 171);
if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 172);
if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency
                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 174);
constParam = this.getInstance(contract) ;                       // create the instance
                _yuitest_coverline("./src/di.js", 175);
this._depCheck.pop() ;                                          // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!
                _yuitest_coverline("./src/di.js", 178);
problemContract = this._depCheck[0] ;
                _yuitest_coverline("./src/di.js", 179);
this._depCheck.length = 0 ;                                     // cleanup
                _yuitest_coverline("./src/di.js", 180);
throw "Circular dependency detected for contract " + problemContract ;
            }
        }
        _yuitest_coverline("./src/di.js", 183);
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
    _yuitest_coverline("./src/di.js", 198);
function createInstance(contract, params)
    {
        _yuitest_coverfunc("./src/di.js", "createInstance", 198);
_yuitest_coverline("./src/di.js", 200);
var instance = null
            , self = this
            , cr ;

        _yuitest_coverline("./src/di.js", 204);
function Dependency(){
            _yuitest_coverfunc("./src/di.js", "Dependency", 204);
_yuitest_coverline("./src/di.js", 205);
cr.apply(this, createInstanceList.call(self, contract, params)) ;
        }

        _yuitest_coverline("./src/di.js", 208);
if ( this._contracts[contract]) {           // contract should exist
            _yuitest_coverline("./src/di.js", 209);
cr = this._contracts[contract].classRef ;

            _yuitest_coverline("./src/di.js", 211);
this._depCheck.push(contract) ;
            _yuitest_coverline("./src/di.js", 212);
Dependency.prototype = cr.prototype ;   // Fix instanceof
            _yuitest_coverline("./src/di.js", 213);
instance = new Dependency() ;           // done
            _yuitest_coverline("./src/di.js", 214);
this._depCheck.pop() ;
        }
        else {
            _yuitest_coverline("./src/di.js", 217);
console.warn( 'Contract ' + contract + ' does not exist') ;
        }
        _yuitest_coverline("./src/di.js", 219);
return instance ;
    }

    _yuitest_coverline("./src/di.js", 222);
ns.DI = di ;

})(window.console, window.Sway) ;
