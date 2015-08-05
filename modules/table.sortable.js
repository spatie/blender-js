var $ = require("jquery");
require("jquery-ui");

$.fn.sortableRows = function (options) {

    this.each(function () {

        var table = $(this);
        table.addClass('-sortable');

        $('tbody', table).sortable({
            helper: preserveWidthOnDrag,
            axis: 'y',
            cancel: '[data-sortable=disabled]',
            containment: "parent",
            update: function (e, ui) {
                var url = table.data('sortable');
                var method = 'patch';

                //serialize whole table
                var data = {
                    '_method': method,
                    'ids': rowsToArray(table)
                }

                $.ajax({
                    type: 'POST',
                    data: data,
                    url: url,
                    success: function (response, textStatus, jqXhr) {
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error("The following error occured: " + textStatus, errorThrown);
                    }
                });
            }
        });

    });

    //return this for chaining
    return this;

    //----------------------------shared functions
    function rowsToArray(table) {
        var rows = new Array();
        $('tbody tr', table).each(function () {
            rows.push($(this).data('row-id'));
        });
        return rows;
    }

    function preserveWidthOnDrag(e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    }

};

//initialization
$("table[data-sortable]").sortableRows();








