window.Sway = window.Sway || {filter: {}}; // make sure it exists

(function (ns, zip) {

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

    Compress.prototype = {
        compress: function (str, callback) {
            // use a BlobWriter to store the zip into a Blob object
            var self = this;
            zip.createWriter(new zip.BlobWriter(), function (writer) {
                // use a TextReader to read the String to add
                //writer.add(defaults.filename, new zip.TextReader("bla bla"), function() {
                //writer.add("filename.txt", new zip.TextReader("bla bla"), function() {
                writer.add(defaults.filename, new zip.TextReader(str), function () {
                    // onsuccess callback
                    // close the zip writer
                    writer.close(function (blob) {
                        // blob contains the zip file as a Blob object
                        callback(blob);
                    });
                }, function (currentIndex, totalIndex) {
                    // onprogress callback
                });
            }, function (error) {
                // onerror callback
                console.log("ERROR");
                throw new CompressException("Could not compress the data")
            });
        },
        uncompress: function (blob, callback, start, end) {
            unzipBlob(blob, function (blob) {
                if (typeof(start) === "number" && typeof(end) === number) {
                    blob = blob.slice(start, end, blob.type);
                }
                if (blob.type == "text/plain") {
                    readBlobAsText(blob, callback);
                }
                else {
                    callback(blob);
                }
            });
        }
    };

    /* ***** Private functions ***** */
    function unzipBlob(blob, callback) {
        // use a zip.BlobReader object to read zipped data stored into blob variable
        zip.createReader(new zip.BlobReader(blob), function (zipReader) {
            // get entries from the zip file
            zipReader.getEntries(function (entries) {
                // get data from the first file
                entries[0].getData(new zip.BlobWriter("text/plain"), function (data) {
                    // close the reader and calls callback function with uncompressed data as parameter
                    zipReader.close();
                    callback(data);
                });
            });
        }, onerror);
    }

    function readBlobAsText(blob, callback) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            callback(e.target.result);
        };
        reader.readAsText(blob);
    }

    function onerror(message) {
        console.error(message);
    }

    function CompressException(message) {
        this.message = message;
        this.name = "NoDataDefinedException";
    }

    ns.Compress = Compress;

})(window.Sway.filter, window.zip);
