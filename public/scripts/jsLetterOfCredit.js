
var ApplicationId = getParameterByName('Id');
var param = JSON.stringify({ action: 'loadall', Id: 0 });
var iscomplete;
var Formdata = new FormData();
var newArr = new Array();
var documenttypeArr=new Array();
var count = 0;
var isupload = false;
 

var currtDate = GetCurrentDate();
$(document).ready(function () {
    $("#pleaseWaitDialog").modal("show");

    $('.modal ').insertAfter($('body'));
    $('.YellowWarning').hide();
    $(function () {
        
        $("#dtpLatestShipment").datepicker();
        $("#dtpExpirationDate").datepicker();
        $("#dtpCreatedDate").datepicker();
        if (ApplicationId == "") {
            ShowApplicationId();
           
            //fill default values
            $('#dtpLatestShipment').datepicker("setDate", currtDate);
            $('#dtpExpirationDate').datepicker("setDate", currtDate);
            $('#dtpCreatedDate').datepicker("setDate", currtDate);

            $('#txtpresentDocument').val('14');
            $('#txtTolerance').val('0');
            $('#btnDownload').hide();   
        }
        else {
            $('#btnDownload').show() 
        }


    });
    // dropdown  binding
    GetApplicantDetails();  //get Applicant Details
    BindDocumentType(param);
    BindPaymentTerms(param);

    //BindGetCurrency(param);
    //BindIncoterms(param);
    //BindShipBy(param);
    //BindFreightCharges(param);
    //BindInsurance(param);
    //BindApplicationStatus(param);
    //BindBank(param);
    //BindBenificiary(param);

    // fill currency symbol
    $("#ddlCurrency").change(function () {
        
        
        
       
        var SelectedID = $("#ddlCurrency :selected").val();
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
          $.ajax({
            type: "POST",
            url: '../Currency/' + SelectedID ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                
                var item = output[0];
                
                if (item.CurrencySymbol ==null) {
                 
                    $("#lblSymbol").text('');
                }
                else {
                   
                    $("#lblSymbol").text(item.CurrencySymbol);
                }
            },
            error: function (e) {

              
            }
        });
  
      
    });
  
    
    //allow number only
    $("#txtpresentDocument").keypress(function (event) {
        return isNumberKey(event, this);
    });
   
    //allow decimal point
    $("#txtCreditAmountRequested").keypress(function (event) {
        
      return isDecimal(event, this);
      
    });
   
    //allow Percentage
    $("#txtTolerance").keypress(function (txtValue) {
        
       return isPercentage(event, this);
       
    });
  //allow number and text only
    $('#txtETCNumber').keypress(function (e) {   
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        
        e.preventDefault();
        return false;
    });
   
    //file upload
    $('#file').on('change', function () {
        debugger;
        var i;
        var chosefilename = $('#file').get(0).files[0].name;
        var size = $('#file').get(0).files[0].size;
        var type = $('#file').get(0).files[0].type;
        var dff = type.toLowerCase().indexOf("image");
        var documenttypeId = $("#ddlDocument :selected").val();
        
        if ($("#ddlDocument").val() == '0') {
            $("#mmsg").html("Please Select Upload file type");
            $("#MessageModal").modal("show");
            $('#file').val('');
            
            return;
        }
        
       else if ($('#file').get(0).files[0].size >5242880 ) // allow file size upto 5mb (1024*1025*5)
         { 
            $("#mmsg").html("File size is Greater than 5MB");
            $("#MessageModal").modal("show");
            $('#file').val('');
            return;
          
        }
       // else if (type.toLowerCase().indexOf("image")< 0 ||  $('#file').get(0).files[0].type != "application/pdf") 
       //// else if ($('#file').get(0).files[0].type != "application/pdf" ) // allow file  type is (pdf and image file)
       // {
       //     $("#mmsg").html("Invalid file.Only allow image and PDF files");
       //     $("#MessageModal").modal("show");
       //     $('#file').val('');
       //     return;
       // }
        // check file is already appended
        var table = document.getElementById("tblFile");
        var tmpfilename;
        var filename;
        debugger;
        for (var i = 0, row; row = table.rows[i]; i++) {
                    filename = table.rows[i].cells[0].textContent
                    tmpfilename = filename;
                    tmpfilename = tmpfilename.split(": ");
                    filename = tmpfilename[1];
                    if (chosefilename.trim() == filename.trim()) {
                    $("#mmsg").html("File is already Uploaded");
                    $("#MessageModal").modal("show");
                    $('#file').val('');
                    return;
                
            }
        }
       
        //add file in form data
       var files = $('input[type=file]')[0].files;   
        jQuery.each(jQuery('#file')[0].files, function (i, file) {
            
            //Formdata.append('file', file);
            Formdata.append('filetype', $("#ddlDocument option:selected").text());
           
        });
      
       
        count = count + 1;
        var buttonid = "b" + count;
        var documenttype = $("#ddlDocument option:selected").text();
        $("#tblFile").append('<tr id=' + count + ' ><td>' + documenttype + ": " + filename + ' </td> <td> <input type="button"  id="' + buttonid + '" value="X" style="font-size: 14px;background: #64a0bc; color: white;"  onclick="RemoveFile(this);" />   </td></tr>');
      
        //append file in array list 
        jQuery.each(jQuery('#file')[0].files, function (i, file) {
            
            newArr.push(file);
            documenttypeArr.push(documenttypeId);
            });
       
       
});


    
    $("#btnFileUpload").click(function () {
        debugger;
        //append selected file in from data 

        if (newArr.length > 0) {
            for (var i = 0; i < newArr.length; i++) {
                Formdata.append('file', newArr[i]);
                Formdata.append('documenttypeId', documenttypeArr[i]);
                 

            }
        }
       
       
        
    });
    
    $("#btnDownloadAll").click(function () {
        debugger;
        $('.bs-example-modal-sm').modal('show');
        $('table#tblFileDownloadAll tr').remove();
        
       var downloadallid;
        var xhr;
        
        var jsondataResource = JSON.stringify({ action: 'DownloadAll', Id: $("#txtApplicationNumber").val() });
        xhr = $.ajax({
            type: "POST",
            url: "../ApplicationDetails/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (data, textStatus, xmlHttp) {
                $('.bs-example-modal-sm').modal('hide');
                debugger;
                if (data != null) {
                       $("#tblFileDownloadAll").append('<tr> <td  align="right"> <a target="_blank" download class="achdownload"  id="downloadall_1" href=../zip/' + data.FolderName + '><img src="css/images/zip.png" style="max-width: 25%; " /></a></td>  </tr>');
                   
                     
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                debugger;
                alert('error')

            }
        });
        
        return xhr;
   
        
    });
    
    //Events
    $("#btncancel").click(function () {
        ShowApplicationId();
        cancelAdd();
    });
    $("#btnSubmit").click(function () {
        
        
        if (validate()) {
            
            iscomplete = 1;
            if (ApplicationId == "") {
                Save();
           

            }
            else if (ApplicationId != "") {
                $('.YellowWarning').hide();
                Edit();

            }
        }
    });
   
    /* choose save or update method whecn click save */
    $("#btnsave").click(function () {
      
        if (validate())
        {
            
            iscomplete = 1;
        }
        else  {
            
            iscomplete = 0;
        }
        if (partialValidate()) {
            if (ApplicationId == "") {
                Save();
           

            }
            else if (ApplicationId != "") {
                $('.YellowWarning').hide();
                Edit();

            }
        }

           

    });
    

  
     
    //End Events

});
//Function

 
function RemoveFile(id) {
    debugger;
   
    var table = document.getElementById("tblFile");
    var rowid = id.id.replace("b", "");
    var tmpfilename;
    var filename;
    tmpfilename = $('table#tblFile tr#' + rowid + ' td').html();
    tmpfilename = tmpfilename.split(": ");
    filename = tmpfilename[1];

    //remove file from database and file folder
    if (id.name  != "") {
        var fileid = id.name;
        var jsondataResource = JSON.stringify({ action: 'deletesinglefile', applicationno: $("#txtApplicationNumber").val(),fileid: fileid,filename: filename });
         $.ajax({
            type: "POST",
            url: "../LetterOfCredit/deletefile",
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                debugger;
                $("#mmsg").html("File Removed Sucessfully...");
                $("#MessageModal").modal("show");
               
            },
            error: function (e) {
               
            }
        });


}
    //Remove table row
    $('table#tblFile tr#' + rowid + '').remove();
   
    //remove file from array object
    var i;
    
    for (i = 0; i < newArr.length; i++) {
        var fname = newArr[i].name;
        if (fname.trim() == filename.trim()) {
            
            newArr.splice(i, 1);
            documenttypeArr.splice(i, 1);
        }
    
    }
   
}

function showUploaderPopup() {
    debugger;
    $("#FileUpload").modal("show");
    if (ApplicationId != "") {
        SelectExistUploadFile();
    }
     
}
function showDownloadPopup() {
    debugger;
    $("#FileDownload").modal("show");
   // $('table#tblFileDownload tr#').remove();
    $('#tblFileDownload tr').remove();
    $('#tblFileDownloadAll tr').remove();
    
    var xhr;
    var item;
    var jsondataResource = JSON.stringify({ action: 'Download', Id: $("#txtApplicationNumber").val()});
    xhr = $.ajax({
        type: "POST",
        url: "../ApplicationDetails/transact",
        data: jsondataResource,
        contentType: 'application/json', // content type sent to server
        dataType: 'json', // Expected data format from server
        processdata: true, // True or False
        crossDomain: true,
        success: function (data, textStatus, xmlHttp) {
            debugger;
            if (data != null) { 
                item = data[0];
                var LocId = getParameterByName('Id');
                for (i = 0; i < item.length; i++) {
                    $("#tblFileDownload").append('<tr><td>' + item[i].DocumentType + ' </td><td> <a target="_blank" download class="achdownload" style="color: #00f;" id=a'+i+' href="../Files/' + item[i].applicationId +'/' + item[i].FileName + '">' + item[i].FileName + '</a></td><td><a target="_blank" download class="achdownload"   href="../Files/' + item[i].applicationId + '/' + item[i].FileName + '"><img src="css/images/download.gif" /></a></td>  </tr>');
                  
                }
           
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            debugger;
            alert('error')

        }
    });
    
    return xhr;
    
    
    
}

function ShowApplicationId() {
   $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "../Common/LcaNoGenerate",
        data: "{}",
        dataType: "json",
        success: function (data) {
            
            if (data.LcaNo != "") {
            
               $("#txtApplicationNumber").val(data.LcaNo);
                $("#pleaseWaitDialog").modal("hide");
            }
           
        },
        error: function (result) {
            
            alert("Error" + result);
        }
    });
}
//function allow number only
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    
    return true;
}

function  isDecimal(evt, element) {
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    
    if (
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;
    
    return true;
}    
 //function allow percentage
function isPercentage(evt, element) {
    

    var charCode = (evt.which) ? evt.which : event.keyCode
    var amt="";
    if (
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;
    if ( $(element).val() > 100) {
        amt = $(element).val().substr(1).slice(1, -1);
        $(element).val(amt);
       }   
     
    
    return true;
}
function GetCurrentDate() {
    var date = new Date();
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    return mm + "/" + dd + "/" + yyyy;
 
}
function formatDate(date) {            //      yyyy/mm/dd format
    
    var oldformat = date.split("/");
    var newformat = oldformat[2] + "/" + oldformat[0] + "/" + oldformat[1];   
    
    
    return newformat;
}
function validateDate(testdate) {
    var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return date_regex.test(testdate);
} 
function validate() {
    
    
    if ($("#txtApplicationNumber").val().trim() == "") {
        $(".YellowWarning").html("Please Enter Application Number");
        $(".YellowWarning").show();
        $("#txtPortofLoading").focus();
        
        return false;
    } if ($("#txtETCNumber").val().trim() == "") {
        $(".YellowWarning").html("Please Enter ETC LCA Number  ");
        $(".YellowWarning").show();
        $("#txtPortofLoading").focus();
        
        return false;
    }
   
   if ($("#ddlPaymentTerms").val() == "0") {
        $(".YellowWarning").html("Please Select Payment Terms ");
        $(".YellowWarning").show();
        $("#ddlPaymentTerms").focus();
        
        return false;
    }
    
    if ($("#ddlCurrency").val() == "0") {
        $(".YellowWarning").html("Please Select Currency ");
        $(".YellowWarning").show();
        $("#ddlCurrency").focus();
        
        return false;
    }
    if ($("#ddlShipby").val() == "0") {
        $(".YellowWarning").html("Please Select Ship by ");
        $(".YellowWarning").show();
        $("#ddlShipby").focus();
        
        return false;
    }
    
    if ($("#ddlFreightCharges").val() == "0") {
        $(".YellowWarning").html("Please Select Freight Charges ");
        $(".YellowWarning").show();
        $("#ddlFreightCharges").focus();
        
        return false;
    }
    
    if ($("#ddlInsurance").val() == "0") {
        $(".YellowWarning").html("Please Select Insurance ");
        $(".YellowWarning").show();
        $("#ddlInsurance").focus();
        
        return false;
    }
    if ($("#ddlApplicationStatus").val() == "0") {
        $(".YellowWarning").html("Please Select Application Status ");
        $(".YellowWarning").show();
        $("#ddlApplicationStatus").focus();
        
        return false;
    }
   

    if ($("#txtCreditAmountRequested").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Credit Amount Requested ");
        $(".YellowWarning").show();
        $("#txtCreditAmountRequested").focus();
        
        return false;
    }
    
    if ($("#txtTolerance").val() > 100) {
        $(".YellowWarning").html("percentage  Value should not greater than 100  ");
        $(".YellowWarning").show();
        $("#txtTolerance").focus();
        
        return false;
    }
   
    if ($("#ddlPartialShipment").val() == "0") {
        $(".YellowWarning").html("Please Select Partial Shipment ");
        $(".YellowWarning").show();
        $("#ddlPartialShipment").focus();
        
        return false;
    }
    if ($("#ddlTranshipment").val() == "0") {
        $(".YellowWarning").html("Please Select Transhipment ");
        $(".YellowWarning").show();
        $("#ddlTranshipment").focus();
        
        return false;
    }
    
    if ($("#dtpExpirationDate").val() == "") {
        $(".YellowWarning").html("Please Select Expiration Date ");
        $(".YellowWarning").show();
        $("#dtpExpirationDate").focus();
        
        return false;
    }
    
    if ($("#dtpLatestShipment").val() == "") {
        $(".YellowWarning").html("Please Select Latest Shipment ");
        $(".YellowWarning").show();
        $("#dtpLatestShipment").focus();
        
        return false;
    }
  
    if ($("#txtPortofLoading").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Port of Loading ");
        $(".YellowWarning").show();
        $("#txtPortofLoading").focus();
        
        return false;
    }
    if ($("#txtPortofDischarge").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Port of Discharge ");
        $(".YellowWarning").show();
        $("#txtPortofDischarge").focus();
        
        return false;
    }
    if ($("#txtpresentDocument").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid present Document ");
        $(".YellowWarning").show();
        $("#txtpresentDocument").focus();
        
        return false;
    }
    var fdata = Formdata.get('file');
    //var filename = fdata.name;
    if (fdata == null) {
        $(".YellowWarning").html("Please Upload the Document ");
        $(".YellowWarning").show();
        return false;
    }
    if ($("#ddlTransferable").val() == "0") {
        $(".YellowWarning").html("Please Select Transferable ");
        $(".YellowWarning").show();
        $("#ddlTransferable").focus();
        
        return false;
    }
    if ($("#ddlConfirmationInstructions").val() == "0") {
        $(".YellowWarning").html("Please Select Confirmation Instructions ");
        $(".YellowWarning").show();
        $("#ddlConfirmationInstructions").focus();
        
        return false;
    }
    
  
    if ($("#ddlBenificiaryID").val() == "0") {
        $(".YellowWarning").html("Please Select Benificiary ");
        $(".YellowWarning").show();
        $("#ddlBenificiaryID").focus();
        
        return false;
    }
    if ($("#ddlBankID").val() == "0") {
        $(".YellowWarning").html("Please Select Bank ");
        $(".YellowWarning").show();
        $("#ddlBankID").focus();
        
        return false;
    }
    if ($("#dtpCreatedDate").val() == "") {
        $(".YellowWarning").html("Please Select Created Date ");
        $(".YellowWarning").show();
        $("#dtpCreatedDate").focus();
        
        return false;
    }
   
    if ($("#txtSignature").val() == "") {
        $(".YellowWarning").html("Please Enter Signature ");
        $(".YellowWarning").show();
        $("#txtSignature").focus();
        
        return false;
    }
    var terems = $('#choice_3_37_1').prop('checked');
    if (terems == false) {
        $(".YellowWarning").html("Please select Terms and Conditions");
        $(".YellowWarning").show();
        $("#choice_3_37_1").focus();
        return false;
    }
   return true;

}
function partialValidate() {
    debugger;
    var terems = $('#choice_3_37_1').prop('checked');
    if (terems==false){
        $(".YellowWarning").html("Please select Terms and Conditions");
        $(".YellowWarning").show();
        $("#choice_3_37_1").focus();
        return false;
    }
    return true;
}
function Upload() {
    debugger;
    Formdata.append('Id', $("#txtApplicationNumber").val());
    $.ajax({
        url: '../LetterOfCredit/Upload',
        type: 'POST',
        data: Formdata,
        processData: false,
        contentType: false,
        success: function (data) {
            debugger;
            if (data == "Upload success") {
                isupload = true;
            }
            else {
                isupload = false;
            }
          //$("#mmsg").html("File Upload successfully...");
            //$("#MessageModal").modal("show");
           
        }, 
        error: function (jqXHR, textStatus, errorThrown) {
            isupload = false;

        }
    });

}
/* insert new record by ajax post method */
function SelectExistUploadFile()
{     
        debugger;
        $('.YellowWarning').hide();
       $('table#tblFile tr').remove();
        var jsondataResource = JSON.stringify({ action: 'SelectExistUploadFile', Id: $("#txtApplicationNumber").val() });
        
        $.ajax({
            type: "POST",
            url: "../ApplicationDetails/transact",
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                debugger;
                var i;
                var item = output[0];
                if (item.length > 0) {
                    for (i = 0; i < item.length; i++) {
                        debugger;
                        count = count + 1;
                        var buttonid = "b" + count;
                        var documenttype = item[i].DocumentType;
                        var filename = item[i].FileName
                        $("#tblFile").append('<tr id=' + count + ' ><td>' + documenttype + ": " + filename + ' </td> <td> <input type="button"  id="' + buttonid + '" name="' + item[i].FileId + '" value="X" style="font-size: 14px;background: #64a0bc; color: white;"  onclick="RemoveFile(this);" />   </td></tr>');
      
                    }
                  

                }
                else {
                   
                }
            },
            error: function (e) {
               
            }
        });

}
function Save() {
    $("#pleaseWaitDialog").modal("show");
    $('.YellowWarning').hide();
    //if (validate()) {
    
    var fdata = Formdata.get('file');
    //var filename = fdata.name;
    if (fdata != null) {
      Upload();
    }

        var createddate = formatDate($("#dtpCreatedDate").datepicker({ dateFormat: 'yyyy/mm/dd' }).val());
        var modifieddate = formatDate(currtDate);
        var expirationdate= formatDate($("#dtpExpirationDate").datepicker({ dateFormat: 'yyyy/mm/dd' }).val());
        var lastshipment= formatDate($("#dtpLatestShipment").datepicker({ dateFormat: 'yyyy/mm/dd' }).val());
        var terms;
       
        if($('#choice_3_37_1').is(':checked')) {
            terms = 1;
        }
        else {
            terms = 0;
        }
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'save', Id: $("#Id").val(), PaymentTermsId: $("#ddlPaymentTerms :selected").val(),CurrencyId: $("#ddlCurrency :selected").val(),IncoTermsId: $("#ddlIncoterms :selected").val(),ShipById: $("#ddlShipby :selected").val(),FrieghtChargesId: $("#ddlFreightCharges :selected").val(),InsurenceId: $("#ddlInsurance :selected").val(), ApplicationStatusId: $("#ddlApplicationStatus :selected").val(),CreditAmountRequested: $("#txtCreditAmountRequested").val().trim(), Tolerance: $("#txtTolerance").val().trim(), ShippingIfOtherSpecify: $("#txtShippingOtherSpecify").val().trim(),PartialShipment: $("#ddlPartialShipment").val(),Transhipment: $("#ddlTranshipment").val(),ExpirationDate: expirationdate,LatestShipment: lastshipment,PortOfLoading: $("#txtPortofLoading").val().trim(),PortOfDischarge: $("#txtPortofDischarge").val().trim(),DaysToPresentDocuments: $("#txtpresentDocument").val().trim(),Transferable: $("#ddlTransferable").val(),ConfirmationInstructions: $("#ddlConfirmationInstructions").val(),CreatedDate: createddate,ModifiedDate: modifieddate,BenificiaryId: $("#ddlBenificiaryID :selected").val(), BankId: $("#ddlBankID :selected").val(), LcaNo: $("#txtApplicationNumber").val(), EtcLcaNo: $("#txtETCNumber").val(),Terms: terms,IsCompleted: iscomplete,Signature: $("#txtSignature").val(), DescriptionOfGoods: $("#txtDescriptionOfGoods").val(), RequiredDocuments: $("#txtRequiredDocuments").val(), AdditionalConditions: $("#txtAdditionalConditions").val(), IncoTermIfOtherSpecify: $("#txtIncotermsOtherSpecify").val() });
        
        xhr = $.ajax({
            type: "POST",
            url: "../LetterOfCredit/save",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
            if (isupload == true) {
                $("#pleaseWaitDialog").modal("hide");
                $("#mmsg").html("File Uploaded & Saved successfully...");
                $("#MessageModal").modal("show");
               
            }
            else {
                $("#pleaseWaitDialog").modal("hide");
                $("#mmsg").html("File Upload is Failed");
                $("#MessageModal").modal("show");
            } result = msg;
                cancelAdd();
                $("#btnOperation").click(function () {
                    window.location = '../ApplicationDetails';
                });
               
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');

            }
        });
        
        return xhr;
   // }
}
function Edit() {
    debugger;
     
    $('.YellowWarning').hide();
    // if (validate()) {
    var fdata = Formdata.get('file');
    //var filename = fdata.name;
    if (fdata != null) {
        Upload();
    }
        var xhr;
        var modifieddate = formatDate(currtDate);
        var expirationdate = formatDate($("#dtpExpirationDate").datepicker({ dateFormat: 'yyyy/mm/dd' }).val());
        var lastshipment = formatDate($("#dtpLatestShipment").datepicker({ dateFormat: 'yyyy/mm/dd' }).val());
        
        var terms;
       
        if ($('#choice_3_37_1').is(':checked')) {
            terms = 1;
        }
        else {
            terms = 0;
    }

        var jsondataResource = JSON.stringify({ action: 'edit', Id: ApplicationId, PaymentTermsId: $("#ddlPaymentTerms :selected").val(), CurrencyId: $("#ddlCurrency :selected").val(), IncoTermsId: $("#ddlIncoterms :selected").val(), ShipById: $("#ddlShipby :selected").val(), FrieghtChargesId: $("#ddlFreightCharges :selected").val(), InsurenceId: $("#ddlInsurance :selected").val(), ApplicationStatusId: $("#ddlApplicationStatus :selected").val(), CreditAmountRequested: $("#txtCreditAmountRequested").val().trim(), Tolerance: $("#txtTolerance").val().trim(), ShippingIfOtherSpecify: $("#txtShippingOtherSpecify").val().trim(), PartialShipment: $("#ddlPartialShipment").val(), Transhipment: $("#ddlTranshipment").val(), ExpirationDate: expirationdate, LatestShipment:  lastshipment, PortOfLoading: $("#txtPortofLoading").val().trim(), PortOfDischarge: $("#txtPortofDischarge").val().trim(), DaysToPresentDocuments: $("#txtpresentDocument").val().trim(), Transferable: $("#ddlTransferable").val(), ConfirmationInstructions: $("#ddlConfirmationInstructions").val(),ModifiedDate:  modifieddate, BenificiaryId: $("#ddlBenificiaryID :selected").val(), BankId: $("#ddlBankID :selected").val(), LcaNo: $("#txtApplicationNumber").val(), EtcLcaNo: $("#txtETCNumber").val(), Terms: terms, IsCompleted: iscomplete, Signature: $("#txtSignature").val(), DescriptionOfGoods: $("#txtDescriptionOfGoods").val(), RequiredDocuments: $("#txtRequiredDocuments").val(), AdditionalConditions: $("#txtAdditionalConditions").val(), IncoTermIfOtherSpecify: $("#txtIncotermsOtherSpecify").val() });
        xhr = $.ajax({
            type: "POST",
            url: "../ApplicationDetails/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
        success: function (msg, textStatus, xmlHttp) {
            if (isupload == true) {
                
                $("#mmsg").html("File Uploaded & Updated successfully...");
                $("#MessageModal").modal("show");
               
            }
            else {
                $("#pleaseWaitDialog").modal("hide");
                $("#mmsg").html("Updated successfully...");
                $("#MessageModal").modal("show");
            }
               //$("#mmsg").html("Updated successfully...");
               // $("#MessageModal").modal("show");
                result = msg;
            cancelAdd();
            $("#btnSaveModelOk").click(function () {
                window.location = '../LetterOfCredit';
              
            });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error')

            }
        });
        
        return xhr;
    //}
}
   
/* clear all html controls when cancel click */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function cancelAdd() {
ShowApplicationId();
$('#btnDownload').hide();   
$(".YellowWarning").hide();
$("#Id").html('');
   // $("#txtApplicationNumber").val('');
$("#txtETCNumber").val('');
$("#ddlPaymentTerms").val(0);
$("#ddlCurrency").val(0);
$("#ddlIncoterms").val(0);
$("#ddlShipby").val(0);
$("#ddlFreightCharges").val(0);
$("#ddlInsurance").val(0);
$("#ddlApplicationStatus").val(0);
$("#txtCreditAmountRequested").val('');
$("#lblSymbol").text('');
$("#txtTolerance").val('0');
$("#txtShippingOtherSpecify").val('');
$("#ddlPartialShipment").val(0);
$("#ddlTranshipment").val(0);
 $('#dtpLatestShipment').datepicker("setDate", currtDate);
 $('#dtpExpirationDate').datepicker("setDate", currtDate);
$("#txtPortofLoading").val('');
$("#txtPortofDischarge").val('');
$("#txtpresentDocument").val('14');
$("#ddlTransferable").val(0);
$("#ddlConfirmationInstructions").val(0);
$("#ddlBenificiaryID").val(0);
    $("#ddlBankID").val(0);
    $('#dtpLatestShipment').datepicker("setDate", currtDate);
    $('#dtpExpirationDate').datepicker("setDate", currtDate);


    $("#choice_3_37_1").prop("checked", false);
    $("#txtSignature").val('');
    $('#dtpCreatedDate').datepicker("setDate", currtDate);
    $("#txtDescriptionOfGoods").val('');
    $("#txtRequiredDocuments").val('');
    $("#txtAdditionalConditions").val('');
    $("#txtIncotermsOtherSpecify").val('');
    //upload clear
    Formdata = new FormData();
    newArr = new Array();
    $("#ddlDocument").val(0);
    $('#file').val('');
    $("#tblFile tbody tr").remove(); 
    
}
function selectData(){
    
    $('.YellowWarning').hide();
   var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id:ApplicationId.trim() });
  
    $.ajax({
        type: "POST",
        url: '../ApplicationDetails/' + ApplicationId,
        data: jsondataResource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (output, status) {
           
            var item = output[0];
            if (item.Id == ApplicationId) {
                $("#Id").html(item.Id);
                $("#txtApplicationNumber").val(item.LcaNo);
                $("#txtETCNumber").val(item.EtcLcaNo);
                $("#ddlPaymentTerms").val(item.PaymentTermsId);
                $("#ddlCurrency").val(item.CurrencyId);
                $("#ddlIncoterms").val(item.IncoTermsId);
                $("#ddlShipby").val(item.ShipById);
                $("#ddlFreightCharges").val(item.FrieghtChargesId);
                $("#ddlInsurance").val(item.InsuranceId);
                $("#ddlApplicationStatus").val(item.ApplicationStatusId);
                $("#txtCreditAmountRequested").val(item.CreditAmountRequested);
                if (item.CurrencySymbol != null) {
                 $("#lblSymbol").text(item.CurrencySymbol);
                }
                $("#txtTolerance").val(item.Tolerance);
                $("#txtShippingOtherSpecify").val(item.ShippingIfOtherSpecify);
                $("#ddlPartialShipment").val(item.PartialShipment);
                $("#ddlTranshipment").val(item.TranShipment);
                $("#dtpExpirationDate").val(item.ExpirationDate);
                $("#dtpLatestShipment").val(item.LatestShipment);
                $("#txtPortofLoading").val(item.PortOfLoading);
                $("#txtPortofDischarge").val(item.PortOfDischarge);
                $("#txtpresentDocument").val(item.DaysToPresentDocuments);
                $("#ddlTransferable").val(item.Transferable);
                $("#ddlConfirmationInstructions").val(item.ConfirmationInstructions);
                $("#ddlBenificiaryID").val(item.BenificiaryId);
                $("#ddlBankID").val(item.BankId);
                
                if (item.Terms.data[0]=="1") {
                    $("#choice_3_37_1").prop("checked", true);
                }
                else {
                    $("#choice_3_37_1").prop("checked", false);
                }
                $("#txtSignature").val(item.Signature);
                $("#dtpCreatedDate").val(item.ModifiedDate);
                $("#txtDescriptionOfGoods").val(item.DescriptionOfGoods);
                $("#txtRequiredDocuments").val(item.RequiredDocuments);
                $("#txtAdditionalConditions").val(item.AdditionalConditions);
                $("#txtIncotermsOtherSpecify").val(item.IncoTermIfOtherSpecify);

                $("#pleaseWaitDialog").modal("hide");

            }
            else {
                   
            }
        },
        error: function (e) {
               
        }
    });
    }
function BindPaymentTerms(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetPaymentTerms",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindGetCurrency(param);
          
            $('#ddlPaymentTerms').empty();
          
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlPaymentTerms").append($("<option></option>").val(Result[i].Id).html(Result[i].Type));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindGetCurrency(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetCurrency",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            BindIncoterms(param);
          
            
            $('#ddlCurrency').empty();
           
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlCurrency").append($("<option></option>").val(Result[i].Id).html(Result[i].Currency));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindIncoterms(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetIncoterms",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindShipBy(param);
            $('#ddlIncoterms').empty();
           
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlIncoterms").append($("<option></option>").val(Result[i].Id).html(Result[i].Type));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindShipBy(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetShipBy",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindFreightCharges(param);
           
            $('#ddlShipby').empty();
          
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlShipby").append($("<option></option>").val(Result[i].Id).html(Result[i].Through));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}

function BindFreightCharges(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetFreightCharges",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindInsurance(param);
            
            $('#ddlFreightCharges').empty();
      
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlFreightCharges").append($("<option></option>").val(Result[i].Id).html(Result[i].Type));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindInsurance(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetInsurance",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindApplicationStatus(param);
           

            $('#ddlInsurance').empty();
        
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlInsurance").append($("<option></option>").val(Result[i].Id).html(Result[i].Type));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindApplicationStatus(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetApplicationStatus",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindBank(param);
           
            $('#ddlApplicationStatus').empty();
         
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlApplicationStatus").append($("<option></option>").val(Result[i].Id).html(Result[i].Status));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindBank(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetBank",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            BindBenificiary(param);
            $('#ddlBankID').empty();
         
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlBankID").append($("<option></option>").val(Result[i].Id).html(Result[i].BankLegalName));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindBenificiary(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetBenificiary",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            
            if (ApplicationId != "") {  //fill value in control 
                selectData();

            }
            $('#ddlBenificiaryID').empty();
           
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlBenificiaryID").append($("<option></option>").val(Result[i].Id).html(Result[i].LegalName));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}
function BindDocumentType(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Common/GetDocumentType",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
           $('#ddlDocument').empty();
            
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlDocument").append($("<option></option>").val(Result[i].Id).html(Result[i].DocumentType));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}

function GetApplicantDetails() {
    
    var jsondataResource = JSON.stringify({ action: 'getsinglerecord'});
    
    $.ajax({
        type: "GET",
        url: '../LetterOfCredit/GetApplicantDetails',
        data: jsondataResource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result, status) {
            
            var item = Result[0];
          
            if (item.Id !=null) {
                $("#input_3_2").val(item.Name);
                //$("#input_3_8").val(item.Benificiary);
                $("#input_3_3").val(item.CompanyLegalName);
                $("#input_3_42").val(item.JobTitle);
                $("#input_3_4").val(item.CompanyPhone);
                $("#input_3_9").val(item.Address);
                $("#input_3_5").val(item.Mobile);
                $("#input_3_6").val(item.Fax);
               // $("#input_3_10").val(item.Bank);
                $("#input_3_7").val(item.Email);
               
            }
            else {
                   
            }
        },
        error: function (e) {
            alert("error in application details");
        }
    });
    
}
//End Function