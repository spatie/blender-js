// Autosave form input
var $ = require('jquery')
require('sisyphus.js')
var translate = require("./interface.translations.js")

$("form[data-autosave]").each(function () {
    var $form = $(this)

    var $erase = $('<a href="?revert=1">'+translate('sisyphus.revert')+'</a>')
        .on('click', function (e) {
            e.preventDefault()
            $form.sisyphus().manuallyReleaseData()
            window.location = $(this).attr('href')
        })

    var $warn = $('<div class="alert -warning" data-autosave-warn>'+translate('sisyphus.warn')+'</div>').append($erase)

    // Add the function to the DOM node so it can be called externally
    $form[0].addDraftWarning = function() {

        // Prevent duplicate warnings
        if ($('[data-autosave-warn]').length) {
            return
        }

        $form.before($warn)
    }

    // Init sisyphus
    $form.sisyphus({
        onRestore: $form[0].addDraftWarning
    })
})
