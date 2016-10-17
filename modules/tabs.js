var $ = require('jquery');
require("jquery-ui/ui/widgets/tabs");

var $tabs = $('[data-tabs]');

if ($tabs.length > 0) {
    var key = 'tab-on-' + $tabs.parents('form').attr('action');
    var dataStore = window.localStorage;
    var previousTab = 0;
    try {
        previousTab = dataStore.getItem(key);
    }
    catch (e) {
        previousTab = 0;
    }

    $tabs.tabs({
        active: previousTab,
        activate: function(event, ui) {
            var activeTab = ui.newTab.parent().children().index(ui.newTab);
            dataStore.setItem(key, activeTab);
        },
    });
}
