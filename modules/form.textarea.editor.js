var ß = require('./../blender.js');

ß.editor = function($textarea) {

    var apiUrl = $textarea.data('redactor-medialibrary-url')

    function triggerChange() {
        $textarea.trigger('change');
    }

    $textarea.redactor({
        formatting: ['p', 'h1', 'h2', 'h3', 'blockquote'],
        imageUpload: apiUrl + '&redactor=true',
        imageManagerJson: apiUrl,
        pastePlainText: true,
        plugins: ['imagemanager', 'video'],
        changeCallback: triggerChange,
        codeKeydownCallback: triggerChange
    });
}

$(function() {
    $('[data-redactor], [data-editor]').each(function(i, el) {
        var $textarea = $(el);

        if ($textarea.data('redactor')) {
            console.warn('[data-redactor] is depricated and is to be replaced by [data-editor]');
        }

        ß.editor($textarea);
    });
});

module.exports = ß.editor;
