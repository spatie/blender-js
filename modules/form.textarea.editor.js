var ß = require('./../blender.js');

ß.editor = function($textarea) {
    var apiUrl = '/blender/api/media?redactor=true';

    function triggerChange() {
        $textarea.trigger('change');
    }

    $textarea.redactor({
        imageUpload : apiUrl,
        imageManagerJson: apiUrl,
        plugins: ['imagemanager', 'video'],
        changeCallback: triggerChange,
        codeKeydownCallback: triggerChange
    });
}

$('[data-redactor], [data-editor]').each(() => {
    var $textarea = $(this);

    if ($textarea.data('redactor')) {
        console.warn('[data-redactor] is depricated and is to be replaced by [data-editor]');
    }

    ß.editor($textarea);
});

module.exports = ß.editor;
