(function(Ns) {
    var defaults =  {
        dbSize: 5
    } ;

	var wsql = function(dbname, size, options) {
		if ( !options ) options = {} ;

        //this._size = size||5 ;

        Object.defineProperty(this, '_dbSize',
            {
                enumerable: false
                /*
                set: function(value) {},
                get: function() {}
                */
            }
        ) ;
        this._dbSize = size||defaults.dbSize ;
        this._db = openDatabase(dbname||'ScajeriDB', '1.0', options.description||'my database', this._dbSize * 1024 * 1024);

        Object.preventExtensions(this) ;
	} ;

	wsql.prototype = {
		createTable: function(tablename, fields, success, error) {
            if ( !fields ) {
                fields = '(key text, data blob)' ;
            }
			this.transaction(function(tx) {
                tx.executeSql('CREATE TABLE if not exists ' + tablename + ' ' + fields) ;
			}, success, error||errorHandler ) ;
		},
		dropTable: function(tablename, success, error) {
			this.transaction(function(tx) {
				tx.executeSql('DROP TABLE IF EXISTS ' + tablename ) ;
			}, callback, error||errorHandler ) ;
		},
		transaction: function(callback, success, error) {
            this.db.transaction(callback, success, error||errorHandler)
		},
		insert: function(tablename, values, callback, tx) {
			if ( tx )
				insert(tx, tablename, values, callback) ;
			else
				this.transaction(function(tx) {
					insert(tx, tablename, values, callback) ;
				}) ;
		}
	} ;

	function insert(tx, tablename, values, callback) {
                tx.executeSql('INSERT INTO ' + tablename + ' (key, data) VALUES (?,? )', values, callback);
	}
	function errorHandler(e) {
		console.dir(e) ;
	}

	Ns.Wsql = wsql ;
})(window.Sway) ;
