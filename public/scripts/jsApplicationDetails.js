
var applicationid = "";

$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
   
   /* binding flexi grid data by connecting node url */
   
    $("#fgrdData").flexigrid({
        dataType: 'json',
        url: "../ApplicationDetails",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 0,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'Application No',
                name: 'LcaNo',
                width: 90,
                sortable: true,
                align: 'left'
            },{
                display: 'Payment Terms',
                name: 'PaymentTermsType',
                width: 90,
                sortable: true,
                align: 'left'
            }, {
                display: 'Currency',
                name: 'Currency',
                width: 55,
                sortable: true,
                align: 'left'
            },  {
                display: 'Ship by',
                name: 'Through',
                width: 50,
                sortable: true,
                align: 'left'
            }, {
                display: 'Frieght Charge',
                name: 'FrieghtChargeType',
                width: 90,
                sortable: true,
                align: 'left'
            }, {
                display: 'Insurance',
                name: 'InsuranceType',
                width: 60,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Status',
                name: 'Status',
                width: 50,
                sortable: true,
                align: 'left'
            }, {
                display: 'Amount',
                name: 'CreditAmountRequested',
                width: 50,
                sortable: true,
                align: 'left'
            },
            
            {
                display: 'PartialShipment',
                name: 'PartialShipment',
                width: 85,
                sortable: true,
                align: 'left'
            }, {
                display: 'Transhipment',
                name: 'TranShipment',
                width: 83,
                sortable: true,
                align: 'left'
            }, {
                display: 'ExpirationDate',
                name: 'ExpirationDate',
                width: 85,
                sortable: true,
                align: 'left'
            }, {
                display: 'LatestShipment',
                name: 'LatestShipment',
                width: 85,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Port of Loading',
                name: 'PortOfLoading',
                width: 80,
                sortable: true,
                align: 'left'
            }, {
                display: 'Port of Discharge',
                name: 'PortOfDischarge',
                width: 80,
                sortable: true,
                align: 'left'
            },  {
                display: 'Transferable',
                name: 'Transferable',
                width: 70,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Confirmation',
                name: 'ConfirmationInstructions',
                width: 70,
                sortable: true,
                align: 'left'
            },
           
            {
                display: 'User',
                name: 'User',
                width: 50,
                sortable: true,
                align: 'left'
            }, 
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ], 
        buttons: [
            { name: 'download', bclass: 'download', onpress: downloadclicked }
        ],
        
        
        
        searchitems: [{
                display: 'Port Of Loading',
                name: 'PortOfLoading',
                isdefault: true
               },{
               display: 'Port Of Discharge',
               name: 'PortOfDischarge',
              
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
        debugger;

        var SelectedID = $("#Id").val();
       
        var jsondataResource = JSON.stringify({ action: 'delete', Id: applicationid});
        $('.YellowWarning').hide();
        //$('#uid').html(ItemCode);
        $.ajax({
            type: "POST",
            url: '../ApplicationDetails/' + applicationid ,
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
       // $("#Id").val(sourceCtl.attr('id').substring(11));
        applicationid = sourceCtl.attr('id').substring(11);
        

        $('#DeleteModal').modal('show');
        
    });
    /* set db data to all Controls when edit click */

    $("[id^=gridedit_]").live("click", function () {
        debugger;
        $("#pleaseWaitDialog").modal("show");
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        window.location = '../LetterOfCredit?Id='+SelectedID;
      
    });
   
    //End Events

});
//Function
/* update record by ajax post method */
function Edit() {
    debugger;
 
    if (validate()) {
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'edit', LegalName: $("#txtLegalName").val().trim(), CompanyDBA: $("#txtCompanyDBA").val().trim(), Address: $("#txtAddress").val().trim(), CountryId: $("#ddlCountry :selected").val(), RefLedgerId: $("#ddlRefLedger :selected").val(), Id: $("#Id").html() });
        xhr = $.ajax({
            type: "POST",
            url: "../Benificiary/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
                
                $('#EntryModal').modal('hide');
                $("#mmsg").html("updated successfully...");
                $("#MessageModal").modal("show");
                $("#fgrdData").flexReload({ url: "../Benificiary" });
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

function downloadclicked(com, grid) {
    var w = window.open('reports\\GeneratingPDF.html');
    w.location = "reports\\ApplicationList.pdf";

}
//End Function



