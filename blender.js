$ = require("jquery");

// the object
var ß = {};

// Get language from DOM or default to 'en'
ß.lang = document.documentElement.lang ? document.documentElement.lang : 'en';

// NPM module export
module.exports = ß ;
