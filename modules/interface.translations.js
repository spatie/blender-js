var ß = require("./../blender.js");

// Register the different langs
ß.translations = {} ;
require("./../locales/en.js");
require("./../locales/nl.js");
require("./../locales/fr.js");

// Translate object
ß.translate = function (key) {
    var lang = ß.translations[ß.lang];
    var string = eval('lang.' + key);

    if (!lang || !string) {
        console.warn(ß.lang.toUpperCase() + ' translations missing for [' + key + ']');
        return '[' + key + ']';
    }

    return (string);
};

module.exports = ß.translate ;
