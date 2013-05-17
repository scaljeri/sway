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
_yuitest_coverage["./src/data/storage/fs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/data/storage/fs.js",
    code: []
};
_yuitest_coverage["./src/data/storage/fs.js"].code=["(function(Ns) {","	var requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;","","    var defaults = {","        storageType: window.TEMPORARY,","        storageSize: 5  // mb","    }","","	var fs = function(storageType, storageSize) {","		this._storageType = storageType || defaults.storageType ;","		this._storageSize = storageSize || defaults.storageSize ;","	}","","	fs.prototype = {","		ls: function(path, callback) {","			requestFileSystem(window[this.storageType], this.storageSize*1024*1024 /*5MB*/, function(fs) {","  				console.log('Opened file system: ' + fs.name);","                fs.root.getDirectory(path, {}, function(dirEntry){","                    var dirReader = dirEntry.createReader();","                    dirReader.readEntries(function(entries) {","					    callback(entries) ;","","						if ( Sway.DEBUG ) {","                            for(var i = 0; i < entries.length; i++) {","								/* entries[i].isFile === true","                                   entries[i].name == 'log.txt'","                                   entries[i].fullPath == '/log.txt			'","								*/","                                var entry = entries[i];","                                if (entry.isDirectory)","                                	console.log('Directory: ' + entry.fullPath);","                                else if (entry.isFile)","                                    console.log('File: ' + entry.fullPath);","							}","                        }","                    }, errorHandler);","                }, errorHandler);","			}, errorHandler);","		},","        //listDirectory: this.ls,","		file: function(filename, path) {","			var self = this ;","			return {","				write:  function(content, callback) { self.writeFile(content, filename, path, callback); },","				read:   function(callback) { self.readFile(filename, path, callback); },","				append: function(content, callback) {},","				exists: function(callback) { self.fileExists(filename, path, callback); },","				remove: function(callback) { self.removeFile(filename, path, callback); }","			}","		},","		/**","FileEntry interface is provided for working with files:","http://www.mosync.com/files/imports/doxygen/latest/html5/filewriter.md.html","fileEntry.isFile === true","fileEntry.isDirectory === false","fileEntry.name","fileEntry.fullPath","...","","fileEntry.getMetadata(successCallback, opt_errorCallback);","fileEntry.remove(successCallback, opt_errorCallback);","fileEntry.moveTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);","fileEntry.copyTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);","fileEntry.getParent(successCallback, opt_errorCallback);","fileEntry.toURI(opt_mimeType);  // Currently not implemented in Google Chrome 9.","","fileEntry.file(successCallback, opt_errorCallback);","fileEntry.createWriter(successCallback, opt_errorCallback);","		*/","		writeFile: function(content, filename, path, callback, options) {","			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {","				fs.root.getFile([path, filename].join('/'), {create: true, exclusive: false}, function(fileEntry) {","  					fileEntry.createWriter(function(fileWriter) {","    						var bb = new Blob([content], {type : \"text/plain\"});","						fileWriter.onwrite = callback ;","    						fileWriter.write(bb); ","  					}, errorHandler);","				}, errorHandler);","			}, errorHandler) ;","		},","		appendFile: function(content, filename, path, callback) {","			this.writeFile(content, filename, path, callback, { append: true }) ;","		},","		/**","			http://www.mosync.com/files/imports/doxygen/latest/html5/filereader.md.html","		*/","		readFile: function(filename, path, callback) {","			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {","				fs.root.getFile([path, filename].join(''), {}, function(fileEntry) {","    				fileEntry.file(function(file) {","					    if ( file.type == \"text/plain\" ) {","       						var reader = new FileReader();","       						reader.onloadend = function(e) {","							    callback(e.target.result) ;","						    }","       						reader.readAsText(file);","					    }","					    else","						    callback(file) ;","    				}, errorHandler);","  				}, errorHandler)","  			}, errorHandler);","		},","		fileExists: function(filename, path, callback) {","			requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {","				fs.root.getFile([path, filename].join('/'), {create: true}, function(fileEntry) {","        			fileEntry.file(function(file) {","            				var reader = new FileReader();","            				reader.onloadend = function() {","                				// The file exists and is readable","						callback(true) ;","            				};","            				reader.readAsText(file);","        			}, errorHandler);","    			}, errorHandler);","			}, errorHandler) ;","		},","		removeFile: function(callback) {","		/*","			fs.root.getFile('log.txt', {create: false}, function(fileEntry) {","","    			fileEntry.remove(function() {","      			console.log('File removed.');","    			}, errorHandler);","			","  			}, errorHandler);","		*/","		},","		directiry: function(dirname, callback) {","			/*","			fs.root.getDirectory('Documents', {create: true}, function(dirEntry) {","  				alert('You have just created the ' + dirEntry.name + ' directory.');","			}, errorHandler);","			*/","","			/*","				function createDir(rootDir, folders) {","  				rootDir.getDirectory(folders[0], {create: true}, function(dirEntry) {","    				if (folders.length) {","      				createDir(dirEntry, folders.slice(1));","    				}","  				}, errorHandler);","				};","			*/","		},","		removeDirectory: function(path, callback) {","/*","fs.root.getDirectory('music/genres/jazz', {}, function(dirEntry) {","","    dirEntry.remove(function() {","      console.log('Directory removed.');","    }, errorHandler);","","  }, errorHandler);","*/","		}","	}; ","","				/*","				fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {","				debugger ;","    				// fileEntry.isFile === true","    				// fileEntry.name == 'log.txt'","    				// fileEntry.fullPath == '/log.txt'","				","  				}, errorHandler);","				*/","","	/**","		https://developer.mozilla.org/en-US/docs/DOM/File_API/File_System_API/FileError","	**/","	function errorHandler(e) {","  		var msg = '';","			","  		switch (e.code) {","    			case FileError.QUOTA_EXCEEDED_ERR:","      				msg = 'QUOTA_EXCEEDED_ERR';","      				break;","    			case FileError.NOT_FOUND_ERR:","      				msg = 'NOT_FOUND_ERR';","      				break;","    			case FileError.SECURITY_ERR:","      				msg = 'SECURITY_ERR';","      				break;","    			case FileError.INVALID_MODIFICATION_ERR:","      				msg = 'INVALID_MODIFICATION_ERR';","      				break;","    			case FileError.INVALID_STATE_ERR:","      				msg = 'INVALID_STATE_ERR';","      				break;","    			default:","      				msg = 'Unknown Error';","      				break;","  		};","	","  		console.error('Error: ' + msg);","	}","","	Ns.Fs = fs ;","})(window.Sway) ;"];
_yuitest_coverage["./src/data/storage/fs.js"].lines = {"1":0,"2":0,"4":0,"9":0,"10":0,"11":0,"14":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"23":0,"24":0,"29":0,"30":0,"31":0,"32":0,"33":0,"42":0,"43":0,"44":0,"45":0,"47":0,"48":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"82":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"94":0,"96":0,"99":0,"105":0,"106":0,"107":0,"108":0,"109":0,"111":0,"113":0,"172":0,"173":0,"175":0,"177":0,"178":0,"180":0,"181":0,"183":0,"184":0,"186":0,"187":0,"189":0,"190":0,"192":0,"193":0,"194":0,"196":0,"199":0};
_yuitest_coverage["./src/data/storage/fs.js"].functions = {"fs:9":0,"(anonymous 4):20":0,"(anonymous 3):18":0,"(anonymous 2):16":0,"ls:15":0,"write:44":0,"read:45":0,"exists:47":0,"remove:48":0,"file:41":0,"(anonymous 7):73":0,"(anonymous 6):72":0,"(anonymous 5):71":0,"writeFile:70":0,"appendFile:81":0,"onloadend:93":0,"(anonymous 10):90":0,"(anonymous 9):89":0,"(anonymous 8):88":0,"readFile:87":0,"onloadend:109":0,"(anonymous 13):107":0,"(anonymous 12):106":0,"(anonymous 11):105":0,"fileExists:104":0,"errorHandler:172":0,"(anonymous 1):1":0};
_yuitest_coverage["./src/data/storage/fs.js"].coveredLines = 67;
_yuitest_coverage["./src/data/storage/fs.js"].coveredFunctions = 27;
_yuitest_coverline("./src/data/storage/fs.js", 1);
(function(Ns) {
	_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 1)", 1);
_yuitest_coverline("./src/data/storage/fs.js", 2);
var requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    _yuitest_coverline("./src/data/storage/fs.js", 4);
var defaults = {
        storageType: window.TEMPORARY,
        storageSize: 5  // mb
    }

	_yuitest_coverline("./src/data/storage/fs.js", 9);
var fs = function(storageType, storageSize) {
		_yuitest_coverfunc("./src/data/storage/fs.js", "fs", 9);
_yuitest_coverline("./src/data/storage/fs.js", 10);
this._storageType = storageType || defaults.storageType ;
		_yuitest_coverline("./src/data/storage/fs.js", 11);
this._storageSize = storageSize || defaults.storageSize ;
	}

	_yuitest_coverline("./src/data/storage/fs.js", 14);
fs.prototype = {
		ls: function(path, callback) {
			_yuitest_coverfunc("./src/data/storage/fs.js", "ls", 15);
_yuitest_coverline("./src/data/storage/fs.js", 16);
requestFileSystem(window[this.storageType], this.storageSize*1024*1024 /*5MB*/, function(fs) {
  				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 2)", 16);
_yuitest_coverline("./src/data/storage/fs.js", 17);
console.log('Opened file system: ' + fs.name);
                _yuitest_coverline("./src/data/storage/fs.js", 18);
fs.root.getDirectory(path, {}, function(dirEntry){
                    _yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 3)", 18);
_yuitest_coverline("./src/data/storage/fs.js", 19);
var dirReader = dirEntry.createReader();
                    _yuitest_coverline("./src/data/storage/fs.js", 20);
dirReader.readEntries(function(entries) {
					    _yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 4)", 20);
_yuitest_coverline("./src/data/storage/fs.js", 21);
callback(entries) ;

						_yuitest_coverline("./src/data/storage/fs.js", 23);
if ( Sway.DEBUG ) {
                            _yuitest_coverline("./src/data/storage/fs.js", 24);
for(var i = 0; i < entries.length; i++) {
								/* entries[i].isFile === true
                                   entries[i].name == 'log.txt'
                                   entries[i].fullPath == '/log.txt			'
								*/
                                _yuitest_coverline("./src/data/storage/fs.js", 29);
var entry = entries[i];
                                _yuitest_coverline("./src/data/storage/fs.js", 30);
if (entry.isDirectory)
                                	{_yuitest_coverline("./src/data/storage/fs.js", 31);
console.log('Directory: ' + entry.fullPath);}
                                else {_yuitest_coverline("./src/data/storage/fs.js", 32);
if (entry.isFile)
                                    {_yuitest_coverline("./src/data/storage/fs.js", 33);
console.log('File: ' + entry.fullPath);}}
							}
                        }
                    }, errorHandler);
                }, errorHandler);
			}, errorHandler);
		},
        //listDirectory: this.ls,
		file: function(filename, path) {
			_yuitest_coverfunc("./src/data/storage/fs.js", "file", 41);
_yuitest_coverline("./src/data/storage/fs.js", 42);
var self = this ;
			_yuitest_coverline("./src/data/storage/fs.js", 43);
return {
				write:  function(content, callback) { _yuitest_coverfunc("./src/data/storage/fs.js", "write", 44);
_yuitest_coverline("./src/data/storage/fs.js", 44);
self.writeFile(content, filename, path, callback); },
				read:   function(callback) { _yuitest_coverfunc("./src/data/storage/fs.js", "read", 45);
_yuitest_coverline("./src/data/storage/fs.js", 45);
self.readFile(filename, path, callback); },
				append: function(content, callback) {},
				exists: function(callback) { _yuitest_coverfunc("./src/data/storage/fs.js", "exists", 47);
_yuitest_coverline("./src/data/storage/fs.js", 47);
self.fileExists(filename, path, callback); },
				remove: function(callback) { _yuitest_coverfunc("./src/data/storage/fs.js", "remove", 48);
_yuitest_coverline("./src/data/storage/fs.js", 48);
self.removeFile(filename, path, callback); }
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
			_yuitest_coverfunc("./src/data/storage/fs.js", "writeFile", 70);
_yuitest_coverline("./src/data/storage/fs.js", 71);
requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 5)", 71);
_yuitest_coverline("./src/data/storage/fs.js", 72);
fs.root.getFile([path, filename].join('/'), {create: true, exclusive: false}, function(fileEntry) {
  					_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 6)", 72);
_yuitest_coverline("./src/data/storage/fs.js", 73);
fileEntry.createWriter(function(fileWriter) {
    						_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 7)", 73);
_yuitest_coverline("./src/data/storage/fs.js", 74);
var bb = new Blob([content], {type : "text/plain"});
						_yuitest_coverline("./src/data/storage/fs.js", 75);
fileWriter.onwrite = callback ;
    						_yuitest_coverline("./src/data/storage/fs.js", 76);
fileWriter.write(bb); 
  					}, errorHandler);
				}, errorHandler);
			}, errorHandler) ;
		},
		appendFile: function(content, filename, path, callback) {
			_yuitest_coverfunc("./src/data/storage/fs.js", "appendFile", 81);
_yuitest_coverline("./src/data/storage/fs.js", 82);
this.writeFile(content, filename, path, callback, { append: true }) ;
		},
		/**
			http://www.mosync.com/files/imports/doxygen/latest/html5/filereader.md.html
		*/
		readFile: function(filename, path, callback) {
			_yuitest_coverfunc("./src/data/storage/fs.js", "readFile", 87);
_yuitest_coverline("./src/data/storage/fs.js", 88);
requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 8)", 88);
_yuitest_coverline("./src/data/storage/fs.js", 89);
fs.root.getFile([path, filename].join(''), {}, function(fileEntry) {
    				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 9)", 89);
_yuitest_coverline("./src/data/storage/fs.js", 90);
fileEntry.file(function(file) {
					    _yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 10)", 90);
_yuitest_coverline("./src/data/storage/fs.js", 91);
if ( file.type == "text/plain" ) {
       						_yuitest_coverline("./src/data/storage/fs.js", 92);
var reader = new FileReader();
       						_yuitest_coverline("./src/data/storage/fs.js", 93);
reader.onloadend = function(e) {
							    _yuitest_coverfunc("./src/data/storage/fs.js", "onloadend", 93);
_yuitest_coverline("./src/data/storage/fs.js", 94);
callback(e.target.result) ;
						    }
       						_yuitest_coverline("./src/data/storage/fs.js", 96);
reader.readAsText(file);
					    }
					    else
						    {_yuitest_coverline("./src/data/storage/fs.js", 99);
callback(file) ;}
    				}, errorHandler);
  				}, errorHandler)
  			}, errorHandler);
		},
		fileExists: function(filename, path, callback) {
			_yuitest_coverfunc("./src/data/storage/fs.js", "fileExists", 104);
_yuitest_coverline("./src/data/storage/fs.js", 105);
requestFileSystem(window[this._storageType], this._storageSize*1024*1024 /*5MB*/, function(fs) {
				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 11)", 105);
_yuitest_coverline("./src/data/storage/fs.js", 106);
fs.root.getFile([path, filename].join('/'), {create: true}, function(fileEntry) {
        			_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 12)", 106);
_yuitest_coverline("./src/data/storage/fs.js", 107);
fileEntry.file(function(file) {
            				_yuitest_coverfunc("./src/data/storage/fs.js", "(anonymous 13)", 107);
_yuitest_coverline("./src/data/storage/fs.js", 108);
var reader = new FileReader();
            				_yuitest_coverline("./src/data/storage/fs.js", 109);
reader.onloadend = function() {
                				// The file exists and is readable
						_yuitest_coverfunc("./src/data/storage/fs.js", "onloadend", 109);
_yuitest_coverline("./src/data/storage/fs.js", 111);
callback(true) ;
            				};
            				_yuitest_coverline("./src/data/storage/fs.js", 113);
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
	_yuitest_coverline("./src/data/storage/fs.js", 172);
function errorHandler(e) {
  		_yuitest_coverfunc("./src/data/storage/fs.js", "errorHandler", 172);
_yuitest_coverline("./src/data/storage/fs.js", 173);
var msg = '';
			
  		_yuitest_coverline("./src/data/storage/fs.js", 175);
switch (e.code) {
    			case FileError.QUOTA_EXCEEDED_ERR:
      				_yuitest_coverline("./src/data/storage/fs.js", 177);
msg = 'QUOTA_EXCEEDED_ERR';
      				_yuitest_coverline("./src/data/storage/fs.js", 178);
break;
    			case FileError.NOT_FOUND_ERR:
      				_yuitest_coverline("./src/data/storage/fs.js", 180);
msg = 'NOT_FOUND_ERR';
      				_yuitest_coverline("./src/data/storage/fs.js", 181);
break;
    			case FileError.SECURITY_ERR:
      				_yuitest_coverline("./src/data/storage/fs.js", 183);
msg = 'SECURITY_ERR';
      				_yuitest_coverline("./src/data/storage/fs.js", 184);
break;
    			case FileError.INVALID_MODIFICATION_ERR:
      				_yuitest_coverline("./src/data/storage/fs.js", 186);
msg = 'INVALID_MODIFICATION_ERR';
      				_yuitest_coverline("./src/data/storage/fs.js", 187);
break;
    			case FileError.INVALID_STATE_ERR:
      				_yuitest_coverline("./src/data/storage/fs.js", 189);
msg = 'INVALID_STATE_ERR';
      				_yuitest_coverline("./src/data/storage/fs.js", 190);
break;
    			default:
      				_yuitest_coverline("./src/data/storage/fs.js", 192);
msg = 'Unknown Error';
      				_yuitest_coverline("./src/data/storage/fs.js", 193);
break;
  		}_yuitest_coverline("./src/data/storage/fs.js", 194);
;
	
  		_yuitest_coverline("./src/data/storage/fs.js", 196);
console.error('Error: ' + msg);
	}

	_yuitest_coverline("./src/data/storage/fs.js", 199);
Ns.Fs = fs ;
})(window.Sway) ;
