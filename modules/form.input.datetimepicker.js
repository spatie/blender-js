// Remember form draft

var $ = require('jquery');
var ß = require('./../blender.js');
require('jquery-datetimepicker/build/jquery.datetimepicker.full'); //temp fix

$.datetimepicker.setLocale(ß.lang);

$('[data-datetimepicker]').datetimepicker({
    timepicker: false,
    lang: ß.lang,
    dayOfWeekStart: 1,
    scrollInput: false,
    format: 'd/m/Y'
});
