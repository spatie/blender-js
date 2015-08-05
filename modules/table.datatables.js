var $ = require("jquery");
require("datatables");
var translate = require("./interface.translations.js");


//remember form data on crash / reload
$("[data-datatable]").each(function () {

    var $table = $(this);

    //init datatables
    $table.DataTable({
        language: {
            decimal: ",",
            thousands: ".",
            lengthMenu: translate('dataTables.lengthMenu'),
            zeroRecords: translate('dataTables.zeroRecords'),
            info: translate('dataTables.info'),
            infoEmpty: translate('dataTables.infoEmpty'),
            infoFiltered: translate('dataTables.infoFiltered'),
            search: translate('dataTables.search'),
            searchPlaceholder: translate('dataTables.searchPlaceholder')
        },
        stateSave: true,
        paging: false,
        info: true
    })
});