var $ = require('jquery');
require("jquery-ui");
require("jquery-confirm");
require('datatables');

require('blueimp-file-upload/js/jquery.iframe-transport.js');
require('blueimp-file-upload');
require('blueimp-file-upload/js/jquery.fileupload-process.js');
require('blueimp-file-upload/js/jquery.fileupload-validate.js');

var translate = require("./interface.translations.js");


    $.fn.parts = function (options) {

        this.each(function () {


            // Part construction and options
            var parts = constructPartsObjectWithOptions($(this));

            // Populate initial data
            var partData = parseFormJson(parts);

            // read column settings, convert for datatables
            var partColumns = constructColumns(parts);

            //init Datatable
            initDataTable(parts, partData, partColumns);


            //-----------------------------------------------init uploads for adding new rows
            if (parts.options.upload != undefined && !parts.options.readOnly) {
                enableUpload( parts );
            }

            //-----------------------------------------------init adding new rows
            if (parts.options.autocomplete != undefined && !parts.options.readOnly) {
                enableInsert( parts);
            }

            //return this for chaining
            return this;

        })


//------------------------------------------------------------------------------------ construct functions


        function constructPartsObjectWithOptions($textarea){

            var parts = {};

            // General settings
            parts.imagesRegExp = /(\.|\/)(gif|jpe?g|png)$/i;

            parts.$textArea = $textarea;
            parts.options = parts.$textArea.data('parts')!= undefined ? parts.$textArea.data('parts') : {};
            parts.options.readOnly = (parts.$textArea.attr('readonly') != undefined ) ;

            if(!parts.options.debug) parts.$textArea.hide();
            if( parts.options.dataTableOptions == undefined) parts.options.dataTableOptions = {};

            parts.options.dataTableOptions.language = {
                "emptyTable" : translate('dataTables.infoEmpty')
            }

            // Init table in DOM
            parts.$formGroup = $textarea.parents('.parts');
            parts.$table = $('<table class="-parts"></table>').appendTo(parts.$formGroup).addClass(parts.options.readOnly?'-readonly':'');

            return parts;
        }

        function parseFormJson(parts){

            // Get textarea source. Result is an array of part objects
            var partArrayTemp = $.parseJSON(parts.$textArea.val());

            // Be sure get array without irregular index (media/download json input)
            var partArray = [];
            for (var key in partArrayTemp) {
                partArray.push(partArrayTemp[key]);
            }

            // Extend each part object with id for dataTables row id
            return partArray.map(function (part) {

                part.DT_RowId = part[parts.options.primaryKeyName];
                return part;
            });
        }

        function constructColumns(parts){

            var dataColumns = [];

            //options for columns
            for (var key in parts.options.columns) {
                var column = parts.options.columns[key];
                var dataColumn = {};
                dataColumn.data = column.data;
                dataColumn.title = column.title;
                if (column.default) dataColumn.defaultContent = column.default;
                if (column.editable) {
                    //editable column style
                    switch(column.editable)
                    {
                        case 'text':
                            dataColumn.class = "-edit -text";
                            break;
                        case 'integer':
                            dataColumn.class = "-edit -integer";
                            break;
                    }

                }
                if (column.hasLink) {
                    dataColumn.render = function ( data, type, full ) {
                        //open destination from options in new tab
                        var link = eval('full.'+ parts.options.detailLink);
                        return '<a target="_parts" href="'+link+'">'+data+'</a>';
                    }
                }
                //show thumb + link
                if(column.media=='image'){
                    dataColumn.class = 'part_thumb -'+column.media;
                    dataColumn.render = function ( data, type, full ) {
                        return renderImage(data, full);
                    }
                }
                //downloads
                if(column.media=='download'){
                    dataColumn.class = 'part_thumb -'+column.media;
                    dataColumn.render = function ( data, type, full ) {
                        //if image download: render as image
                        var thumbExtensions = ['pdf', 'jpg', 'png'];
                        if(thumbExtensions.indexOf(full.file_name.split('.').pop()) != -1){
                            return renderImage(data, full);
                        }
                        else{
                            var mediaRoot = '/media/' + full.id ;
                            var link = mediaRoot +'/'+ full.file_name;
                            return '<a href="'+link+'" target="media"><div>' + full.file_name.split('.').pop() + '</div></a>';
                        }
                    }
                }
                //styling
                if(column.width){
                    dataColumn.width = column.width;
                }
                dataColumns.push(dataColumn);
            }

            // Add delete column as last
            if(!parts.options.readOnly){
                dataColumns.push({
                    "data": null,
                    "class": "-right",
                    "sortable": false,
                    "defaultContent": "<a href='#' data-delete class='button -small -danger'><span class='fa fa-remove'></span></a>"
                });
            }

            return dataColumns;
        }

        function initDataTable(parts, data, columns){
            // Gather dataTable options
            parts.options.dataTableOptions.data = data;
            parts.options.dataTableOptions.columns = columns;
            parts.options.dataTableOptions.drawCallback = function () { initEditableCells(parts); };
            parts.options.dataTableOptions.paginate = false;
            parts.options.dataTableOptions.sort = false;


            // Init dataTable
            parts.$table.DataTable(parts.options.dataTableOptions);

            // Sort rows?
            makeRowsSortable(parts);

            // edit and delete
            makeRowsInteraction(parts);

        }


//------------------------------------------------------------------------------------ table functions


        function makeRowsSortable(parts){

            if(parts.options.orderRows && !parts.options.readOnly){
                parts.$table.addClass('-sortable');
                $('tbody', parts.$table).sortable({
                    helper : preserveWidthOnDrag,
                    axis: 'y',
                    cancel:  '.dataTables_empty',
                    containment: "parent",
                    stop: function(){
                        updateTextarea(parts);
                    },
                    handle: "td:not('.-edit')" //no drag behaviour on these cells
                })
            }
        }

        function makeRowsInteraction(parts){

            if(!parts.options.readOnly){

                parts.$table
                    // init delete btn for entire table
                    .on('click', 'a[data-delete]', function (e) {
                        e.preventDefault();
                        deleteRow(parts, $(this).closest('tr')[0]);
                        return false;
                    })
                    // no returns on edit field
                    .on('keypress', 'td.-edit', function (e) {
                        if(e.which == 13) $(this).blur();
                    });
            }
        }

        function updateTextarea(parts) {

            var sortedData = calculateRowOrder(parts);

            //read column settings, convert for datatables
            parts.$textArea.val(JSON.stringify(sortedData));

            parts.$textArea.trigger('change'); //autosave update

        }

        function calculateRowOrder(parts){
            var sortedParts = new Array();
            $('tbody tr', parts.$table).each(function(){
                var rowData = parts.$table.DataTable().row( this ).data();
                if(rowData != null) sortedParts.push(rowData);
            });
            return sortedParts;
        }

        function addRow(parts, rowObj, label) {

            if(parts.options.readOnly) return false;

            //clear field
            parts.$addPartField.val('');

            //check if row exist
            var rowId = rowObj.DT_RowId;
            var allRows = parts.$table.DataTable().rows().data();
            for (var i = 0; i < allRows.length; i++) {
                if(allRows[i].id == rowId){
                    writeAlert(parts.options.autocomplete.duplicateLabel, 'error', parts.$addPartAlerts);
                    return false;
                }
            }

            //add row
            var row = parts.$table.DataTable().row.add(rowObj).draw().node();
            $(row).addClass('-added');

            writeAlert( label + ' ' + translate('parts.added'), 'info', parts.$addPartAlerts);
            updateTextarea(parts);

        }

        function deleteRow(parts, row) {

            if(parts.options.readOnly) return false;

            $.confirm({
                title: translate('confirm.text'),
                content: ' ',
                confirmButton: translate('confirm.yes'),
                cancelButton: translate('confirm.no'),
                confirmButtonClass: 'button',
                cancelButtonClass: 'button -gray',
                confirm: function(){
                    parts.$table.DataTable().rows(row).remove().draw();
                    updateTextarea(parts);
                }
            });

            return false;

        }

        function initEditableCells(parts) {

            if(parts.options.readOnly) return false;

            //make cell editable
            $('td.-edit', parts.$table)
                .attr('contenteditable', true)
                .on('focus', function () {
                    var $this = $(this);
                    $this.data('before', $this.text());
                    return $this;
                })
                .on('blur', function () {
                    var $this = $(this);
                    var string = $this.text();
                    var before = $this.data('before');
                    if (before !== string) {

                        if ($this.hasClass('-integer') && !isNormalPositiveInteger(number)) {
                            //reset value
                            $this.text(before);
                            return $this ;
                        }

                        updateCell(this, parts)
                    }
                    return $this;
                });

        }

        function updateCell(cell, parts) {

            if(parts.options.readOnly) return false;

            //update cell data
            parts.$table.DataTable().cell(cell).data( $(cell).text() );

            //push changes to textarea
            updateTextarea(parts);

        }




//------------------------------------------------------------------------------------ upload functions

        function enableUpload(parts){

            constructUploadField( parts );

            var dropZone = enableDropZone( parts);

            var uploadOptions = constructUploadOptions( parts, dropZone );

            // clear errors
            parts.$uploadField.on('click',function(e){
                clearAlerts(parts.$uploadAlerts);
            });

            // init file uploads
            parts.$uploadField.fileupload(uploadOptions)
                .prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');

        }


        function constructUploadField( parts ) {

            //make new input field
            parts.$uploadField = $('<input type="file" name="file" multiple>');
            parts.$uploadMask = $('<span class="button -blue fileinput-button">' + parts.options.upload.label + ' </span>').append(parts.$uploadField);
            parts.$uploadProgress = $('<div class="progress"><div class="progress_bar"></div></div>').hide();
            parts.$uploadAlerts = $('<div class="parts_alerts"></div>');
            parts.$uploadPart = $('<div class="parts_new"></div>').append(parts.$uploadMask,parts.$uploadProgress, parts.$uploadAlerts).appendTo(parts.$formGroup);

            parts.options.upload.errors = [];

        }


        function enableDropZone( parts ){
            //prevent drag on body, only on formgroup
            $(document).bind('drop dragover', function (e) {
                e.preventDefault();
            });
            var dropZone = parts.$formGroup,
                html = $('html'),
                showDrag = false,
                timeout = -1;
            dropZone.bind('dragenter', function () {
                dropZone.addClass('-dropzone');
                showDrag = true;
            }).bind('dragover', function(){
                showDrag = true;
            }).bind('dragleave drop', function (e) {
                showDrag = false;
                clearAlerts(parts.$uploadAlerts);
                clearTimeout( timeout );
                timeout = setTimeout( function(){
                    if( !showDrag ){ dropZone.removeClass('-dropzone'); }
                }, 200 );
            });

            return dropZone;
        }


        function constructUploadOptions( parts, dropZone){

            var uploadOptions =  {url: parts.options.upload.url,
                type: 'POST',
                dataType: 'json',
                dropZone : dropZone,
                formData: {'collection': parts.options.upload.collection,
                    'modelName': parts.options.upload.modelName},
                singleFileUploads: true,
                messages: {
                    maxNumberOfFiles: translate('parts.upload.maxNumberOfFiles'),
                    acceptFileTypes: translate('parts.upload.acceptFileTypes'),
                    maxFileSize: translate('parts.upload.maxFileSize'),
                    minFileSize:  translate('parts.upload.minFileSize')
                }
            };

            if(parts.options.upload.validation.acceptFileTypes == 'images') uploadOptions.acceptFileTypes = parts.imagesRegExp ;
            if(parts.options.upload.validation.maxFileSize > 0) uploadOptions.maxFileSize = parts.options.upload.validation.maxFileSize ;


            //begin of all uploads
            uploadOptions.start = function(e,data){
                parts.$uploadProgress.show();
                parts.$uploadMask.hide();
            };

            //after all uploads finished
            uploadOptions.stop = function (e, data) {
                parts.$uploadProgress.hide();
                parts.$uploadMask.show();
                parts.$uploadProgress.removeClass('-working');
            }

            //progress for all files
            uploadOptions.progressall = function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('.progress_bar',parts.$uploadProgress).css('width',progress + '%');

                if(progress > 96){
                    parts.$uploadProgress.addClass('-working');
                    $('.progress_bar',parts.$uploadProgress).css('width', '1%');
                }
            }

            //one file not suited
            uploadOptions.processfail = function (e, data) {
                var currentFile = data.files[data.index];
                if (data.files.error && currentFile.error) {
                    // there was an error, do something about it
                    var msg = currentFile.error + ': ' + currentFile.name ;
                    writeAlert(msg,'error', parts.$uploadAlerts);
                }
            }

            //one file done
            uploadOptions.done = function (e, data) {
                if(data.result.media){
                    var rowObj = data.result.media;
                    //set ID for row
                    rowObj.DT_RowId = data.result.media.id;

                    var row = parts.$table.DataTable().row.add(rowObj).draw().node();
                    $(row).addClass('-added');
                    updateTextarea(parts);
                }
            }

            //one file error
            uploadOptions.fail = function (e,data) {
                writeAlert( translate('parts.upload.fail') + ' ('+data.errorThrown+')','error', parts.$uploadAlerts);
            }

            return uploadOptions;
        }

//------------------------------------------------------------------------------------ insert functions


        function enableInsert( parts ){

            constructAddPartField( parts );

            //jquery ui autocomplete on new field
            parts.$addPartField.autocomplete({
                source: parts.options.autocomplete.source,
                appendTo: $(".parts_new", parts.$formGroup),
                minLength: parts.options.autocomplete.minLength,
                html: true,
                select: function (event, ui) {
                    //map the autocomplete value to a new row, add neccessary properties

                    var rowObj = new Object();
                    if(parts.options.foreignTableName!=undefined){
                        rowObj[parts.options.foreignTableName] = ui.item.value;
                    }
                    else{
                        rowObj = ui.item.value;
                    }

                    //set ID for row
                    rowObj.DT_RowId = ui.item.value.id;

                    addRow(parts, rowObj, ui.item.label);

                    event.preventDefault();
                    return false;
                },
                focus: function (event, ui) {
                    event.preventDefault();
                    syncAutocompleteField(parts, ui.item.label);
                    return false;
                }

            }).keydown(function (e) {

                //don't submit whole form on enter
                if (e.keyCode == 13) {
                    return false;
                }

                clearAlerts(parts.$addPartAlerts);
            })
        }


        function constructAddPartField( parts ){
            //make new input field
            parts.$addPartField = $('<input placeholder="' + parts.options.autocomplete.placeholder + '" type="text" data-behaviour="autocomplete" class="form-control">');
            parts.$addPartLabel = $('<label>' + parts.options.autocomplete.label + '</label>');
            parts.$addPartAlerts = $('<div class="parts_alerts"></div>');
            parts.$addPart = $('<div class="parts_new"></div>').append(parts.$addPartLabel, parts.$addPartField, parts.$addPartAlerts).appendTo(parts.$formGroup);

        }

        function syncAutocompleteField(parts, label) {
            parts.$addPartField.val(label);
            parts.$addPartLabel.html(parts.options.autocomplete.label);
        }


//------------------------------------------------------------------------------------ interface helpers

        function renderImage(data, full){
            var mediaRoot = '/media/' + full.id ;
            var link = mediaRoot +'/'+ full.file_name;
            return '<a href="'+link+'" target="_blank"><div style="background-image:url(\'' + mediaRoot + '/conversions/admin.jpg\');"></div></a>';
        }

        function preserveWidthOnDrag(e, ui) {
            ui.children().each(function() {
                $(this).width($(this).width());
            });
            return ui;
        };

        function clearAlerts(where){
            where.empty();
        }

        function writeAlert(msg, type, where){

            var css;

            switch(type)
            {
                case 'info':
                    css = "-info";
                    break;
                case 'success':
                    css = "-success";
                    break;
                case 'warning':
                    css = "-warning";
                    break;
                case 'error':
                    css = "-danger";
                    break;

            }

            where.append($('<div class="alert '+ css + '">'+ msg + '</div>'));
        }

//------------------------------------------------------------------------------------Small helpers

        function isNormalPositiveInteger(str) {
            var n = ~~Number(str);
            return String(n) === str && n > 0;
        }

    };

    // Register parts component
    $('textarea[data-parts]').parts();






