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
_yuitest_coverage["./src/di.js"].code=["(function(console, ns) {","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     * facilitating lazy initialization and loose coupling between classes.","     *","     * As an example, register all contracts during the application initialization","     *","     *      var di = new Sway.DI() ;","     *      di.register( 'User'                                                                                 // contract name","     *                   , Sway.data.ActiveRecord                                                               // class definiton","     *                   , [ 'User', 'webSql', ['userNameField', 'passwordField', 'accountInfo'], 'websql' ]    // constructor parameters","     *                   , { singleton: TRUE }                                                                  // configuration: create a singleton","     *                 )","     *        .register( 'userNameField'","     *                   , Sway.data.Field","     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                   , {singleton: TRUE}","     *                 )","     *        .register( 'accountInfoField',","     *                   , Sway.data.Field","     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                        , ['encryptFilter', 'compressFilter']","     *                     ]","     *                   , { singleton: TRUE}","     *                 )","     *        .register( 'userRecord'","     *                   , di.register('User')  // create the User model!!","     *                 )","     *        ...","     *","     * Now everywhere in the application create the instances as follows","     *","     *       var User = Sway.di.getInstance('User') ;","     *       userRecord = new User({ username: 'John', password: 'Secret' }) ;","     *       // or","     *       userRecord = Sway.di.getInstance('userRecord', [{username: 'John', password: 'Secret'}]) ;","     *","     * To give an idea of what this does, below is an example doing the exact same thing but without Sway.DI","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *       ...","     *","     * And create instances like","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, passwordField, accountInfoField] ) ;","     *       var userRecord = new User({username: 'John', password: 'Secret'}) ;","     *","     * @class Sway.DI","     * @constructor","     **/","    var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"Sway.DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>params</tt> parameter is a list of contracts,  and, if needed, normal","         * constructor parameters can be mixed in.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contract","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. Only if a parameter is a string and matches a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {string} [options.singleton=false] create a new instance every time","         * @return {Object} this","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( !options && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","","            if ( !classRef ) {","                console.warn('the Class is undefined for contract ' + contract ) ;","            }","            else {","                this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;","            }","            return this ;","        },","","        /**","         * Returns an instance for the given contract. Use <tt>params</tt> attribute to overwrite the default","         * parameters for this contract. If <tt>params</tt> is defined, the singleton configuration option is ignored.","         *","         * @method getInstance","         * @param  {String} contract name","         * @param  {Array} [params] constructor parameters","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract, params) {","            var instance = null ;","","            if ( this._contracts[contract]  ) {                                      // it should exist","                if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!","                {","                    instance = getSingletonInstance.call(this, contract) ;","                } else //create a new instance every time","                {","                    instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;","                }","            }","            return instance ;","        },","    } ;","","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance(contract) {","        var config = this._contracts[contract] ;","","        if ( config.instance === undefined ) {","            config.instance = createInstance.call(this, contract, config.params);","        }","        return config.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        (params||this._contracts[contract].params||[]).forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) { // is a contract","        var constParam = contract","            , problemContract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?","            if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency","                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                       // create the instance","                this._depCheck.pop() ;                                          // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!","                problemContract = this._depCheck[0] ;","                this._depCheck.length = 0 ;                                     // cleanup","                throw \"Circular dependency detected for contract \" + problemContract ;","            }","        }","        return constParam ;","    }","","    /*","     * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","     *","     * @method createInstance","     * @param {string} contract - the contract name","     * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or","     * an unknown contract, is passed as-is to the constructor","     *","     * @returns {Object}","     * @example","     var storage = App.di.createInstance(\"data\", [\"compress\", true, \"websql\"]) ;","     **/","    function createInstance(contract, params)","    {","        var instance = null","            , self = this","            , cr ;","","        function Dependency(){","            cr.apply(this, createInstanceList.call(self, contract, params)) ;","        }","","        if ( this._contracts[contract]) {           // contract should exist","            cr = this._contracts[contract].classRef ;","","            this._depCheck.push(contract) ;","            Dependency.prototype = cr.prototype ;   // Fix instanceof","            instance = new Dependency() ;           // done","            this._depCheck.pop() ;","        }","        else {","            console.warn( 'Contract ' + contract + ' does not exist') ;","        }","        return instance ;","    }","","    ns.DI = di ;","","})(window.console, window.Sway) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"53":0,"55":0,"62":0,"70":0,"92":0,"93":0,"94":0,"97":0,"98":0,"101":0,"103":0,"118":0,"120":0,"121":0,"123":0,"126":0,"129":0,"137":0,"138":0,"140":0,"141":0,"143":0,"152":0,"153":0,"155":0,"156":0,"157":0,"160":0,"163":0,"166":0,"167":0,"169":0,"170":0,"172":0,"173":0,"176":0,"177":0,"178":0,"181":0,"196":0,"198":0,"202":0,"203":0,"206":0,"207":0,"209":0,"210":0,"211":0,"212":0,"215":0,"217":0,"220":0};
_yuitest_coverage["./src/di.js"].functions = {"di:53":0,"register:90":0,"getInstance:117":0,"getSingletonInstance:137":0,"(anonymous 2):155":0,"createInstanceList:152":0,"createInstanceIfContract:166":0,"Dependency:202":0,"createInstance:196":0,"(anonymous 1):1":0};
_yuitest_coverage["./src/di.js"].coveredLines = 53;
_yuitest_coverage["./src/di.js"].coveredFunctions = 10;
_yuitest_coverline("./src/di.js", 1);
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
    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/di.js", 53);
var di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 53);
_yuitest_coverline("./src/di.js", 55);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        _yuitest_coverline("./src/di.js", 62);
Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/di.js", 70);
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
            _yuitest_coverfunc("./src/di.js", "register", 90);
_yuitest_coverline("./src/di.js", 92);
if ( !options && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 93);
options = params ;
                _yuitest_coverline("./src/di.js", 94);
params = [] ;
            }

            _yuitest_coverline("./src/di.js", 97);
if ( !classRef ) {
                _yuitest_coverline("./src/di.js", 98);
console.warn('the Class is undefined for contract ' + contract ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 101);
this._contracts[contract] = { classRef: classRef, params: params||[], options: options||{} } ;
            }
            _yuitest_coverline("./src/di.js", 103);
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
            _yuitest_coverfunc("./src/di.js", "getInstance", 117);
_yuitest_coverline("./src/di.js", 118);
var instance = null ;

            _yuitest_coverline("./src/di.js", 120);
if ( this._contracts[contract]  ) {                                      // it should exist
                _yuitest_coverline("./src/di.js", 121);
if (this._contracts[contract].options.singleton )                    // if singleton, params arg is not used!!
                {
                    _yuitest_coverline("./src/di.js", 123);
instance = getSingletonInstance.call(this, contract) ;
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 126);
instance = createInstance.call(this, contract, params||this._contracts[contract].params||[]) ;
                }
            }
            _yuitest_coverline("./src/di.js", 129);
return instance ;
        },
    } ;


    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 137);
function getSingletonInstance(contract) {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 137);
_yuitest_coverline("./src/di.js", 138);
var config = this._contracts[contract] ;

        _yuitest_coverline("./src/di.js", 140);
if ( config.instance === undefined ) {
            _yuitest_coverline("./src/di.js", 141);
config.instance = createInstance.call(this, contract, config.params);
        }
        _yuitest_coverline("./src/di.js", 143);
return config.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 152);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 152);
_yuitest_coverline("./src/di.js", 153);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 155);
(params||this._contracts[contract].params||[]).forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 155);
_yuitest_coverline("./src/di.js", 156);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 157);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 160);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 163);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 166);
function createInstanceIfContract(contract) { // is a contract
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 166);
_yuitest_coverline("./src/di.js", 167);
var constParam = contract
            , problemContract ;
        _yuitest_coverline("./src/di.js", 169);
if ( typeof(contract) === 'string' && this._contracts[contract] ) {     // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 170);
if ( this._depCheck.indexOf(contract) === -1 ) {                    // check for circular dependency
                //this._depCheck.push(contract) ;                               // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 172);
constParam = this.getInstance(contract) ;                       // create the instance
                _yuitest_coverline("./src/di.js", 173);
this._depCheck.pop() ;                                          // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP, someone did something stupid -> fix needed!!
                _yuitest_coverline("./src/di.js", 176);
problemContract = this._depCheck[0] ;
                _yuitest_coverline("./src/di.js", 177);
this._depCheck.length = 0 ;                                     // cleanup
                _yuitest_coverline("./src/di.js", 178);
throw "Circular dependency detected for contract " + problemContract ;
            }
        }
        _yuitest_coverline("./src/di.js", 181);
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
    _yuitest_coverline("./src/di.js", 196);
function createInstance(contract, params)
    {
        _yuitest_coverfunc("./src/di.js", "createInstance", 196);
_yuitest_coverline("./src/di.js", 198);
var instance = null
            , self = this
            , cr ;

        _yuitest_coverline("./src/di.js", 202);
function Dependency(){
            _yuitest_coverfunc("./src/di.js", "Dependency", 202);
_yuitest_coverline("./src/di.js", 203);
cr.apply(this, createInstanceList.call(self, contract, params)) ;
        }

        _yuitest_coverline("./src/di.js", 206);
if ( this._contracts[contract]) {           // contract should exist
            _yuitest_coverline("./src/di.js", 207);
cr = this._contracts[contract].classRef ;

            _yuitest_coverline("./src/di.js", 209);
this._depCheck.push(contract) ;
            _yuitest_coverline("./src/di.js", 210);
Dependency.prototype = cr.prototype ;   // Fix instanceof
            _yuitest_coverline("./src/di.js", 211);
instance = new Dependency() ;           // done
            _yuitest_coverline("./src/di.js", 212);
this._depCheck.pop() ;
        }
        else {
            _yuitest_coverline("./src/di.js", 215);
console.warn( 'Contract ' + contract + ' does not exist') ;
        }
        _yuitest_coverline("./src/di.js", 217);
return instance ;
    }

    _yuitest_coverline("./src/di.js", 220);
ns.DI = di ;

})(window.console, window.Sway) ;
