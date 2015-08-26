// Remember form draft

var $ = require('jquery');
var ß = require('./../blender.js');
require('jquery-datetimepicker');

$('[data-datetimepicker]').datetimepicker({
    timepicker: false,
    lang: ß.lang,
    dayOfWeekStart: 1,
    scrollInput: false,
    format: 'd/m/Y'
});
