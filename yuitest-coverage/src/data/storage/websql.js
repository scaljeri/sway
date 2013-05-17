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
_yuitest_coverage["./src/data/storage/websql.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/storage/websql.js",
    code: []
};
_yuitest_coverage["./src/data/storage/websql.js"].code=["/* create example:"," CREATE  TABLE IF NOT EXISTS `feature` ("," `feature_id` VARCHAR(40) NOT NULL ,"," `intensity` DOUBLE NOT NULL ,"," `overallquality` DOUBLE NOT NULL ,"," `quality` DOUBLE NOT NULL ,"," `charge` INT NOT NULL ,"," `content` VARCHAR(45) NOT NULL ,"," `msrun_msrun_id` INT NOT NULL,"," CONSTRAINT `fk_feature_msrun1`"," FOREIGN KEY (`msrun_msrun_id` )"," REFERENCES `msrun` (`msrun_id` )"," ON DELETE NO ACTION"," ON UPDATE NO ACTION);"," CREATE UNIQUE INDEX `id_UNIQUE` ON `feature` (`feature_id` ASC);"," CREATE INDEX `fk_feature_msrun1` ON `feature` (`msrun_msrun_id` ASC);",""," CREATE TABLE name (column defs)"," CONSTRAINT constraint_name    -- This is new"," UNIQUE (col_name1, col_name2) ON CONFLICT REPLACE",""," CREATE TABLE track("," trackid     INTEGER,"," trackname   TEXT,"," trackartist INTEGER REFERENCES artist(artistid) ON UPDATE CASCADE"," );",""," http://www.sqlite.org/foreignkeys.html"," NO ACTION: Configuring \"NO ACTION\" means just that: when a parent key is modified or deleted from the database, no special action is taken.",""," RESTRICT: The \"RESTRICT\" action means that the application is prohibited from deleting (for ON DELETE RESTRICT) or modifying (for ON UPDATE RESTRICT) a parent key when there exists one or more child keys mapped to it. The difference between the effect of a RESTRICT action and normal foreign key constraint enforcement is that the RESTRICT action processing happens as soon as the field is updated - not at the end of the current statement as it would with an immediate constraint, or at the end of the current transaction as it would with a deferred constraint. Even if the foreign key constraint it is attached to is deferred, configuring a RESTRICT action causes SQLite to return an error immediately if a parent key with dependent child keys is deleted or modified.",""," SET NULL: If the configured action is \"SET NULL\", then when a parent key is deleted (for ON DELETE SET NULL) or modified (for ON UPDATE SET NULL), the child key columns of all rows in the child table that mapped to the parent key are set to contain SQL NULL values.",""," SET DEFAULT: The \"SET DEFAULT\" actions are similar to \"SET NULL\", except that each of the child key columns is set to contain the columns default value instead of NULL. Refer to the CREATE TABLE documentation for details on how default values are assigned to table columns.",""," CASCADE: A \"CASCADE\" action propagates the delete or update operation on the parent key to each dependent child key. For an \"ON DELETE CASCADE\" action, this means that each row in the child table that was associated with the deleted parent row is also deleted. For an \"ON UPDATE CASCADE\" action, it means that the values stored in each dependent child key are modified to match the new parent key values."," */","(function(Ns) {","    var defaults =  {","        dbSize: 5","    } ;","","	var wsql = function(dbname, size, options) {","		if ( !options ) options = {} ;","","        //this._size = size||5 ;","","        Object.defineProperty(this, '_dbSize',","            {","                enumerable: false","                /*","                set: function(value) {},","                get: function() {}","                */","            }","        ) ;","        this._dbSize = size||defaults.dbSize ;","        this._db = openDatabase(dbname||'ScajeriDB', '1.0', options.description||'my database', this._dbSize * 1024 * 1024);","","        Object.preventExtensions(this) ;","	} ;","","	wsql.prototype = {","		createTable: function(tablename, fields, success, error) {","            if ( !fields ) {","                fields = '(key text, data blob)' ;","            }","			this.transaction(function(tx) {","                tx.executeSql('CREATE TABLE if not exists ' + tablename + ' ' + fields) ;","			}, success, error||errorHandler ) ;","		},","		dropTable: function(tablename, success, error) {","			this.transaction(function(tx) {","				tx.executeSql('DROP TABLE IF EXISTS ' + tablename ) ;","			}, callback, error||errorHandler ) ;","		},","		transaction: function(callback, success, error) {","            this.db.transaction(callback, success, error||errorHandler)","		},","		insert: function(tablename, values, callback, tx) {","			if ( tx )","				insert(tx, tablename, values, callback) ;","			else","				this.transaction(function(tx) {","					insert(tx, tablename, values, callback) ;","				}) ;","		}","	} ;","","	function insert(tx, tablename, values, callback) {","                tx.executeSql('INSERT INTO ' + tablename + ' (key, data) VALUES (?,? )', values, callback);","	}","	function errorHandler(e) {","		console.dir(e) ;","	}","","	Ns.Wsql = wsql ;","})(window.Sway) ;"];
/* create example:
 CREATE  TABLE IF NOT EXISTS `feature` (
 `feature_id` VARCHAR(40) NOT NULL ,
 `intensity` DOUBLE NOT NULL ,
 `overallquality` DOUBLE NOT NULL ,
 `quality` DOUBLE NOT NULL ,
 `charge` INT NOT NULL ,
 `content` VARCHAR(45) NOT NULL ,
 `msrun_msrun_id` INT NOT NULL,
 CONSTRAINT `fk_feature_msrun1`
 FOREIGN KEY (`msrun_msrun_id` )
 REFERENCES `msrun` (`msrun_id` )
 ON DELETE NO ACTION
 ON UPDATE NO ACTION);
 CREATE UNIQUE INDEX `id_UNIQUE` ON `feature` (`feature_id` ASC);
 CREATE INDEX `fk_feature_msrun1` ON `feature` (`msrun_msrun_id` ASC);

 CREATE TABLE name (column defs)
 CONSTRAINT constraint_name    -- This is new
 UNIQUE (col_name1, col_name2) ON CONFLICT REPLACE

 CREATE TABLE track(
 trackid     INTEGER,
 trackname   TEXT,
 trackartist INTEGER REFERENCES artist(artistid) ON UPDATE CASCADE
 );

 http://www.sqlite.org/foreignkeys.html
 NO ACTION: Configuring "NO ACTION" means just that: when a parent key is modified or deleted from the database, no special action is taken.

 RESTRICT: The "RESTRICT" action means that the application is prohibited from deleting (for ON DELETE RESTRICT) or modifying (for ON UPDATE RESTRICT) a parent key when there exists one or more child keys mapped to it. The difference between the effect of a RESTRICT action and normal foreign key constraint enforcement is that the RESTRICT action processing happens as soon as the field is updated - not at the end of the current statement as it would with an immediate constraint, or at the end of the current transaction as it would with a deferred constraint. Even if the foreign key constraint it is attached to is deferred, configuring a RESTRICT action causes SQLite to return an error immediately if a parent key with dependent child keys is deleted or modified.

 SET NULL: If the configured action is "SET NULL", then when a parent key is deleted (for ON DELETE SET NULL) or modified (for ON UPDATE SET NULL), the child key columns of all rows in the child table that mapped to the parent key are set to contain SQL NULL values.

 SET DEFAULT: The "SET DEFAULT" actions are similar to "SET NULL", except that each of the child key columns is set to contain the columns default value instead of NULL. Refer to the CREATE TABLE documentation for details on how default values are assigned to table columns.

 CASCADE: A "CASCADE" action propagates the delete or update operation on the parent key to each dependent child key. For an "ON DELETE CASCADE" action, this means that each row in the child table that was associated with the deleted parent row is also deleted. For an "ON UPDATE CASCADE" action, it means that the values stored in each dependent child key are modified to match the new parent key values.
 */
_yuitest_coverage["./src/data/storage/websql.js"].lines = {"39":0,"40":0,"44":0,"45":0,"49":0,"58":0,"59":0,"61":0,"64":0,"66":0,"67":0,"69":0,"70":0,"74":0,"75":0,"79":0,"82":0,"83":0,"85":0,"86":0,"91":0,"92":0,"94":0,"95":0,"98":0};
_yuitest_coverage["./src/data/storage/websql.js"].functions = {"wsql:44":0,"(anonymous 2):69":0,"createTable:65":0,"(anonymous 3):74":0,"dropTable:73":0,"transaction:78":0,"(anonymous 4):85":0,"insert:81":0,"insert:91":0,"errorHandler:94":0,"(anonymous 1):39":0};
_yuitest_coverage["./src/data/storage/websql.js"].coveredLines = 25;
_yuitest_coverage["./src/data/storage/websql.js"].coveredFunctions = 11;
_yuitest_coverline("./src/data/storage/websql.js", 39);
(function(Ns) {
    _yuitest_coverfunc("./src/data/storage/websql.js", "(anonymous 1)", 39);
_yuitest_coverline("./src/data/storage/websql.js", 40);
var defaults =  {
        dbSize: 5
    } ;

	_yuitest_coverline("./src/data/storage/websql.js", 44);
var wsql = function(dbname, size, options) {
		_yuitest_coverfunc("./src/data/storage/websql.js", "wsql", 44);
_yuitest_coverline("./src/data/storage/websql.js", 45);
if ( !options ) {options = {} ;}

        //this._size = size||5 ;

        _yuitest_coverline("./src/data/storage/websql.js", 49);
Object.defineProperty(this, '_dbSize',
            {
                enumerable: false
                /*
                set: function(value) {},
                get: function() {}
                */
            }
        ) ;
        _yuitest_coverline("./src/data/storage/websql.js", 58);
this._dbSize = size||defaults.dbSize ;
        _yuitest_coverline("./src/data/storage/websql.js", 59);
this._db = openDatabase(dbname||'ScajeriDB', '1.0', options.description||'my database', this._dbSize * 1024 * 1024);

        _yuitest_coverline("./src/data/storage/websql.js", 61);
Object.preventExtensions(this) ;
	} ;

	_yuitest_coverline("./src/data/storage/websql.js", 64);
wsql.prototype = {
		createTable: function(tablename, fields, success, error) {
            _yuitest_coverfunc("./src/data/storage/websql.js", "createTable", 65);
_yuitest_coverline("./src/data/storage/websql.js", 66);
if ( !fields ) {
                _yuitest_coverline("./src/data/storage/websql.js", 67);
fields = '(key text, data blob)' ;
            }
			_yuitest_coverline("./src/data/storage/websql.js", 69);
this.transaction(function(tx) {
                _yuitest_coverfunc("./src/data/storage/websql.js", "(anonymous 2)", 69);
_yuitest_coverline("./src/data/storage/websql.js", 70);
tx.executeSql('CREATE TABLE if not exists ' + tablename + ' ' + fields) ;
			}, success, error||errorHandler ) ;
		},
		dropTable: function(tablename, success, error) {
			_yuitest_coverfunc("./src/data/storage/websql.js", "dropTable", 73);
_yuitest_coverline("./src/data/storage/websql.js", 74);
this.transaction(function(tx) {
				_yuitest_coverfunc("./src/data/storage/websql.js", "(anonymous 3)", 74);
_yuitest_coverline("./src/data/storage/websql.js", 75);
tx.executeSql('DROP TABLE IF EXISTS ' + tablename ) ;
			}, callback, error||errorHandler ) ;
		},
		transaction: function(callback, success, error) {
            _yuitest_coverfunc("./src/data/storage/websql.js", "transaction", 78);
_yuitest_coverline("./src/data/storage/websql.js", 79);
this.db.transaction(callback, success, error||errorHandler)
		},
		insert: function(tablename, values, callback, tx) {
			_yuitest_coverfunc("./src/data/storage/websql.js", "insert", 81);
_yuitest_coverline("./src/data/storage/websql.js", 82);
if ( tx )
				{_yuitest_coverline("./src/data/storage/websql.js", 83);
insert(tx, tablename, values, callback) ;}
			else
				{_yuitest_coverline("./src/data/storage/websql.js", 85);
this.transaction(function(tx) {
					_yuitest_coverfunc("./src/data/storage/websql.js", "(anonymous 4)", 85);
_yuitest_coverline("./src/data/storage/websql.js", 86);
insert(tx, tablename, values, callback) ;
				}) ;}
		}
	} ;

	_yuitest_coverline("./src/data/storage/websql.js", 91);
function insert(tx, tablename, values, callback) {
                _yuitest_coverfunc("./src/data/storage/websql.js", "insert", 91);
_yuitest_coverline("./src/data/storage/websql.js", 92);
tx.executeSql('INSERT INTO ' + tablename + ' (key, data) VALUES (?,? )', values, callback);
	}
	_yuitest_coverline("./src/data/storage/websql.js", 94);
function errorHandler(e) {
		_yuitest_coverfunc("./src/data/storage/websql.js", "errorHandler", 94);
_yuitest_coverline("./src/data/storage/websql.js", 95);
console.dir(e) ;
	}

	_yuitest_coverline("./src/data/storage/websql.js", 98);
Ns.Wsql = wsql ;
})(window.Sway) ;
