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
        url: "../PaymentTerms",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 0,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'Type',
                name: 'Type',
                width: 450,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ],
        
        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked }
        ],
        
        searchitems: [{
                display: 'Type',
                name: 'Type',
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
        var Id = $("#Id").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: Id.trim() });
        $('.YellowWarning').hide();
        $.ajax({
            type: "POST",
            url: '../PaymentTerms/' + Id ,
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
                else{
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
                }}
            },
            error: function (err) {
                        
            }
        });

    });
    
    /* Code for get &  set Unique ID to html span control & show confirm dialog  when delete link click */
    $("[id^=griddelete_]").live("click", function () {
        debugger;
        var sourceCtl = $(this);
        $("#Id").val(sourceCtl.attr('id').substring(11));
        
        $('#DeleteModal').modal('show');
        
    });
 
    /* set db data to all Controls when edit click */
    $("[id^=gridedit_]").live("click", function () {
       
        $("#pleaseWaitDialog").modal("show");
        $("#myModalLabel").html('Edit Payment Term');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var Id = sourceCtl.attr('Id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: Id.trim() });
        $("#OldCode").html(Id);
        $.ajax({
            type: "POST",
            url: '../PaymentTerms/' + Id ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                
                var item = output[0];
                
                if (item.Id == Id) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#Id").html(item.Id);
                    $("#txtType").val(item.Type);
                  
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
    //save validation
    function validate() {
        if ($("#txtType").val() == "") {
            $(".YellowWarning").html("Enter Valid Terms ");
            $(".YellowWarning").show();
            $("#txtType").focus();
            
            return false;
        }
        return true;
    }
    /* insert new record by ajax post method */
    function Save() {
        if (validate()) {
            var xhr;
            var jsondataResource = JSON.stringify({ action: 'save', Id: $("#Id").html().trim(), Type: $("#txtType").val().trim() });
            xhr = $.ajax({
                type: "POST",
                url: "../PaymentTerms/save",
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
                        $("#fgrdData").flexReload({ url: "../PaymentTerms" });
                        result = msg;
                        cancelAdd();
                    }
                    else if (msg.status == "ER_DUP_ENTRY") {
                        $("#ptitle").html("Warning");
                        $("#mmsg").html(" Payment Terms  : " + $("#txtType").val() + " Already exists ");
                        $("#mmsg").css("color", "red");
                        $("#MessageModal").modal("show");
                        $("#txtType").focus();
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
        debugger;
        if (validate()) {
            var xhr;
         //   var jsondataResource = JSON.stringify({ action: 'edit', Terms: $("#txtType").val().trim(), Id: $("#Id").html() });
            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#Id").html().trim(), Type: $("#txtType").val().trim() });

            xhr = $.ajax({
                type: "POST",
                url: "../PaymentTerms/transact",
                data: jsondataResource,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {

                    $('#EntryModal').modal('hide');
                    $("#mmsg").html("Updated successfully...");
                    $("#MessageModal").modal("show");

                    $("#fgrdData").flexReload({ url: "../PaymentTerms" });
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
        $("#Id").html('');
        $("#txtType").val('');
        $('#EntryModal').modal('hide');
    }
  

    /* Clear all controls & open entry dialog when add button clicked */
    function addclicked(com, grid) {
        $("#myModalLabel").html('Add Payment Terms');
        $("#Id").html('');
        $("#txtType").val('');
        $('#EntryModal').modal('show');
        $(".YellowWarning").hide();
        $(".Warning").hide();
    }
 			
});