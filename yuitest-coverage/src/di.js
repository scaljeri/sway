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
_yuitest_coverage["./src/di.js"].code=["(function(console, Ns) {","    /**","     * DI makes classes accessible by a contract. Instances are created when requested and dependencies are injected into the constructor,","     *  facilitating lazy initialization and loose coupling between classes.","     *","     *      Sway.di.register( 'user'","     *                        , Sway.data.ActiveRecord","     *                        , [ 'User', 'webSql', ['username', 'password', 'accountInfo'], 'websql' ]","     *                        , { singleton: TRUE }","     *                      )","     *             .register( 'userNameField'","     *                        , Sway.data.Field","     *                        , [{ type: 'TEXT',  key: 'username', friendlyName: 'User name' }]","     *                        , {singleton: TRUE}","     *                      )","     *             .register( 'accountInfoField',","     *                        , Sway.data.Field","     *                        , [ { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                            , ['encryptFilter', 'compressFilter']","     *                          ]","     *                        , { singleton: TRUE}","     *                      ) ;","     *","     * Now, everywhere in the application where a User model is required simply do","     *","     *       var User = Sway.di.getInstance('user') ;","     *","     * Doing the same without Sway.DI, you will have to keep track of a lot more variables","     *","     *       var userNameField    = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }] ) ;","     *       var accountInfoField = new Sway.data.Field( { type: 'TEXT',  key: 'username', friendlyName: 'User name' }","     *                                                   , [encryptFilterInstance, compressFilterInstance] ) ;","     *","     * And finally, to create a User model","     *","     *       var User = new Sway.data.ActiveRecord( 'User', webSqlInstance, [userNameField, accountInfoField] ) ;","     *","     * is definitely more tightly coupled code!","     *","     * @class Sway.DI","     * @constructor","     **/","    var di = function() {","        // container for all registered classes","        Object.defineProperty(this, '_contracts',","            {","                value: {},","                enumerable: false // hide it","            }","        ) ;","        // used to check for circular dependencies","        Object.defineProperty(this, '_depCheck',","            {","                value:[],","                enumerable: false // hide it","            }","        ) ;","    } ;","","    di.prototype = {","        /**","         * Register a class by creating a contract. Use {{#crossLink \"DI/getInstance:method\"}}{{/crossLink}} to obtain","         * an instance from this contract. The <tt>param</tt> parameter is a list of contracts,  and, if needed,  mixed","         * with other constructor parameters. These are the constructor parameters.","         *","         * @method register","         * @chainable","         * @param {String} contract name of the contracta","         * @param {Class} classRef the class bind to this contract","         * @param {Array} [params] list of constructor parameters. If a parameter is a string matching a contract, it","         * will be replaced with the corresponding instance","         * @param {Object} [options] configuration","         *      @param {string} [options.singleton=false] create a new instance every time","         * @example","         App.di.registerType(\"ajax\", App.AJAX) ;","         App.di.registerType(\"ajax\", App.AJAX, [], { singleton: true }) ;","         App.di.registerType(\"util\", App.Util, [\"compress\", true, [\"wsql\", \"ls\"] ], { singleton: true } ) ;","         **/","        register: function(contract, classRef, params, options)","        {","            if ( !options && !Array.isArray(params) ) { // fix input","                options = params ;","                params = [] ;","            }","            this._contracts[contract] = { classRef: classRef, dependencies: params||[], options: options||{} } ;","            return this ;","        },","","        /**","         * Returns an instance for the given contract.","         *","         * @method getInstancet","         * @param  {string} contract name","         * @returns {Object} Class instance","         * @example","         var ajax = App.di.getInstance(\"ajax\") ;","         **/","        getInstance: function(contract) {","            var instance = null ;","            if ( this._contracts[contract] ) {                                          // it should exist","                if (this._contracts[contract].options.singleton )","                {","                    instance = getSingletonInstance.call(this._contracts[contract]);","                } else //create a new instance every time","                {","                    instance = this.createInstance(contract, this._contracts[contract].dependencies) ;","                }","            }","            return instance ;","        },","","        /**","         * Returns a new instance of the class matched by the contract. If the contract does not exists an error is thrown.","         * If one of the dependencies does not exists, 'null' is used instead.","         *","         * @method createInstance","         * @param {string} contract - the contract name","         * @param {Array} dependencies - list of contracts passed to the constructor","         * @returns {Object}","         * @example","         try {","             var storage = App.di.createInstance(\"data\", [\"compress\", \"websql\"]) ;","         }","         catch(e) { // will fail if contract does not exist","             console.log(e.name + ': ' + e.message) ;","         }","         **/","        createInstance: function(contract, params)","        {","            var instance = null","                , self = this","                , cr ;","","            function Fake(){","                cr.apply(this, createInstanceList.call(self, contract, params||[])) ;","            }","","            if ( this._contracts[contract]) {   // contract should exist","                cr = this._contracts[contract].classRef ;","","                Fake.prototype = cr.prototype ; // Fix instanceof","                instance = new Fake() ;","            }","            else {","                console.warn( 'Contract ' + contract + ' does not exist') ;","            }","            return instance ;","        }","    } ;","","","    /* ***** PRIVATE HELPERS ***** */","","    /* Create or reuse a singleton instance */","    function getSingletonInstance() {","        if (this.instance === undefined) {","            this.instance = new this.classRef(this.dependencies);","        }","        return this.instance ;","    }","","    /* convert a list of contracts into a list of instances","     * A dependency list can contain arrays with dependencies too:","     *    [\"depA\", [\"depB\", \"depC\"], \"depE\"]","     * In this case, the constructor would, for example, look like this:","     *    function constructor(instance, array, instance) { .. }","     * */","    function createInstanceList(contract, params) {","        var constParams = [] ;","","        params.forEach( function(c) {","            if ( Array.isArray(c)) {","                constParams.push( createInstanceList.call(this, contract, c) ) ;","            }","            else {","                constParams.push( createInstanceIfContract.call(this, c) ) ;","            }","        }.bind(this)) ;","        return constParams ;","    }","","    function createInstanceIfContract(contract) {","        var constParam = contract ;","        if ( typeof(contract) === 'string' && this._contracts[contract] ) { // is 'contract' just a contructor parameter or a contract?","            if ( this._depCheck.indexOf(contract) === -1 ) {                // check for circular dependency","                this._depCheck.push(contract) ;                                    // add contract to circular dependency check list","                constParam = this.getInstance(contract) ;                     // create the instance","                this._depCheck.pop() ;                                      // done, remove dependency from the list","            }","            else { // circular dependency detected!! --> STOP","                this._depCheck.length = 0 ;","                throw \"Circular dependency detected for contract \" + contract ;","            }","        }","        return constParam ;","    }","","    Ns.DI = di ;","","})(window.console, window.Sway) ;"];
_yuitest_coverage["./src/di.js"].lines = {"1":0,"43":0,"45":0,"52":0,"60":0,"81":0,"82":0,"83":0,"85":0,"86":0,"99":0,"100":0,"101":0,"103":0,"106":0,"109":0,"130":0,"134":0,"135":0,"138":0,"139":0,"141":0,"142":0,"145":0,"147":0,"155":0,"156":0,"157":0,"159":0,"168":0,"169":0,"171":0,"172":0,"173":0,"176":0,"179":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"191":0,"192":0,"195":0,"198":0};
_yuitest_coverage["./src/di.js"].functions = {"di:43":0,"register:79":0,"getInstance:98":0,"Fake:134":0,"createInstance:128":0,"getSingletonInstance:155":0,"(anonymous 2):171":0,"createInstanceList:168":0,"createInstanceIfContract:182":0,"(anonymous 1):1":0};
_yuitest_coverage["./src/di.js"].coveredLines = 47;
_yuitest_coverage["./src/di.js"].coveredFunctions = 10;
_yuitest_coverline("./src/di.js", 1);
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
    _yuitest_coverfunc("./src/di.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/di.js", 43);
var di = function() {
        // container for all registered classes
        _yuitest_coverfunc("./src/di.js", "di", 43);
_yuitest_coverline("./src/di.js", 45);
Object.defineProperty(this, '_contracts',
            {
                value: {},
                enumerable: false // hide it
            }
        ) ;
        // used to check for circular dependencies
        _yuitest_coverline("./src/di.js", 52);
Object.defineProperty(this, '_depCheck',
            {
                value:[],
                enumerable: false // hide it
            }
        ) ;
    } ;

    _yuitest_coverline("./src/di.js", 60);
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
            _yuitest_coverfunc("./src/di.js", "register", 79);
_yuitest_coverline("./src/di.js", 81);
if ( !options && !Array.isArray(params) ) { // fix input
                _yuitest_coverline("./src/di.js", 82);
options = params ;
                _yuitest_coverline("./src/di.js", 83);
params = [] ;
            }
            _yuitest_coverline("./src/di.js", 85);
this._contracts[contract] = { classRef: classRef, dependencies: params||[], options: options||{} } ;
            _yuitest_coverline("./src/di.js", 86);
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
            _yuitest_coverfunc("./src/di.js", "getInstance", 98);
_yuitest_coverline("./src/di.js", 99);
var instance = null ;
            _yuitest_coverline("./src/di.js", 100);
if ( this._contracts[contract] ) {                                          // it should exist
                _yuitest_coverline("./src/di.js", 101);
if (this._contracts[contract].options.singleton )
                {
                    _yuitest_coverline("./src/di.js", 103);
instance = getSingletonInstance.call(this._contracts[contract]);
                } else //create a new instance every time
                {
                    _yuitest_coverline("./src/di.js", 106);
instance = this.createInstance(contract, this._contracts[contract].dependencies) ;
                }
            }
            _yuitest_coverline("./src/di.js", 109);
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
            _yuitest_coverfunc("./src/di.js", "createInstance", 128);
_yuitest_coverline("./src/di.js", 130);
var instance = null
                , self = this
                , cr ;

            _yuitest_coverline("./src/di.js", 134);
function Fake(){
                _yuitest_coverfunc("./src/di.js", "Fake", 134);
_yuitest_coverline("./src/di.js", 135);
cr.apply(this, createInstanceList.call(self, contract, params||[])) ;
            }

            _yuitest_coverline("./src/di.js", 138);
if ( this._contracts[contract]) {   // contract should exist
                _yuitest_coverline("./src/di.js", 139);
cr = this._contracts[contract].classRef ;

                _yuitest_coverline("./src/di.js", 141);
Fake.prototype = cr.prototype ; // Fix instanceof
                _yuitest_coverline("./src/di.js", 142);
instance = new Fake() ;
            }
            else {
                _yuitest_coverline("./src/di.js", 145);
console.warn( 'Contract ' + contract + ' does not exist') ;
            }
            _yuitest_coverline("./src/di.js", 147);
return instance ;
        }
    } ;


    /* ***** PRIVATE HELPERS ***** */

    /* Create or reuse a singleton instance */
    _yuitest_coverline("./src/di.js", 155);
function getSingletonInstance() {
        _yuitest_coverfunc("./src/di.js", "getSingletonInstance", 155);
_yuitest_coverline("./src/di.js", 156);
if (this.instance === undefined) {
            _yuitest_coverline("./src/di.js", 157);
this.instance = new this.classRef(this.dependencies);
        }
        _yuitest_coverline("./src/di.js", 159);
return this.instance ;
    }

    /* convert a list of contracts into a list of instances
     * A dependency list can contain arrays with dependencies too:
     *    ["depA", ["depB", "depC"], "depE"]
     * In this case, the constructor would, for example, look like this:
     *    function constructor(instance, array, instance) { .. }
     * */
    _yuitest_coverline("./src/di.js", 168);
function createInstanceList(contract, params) {
        _yuitest_coverfunc("./src/di.js", "createInstanceList", 168);
_yuitest_coverline("./src/di.js", 169);
var constParams = [] ;

        _yuitest_coverline("./src/di.js", 171);
params.forEach( function(c) {
            _yuitest_coverfunc("./src/di.js", "(anonymous 2)", 171);
_yuitest_coverline("./src/di.js", 172);
if ( Array.isArray(c)) {
                _yuitest_coverline("./src/di.js", 173);
constParams.push( createInstanceList.call(this, contract, c) ) ;
            }
            else {
                _yuitest_coverline("./src/di.js", 176);
constParams.push( createInstanceIfContract.call(this, c) ) ;
            }
        }.bind(this)) ;
        _yuitest_coverline("./src/di.js", 179);
return constParams ;
    }

    _yuitest_coverline("./src/di.js", 182);
function createInstanceIfContract(contract) {
        _yuitest_coverfunc("./src/di.js", "createInstanceIfContract", 182);
_yuitest_coverline("./src/di.js", 183);
var constParam = contract ;
        _yuitest_coverline("./src/di.js", 184);
if ( typeof(contract) === 'string' && this._contracts[contract] ) { // is 'contract' just a contructor parameter or a contract?
            _yuitest_coverline("./src/di.js", 185);
if ( this._depCheck.indexOf(contract) === -1 ) {                // check for circular dependency
                _yuitest_coverline("./src/di.js", 186);
this._depCheck.push(contract) ;                                    // add contract to circular dependency check list
                _yuitest_coverline("./src/di.js", 187);
constParam = this.getInstance(contract) ;                     // create the instance
                _yuitest_coverline("./src/di.js", 188);
this._depCheck.pop() ;                                      // done, remove dependency from the list
            }
            else { // circular dependency detected!! --> STOP
                _yuitest_coverline("./src/di.js", 191);
this._depCheck.length = 0 ;
                _yuitest_coverline("./src/di.js", 192);
throw "Circular dependency detected for contract " + contract ;
            }
        }
        _yuitest_coverline("./src/di.js", 195);
return constParam ;
    }

    _yuitest_coverline("./src/di.js", 198);
Ns.DI = di ;

})(window.console, window.Sway) ;
