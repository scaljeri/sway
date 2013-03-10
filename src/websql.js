(function(Ns) {
	var wsql = function(dbname, size, options) {
		if ( !options ) options = {} ;

		this.db = openDatabase(dbname, '1.0', options.description||'my first database', size * 1024 * 1024);
	} ;

	wsql.prototype = {
		createTable: function(tablename, success, error) {
			this.transaction(function(tx) {
                                tx.executeSql('CREATE TABLE if not exists ' + tablename + '(key text, data blob)');
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
})(window.Scaljeri) ;
