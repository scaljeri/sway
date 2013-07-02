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
_yuitest_coverage["./src/di.js"].code=["window.Sway = window.Sway || {} ; // make sure it exists","","(function(ns, console, DEBUG) {","","    var depCheck = []                                   // used to check for circular dependencies","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     * facilitating lazy initialization and loose coupling between classes.","     *","     * As an example, register all contracts during the application initialization","     *","     *      var di = new Sway.DI() ;","     *      di.register( 'UserModel'                                                                            // contract name","     *                   , Sway.data.ActiveRecord                                                               // class definiton","     *                   , [ 'User', 'webSql', ['userNameField', 'passwordField', 'accountInfo'], 'websql' ]    // constructor parameters","     *                   , { singleton: TRUE }                                                                  // configuration: create a singleton","     *                 )","     *        .register( 'userNameField'","     *                   , Sway.data.Field","     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                   , {singleton: TRUE}","     *                 )","     *        .register( 'accountInfoField',","     *                   , Sway.data.Field","     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                        , ['encryptFilter', 'compressFilter']","     *                     ]","     *                   , { singleton: TRUE}","     *                 )","     *        .register( 'userRecord'","     *                   , di.getInstance('UserModel')  // create the User model!!","     *                 )","     *        ...","     *","     * Now everywhere in the application create the instances as follows","     *","     *       var User = Sway.di.getInstance('User') ;","     *       userRecord = new User({ username: 'John', password: 'Secret' }) ;","     *       // or","     *       userRecord = Sway.di.getInstance('userRecord', [{username: 'John', password: 'Secret'}]) ;","     *","     * To give an idea of what this does, below is an example doing the exact same thing but without Sway.DI","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *       ...","     *","     * And create instances like","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, passwordField, accountInfoField] ) ;","     *       var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *","     * @class Sway.DI","     * @constructor","     **/","     , di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"Sway.DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>params</tt> parameter is a list of contracts,  and, if needed, normal","         * constructor parameters can be mixed in.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contract","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. Only if a parameter is a string and matches a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {String} [options.singleton=false] create a new instance every time","         *      @param {String} [options.description] describes the contract (currently only used by {{#crossLink \"Sway.DI/listContracts:method\"}}{{/crossLink}}).","         * @return {Object} this","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( params && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","","            this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;","            return this ;","        },","","        /**","         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default","         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.","         *","         * @method getInstance","         * @param  {String} contract name","         * @param  {Array} [params] constructor parameters which, if defined, replaces its default arguments (see {{#crossLink \"Sway.DI/register:method\"}}{{/crossLink}} )","         * @return {Object} Class instance","         * @example","         App.di.register(\"ajax\", [\"rest\"]) ;","         var ajax = App.di.getInstance(\"ajax\") ;","         ajax = App.di.getInstance(\"ajax\", [\"rest\", true]) ;    //","         **/","        getInstance: function(contract, params) {","            var instance = null ;","","            if ( this._contracts[contract]  ) {                                      // it should exist","                if (this._contracts[contract].options.singleton )","                {","                    instance = getSingletonInstance.call(this, contract, params) ;","                } else //create a new instance every time","                {","                    instance = createInstance.call(this, contract, params) ;","                }","            }","            return instance ;","        },","        /**","         * List all available contracts with their description to <tt>console.log</tt>","         * @method listContracts","         */","        listContracts: function() {","            var keys = Object.keys(this._contracts) ;","            keys.sort().forEach(function(v) {","               console(v + ', ' + this._contracts[v].options.description) ;","            }.bind(this)) ;","        }","    } ;","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance(contract, params) {","        var config = this._contracts[contract] ;","        if ( params ) {","            config.params = params ;","        }","","        if ( config.instance === undefined || params ) {","            config.instance = createInstance.call(this, contract, config.params);","        }","        return config.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        (params||this._contracts[contract].params||[]).forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) { // is a contract","        var constParam = contract","            , problemContract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?","            if ( depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency","                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                       // create the instance","                depCheck.pop() ;                                          // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!","                problemContract = depCheck[0] ;","                depCheck.length = 0 ;                                     // cleanup","                throw \"Circular dependency detected for contract \" + problemContract ;","            }","        }","        return constParam ;","    }","","    /*","     * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","     *","     * @method createInstance","     * @param {string} contract - the contract name","     * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or","     * an unknown contract, is passed as-is to the constructor","     *","     * @returns {Object}","     * @example","     var storage = App.di.createInstance(\"data\", [\"compress\", true, \"websql\"]) ;","     **/","    function createInstance(contract, params)","    {","        var instance = null","            , self = this","            , cr ;","","        function Dependency(){","            cr.apply(this, createInstanceList.call(self, contract, params)) ;","        }","","        if ( this._contracts[contract]) {           // contract should exist","            cr = this._contracts[contract].classRef ;","","            depCheck.push(contract) ;","            Dependency.prototype = cr.prototype ;   // Fix instanceof","            instance = new Dependency() ;           // done","            depCheck.pop() ;","        }","        else if ( DEBUG ) {","            console.warn( 'Contract ' + contract + ' does not exist') ;","        }","        return instance ;","    }","","    ns.DI = di ;","","})(window.Sway, window.console, window.Sway.DEBUG) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"3":0,"5":0,"59":0,"67":0,"90":0,"91":0,"92":0,"95":0,"96":0,"113":0,"115":0,"116":0,"118":0,"121":0,"124":0,"131":0,"132":0,"133":0,"141":0,"142":0,"143":0,"144":0,"147":0,"148":0,"150":0,"159":0,"160":0,"162":0,"163":0,"164":0,"167":0,"170":0,"173":0,"174":0,"176":0,"177":0,"179":0,"180":0,"183":0,"184":0,"185":0,"188":0,"203":0,"205":0,"209":0,"210":0,"213":0,"214":0,"216":0,"217":0,"218":0,"219":0,"221":0,"222":0,"224":0,"227":0};
_yuitest_coverage["./src/di.js"].functions = {"di:57":0,"register:88":0,"getInstance:112":0,"(anonymous 2):132":0,"listContracts:130":0,"getSingletonInstance:141":0,"(anonymous 3):162":0,"createInstanceList:159":0,"createInstanceIfContract:173":0,"Dependency:209":0,"createInstance:203":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/di.js"].coveredLines = 57;
_yuitest_coverage["./src/di.js"].coveredFunctions = 12;
_yuitest_coverline("./src/di.js", 1);
window.Sway = window.Sway || {} ; // make sure it exists

_yuitest_coverline("./src/di.js", 3);
(function(ns, console, DEBUG) {

    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/di.js", 5);
var depCheck = []                                   // used to check for circular dependencies
    /**
     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
     * facilitating lazy initialization and loose coupling between classes.
     *
     * As an example, register all contracts during the application initialization
     *
     *      var di = new Sway.DI() ;
     *      di.register( 'UserModel'                                                                            // contract name
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
     , di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 57);
_yuitest_coverline("./src/di.js", 59);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/di.js", 67);
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
            _yuitest_coverfunc("./src/di.js", "register", 88);
_yuitest_coverline("./src/di.js", 90);
if ( params && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 91);
options = params ;
                _yuitest_coverline("./src/di.js", 92);
params = [] ;
            }

            _yuitest_coverline("./src/di.js", 95);
this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;
            _yuitest_coverline("./src/di.js", 96);
return this ;
        },

        /**
         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default
         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.
         *
         * @method getInstance
         * @param  {String} contract name
         * @param  {Array} [params] constructor parameters which, if defined, replaces its default arguments (see {{#crossLink "Sway.DI/register:method"}}{{/crossLink}} )
         * @return {Object} Class instance
         * @example
         App.di.register("ajax", ["rest"]) ;
         var ajax = App.di.getInstance("ajax") ;
         ajax = App.di.getInstance("ajax", ["rest", true]) ;    //
         **/
        getInstance: function(contract, params) {
            _yuitest_coverfunc("./src/di.js", "getInstance", 112);
_yuitest_coverline("./src/di.js", 113);
var instance = null ;

            _yuitest_coverline("./src/di.js", 115);
if ( this._contracts[contract]  ) {                                      // it should exist
                _yuitest_coverline("./src/di.js", 116);
if (this._contracts[contract].options.singleton )
                {
                    _yuitest_coverline("./src/di.js", 118);
instance = getSingletonInstance.call(this, contract, params) ;
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 121);
instance = createInstance.call(this, contract, params) ;
                }
            }
            _yuitest_coverline("./src/di.js", 124);
return instance ;
        },
        /**
         * List all available contracts with their description to <tt>console.log</tt>
         * @method listContracts
         */
        listContracts: function() {
            _yuitest_coverfunc("./src/di.js", "listContracts", 130);
_yuitest_coverline("./src/di.js", 131);
var keys = Object.keys(this._contracts) ;
            _yuitest_coverline("./src/di.js", 132);
keys.sort().forEach(function(v) {
               _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 132);
_yuitest_coverline("./src/di.js", 133);
console(v + ', ' + this._contracts[v].options.description) ;
            }.bind(this)) ;
        }
    } ;

    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 141);
function getSingletonInstance(contract, params) {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 141);
_yuitest_coverline("./src/di.js", 142);
var config = this._contracts[contract] ;
        _yuitest_coverline("./src/di.js", 143);
if ( params ) {
            _yuitest_coverline("./src/di.js", 144);
config.params = params ;
        }

        _yuitest_coverline("./src/di.js", 147);
if ( config.instance === undefined || params ) {
            _yuitest_coverline("./src/di.js", 148);
config.instance = createInstance.call(this, contract, config.params);
        }
        _yuitest_coverline("./src/di.js", 150);
return config.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 159);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 159);
_yuitest_coverline("./src/di.js", 160);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 162);
(params||this._contracts[contract].params||[]).forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 3)", 162);
_yuitest_coverline("./src/di.js", 163);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 164);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 167);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 170);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 173);
function createInstanceIfContract(contract) { // is a contract
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 173);
_yuitest_coverline("./src/di.js", 174);
var constParam = contract
            , problemContract ;
        _yuitest_coverline("./src/di.js", 176);
if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 177);
if ( depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency
                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 179);
constParam = this.getInstance(contract) ;                       // create the instance
                _yuitest_coverline("./src/di.js", 180);
depCheck.pop() ;                                          // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!
                _yuitest_coverline("./src/di.js", 183);
problemContract = depCheck[0] ;
                _yuitest_coverline("./src/di.js", 184);
depCheck.length = 0 ;                                     // cleanup
                _yuitest_coverline("./src/di.js", 185);
throw "Circular dependency detected for contract " + problemContract ;
            }
        }
        _yuitest_coverline("./src/di.js", 188);
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
    _yuitest_coverline("./src/di.js", 203);
function createInstance(contract, params)
    {
        _yuitest_coverfunc("./src/di.js", "createInstance", 203);
_yuitest_coverline("./src/di.js", 205);
var instance = null
            , self = this
            , cr ;

        _yuitest_coverline("./src/di.js", 209);
function Dependency(){
            _yuitest_coverfunc("./src/di.js", "Dependency", 209);
_yuitest_coverline("./src/di.js", 210);
cr.apply(this, createInstanceList.call(self, contract, params)) ;
        }

        _yuitest_coverline("./src/di.js", 213);
if ( this._contracts[contract]) {           // contract should exist
            _yuitest_coverline("./src/di.js", 214);
cr = this._contracts[contract].classRef ;

            _yuitest_coverline("./src/di.js", 216);
depCheck.push(contract) ;
            _yuitest_coverline("./src/di.js", 217);
Dependency.prototype = cr.prototype ;   // Fix instanceof
            _yuitest_coverline("./src/di.js", 218);
instance = new Dependency() ;           // done
            _yuitest_coverline("./src/di.js", 219);
depCheck.pop() ;
        }
        else {_yuitest_coverline("./src/di.js", 221);
if ( DEBUG ) {
            _yuitest_coverline("./src/di.js", 222);
console.warn( 'Contract ' + contract + ' does not exist') ;
        }}
        _yuitest_coverline("./src/di.js", 224);
return instance ;
    }

    _yuitest_coverline("./src/di.js", 227);
ns.DI = di ;

})(window.Sway, window.console, window.Sway.DEBUG) ;
