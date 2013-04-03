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
_yuitest_coverage["./src/filters/compress.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Volumes/DATA/dev/ws/zipped/src/filters/compress.js",
    code: []
};
_yuitest_coverage["./src/filters/compress.js"].code=["window.Sway = window.Sway || {filter: {}} ; // make sure it exists","","(function(Ns) {","","    defaults = {","        filename: \"compressed.bin\"","    }","","    /**","     * This filter can compress a string and uncompress a Blob (the compressed string).","     *","     * @class Sway.filter.Compress","     * @constructor","     */","	var c = function() {}","","	c.prototype = {","        compress: function(str, callback) {","            // use a BlobWriter to store the zip into a Blob object","            var self = this ;","            zip.createWriter(new zip.BlobWriter(), function(writer) {","                // use a TextReader to read the String to add","                //writer.add(defaults.filename, new zip.TextReader(\"bla bla\"), function() {","                //writer.add(\"filename.txt\", new zip.TextReader(\"bla bla\"), function() {","                writer.add(defaults.filename, new zip.TextReader(str) , function() {","                    // onsuccess callback","                    // close the zip writer","                    writer.close(function(blob) {","                        // blob contains the zip file as a Blob object","                        callback(blob) ;","                    });","                }, function(currentIndex, totalIndex) {","                    // onprogress callback","                });","            }, function(error) {","                // onerror callback","                console.log(\"ERROR\") ;","                throw new CompressException(\"Could not compress the data\")","            });","        },","        uncompress: function(blob, callback, start, end) {","            unzipBlob(blob, function(blob){","                if ( typeof(start) === \"number\" && typeof(end) === number ) {","                    blob = blob.slice(start, end, blob.type );","                }","                if ( blob.type == \"text/plain\") {","       			    readBlobAsText(blob, callback) ;","                }","                else {","                    callback(blob) ;","                }","            }) ;","        }","	} ;","","    /* ***** Private functions ***** */","	function unzipBlob(blob, callback) {","  	    // use a zip.BlobReader object to read zipped data stored into blob variable","  		zip.createReader(new zip.BlobReader(blob), function(zipReader) {","    	    // get entries from the zip file","    		zipReader.getEntries(function(entries) {","      			// get data from the first file","      			entries[0].getData(new zip.BlobWriter(\"text/plain\"), function(data) {","        			// close the reader and calls callback function with uncompressed data as parameter","        			zipReader.close();","        			callback(data);","      			});","    		});","  		}, onerror);","	}","","    function readBlobAsText(blob, callback) {","        var reader = new FileReader();","        reader.onloadend = function(e) {","            callback(e.target.result) ;","        } ;","        reader.readAsText(blob);","    }","","	function onerror(message) {","  		console.error(message);","	}","","    function CompressException(message) {","        this.message = message;","        this.name = \"NoDataDefinedException\";","    }","","	Ns.Compress = dc ;","","})(window.Sway.filter) ;"];
_yuitest_coverage["./src/filters/compress.js"].lines = {"1":0,"3":0,"5":0,"15":0,"17":0,"20":0,"21":0,"25":0,"28":0,"30":0,"37":0,"38":0,"42":0,"43":0,"44":0,"46":0,"47":0,"50":0,"57":0,"59":0,"61":0,"63":0,"65":0,"66":0,"72":0,"73":0,"74":0,"75":0,"77":0,"80":0,"81":0,"84":0,"85":0,"86":0,"89":0};
_yuitest_coverage["./src/filters/compress.js"].functions = {"(anonymous 4):28":0,"(anonymous 3):25":0,"(anonymous 2):21":0,"(anonymous 6):35":0,"compress:18":0,"(anonymous 7):42":0,"uncompress:41":0,"(anonymous 10):63":0,"(anonymous 9):61":0,"(anonymous 8):59":0,"unzipBlob:57":0,"onloadend:74":0,"readBlobAsText:72":0,"onerror:80":0,"CompressException:84":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/filters/compress.js"].coveredLines = 35;
_yuitest_coverage["./src/filters/compress.js"].coveredFunctions = 16;
_yuitest_coverline("./src/filters/compress.js", 1);
window.Sway = window.Sway || {filter: {}} ; // make sure it exists

_yuitest_coverline("./src/filters/compress.js", 3);
(function(Ns) {

    _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/filters/compress.js", 5);
defaults = {
        filename: "compressed.bin"
    }

    /**
     * This filter can compress a string and uncompress a Blob (the compressed string).
     *
     * @class Sway.filter.Compress
     * @constructor
     */
	_yuitest_coverline("./src/filters/compress.js", 15);
var c = function() {}

	_yuitest_coverline("./src/filters/compress.js", 17);
c.prototype = {
        compress: function(str, callback) {
            // use a BlobWriter to store the zip into a Blob object
            _yuitest_coverfunc("./src/filters/compress.js", "compress", 18);
_yuitest_coverline("./src/filters/compress.js", 20);
var self = this ;
            _yuitest_coverline("./src/filters/compress.js", 21);
zip.createWriter(new zip.BlobWriter(), function(writer) {
                // use a TextReader to read the String to add
                //writer.add(defaults.filename, new zip.TextReader("bla bla"), function() {
                //writer.add("filename.txt", new zip.TextReader("bla bla"), function() {
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 2)", 21);
_yuitest_coverline("./src/filters/compress.js", 25);
writer.add(defaults.filename, new zip.TextReader(str) , function() {
                    // onsuccess callback
                    // close the zip writer
                    _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 3)", 25);
_yuitest_coverline("./src/filters/compress.js", 28);
writer.close(function(blob) {
                        // blob contains the zip file as a Blob object
                        _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 4)", 28);
_yuitest_coverline("./src/filters/compress.js", 30);
callback(blob) ;
                    });
                }, function(currentIndex, totalIndex) {
                    // onprogress callback
                });
            }, function(error) {
                // onerror callback
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 6)", 35);
_yuitest_coverline("./src/filters/compress.js", 37);
console.log("ERROR") ;
                _yuitest_coverline("./src/filters/compress.js", 38);
throw new CompressException("Could not compress the data")
            });
        },
        uncompress: function(blob, callback, start, end) {
            _yuitest_coverfunc("./src/filters/compress.js", "uncompress", 41);
_yuitest_coverline("./src/filters/compress.js", 42);
unzipBlob(blob, function(blob){
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 7)", 42);
_yuitest_coverline("./src/filters/compress.js", 43);
if ( typeof(start) === "number" && typeof(end) === number ) {
                    _yuitest_coverline("./src/filters/compress.js", 44);
blob = blob.slice(start, end, blob.type );
                }
                _yuitest_coverline("./src/filters/compress.js", 46);
if ( blob.type == "text/plain") {
       			    _yuitest_coverline("./src/filters/compress.js", 47);
readBlobAsText(blob, callback) ;
                }
                else {
                    _yuitest_coverline("./src/filters/compress.js", 50);
callback(blob) ;
                }
            }) ;
        }
	} ;

    /* ***** Private functions ***** */
	_yuitest_coverline("./src/filters/compress.js", 57);
function unzipBlob(blob, callback) {
  	    // use a zip.BlobReader object to read zipped data stored into blob variable
  		_yuitest_coverfunc("./src/filters/compress.js", "unzipBlob", 57);
_yuitest_coverline("./src/filters/compress.js", 59);
zip.createReader(new zip.BlobReader(blob), function(zipReader) {
    	    // get entries from the zip file
    		_yuitest_coverfunc("./src/filters/compress.js", "(anonymous 8)", 59);
_yuitest_coverline("./src/filters/compress.js", 61);
zipReader.getEntries(function(entries) {
      			// get data from the first file
      			_yuitest_coverfunc("./src/filters/compress.js", "(anonymous 9)", 61);
_yuitest_coverline("./src/filters/compress.js", 63);
entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
        			// close the reader and calls callback function with uncompressed data as parameter
        			_yuitest_coverfunc("./src/filters/compress.js", "(anonymous 10)", 63);
_yuitest_coverline("./src/filters/compress.js", 65);
zipReader.close();
        			_yuitest_coverline("./src/filters/compress.js", 66);
callback(data);
      			});
    		});
  		}, onerror);
	}

    _yuitest_coverline("./src/filters/compress.js", 72);
function readBlobAsText(blob, callback) {
        _yuitest_coverfunc("./src/filters/compress.js", "readBlobAsText", 72);
_yuitest_coverline("./src/filters/compress.js", 73);
var reader = new FileReader();
        _yuitest_coverline("./src/filters/compress.js", 74);
reader.onloadend = function(e) {
            _yuitest_coverfunc("./src/filters/compress.js", "onloadend", 74);
_yuitest_coverline("./src/filters/compress.js", 75);
callback(e.target.result) ;
        } ;
        _yuitest_coverline("./src/filters/compress.js", 77);
reader.readAsText(blob);
    }

	_yuitest_coverline("./src/filters/compress.js", 80);
function onerror(message) {
  		_yuitest_coverfunc("./src/filters/compress.js", "onerror", 80);
_yuitest_coverline("./src/filters/compress.js", 81);
console.error(message);
	}

    _yuitest_coverline("./src/filters/compress.js", 84);
function CompressException(message) {
        _yuitest_coverfunc("./src/filters/compress.js", "CompressException", 84);
_yuitest_coverline("./src/filters/compress.js", 85);
this.message = message;
        _yuitest_coverline("./src/filters/compress.js", 86);
this.name = "NoDataDefinedException";
    }

	_yuitest_coverline("./src/filters/compress.js", 89);
Ns.Compress = dc ;

})(window.Sway.filter) ;
