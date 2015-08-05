var $ = require('jquery');
require('jquery.mousewheel');
require('select2');
require('select2/dist/js/i18n/en.js');


//normal select
$("[data-select=select]").select2({
    minimumResultsForSearch: Infinity
});

//extendable tags
$("[data-select=tags]").select2({
    tags: true,
    tokenSeparators: [',']
});


//freetext
$("[data-select=free]").select2({
    tags: true
});

//select with search
$("[data-select=search]").select2({});



