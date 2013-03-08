(function(App) {
	var requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    var defaults = {
        storageType: window.TEMPORARY,
        storageSize: 5  // mb
    }

	var fs = function(storageType, storageSize) {
		this._storageType = storageType || defaults.storageType ;
		this._storageSize = storageSize || defaults.storageSize ;
	}

	fs.prototype = {
		ls: function(path, callback) {
			requestFileSystem(window[this.storageType], this.storageSize*1024*1024 /*5MB*/, function(fs) {
  				console.log('Opened file system: ' + fs.name);
                fs.root.getDirectory(path, {}, function(dirEntry){
                    var dirReader = dirEntry.createReader();
                    dirReader.readEntries(function(entries) {
					    callback(entries) ;

						if ( App.DEBUG ) {
                            for(var i = 0; i < entries.length; i++) {
								/* entries[i].isFile === true
                                   entries[i].name == 'log.txt'
                                   entries[i].fullPath == '/log.txt			'
								*/
                                var entry = entries[i];
                                if (entry.isDirectory)
                                	console.log('Directory: ' + entry.fullPath);
                                else if (entry.isFile)
                                    console.log('File: ' + entry.fullPath);
							}
                        }
                    }, errorHandler);
                }, errorHandler);
			}, errorHandler);
		},
        //listDirectory: this.ls,
		file: function(filename, path) {
			var self = this ;
			return {
				write:  function(content, callback) { self.writeFile(content, filename, path, callback); },
				read:   function(callback) { self.readFile(filename, path, callback); },
				append: function(content, callback) {},
				exists: function(callback) { self.fileExists(filename, path, callback); },
				remove: function(callback) { self.removeFile(filename, path, callback); }
			}
		},
		/**
FileEntry interface is provided for working with files:
http://www.mosync.com/files/imports/doxygen/latest/html5/filewriter.md.html
fileEntry.isFile === true
fileEntry.isDirectory === false
fileEntry.name
fileEntry.fullPath
...

fileEntry.getMetadata(successCallback, opt_errorCallback);
fileEntry.remove(successCallback, opt_errorCallback);
fileEntry.moveTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);
fileEntry.copyTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);
fileEntry.getParent(successCallback, opt_errorCallback);
fileEntry.toURI(opt_mimeType);  // Currently not implemented in Google Chrome 9.

fileEntry.file(successCallback, opt_errorCallback);
fileEntry.createWriter(successCallback, opt_errorCallback);
		*/
		writeFile: function(content, filename, path, callback, options) {
			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				fs.root.getFile([path, filename].join('/'), {create: true, exclusive: false}, function(fileEntry) {
  					fileEntry.createWriter(function(fileWriter) {
    						var bb = new Blob([content], {type : "text/plain"});
						fileWriter.onwrite = callback ;
    						fileWriter.write(bb); 
  					}, errorHandler);
				}, errorHandler);
			}, errorHandler) ;
		},
		appendFile: function(content, filename, path, callback) {
			this.writeFile(content, filename, path, callback, { append: true }) ;
		},
		/**
			http://www.mosync.com/files/imports/doxygen/latest/html5/filereader.md.html
		*/
		readFile: function(filename, path, callback) {
			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				fs.root.getFile([path, filename].join(''), {}, function(fileEntry) {
    				fileEntry.file(function(file) {
					    if ( file.type == "text/plain" ) {
       						var reader = new FileReader();
       						reader.onloadend = function(e) {
							    callback(e.target.result) ;
						    }
       						reader.readAsText(file);
					    }
					    else
						    callback(file) ;
    				}, errorHandler);
  				}, errorHandler)
  			}, errorHandler);
		},
		fileExists: function(filename, path, callback) {
			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				fs.root.getFile([path, filename].join('/'), {create: true}, function(fileEntry) {
        			fileEntry.file(function(file) {
            				var reader = new FileReader();
            				reader.onloadend = function() {
                				// The file exists and is readable
						callback(true) ;
            				};
            				reader.readAsText(file);
        			}, errorHandler);
    			}, errorHandler);
			}, errorHandler) ;
		},
		removeFile: function(callback) {
		/*
			fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

    			fileEntry.remove(function() {
      			console.log('File removed.');
    			}, errorHandler);
			
  			}, errorHandler);
		*/
		},
		directiry: function(dirname, callback) {
			/*
			fs.root.getDirectory('Documents', {create: true}, function(dirEntry) {
  				alert('You have just created the ' + dirEntry.name + ' directory.');
			}, errorHandler);
			*/

			/*
				function createDir(rootDir, folders) {
  				rootDir.getDirectory(folders[0], {create: true}, function(dirEntry) {
    				if (folders.length) {
      				createDir(dirEntry, folders.slice(1));
    				}
  				}, errorHandler);
				};
			*/
		},
		removeDirectory: function(path, callback) {
/*
fs.root.getDirectory('music/genres/jazz', {}, function(dirEntry) {

    dirEntry.remove(function() {
      console.log('Directory removed.');
    }, errorHandler);

  }, errorHandler);
*/
		}
	}; 

				/*
				fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
				debugger ;
    				// fileEntry.isFile === true
    				// fileEntry.name == 'log.txt'
    				// fileEntry.fullPath == '/log.txt'
				
  				}, errorHandler);
				*/

	/**
		https://developer.mozilla.org/en-US/docs/DOM/File_API/File_System_API/FileError
	**/
	function errorHandler(e) {
  		var msg = '';
			
  		switch (e.code) {
    			case FileError.QUOTA_EXCEEDED_ERR:
      				msg = 'QUOTA_EXCEEDED_ERR';
      				break;
    			case FileError.NOT_FOUND_ERR:
      				msg = 'NOT_FOUND_ERR';
      				break;
    			case FileError.SECURITY_ERR:
      				msg = 'SECURITY_ERR';
      				break;
    			case FileError.INVALID_MODIFICATION_ERR:
      				msg = 'INVALID_MODIFICATION_ERR';
      				break;
    			case FileError.INVALID_STATE_ERR:
      				msg = 'INVALID_STATE_ERR';
      				break;
    			default:
      				msg = 'Unknown Error';
      				break;
  		};
	
  		console.error('Error: ' + msg);
	}

	window.App.Fs = fs ;
})(App) ;
