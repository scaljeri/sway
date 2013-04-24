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
_yuitest_coverage["./src/persistance/websql.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/persistance/websql.js",
    code: []
};
_yuitest_coverage["./src/persistance/websql.js"].code=["(function(Ns) {","    var defaults =  {","        dbSize: 5","    } ;","","	var wsql = function(dbname, size, options) {","		if ( !options ) options = {} ;","","        //this._size = size||5 ;","","        Object.defineProperty(this, '_dbSize',","            {","                enumerable: false","                /*","                set: function(value) {},","                get: function() {}","                */","            }","        ) ;","        this._dbSize = size||defaults.dbSize ;","        this._db = openDatabase(dbname||'ScajeriDB', '1.0', options.description||'my database', this._dbSize * 1024 * 1024);","","        Object.preventExtensions(this) ;","	} ;","","	wsql.prototype = {","		createTable: function(tablename, fields, success, error) {","            if ( !fields ) {","                fields = '(key text, data blob)' ;","            }","			this.transaction(function(tx) {","                tx.executeSql('CREATE TABLE if not exists ' + tablename + ' ' + fields) ;","			}, success, error||errorHandler ) ;","		},","		dropTable: function(tablename, success, error) {","			this.transaction(function(tx) {","				tx.executeSql('DROP TABLE IF EXISTS ' + tablename ) ;","			}, callback, error||errorHandler ) ;","		},","		transaction: function(callback, success, error) {","            this.db.transaction(callback, success, error||errorHandler)","		},","		insert: function(tablename, values, callback, tx) {","			if ( tx )","				insert(tx, tablename, values, callback) ;","			else","				this.transaction(function(tx) {","					insert(tx, tablename, values, callback) ;","				}) ;","		}","	} ;","","	function insert(tx, tablename, values, callback) {","                tx.executeSql('INSERT INTO ' + tablename + ' (key, data) VALUES (?,? )', values, callback);","	}","	function errorHandler(e) {","		console.dir(e) ;","	}","","	Ns.Wsql = wsql ;","})(window.Sway) ;"];
_yuitest_coverage["./src/persistance/websql.js"].lines = {"1":0,"2":0,"6":0,"7":0,"11":0,"20":0,"21":0,"23":0,"26":0,"28":0,"29":0,"31":0,"32":0,"36":0,"37":0,"41":0,"44":0,"45":0,"47":0,"48":0,"53":0,"54":0,"56":0,"57":0,"60":0};
_yuitest_coverage["./src/persistance/websql.js"].functions = {"wsql:6":0,"(anonymous 2):31":0,"createTable:27":0,"(anonymous 3):36":0,"dropTable:35":0,"transaction:40":0,"(anonymous 4):47":0,"insert:43":0,"insert:53":0,"errorHandler:56":0,"(anonymous 1):1":0};
_yuitest_coverage["./src/persistance/websql.js"].coveredLines = 25;
_yuitest_coverage["./src/persistance/websql.js"].coveredFunctions = 11;
_yuitest_coverline("./src/persistance/websql.js", 1);
(function(Ns) {
    _yuitest_coverfunc("./src/persistance/websql.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/persistance/websql.js", 2);
var defaults =  {
        dbSize: 5
    } ;

	_yuitest_coverline("./src/persistance/websql.js", 6);
var wsql = function(dbname, size, options) {
		_yuitest_coverfunc("./src/persistance/websql.js", "wsql", 6);
_yuitest_coverline("./src/persistance/websql.js", 7);
if ( !options ) {options = {} ;}

        //this._size = size||5 ;

        _yuitest_coverline("./src/persistance/websql.js", 11);
Object.defineProperty(this, '_dbSize',
            {
                enumerable: false
                /*
                set: function(value) {},
                get: function() {}
                */
            }
        ) ;
        _yuitest_coverline("./src/persistance/websql.js", 20);
this._dbSize = size||defaults.dbSize ;
        _yuitest_coverline("./src/persistance/websql.js", 21);
this._db = openDatabase(dbname||'ScajeriDB', '1.0', options.description||'my database', this._dbSize * 1024 * 1024);

        _yuitest_coverline("./src/persistance/websql.js", 23);
Object.preventExtensions(this) ;
	} ;

	_yuitest_coverline("./src/persistance/websql.js", 26);
wsql.prototype = {
		createTable: function(tablename, fields, success, error) {
            _yuitest_coverfunc("./src/persistance/websql.js", "createTable", 27);
_yuitest_coverline("./src/persistance/websql.js", 28);
if ( !fields ) {
                _yuitest_coverline("./src/persistance/websql.js", 29);
fields = '(key text, data blob)' ;
            }
			_yuitest_coverline("./src/persistance/websql.js", 31);
this.transaction(function(tx) {
                _yuitest_coverfunc("./src/persistance/websql.js", "(anonymous 2)", 31);
_yuitest_coverline("./src/persistance/websql.js", 32);
tx.executeSql('CREATE TABLE if not exists ' + tablename + ' ' + fields) ;
			}, success, error||errorHandler ) ;
		},
		dropTable: function(tablename, success, error) {
			_yuitest_coverfunc("./src/persistance/websql.js", "dropTable", 35);
_yuitest_coverline("./src/persistance/websql.js", 36);
this.transaction(function(tx) {
				_yuitest_coverfunc("./src/persistance/websql.js", "(anonymous 3)", 36);
_yuitest_coverline("./src/persistance/websql.js", 37);
tx.executeSql('DROP TABLE IF EXISTS ' + tablename ) ;
			}, callback, error||errorHandler ) ;
		},
		transaction: function(callback, success, error) {
            _yuitest_coverfunc("./src/persistance/websql.js", "transaction", 40);
_yuitest_coverline("./src/persistance/websql.js", 41);
this.db.transaction(callback, success, error||errorHandler)
		},
		insert: function(tablename, values, callback, tx) {
			_yuitest_coverfunc("./src/persistance/websql.js", "insert", 43);
_yuitest_coverline("./src/persistance/websql.js", 44);
if ( tx )
				{_yuitest_coverline("./src/persistance/websql.js", 45);
insert(tx, tablename, values, callback) ;}
			else
				{_yuitest_coverline("./src/persistance/websql.js", 47);
this.transaction(function(tx) {
					_yuitest_coverfunc("./src/persistance/websql.js", "(anonymous 4)", 47);
_yuitest_coverline("./src/persistance/websql.js", 48);
insert(tx, tablename, values, callback) ;
				}) ;}
		}
	} ;

	_yuitest_coverline("./src/persistance/websql.js", 53);
function insert(tx, tablename, values, callback) {
                _yuitest_coverfunc("./src/persistance/websql.js", "insert", 53);
_yuitest_coverline("./src/persistance/websql.js", 54);
tx.executeSql('INSERT INTO ' + tablename + ' (key, data) VALUES (?,? )', values, callback);
	}
	_yuitest_coverline("./src/persistance/websql.js", 56);
function errorHandler(e) {
		_yuitest_coverfunc("./src/persistance/websql.js", "errorHandler", 56);
_yuitest_coverline("./src/persistance/websql.js", 57);
console.dir(e) ;
	}

	_yuitest_coverline("./src/persistance/websql.js", 60);
Ns.Wsql = wsql ;
})(window.Sway) ;
