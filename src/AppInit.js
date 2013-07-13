/**
 * TODO
 * @class Sway
 */
window.Sway = window.Sway || { data: { persistance: {}}, filter: {}, ux: {}} ;

/**
  * Version of the framework
  * @property VERSION
  * @type String
  **/
window.Sway.VERSION = '1.0alpha' ;

/**
  * If TRUE, debugging is enabled. In PRODUCTION this property should be set to FALSE!!
  * @property DEBUG
  * @type boolean
  **/
window.Sway.DEBUG = true ;

// zip.js settings
if ( !window.zip ){
    window.zip = {} ;
}
zip.useWebWorkers     = true ;
zip.workerScriptsPath = "lib/zip.js/" ;