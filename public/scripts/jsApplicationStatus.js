

$(document).ready(function () {
   
    $('.modal ').insertAfter($('body'));
    $("#btncancel").click(function () {

        cancelAdd();
    });

    /* choose save or update method whecn click save */
    $("#btnsave").click(function () {

        if ($("#Id").html().trim() != "") {

            Edit();
          
        }
        else {
            Save();
        }

    });

    /* binding flexi grid data by connecting node url */
    $("#fgrdData").flexigrid({

        dataType: 'json',
        url: "../ApplicationStatus",
        colModel: [{
            display: 'Id',
            name: 'Id',
            width: 0,
            hide: true,
            sortable: true,
            align: 'center'
        }, {
                display: 'Application Status',
                name: 'Status',
                width: 250,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ],

        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked }],

        searchitems: [{
            display: 'Status',
                name: 'Status',
                isdefault: true

        }],
        sortname: "Id",
        sortorder: "asc",
        usepager: true,

        useRp: true,
        rp: parseInt(($(window).height() - 380) / 26),
        showTableToggleBtn: true,

        height: $(window).height() - 380,

    });

      /* delete process by ajax post after confirm delete clicked */
    $("#btnMDelete").live("click", function () {
        var SelectedID = $("#Id").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: SelectedID.trim() });
        $('.YellowWarning').hide();
        $.ajax({
            type: "POST",
            url: '../ApplicationStatus/' + SelectedID,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output) {
                if (output.status.indexOf("ER_ROW_IS_REFERENCED") > -1) {
                    $("#ptitle").html("Warning");
                    $("#mmsg").html("Can't delete. this record is  referred in another page.");
                    $("#mmsg").css("color", "red");
                    $("#MessageModal").modal("show");
                    $("#DeleteModal").modal("hide");
                }
                else {
                    $("#DeleteModal").modal("hide");
                    $("#fgrdData").flexReload({ url: '/url/for/refresh' });
                    $("#mmsg").html("Deleted successfully...");
                    $("#MessageModal").modal("show");
                    $("#mmsg").css("color", "green");
                    
                    
                    if (output.d == 'valid') {

                    }
                    else {
                    // $("#DeleteConform").dialog("close");
                    // $("#msg").html("There was an error during save the details!");
                    // $("#msgbox-select").dialog("open");
                    }
                }
            },
            error: function (err) {

            }
        });

    });

    /* Code for get &  set Unique ID to html span control & show confirm dialog  when delete link click */
    $("[id^=itemdelete_]").live("click", function () {
        var sourceCtl = $(this);
        $("#Id").val(sourceCtl.attr('id').substring(11));
        $('#DeleteModal').modal('show');

    });



    /* set db data to all Controls when edit click */
    $("[id^=itemedit_]").live("click", function () {
        $("#pleaseWaitDialog").modal("show");
        $("#myModalLabel").html('Edit Application Status');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
        $("#OldCode").html(SelectedID);
        $.ajax({
            type: "POST",
            url: '../ApplicationStatus/' + SelectedID,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                var item = output[0];
                if (item.Id == SelectedID) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#Id").html(item.Id);
                    $("#txtStatus").val(item.Status);
                }
                else {
                    //  $("#msg").html("Unable to get the item details, please contact site admin.");
                    //  $("#msgbox-select").dialog("open");
                }
            },
            error: function (e) {
                // $("#msg").html("OOPS! Something went wrong, please contact site administrator.");
                // $("#msgbox-select").dialog("open");
            }
        });
    });
});


      //save validation
    function validate() {

        if ($("#txtStatus").val() == "") {
            $(".YellowWarning").html("Enter Valid Application Status");
            $(".YellowWarning").show();
            $("#txtStatus").focus();

            return false;
        }
      
        return true;

    }

    /* insert new record by ajax post method */
    function Save() {

        if (validate()) {
            debugger;
            var xhr;
           
            var jsondataResource = JSON.stringify({ action: 'save', uid: $("#Id").val().trim(), Status: $("#txtStatus").val().trim()});
            xhr = $.ajax({
                type: "POST",
                url: "../ApplicationStatus/save",
                data: jsondataResource,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {
                    debugger;
                    if (msg.status == "saved") {
                        $('#EntryModal').modal('hide');

                        $("#mmsg").html("Saved successfully...");
                        $("#mmsg").css("color", "green");
                        $("#MessageModal").modal("show");
                        $("#fgrdData").flexReload({ url: "../ApplicationStatus" });
                        result = msg;
                        cancelAdd();
                    }
                    else if (msg.status == "ER_DUP_ENTRY") {
                        $("#ptitle").html("Warning");
                        $("#mmsg").html(" Application Status : " + $("#txtStatus").val() + " Already exists ");
                        $("#mmsg").css("color", "red");
                        $("#MessageModal").modal("show");
                        $("#txtStatus").focus();
                    }

                },
                error: function (err) {
                    alert('error :' + err);

                }


            });

            return xhr;
        }
    }

      /* update record by ajax post method */
    function Edit() {
        if (validate()) {
            var xhr;
            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#Id").html().trim(), Status: $("#txtStatus").val().trim()});
            xhr = $.ajax({
                type: "POST",
                url: "../ApplicationStatus/transact",
                data: jsondataResource,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {

                    $('#EntryModal').modal('hide');
                    $("#mmsg").html("Updated successfully...");
                    $("#MessageModal").modal("show");

                    $("#fgrdData").flexReload({ url: "../ApplicationStatus" });
                    result = msg;
                    cancelAdd();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('error')

                }
            });

            return xhr;
        }
    }
       /* clear all html controls when cancel click */
    function cancelAdd() {
        $("#txtStatus").val('');
     
        $("#Id").html('');      
        $('#EntryModal').modal('hide');
    }

      /* Clear all controls & open entry dialog when add button clicked */
    function addclicked(com, grid) {
        $("#myModalLabel").html('Add Application Status');
        $("#txtStatus").val('');
        $("#Id").html('');      
        $('#EntryModal').modal('show');
        $(".YellowWarning").hide();
        $(".Warning").hide();
    }
    
    
   

   
