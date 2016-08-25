
$(document).ready(function () {
    debugger;
    $('.modal ').insertAfter($('body'));
    
   
    /* binding flexi grid data by connecting node url */
    $("#fgrdData").flexigrid({
        
        dataType: 'json',
        url: "../CreditId",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 100,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'Lca No',
                name: 'LcaNo',
                width: 350,
                sortable: true,
                align: 'left'
            }, {
                display: 'Etc Lca No',
                name: 'EtcLcaNo',
                width: 350,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ], 
        
        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked },
        ],
        
        searchitems: [{
                
                display: 'Lca No',
                name: 'LcaNo',
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
    
    
    
    
    //Events
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
    /* delete process by ajax post after confirm delete clicked */
    $("#btnMDelete").live("click", function () {
        debugger;
        var SelectedID = $("#Id").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: SelectedID.trim() });
        $('.YellowWarning').hide();
        //$('#uid').html(ItemCode);
        $.ajax({
            type: "POST",
            url: '../CreditId/' + SelectedID ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output) {
                
                $("#DeleteModal").modal("hide");
                $("#fgrdData").flexReload({ url: '/url/for/refresh' });
                $("#mmsg").html("Deleted successfully...");
                $("#MessageModal").modal("show");
                
                
                if (output.d == 'valid') {
                           
                }
                else {
                          // $("#DeleteConform").dialog("close");
                           // $("#msg").html("There was an error during save the details!");
                           // $("#msgbox-select").dialog("open");
                }
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
        debugger;
        
        $("#pleaseWaitDialog").modal("show");
        $("#myModalLabel").html('Edit Credit Id');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
        $("#OldCode").html(SelectedID);
        $.ajax({
            type: "POST",
            url: '../CreditId/' + SelectedID ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                
                var item = output[0];
                
                if (item.Id == SelectedID) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#Id").html(item.Id);
                    $("#txtLcaNo").val(item.LcaNo);
                    $("#txtEtcLcaNo").val(item.EtcLcaNo);
                   
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
    
    //End Events
 			
});

//Function
//save validation
function validate() {
    
    if ($("#txtLcaNo").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Lca No ");
        $(".YellowWarning").show();
        $("#txtLcaNo").focus();
        
        return false;
    }
    return true;

}
/* insert new record by ajax post method */
function Save() {
    debugger;
    if (validate()) {
        
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'save', Id: $("#Id").html().trim(), LcaNo: $("#txtLcaNo").val().trim(), EtcLcaNo: $("#txtEtcLcaNo").val() });
        xhr = $.ajax({
            type: "POST",
            url: "../CreditId/save",      
            data: jsondataResource ,
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
                    $("#fgrdData").flexReload({ url: "../CreditId" });
                    result = msg;
                    cancelAdd();
                }
                else if (msg.status == "ER_DUP_ENTRY") {
                    $("#ptitle").html("Warning");
                    $("#mmsg").html(" CreditId  : " + $("#txtLcaNo").val() + " Already exists ");
                    $("#mmsg").css("color", "red");
                    $("#MessageModal").modal("show");
                    $("#txtLcaNo").focus();
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
        var jsondataResource = JSON.stringify({ action: 'edit',  LcaNo: $("#txtLcaNo").val(), EtcLcaNo: $("#txtEtcLcaNo").val(), Id: $("#Id").html() });
        xhr = $.ajax({
            type: "POST",
            url: "../CreditId/transact",      
            data: jsondataResource ,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
                
                $('#EntryModal').modal('hide');
                $("#mmsg").html("updated successfully...");
                $("#MessageModal").modal("show");
                
                $("#fgrdData").flexReload({ url: "../CreditId" });
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
    
    $("#txtLcaNo").val('');
    $("#Id").html('');
    $("#txtEtcLcaNo").val('');
    $('#EntryModal').modal('hide');
}
/* Clear all controls & open entry dialog when add button clicked */
function addclicked(com, grid) {
    debugger;
    
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "../Common/LcaNoGenerate",
        data: "{}",
        dataType: "json",
        success: function (data) {
            debugger;
            if (data.LcaNo != "") {
                $("#txtLcaNo").val(data.LcaNo);
            
            }
           
        },
        error: function (result) {
            debugger;
            alert("Error"+ result);
        }
    });
    

    $("#myModalLabel").html('Add Credit Id');
    $("#Id").html('');
    // $("#txtLcaNo").val('');
    $("#txtEtcLcaNo").val('');
    $('#EntryModal').modal('show');
    $(".YellowWarning").hide();
    $(".Warning").hide();
}


     
//End Function