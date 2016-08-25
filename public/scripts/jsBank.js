

$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
   // ddlCountry  binding
    var param = JSON.stringify({ action: 'loadall', Id: 0 });
    BindCountry(param);
   /* binding flexi grid data by connecting node url */
    $("#fgrdData").flexigrid({
        dataType: 'json',
        url: "../Bank",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 0,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'Bank Legal Name',
                name: 'BankLegalName',
                width: 200,
                sortable: true,
                align: 'left'
            }, {
                display: 'Company DBA',
                name: 'CompanyDBA',
                width: 200,
                sortable: true,
                align: 'left'
            }, {
                display: 'Address',
                name: 'Address',
                width: 300,
                sortable: true,
                align: 'left'
            }, {
                display: 'Swift Code',
                name: 'SwiftCode',
                width: 100,
                sortable: true,
                align: 'left'
            }, {
                display: 'Country Name',
                name: 'CountryName',
                width: 100,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Agent',
                name: 'User',
                width: 100,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ], 
        
        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked },
        ],
        
        searchitems: [{
                display: 'Bank Legal Name',
                name: 'BankLegalName',
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
        var SelectedID = $("#Id").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: SelectedID.trim() });
        $('.YellowWarning').hide();
        //$('#uid').html(ItemCode);
        $.ajax({
            type: "POST",
            url: '../Bank/' + SelectedID ,
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
        $("#myModalLabel").html('Edit Bank');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
        $("#OldCode").html(SelectedID);
        $.ajax({
            type: "POST",
            url: '../Bank/' + SelectedID ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                
                var item = output[0];
                
                if (item.Id == SelectedID) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#Id").html(item.Id);
                    $("#txtBankLegalName").val(item.BankLegalName);
                    $("#txtCompanyDBA").val(item.CompanyDBA);
                    $("#txtAddress").val(item.Address);
                    $("#txtSwiftCode").val(item.SwiftCode);
                    $("#ddlCountry").val(item.CountryId);
                   
                   
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
    debugger;
    if ($("#txtBankLegalName").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Bank Legal Name ");
        $(".YellowWarning").show();
        $("#txtBankLegalName").focus();
        
        return false;
    }
    if ($("#txtAddress").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Address ");
        $(".YellowWarning").show();
        $("#txtAddress").focus();
        
        return false;
    }
    if ($("#txtSwiftCode").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Swift Code ");
        $(".YellowWarning").show();
        $("#txtSwiftCode").focus();
        
        return false;
    }
    if ($("#ddlCountry").val() == "0") {
        $(".YellowWarning").html("Please Select Country Name ");
        $(".YellowWarning").show();
        $("#ddlCountry").focus();
        
        return false;
    }
   
   
    
   return true;

}
/* insert new record by ajax post method */
function Save() {
    
    if (validate()) {
        debugger;
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'save', Id: $("#Id").val().trim(), BankLegalName: $("#txtBankLegalName").val().trim(),CompanyDBA: $("#txtCompanyDBA").val().trim(), Address: $("#txtAddress").val().trim(), SwiftCode: $("#txtSwiftCode").val().trim(), CountryId: $("#ddlCountry :selected").val()});
        xhr = $.ajax({
            type: "POST",
            url: "../Bank/save",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp)
            {
                if (msg.status == "saved") {
                $('#EntryModal').modal('hide');

                $("#mmsg").html("Saved successfully...");
                $("#mmsg").css("color", "green");
                $("#MessageModal").modal("show");
                $("#fgrdData").flexReload({ url: "../Bank" });
                result = msg;
                cancelAdd();
            }
                    else if (msg.status == "ER_DUP_ENTRY") {
                $("#ptitle").html("Warning");
                $("#mmsg").html(" Bank : " + $("#txtBankLegalName").val() + " Already exists ");
                $("#mmsg").css("color", "red");
                $("#MessageModal").modal("show");
                $("#txtBankLegalName").focus();
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
        var jsondataResource = JSON.stringify({ action: 'edit', BankLegalName: $("#txtBankLegalName").val().trim(), CompanyDBA: $("#txtCompanyDBA").val().trim(), Address: $("#txtAddress").val().trim(), SwiftCode: $("#txtSwiftCode").val().trim(), CountryId: $("#ddlCountry :selected").val(), Id: $("#Id").html() });
        xhr = $.ajax({
            type: "POST",
            url: "../Bank/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
                
                $('#EntryModal').modal('hide');
                $("#mmsg").html("updated successfully...");
                $("#MessageModal").modal("show");
                
                $("#fgrdData").flexReload({ url: "../Bank" });
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
    $("#txtBankLegalName").val('');
    $("#txtCompanyDBA").val('');
    $("#txtAddress").val('');
    $("#txtSwiftCode").val('');
    $("#ddlCountry").val(0);
    $('#EntryModal').modal('hide');
}
/* Clear all controls & open entry dialog when add button clicked */
function addclicked(com, grid) {
    $("#myModalLabel").html('Add Bank');
    $("#Id").html('');
    $("#txtBankLegalName").val('');
    $("#txtCompanyDBA").val('');
    $("#txtAddress").val('');
    $("#txtSwiftCode").val('');
    $("#ddlCountry").val(0);
    $('#EntryModal').modal('show');
    $(".YellowWarning").hide();
    $(".Warning").hide();
}
function BindCountry(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Constant/GetCountryData",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            debugger;
            $('#ddlCountry').empty();
            $('#ddlCountry').append('<option selected="selected" value="0">---select---</option>');
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlCountry").append($("<option></option>").val(Result[i].Id).html(Result[i].CountryName));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}



//End Function