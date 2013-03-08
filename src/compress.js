(function(App, $) {
	zip.useWebWorkers = true ;
    zip.workerScriptsPath = "../lib/zip.js/" ;

    defaults = {
        filename: "compressed.bin"
    }

	var dc = function(data, options) {
        this.state = "no data" ;
        this.setData(str, options) ;
    }

	dc.prototype = {
        setData: function(data, options) {
            if ( data ) {
                this._zippedBlob = null ;
                this.state = "uncompressed" ;
                this._blob = typeof(data) == "string" ? new Blob([data], { type: "text/plain"}) : data ;
            }
            else if ( App.DEBUG )
                console.warn("Compress.setData() called without any data")
        },
        getBlob: function() {
            return this._blob || this._zippedBlob ;
        },
        getState: function() {
            return this.state ;
        },

		zip: function(callback) {
            if ( !this._blob )
                throw new CompressException(this.state == "compressed" ? "Data already compressed" : "No Data defined")
			// use a BlobWriter to store the zip into a Blob object
            var self = this ;
			zip.createWriter(new zip.BlobWriter(), function(writer) {
  				// use a TextReader to read the String to add
  				//writer.add(defaults.filename, new zip.TextReader(str), function() {
                writer.add(defaults.filename, self._blob, function() {
    					// onsuccess callback
				
    					// close the zip writer
    					writer.close(function(blob) {
      						// blob contains the zip file as a Blob object
                            self.state = "compressed" ;
                            this._blob = null ;
                            this._zippedBlob = blob ;
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
            if ( !this._zippedBlob )
                throw new CompressException("No zipped data defined") ;

		    unzipBlob(this._zippedBlob, function(blob){
                blob = blob.slice(start, end, blob.type );
                if ( blob.type == "text/plain") {
       			    var reader = new FileReader();
                    reader.onloadend = function(e) {
					    callback(e.target.result) ;
					} ;
                    reader.readAsText(blob); //
                }
                else
                    callback(blob) ;
			}) ;
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

	function onerror(message) {
  		console.error(message);
	}

    function CompressException(message) {
        this.message = message;
        this.name = "NoDataDefinedException";
    }

	App.Data = compress ;

})(window.App, jQuery) ;
