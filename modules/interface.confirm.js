var $ = require("jquery");
require("jquery-confirm");
var translate = require("./interface.translations.js");


//confirm dialog for forms
$("[data-confirm]").on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);

    $.confirm({
        title: translate('confirm.text'),
        content: ' ',
        confirmButton: translate('confirm.yes'),
        cancelButton: translate('confirm.no'),
        confirmButtonClass: 'button',
        cancelButtonClass: 'button -gray',
        confirm: function () {
            $form.trigger('submit.byscript'); //namespaced to avoid trigger loop
        }
    });

});

// confirm dialog for links
$("body").on('click', 'a[data-confirm]', function (e) {
    e.preventDefault();
    var $link = $(this);

    $.confirm({
        title: translate('confirm.text'),
        content: ' ',
        confirmButton: translate('confirm.yes'),
        cancelButton: translate('confirm.no'),
        confirmButtonClass: 'button',
        cancelButtonClass: 'button -gray',
        confirm: function () {
            $link.trigger('click.byscript'); //namespaced to avoid trigger loop
        }
    });

});