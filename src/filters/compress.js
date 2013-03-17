(function(Ns) {

    defaults = {
        filename: "compressed.bin"
    }

    /**
     * This class manages string data, like stringified JSON. If defined, the persistance dependency can be used to persist the data somewhere.
     * Depending on the filter, they can be applied as a before filter and/or after filter, when the data is loaded from the persistance
     * dependency.
     *
     * @class Data
     * @param {Object}[persistence] dependency which can persist the data
     * @param {Array} [filterList] list of filter
     */
	var dc = function(persistance, filterList) {

        this.state = "no data" ;
        this.persistance = persistance ;
        this.filter = filterList ;
    }

	dc.prototype = {
        setData: function(data, options) {
            if ( data ) {
                this._zippedBlob = null ;
                this.state = "uncompressed" ;
                this._inputStr = data ;
            }
            else if ( App.DEBUG )
                console.warn("Compress.setData() called without any data")
        },
        getState: function() {
            return this.state ;
        },
        getSize: function() {
            return this.state == "uncompressed" ? encodeURI(this._inputStr).split(/%..|./).length - 1 : this._zippedBlob.size ;

            /*
            return (this.state == "uncompressed" ?
                        new Blob([this._inputStr], { type: "text/plain"}) : this._zippedBlob
                   ).size ;
            */
        },

		zip: function(callback) {
            if ( !this._inputStr )
                throw new CompressException(this.state == "compressed" ? "Data already compressed" : "No string defined") ;
			// use a BlobWriter to store the zip into a Blob object
            var self = this ;
			zip.createWriter(new zip.BlobWriter(), function(writer) {
  				// use a TextReader to read the String to add
  				//writer.add(defaults.filename, new zip.TextReader("bla bla"), function() {
                //writer.add("filename.txt", new zip.TextReader("bla bla"), function() {
                writer.add(defaults.filename, new zip.TextReader(self._inputStr) , function() {
    					// onsuccess callback
    					// close the zip writer
    					writer.close(function(blob) {
      						// blob contains the zip file as a Blob object
                            self.state = "compressed" ;
                            self._inputStr = null ; // cleanup
                            self._zippedBlob = blob ;
						    callback({status: true}) ;
    					});
  				}, function(currentIndex, totalIndex) {
    					// onprogress callback
  				});
			}, function(error) {
  				// onerror callback
				console.log("ERROR") ;
                throw new CompressException("Could not compress the data")
			});
		},

	    read: function(callback, start, end) {
            if ( this._inputStr )
                callback(this._inputStr.substring(start, end)) ;
            else {
                if ( ! this._zippedBlob )
                    callback(null) ;
                else {
		            unzipBlob(this._zippedBlob, function(blob){
                        if ( typeof(start) === "number" && typeof(end) === number )
                            blob = blob.slice(start, end, blob.type );
                        if ( blob.type == "text/plain")
       			           readBlobAsText(blob, callback) ;
                        else
                            callback(blob) ;
			        }) ;
                }
            }
        }
	} ;

    /* ***** Private functions ***** */
	function unzipBlob(blob, callback) {
  	    // use a zip.BlobReader object to read zipped data stored into blob variable
  		zip.createReader(new zip.BlobReader(blob), function(zipReader) {
    	    // get entries from the zip file
    		zipReader.getEntries(function(entries) {
      			// get data from the first file
      			entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
        			// close the reader and calls callback function with uncompressed data as parameter
        			zipReader.close();
        			callback(data);
      			});
    		});
  		}, onerror);
	}

    function readBlobAsText(blob, callback) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
            callback(e.target.result) ;
        } ;
        reader.readAsText(blob);
    }

	function onerror(message) {
  		console.error(message);
	}

    function CompressException(message) {
        this.message = message;
        this.name = "NoDataDefinedException";
    }

	Ns.DataContainer = dc ;

})(window.Scaljeri) ;
