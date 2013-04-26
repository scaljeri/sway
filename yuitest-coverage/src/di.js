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
_yuitest_coverage["./src/di.js"].code=["(function(console, Ns) {","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     *  facilitating lazy initialization and loose coupling between classes.","     *","     *      var di = new Sway.DI() ;","     *      di.register( 'user'                                                                     // contract name","     *                   , Sway.data.ActiveRecord                                                   // class definiton","     *                   , [ 'User', 'webSql', ['username', 'password', 'accountInfo'], 'websql' ]  // constructor parameters","     *                   , { singleton: TRUE }                                                      // configuration: create a singleton","     *                 )","     *        .register( 'userNameField'","     *                   , Sway.data.Field","     *                   , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                   , {singleton: TRUE}","     *                 )","     *        .register( 'accountInfoField',","     *                   , Sway.data.Field","     *                   , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                        , ['encryptFilter', 'compressFilter']","     *                     ]","     *                   , { singleton: TRUE}","     *                 ) ;","     *","     * Now, everywhere in the application where a User model is required simply do","     *","     *       var User = Sway.di.getInstance('user') ;","     *","     * To give an idea of what this is doing, below is an example doing the same as above but without using Sway.DI","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, accountInfoField] ) ;","     *","     * @class Sway.DI","     * @constructor","     **/","    var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>param</tt> parameter is a list of contracts,  and, if needed,  mixed","         * with other constructor parameters. These are the constructor parameters.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contracta","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. If a parameter is a string matching a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {string} [options.singleton=false] create a new instance every time","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( !options && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","            this._contracts[contract] = { classRef: classRef, dependencies: params||[], options: options||{} } ;","            return this ;","        },","","        /**","         * Returns an instance for the given contract.","         *","         * @method getInstance","         * @param  {string} contract name","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract) {","            var instance = null ;","            if ( this._contracts[contract] ) {                                          // it should exist","                if (this._contracts[contract].options.singleton )","                {","                    instance = getSingletonInstance.call(this._contracts[contract]);","                } else //create a new instance every time","                {","                    instance = this.createInstance(contract, this._contracts[contract].dependencies) ;","                }","            }","            return instance ;","        },","","        /**","         * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","         *","         * @method createInstance","         * @param {string} contract - the contract name","         * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or","         * an unknown contract, is passed as-is to the constructor","         *","         * @returns {Object}","         * @example","         try {","             var storage = App.di.createInstance(\"data\", [\"compress\", true, \"websql\"]) ;","         }","         catch(e) { // will fail if contract does not exist","             console.log(e.name + ': ' + e.message) ;","         }","         **/","        createInstance: function(contract, params)","        {","            var instance = null","                , self = this","                , cr ;","","            function Fake(){","                cr.apply(this, createInstanceList.call(self, contract, params||[])) ;","            }","","            if ( this._contracts[contract]) {   // contract should exist","                cr = this._contracts[contract].classRef ;","","                Fake.prototype = cr.prototype ; // Fix instanceof","                instance = new Fake() ;","            }","            else {","                console.warn( 'Contract ' + contract + ' does not exist') ;","            }","            return instance ;","        }","    } ;","","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance() {","        if (this.instance === undefined) {","            this.instance = new this.classRef(this.dependencies);","        }","        return this.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        params.forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) {","        var constParam = contract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) { // is 'contract' just a contructor parameter or a contract?","            if ( this._depCheck.indexOf(contract) === -1 ) {                // check for circular dependency","                this._depCheck.push(contract) ;                                    // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                     // create the instance","                this._depCheck.pop() ;                                      // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP","                this._depCheck.length = 0 ;","                throw \"Circular dependency detected for contract \" + contract ;","            }","        }","        return constParam ;","    }","","    Ns.DI = di ;","","})(window.console, window.Sway) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"40":0,"42":0,"49":0,"57":0,"78":0,"79":0,"80":0,"82":0,"83":0,"96":0,"97":0,"98":0,"100":0,"103":0,"106":0,"128":0,"132":0,"133":0,"136":0,"137":0,"139":0,"140":0,"143":0,"145":0,"153":0,"154":0,"155":0,"157":0,"166":0,"167":0,"169":0,"170":0,"171":0,"174":0,"177":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"186":0,"189":0,"190":0,"193":0,"196":0};
_yuitest_coverage["./src/di.js"].functions = {"di:40":0,"register:76":0,"getInstance:95":0,"Fake:132":0,"createInstance:126":0,"getSingletonInstance:153":0,"(anonymous 2):169":0,"createInstanceList:166":0,"createInstanceIfContract:180":0,"(anonymous 1):1":0};
_yuitest_coverage["./src/di.js"].coveredLines = 47;
_yuitest_coverage["./src/di.js"].coveredFunctions = 10;
_yuitest_coverline("./src/di.js", 1);
(function(console, Ns) {
    /**
     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,
     *  facilitating lazy initialization and loose coupling between classes.
     *
     *      var di = new Sway.DI() ;
     *      di.register( 'user'                                                                     // contract name
     *                   , Sway.data.ActiveRecord                                                   // class definiton
     *                   , [ 'User', 'webSql', ['username', 'password', 'accountInfo'], 'websql' ]  // constructor parameters
     *                   , { singleton: TRUE }                                                      // configuration: create a singleton
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
     *                 ) ;
     *
     * Now, everywhere in the application where a User model is required simply do
     *
     *       var User = Sway.di.getInstance('user') ;
     *
     * To give an idea of what this is doing, below is an example doing the same as above but without using Sway.DI
     *
     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;
     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }
     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;
     *
     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, accountInfoField] ) ;
     *
     * @class Sway.DI
     * @constructor
     **/
    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/di.js", 40);
var di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 40);
_yuitest_coverline("./src/di.js", 42);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        _yuitest_coverline("./src/di.js", 49);
Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/di.js", 57);
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
            _yuitest_coverfunc("./src/di.js", "register", 76);
_yuitest_coverline("./src/di.js", 78);
if ( !options && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 79);
options = params ;
                _yuitest_coverline("./src/di.js", 80);
params = [] ;
            }
            _yuitest_coverline("./src/di.js", 82);
this._contracts[contract] = { classRef: classRef, dependencies: params||[], options: options||{} } ;
            _yuitest_coverline("./src/di.js", 83);
return this ;
        },

        /**
         * Returns an instance for the given contract.
         *
         * @method getInstance
         * @param  {string} contract name
         * @returns {Object} Class instance
         * @example
         var ajax = App.di.getInstance("ajax") ;
         **/
        getInstance: function(contract) {
            _yuitest_coverfunc("./src/di.js", "getInstance", 95);
_yuitest_coverline("./src/di.js", 96);
var instance = null ;
            _yuitest_coverline("./src/di.js", 97);
if ( this._contracts[contract] ) {                                          // it should exist
                _yuitest_coverline("./src/di.js", 98);
if (this._contracts[contract].options.singleton )
                {
                    _yuitest_coverline("./src/di.js", 100);
instance = getSingletonInstance.call(this._contracts[contract]);
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 103);
instance = this.createInstance(contract, this._contracts[contract].dependencies) ;
                }
            }
            _yuitest_coverline("./src/di.js", 106);
return instance ;
        },

        /**
         * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.
         *
         * @method createInstance
         * @param {string} contract - the contract name
         * @param {Array} params - list of contracts passed to the constructor. Each parameter which is not a string or
         * an unknown contract, is passed as-is to the constructor
         *
         * @returns {Object}
         * @example
         try {
             var storage = App.di.createInstance("data", ["compress", true, "websql"]) ;
         }
         catch(e) { // will fail if contract does not exist
             console.log(e.name + ': ' + e.message) ;
         }
         **/
        createInstance: function(contract, params)
        {
            _yuitest_coverfunc("./src/di.js", "createInstance", 126);
_yuitest_coverline("./src/di.js", 128);
var instance = null
                , self = this
                , cr ;

            _yuitest_coverline("./src/di.js", 132);
function Fake(){
                _yuitest_coverfunc("./src/di.js", "Fake", 132);
_yuitest_coverline("./src/di.js", 133);
cr.apply(this, createInstanceList.call(self, contract, params||[])) ;
            }

            _yuitest_coverline("./src/di.js", 136);
if ( this._contracts[contract]) {   // contract should exist
                _yuitest_coverline("./src/di.js", 137);
cr = this._contracts[contract].classRef ;

                _yuitest_coverline("./src/di.js", 139);
Fake.prototype = cr.prototype ; // Fix instanceof
                _yuitest_coverline("./src/di.js", 140);
instance = new Fake() ;
            }
            else {
                _yuitest_coverline("./src/di.js", 143);
console.warn( 'Contract ' + contract + ' does not exist') ;
            }
            _yuitest_coverline("./src/di.js", 145);
return instance ;
        }
    } ;


    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 153);
function getSingletonInstance() {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 153);
_yuitest_coverline("./src/di.js", 154);
if (this.instance === undefined) {
            _yuitest_coverline("./src/di.js", 155);
this.instance = new this.classRef(this.dependencies);
        }
        _yuitest_coverline("./src/di.js", 157);
return this.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 166);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 166);
_yuitest_coverline("./src/di.js", 167);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 169);
params.forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 169);
_yuitest_coverline("./src/di.js", 170);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 171);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 174);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 177);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 180);
function createInstanceIfContract(contract) {
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 180);
_yuitest_coverline("./src/di.js", 181);
var constParam = contract ;
        _yuitest_coverline("./src/di.js", 182);
if ( typeof(contract) === 'string' && this._contracts[contract] ) { // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 183);
if ( this._depCheck.indexOf(contract) === -1 ) {                // check for circular dependency
                _yuitest_coverline("./src/di.js", 184);
this._depCheck.push(contract) ;                                    // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 185);
constParam = this.getInstance(contract) ;                     // create the instance
                _yuitest_coverline("./src/di.js", 186);
this._depCheck.pop() ;                                      // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP
                _yuitest_coverline("./src/di.js", 189);
this._depCheck.length = 0 ;
                _yuitest_coverline("./src/di.js", 190);
throw "Circular dependency detected for contract " + contract ;
            }
        }
        _yuitest_coverline("./src/di.js", 193);
return constParam ;
    }

    _yuitest_coverline("./src/di.js", 196);
Ns.DI = di ;

})(window.console, window.Sway) ;
