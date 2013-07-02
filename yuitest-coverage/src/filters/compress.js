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
_yuitest_coverage["./src/filters/compress.js"].code=["window.Sway = window.Sway || {filter: {}}; // make sure it exists","","(function (ns, zip) {","","    var defaults = {","            filename: \"compressed.bin\"","        }","","    /**","     * This filter can compress a string and uncompress a Blob (the compressed string).","     *","     * @class Sway.filter.Compress","     * @constructor","     */","        , Compress = function () {","        };","","    Compress.prototype = {","        compress: function (str, callback) {","            // use a BlobWriter to store the zip into a Blob object","            var self = this;","            zip.createWriter(new zip.BlobWriter(), function (writer) {","                // use a TextReader to read the String to add","                //writer.add(defaults.filename, new zip.TextReader(\"bla bla\"), function() {","                //writer.add(\"filename.txt\", new zip.TextReader(\"bla bla\"), function() {","                writer.add(defaults.filename, new zip.TextReader(str), function () {","                    // onsuccess callback","                    // close the zip writer","                    writer.close(function (blob) {","                        // blob contains the zip file as a Blob object","                        callback(blob);","                    });","                }, function (currentIndex, totalIndex) {","                    // onprogress callback","                });","            }, function (error) {","                // onerror callback","                console.log(\"ERROR\");","                throw new CompressException(\"Could not compress the data\")","            });","        },","        uncompress: function (blob, callback, start, end) {","            unzipBlob(blob, function (blob) {","                if (typeof(start) === \"number\" && typeof(end) === number) {","                    blob = blob.slice(start, end, blob.type);","                }","                if (blob.type == \"text/plain\") {","                    readBlobAsText(blob, callback);","                }","                else {","                    callback(blob);","                }","            });","        }","    };","","    /* ***** Private functions ***** */","    function unzipBlob(blob, callback) {","        // use a zip.BlobReader object to read zipped data stored into blob variable","        zip.createReader(new zip.BlobReader(blob), function (zipReader) {","            // get entries from the zip file","            zipReader.getEntries(function (entries) {","                // get data from the first file","                entries[0].getData(new zip.BlobWriter(\"text/plain\"), function (data) {","                    // close the reader and calls callback function with uncompressed data as parameter","                    zipReader.close();","                    callback(data);","                });","            });","        }, onerror);","    }","","    function readBlobAsText(blob, callback) {","        var reader = new FileReader();","        reader.onloadend = function (e) {","            callback(e.target.result);","        };","        reader.readAsText(blob);","    }","","    function onerror(message) {","        console.error(message);","    }","","    function CompressException(message) {","        this.message = message;","        this.name = \"NoDataDefinedException\";","    }","","    ns.Compress = Compress;","","})(window.Sway.filter, window.zip);"];
_yuitest_coverage["./src/filters/compress.js"].lines = {"1":0,"3":0,"5":0,"18":0,"21":0,"22":0,"26":0,"29":0,"31":0,"38":0,"39":0,"43":0,"44":0,"45":0,"47":0,"48":0,"51":0,"58":0,"60":0,"62":0,"64":0,"66":0,"67":0,"73":0,"74":0,"75":0,"76":0,"78":0,"81":0,"82":0,"85":0,"86":0,"87":0,"90":0};
_yuitest_coverage["./src/filters/compress.js"].functions = {"(anonymous 4):29":0,"(anonymous 3):26":0,"(anonymous 2):22":0,"(anonymous 6):36":0,"compress:19":0,"(anonymous 7):43":0,"uncompress:42":0,"(anonymous 10):64":0,"(anonymous 9):62":0,"(anonymous 8):60":0,"unzipBlob:58":0,"onloadend:75":0,"readBlobAsText:73":0,"onerror:81":0,"CompressException:85":0,"(anonymous 1):3":0};
_yuitest_coverage["./src/filters/compress.js"].coveredLines = 34;
_yuitest_coverage["./src/filters/compress.js"].coveredFunctions = 16;
_yuitest_coverline("./src/filters/compress.js", 1);
window.Sway = window.Sway || {filter: {}}; // make sure it exists

_yuitest_coverline("./src/filters/compress.js", 3);
(function (ns, zip) {

    _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 1)", 3);
_yuitest_coverline("./src/filters/compress.js", 5);
var defaults = {
            filename: "compressed.bin"
        }

    /**
     * This filter can compress a string and uncompress a Blob (the compressed string).
     *
     * @class Sway.filter.Compress
     * @constructor
     */
        , Compress = function () {
        };

    _yuitest_coverline("./src/filters/compress.js", 18);
Compress.prototype = {
        compress: function (str, callback) {
            // use a BlobWriter to store the zip into a Blob object
            _yuitest_coverfunc("./src/filters/compress.js", "compress", 19);
_yuitest_coverline("./src/filters/compress.js", 21);
var self = this;
            _yuitest_coverline("./src/filters/compress.js", 22);
zip.createWriter(new zip.BlobWriter(), function (writer) {
                // use a TextReader to read the String to add
                //writer.add(defaults.filename, new zip.TextReader("bla bla"), function() {
                //writer.add("filename.txt", new zip.TextReader("bla bla"), function() {
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 2)", 22);
_yuitest_coverline("./src/filters/compress.js", 26);
writer.add(defaults.filename, new zip.TextReader(str), function () {
                    // onsuccess callback
                    // close the zip writer
                    _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 3)", 26);
_yuitest_coverline("./src/filters/compress.js", 29);
writer.close(function (blob) {
                        // blob contains the zip file as a Blob object
                        _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 4)", 29);
_yuitest_coverline("./src/filters/compress.js", 31);
callback(blob);
                    });
                }, function (currentIndex, totalIndex) {
                    // onprogress callback
                });
            }, function (error) {
                // onerror callback
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 6)", 36);
_yuitest_coverline("./src/filters/compress.js", 38);
console.log("ERROR");
                _yuitest_coverline("./src/filters/compress.js", 39);
throw new CompressException("Could not compress the data")
            });
        },
        uncompress: function (blob, callback, start, end) {
            _yuitest_coverfunc("./src/filters/compress.js", "uncompress", 42);
_yuitest_coverline("./src/filters/compress.js", 43);
unzipBlob(blob, function (blob) {
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 7)", 43);
_yuitest_coverline("./src/filters/compress.js", 44);
if (typeof(start) === "number" && typeof(end) === number) {
                    _yuitest_coverline("./src/filters/compress.js", 45);
blob = blob.slice(start, end, blob.type);
                }
                _yuitest_coverline("./src/filters/compress.js", 47);
if (blob.type == "text/plain") {
                    _yuitest_coverline("./src/filters/compress.js", 48);
readBlobAsText(blob, callback);
                }
                else {
                    _yuitest_coverline("./src/filters/compress.js", 51);
callback(blob);
                }
            });
        }
    };

    /* ***** Private functions ***** */
    _yuitest_coverline("./src/filters/compress.js", 58);
function unzipBlob(blob, callback) {
        // use a zip.BlobReader object to read zipped data stored into blob variable
        _yuitest_coverfunc("./src/filters/compress.js", "unzipBlob", 58);
_yuitest_coverline("./src/filters/compress.js", 60);
zip.createReader(new zip.BlobReader(blob), function (zipReader) {
            // get entries from the zip file
            _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 8)", 60);
_yuitest_coverline("./src/filters/compress.js", 62);
zipReader.getEntries(function (entries) {
                // get data from the first file
                _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 9)", 62);
_yuitest_coverline("./src/filters/compress.js", 64);
entries[0].getData(new zip.BlobWriter("text/plain"), function (data) {
                    // close the reader and calls callback function with uncompressed data as parameter
                    _yuitest_coverfunc("./src/filters/compress.js", "(anonymous 10)", 64);
_yuitest_coverline("./src/filters/compress.js", 66);
zipReader.close();
                    _yuitest_coverline("./src/filters/compress.js", 67);
callback(data);
                });
            });
        }, onerror);
    }

    _yuitest_coverline("./src/filters/compress.js", 73);
function readBlobAsText(blob, callback) {
        _yuitest_coverfunc("./src/filters/compress.js", "readBlobAsText", 73);
_yuitest_coverline("./src/filters/compress.js", 74);
var reader = new FileReader();
        _yuitest_coverline("./src/filters/compress.js", 75);
reader.onloadend = function (e) {
            _yuitest_coverfunc("./src/filters/compress.js", "onloadend", 75);
_yuitest_coverline("./src/filters/compress.js", 76);
callback(e.target.result);
        };
        _yuitest_coverline("./src/filters/compress.js", 78);
reader.readAsText(blob);
    }

    _yuitest_coverline("./src/filters/compress.js", 81);
function onerror(message) {
        _yuitest_coverfunc("./src/filters/compress.js", "onerror", 81);
_yuitest_coverline("./src/filters/compress.js", 82);
console.error(message);
    }

    _yuitest_coverline("./src/filters/compress.js", 85);
function CompressException(message) {
        _yuitest_coverfunc("./src/filters/compress.js", "CompressException", 85);
_yuitest_coverline("./src/filters/compress.js", 86);
this.message = message;
        _yuitest_coverline("./src/filters/compress.js", 87);
this.name = "NoDataDefinedException";
    }

    _yuitest_coverline("./src/filters/compress.js", 90);
ns.Compress = Compress;

})(window.Sway.filter, window.zip);
