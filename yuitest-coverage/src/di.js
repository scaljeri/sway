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
_yuitest_coverage["./src/di.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(console, ns) {","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     * facilitating lazy initialization and loose coupling between classes.","     *","     * As an example, register all contracts during the application initialization","     *","     *      var di = new Sway.DI() ;","     *      di.register( 'UserModel'                                                                                 // contract name","     *                   , Sway.data.ActiveRecord                                                               // class definiton","     *                   , [ 'User', 'webSql', ['userNameField', 'passwordField', 'accountInfo'], 'websql' ]    // constructor parameters","     *                   , { singleton: TRUE }                                                                  // configuration: create a singleton","     *                 )","     *        .register( 'userNameField'","     *                   , Sway.data.Field","     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                   , {singleton: TRUE}","     *                 )","     *        .register( 'accountInfoField',","     *                   , Sway.data.Field","     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                        , ['encryptFilter', 'compressFilter']","     *                     ]","     *                   , { singleton: TRUE}","     *                 )","     *        .register( 'userRecord'","     *                   , di.getInstance('UserModel')  // create the User model!!","     *                 )","     *        ...","     *","     * Now everywhere in the application create the instances as follows","     *","     *       var User = Sway.di.getInstance('User') ;","     *       userRecord = new User({ username: 'John', password: 'Secret' }) ;","     *       // or","     *       userRecord = Sway.di.getInstance('userRecord', [{username: 'John', password: 'Secret'}]) ;","     *","     * To give an idea of what this does, below is an example doing the exact same thing but without Sway.DI","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *       ...","     *","     * And create instances like","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, passwordField, accountInfoField] ) ;","     *       var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *","     * @class Sway.DI","     * @constructor","     **/","    var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"Sway.DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>params</tt> parameter is a list of contracts,  and, if needed, normal","         * constructor parameters can be mixed in.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contract","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. Only if a parameter is a string and matches a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {String} [options.singleton=false] create a new instance every time","         *      @param {String} [options.description] describes the contract (currently only used by {{#crossLink \"Sway.DI/listContracts:method\"}}{{/crossLink}}).","         * @return {Object} this","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( !options && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","","            if ( !classRef ) {","                console.warn('the Class is undefined for contract ' + contract ) ;","            }","            else {","                this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;","            }","            return this ;","        },","","        /**","         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default","         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.","         *","         * @method getInstance","         * @param  {String} contract name","         * @param  {Array} [params] constructor parameters","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract, params) {","            var instance = null ;","","            if ( this._contracts[contract]  ) {                                      // it should exist","                if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!","                {","                    instance = getSingletonInstance.call(this, contract) ;","                } else //create a new instance every time","                {","                    instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;","                }","            }","            return instance ;","        },","        /**","         * List all available contracts with their description to <tt>console.log</tt>","         * @method listContracts","         */","        listContracts: function() {","            var keys = Object.keys(this._contracts) ;","            keys.sort().forEach(function(v) {","               console(v + ', ' + this._contracts[v].options.description) ;","            }.bind(this)) ;","        }","    } ;","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance(contract) {","        var config = this._contracts[contract] ;","","        if ( config.instance === undefined ) {","            config.instance = createInstance.call(this, contract, config.params);","        }","        return config.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        (params||this._contracts[contract].params||[]).forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) { // is a contract","        var constParam = contract","            , problemContract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?","            if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency","                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                       // create the instance","                this._depCheck.pop() ;                                          // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!","                problemContract = this._depCheck[0] ;","                this._depCheck.length = 0 ;                                     // cleanup","                throw \"Circular dependency detected for contract \" + problemContract ;","            }","        }","        return constParam ;","    }","","    /*","     * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","     *","     * @method createInstance","     * @param {string} contract - the contract name","     * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or","     * an unknown contract, is passed as-is to the constructor","     *","     * @returns {Object}","     * @example","     var storage = App.di.createInstance(\"data\", [\"compress\", true, \"websql\"]) ;","     **/","    function createInstance(contract, params)","    {","        var instance = null","            , self = this","            , cr ;","","        function Dependency(){","            cr.apply(this, createInstanceList.call(self, contract, params)) ;","        }","","        if ( this._contracts[contract]) {           // contract should exist","            cr = this._contracts[contract].classRef ;","","            this._depCheck.push(contract) ;","            Dependency.prototype = cr.prototype ;   // Fix instanceof","            instance = new Dependency() ;           // done","            this._depCheck.pop() ;","        }","        else {","            console.warn( 'Contract ' + contract + ' does not exist') ;","        }","        return instance ;","    }","","    ns.DI = di ;","","})(window.console, window.Sway) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"3":0,"55":0,"57":0,"64":0,"72":0,"95":0,"96":0,"97":0,"100":0,"101":0,"104":0,"106":0,"121":0,"123":0,"124":0,"126":0,"129":0,"132":0,"139":0,"140":0,"141":0,"149":0,"150":0,"152":0,"153":0,"155":0,"164":0,"165":0,"167":0,"168":0,"169":0,"172":0,"175":0,"178":0,"179":0,"181":0,"182":0,"184":0,"185":0,"188":0,"189":0,"190":0,"193":0,"208":0,"210":0,"214":0,"215":0,"218":0,"219":0,"221":0,"222":0,"223":0,"224":0,"227":0,"229":0,"232":0};
_yuitest_coverage["./src/di.js"].functions = {"di:55":0,"register:93":0,"getInstance:120":0,"(anonymous 2):140":0,"listContracts:138":0,"getSingletonInstance:149":0,"(anonymous 3):167":0,"createInstanceList:164":0,"createInstanceIfContract:178":0,"Dependency:214":0,"createInstance:208":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/di.js"].coveredLines = 57;
_yuitest_coverage["./src/di.js"].coveredFunctions = 12;
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
     *      di.register( 'UserModel'                                                                                 // contract name
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
     *                   , di.getInstance('UserModel')  // create the User model!!
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
         *      @param {String} [options.singleton=false] create a new instance every time
         *      @param {String} [options.description] describes the contract (currently only used by {{#crossLink "Sway.DI/listContracts:method"}}{{/crossLink}}).
         * @return {Object} this
         * @example
         App.di.registerType("ajax", App.AJAX) ;
         App.di.registerType("ajax", App.AJAX, [], { singleton: true }) ;
         App.di.registerType("util", App.Util, ["compress", true, ["wsql", "ls"] ], { singleton: true } ) ;
         **/
        register: function(contract, classRef, params, options)
        {
            _yuitest_coverfunc("./src/di.js", "register", 93);
_yuitest_coverline("./src/di.js", 95);
if ( !options && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 96);
options = params ;
                _yuitest_coverline("./src/di.js", 97);
params = [] ;
            }

            _yuitest_coverline("./src/di.js", 100);
if ( !classRef ) {
                _yuitest_coverline("./src/di.js", 101);
console.warn('the Class is undefined for contract ' + contract ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 104);
this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;
            }
            _yuitest_coverline("./src/di.js", 106);
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
            _yuitest_coverfunc("./src/di.js", "getInstance", 120);
_yuitest_coverline("./src/di.js", 121);
var instance = null ;

            _yuitest_coverline("./src/di.js", 123);
if ( this._contracts[contract]  ) {                                      // it should exist
                _yuitest_coverline("./src/di.js", 124);
if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!
                {
                    _yuitest_coverline("./src/di.js", 126);
instance = getSingletonInstance.call(this, contract) ;
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 129);
instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;
                }
            }
            _yuitest_coverline("./src/di.js", 132);
return instance ;
        },
        /**
         * List all available contracts with their description to <tt>console.log</tt>
         * @method listContracts
         */
        listContracts: function() {
            _yuitest_coverfunc("./src/di.js", "listContracts", 138);
_yuitest_coverline("./src/di.js", 139);
var keys = Object.keys(this._contracts) ;
            _yuitest_coverline("./src/di.js", 140);
keys.sort().forEach(function(v) {
               _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 140);
_yuitest_coverline("./src/di.js", 141);
console(v + ', ' + this._contracts[v].options.description) ;
            }.bind(this)) ;
        }
    } ;

    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 149);
function getSingletonInstance(contract) {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 149);
_yuitest_coverline("./src/di.js", 150);
var config = this._contracts[contract] ;

        _yuitest_coverline("./src/di.js", 152);
if ( config.instance === undefined ) {
            _yuitest_coverline("./src/di.js", 153);
config.instance = createInstance.call(this, contract, config.params);
        }
        _yuitest_coverline("./src/di.js", 155);
return config.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 164);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 164);
_yuitest_coverline("./src/di.js", 165);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 167);
(params||this._contracts[contract].params||[]).forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 3)", 167);
_yuitest_coverline("./src/di.js", 168);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 169);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 172);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 175);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 178);
function createInstanceIfContract(contract) { // is a contract
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 178);
_yuitest_coverline("./src/di.js", 179);
var constParam = contract
            , problemContract ;
        _yuitest_coverline("./src/di.js", 181);
if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 182);
if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency
                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 184);
constParam = this.getInstance(contract) ;                       // create the instance
                _yuitest_coverline("./src/di.js", 185);
this._depCheck.pop() ;                                          // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!
                _yuitest_coverline("./src/di.js", 188);
problemContract = this._depCheck[0] ;
                _yuitest_coverline("./src/di.js", 189);
this._depCheck.length = 0 ;                                     // cleanup
                _yuitest_coverline("./src/di.js", 190);
throw "Circular dependency detected for contract " + problemContract ;
            }
        }
        _yuitest_coverline("./src/di.js", 193);
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
    _yuitest_coverline("./src/di.js", 208);
function createInstance(contract, params)
    {
        _yuitest_coverfunc("./src/di.js", "createInstance", 208);
_yuitest_coverline("./src/di.js", 210);
var instance = null
            , self = this
            , cr ;

        _yuitest_coverline("./src/di.js", 214);
function Dependency(){
            _yuitest_coverfunc("./src/di.js", "Dependency", 214);
_yuitest_coverline("./src/di.js", 215);
cr.apply(this, createInstanceList.call(self, contract, params)) ;
        }

        _yuitest_coverline("./src/di.js", 218);
if ( this._contracts[contract]) {           // contract should exist
            _yuitest_coverline("./src/di.js", 219);
cr = this._contracts[contract].classRef ;

            _yuitest_coverline("./src/di.js", 221);
this._depCheck.push(contract) ;
            _yuitest_coverline("./src/di.js", 222);
Dependency.prototype = cr.prototype ;   // Fix instanceof
            _yuitest_coverline("./src/di.js", 223);
instance = new Dependency() ;           // done
            _yuitest_coverline("./src/di.js", 224);
this._depCheck.pop() ;
        }
        else {
            _yuitest_coverline("./src/di.js", 227);
console.warn( 'Contract ' + contract + ' does not exist') ;
        }
        _yuitest_coverline("./src/di.js", 229);
return instance ;
    }

    _yuitest_coverline("./src/di.js", 232);
ns.DI = di ;

})(window.console, window.Sway) ;
