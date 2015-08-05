// Autosave form input
var $ = require('jquery');
require('sisyphus.js');
var translate = require("./interface.translations.js");


$("form[data-autosave]").each(function () {
    var $form = $(this);

    //construct warning
    var $erase = $('<a href="#">' + translate('sisyphus.revert') + '</a>').on('click', function (e) {
        e.preventDefault();
        $form.sisyphus().manuallyReleaseData();
        window.location.reload();
    });
    var $warn = $('<div class="alert -warning">' + translate('sisyphus.warn') + ' </div>').append($erase);

    //init sisyphus
    $form.sisyphus({
        onRestore: function () {
            $form.before($warn);
        }
    });
});