

$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    // Default Load all data
    var param = JSON.stringify({ action: 'loadall', Id: 0 });
    BindCountry(param);
    BindState(param);
    BindCity(param);
    GetAgentProfileData();
    $("#Msg").css('visibility', 'hidden');
    $("#ddlCountry").change(function () {
        
        var SelectedCountryId = $("#ddlCountry :selected").val();
        
        var param = JSON.stringify({ action: 'state', CountryId: SelectedCountryId });
        
        BindState(param);
    });
    
    $("#ddlState").change(function () {
        
        var SelectedCountryId = $("#ddlCountry :selected").val();
        var SelectedStateId = $("#ddlState :selected").val();
        
        if (SelectedCountryId == 0 || SelectedStateId == 0)
            return;
        var param = JSON.stringify({ action: 'state', CountryId: SelectedCountryId, StateId: SelectedStateId });
        
        BindCity(param);
    });
    
    $("#btncancel").click(function () {
        
        cancelAdd();
    });
    
    /* choose save or update method whecn click save */
    $("#btnUpdate").click(function () {
        
        if ($("#uid").html().trim() != "") {
            Edit();
            //cancelAdd();
        }
        else {
        }
    });
});
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
    
// ddlCountry  binding
function BindCountry(jsonddlResource) {
    
    $.ajax({
        
        type: "POST",
      //  async:false,        
        contentType: "application/json; charset=utf-8",
        
        url: "../Constant/GetCountryData",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
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
function GetAgentProfileData() {
    var SelectedID = getParameterByName("id");
    var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID });
    
    $.ajax({
        type: "POST",
        url: '../AgentProfile/' + SelectedID,
        data: jsondataResource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result, status) {
            var item = Result.Data[0];
          //  alert(item.CountryId);
            if (item.Id == SelectedID) {
                $('#pleaseWaitDialog').modal('hide');
                $('#EntryModal').modal('hide');
                $("#uid").html(item.Id);
                $("#txtFirstName").val(item.FirstName);
                $("#txtLastName").val(item.LastName);
                $("#txtAddress").val(item.Address);
                $("#ddlCountry").val(item.CountryId);
                $("#ddlState").val(item.StateId);
                $("#ddlCity").val(item.CityId);
                $("#txtZipcode").val(item.ZipCode);
                $("#txtPhone").val(item.Phone);
                $("#txtMobile").val(item.Mobile);
                $("#txtInitial").val(item.Initial);
                $("#txtEmail").val(item.Email);
                $("#txtPassword").val(item.Password);
                if (Result.MSGDiv == "No") {
                    $("#Msg").css('visibility', 'hidden');
                }
                else {
                    $("#Msg").css('visibility', 'visible');
                }
            }
            else {
                   
            }
        },
        error: function (e) {
        }
    });
    
}

// ddlState  binding
function BindState(jsonddlResource) {
    $.ajax({
        
        type: "POST",
        async: false,
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Constant/GetStateData",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            $('#ddlState').empty();
            $('#ddlState').append('<option selected="selected" value="0">---select---</option>');
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlState").append($("<option></option>").val(Result[i].Id).html(Result[i].StateName));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });
}
// ddlcity  binding
function BindCity(jsonddlResource) {
    $.ajax({
        
        type: "POST",
        async: false,
        
        contentType: "application/json; charset=utf-8",
        
        url: "../Constant/GetCityData",
        
        data: jsonddlResource,
        
        dataType: "json",
        
        success: function (Result) {
            
            $('#ddlCity').empty();
            $('#ddlCity').append('<option selected="selected" value="0">---select---</option>');
            
            for (var i = 0; i < Result.length; i++) {
                
                $("#ddlCity").append($("<option></option>").val(Result[i].Id).html(Result[i].CityName));

            }

        },
        
        error: function (Result) {
            
            alert("Error");

        }

    });

}

function validatePassword() {
    
    var newPassword = $("#txtPassword").val();
    var minNumberofChars = 10;
    var maxNumberofChars = 15;
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
   // 
    if (newPassword.length < minNumberofChars || newPassword.length > maxNumberofChars) {
        alert("password should contain Minimum 10 charecter");
        return false;
    }
    if (!regularExpression.test(newPassword)) {
        alert("password should contain atleast one number and one special character");
        return false;
    }
    return true;
}
//save validation
function validate() {
    debugger;
    if ($("#txtFirstName").val() == "") {
        alert("Enter Valid First Name");
       
        $("#txtFirstName").focus();
        
        return false;
    }
    
    if ($("#txtPassword").val() == "") {
        alert("Enter Valid Password");
        
        $("#txtPassword").focus();
        
        return false;
    }
    if ($("#txtPassword").val() != "") {
        
        if (!validatePassword()) {
            return false;
        }
        return true;

    }
    
    
    if ($("#txtLastName").val() == "") {
    alert("Enter Valid Last Name");
        $("#txtLastName").focus();
        
        return false;
    }
    
    if ($("#ddlCountry").val() <= 0) {
        alert("Select Valid Country");
        $("#ddlCountry").focus();
        
        return false;
    }
    if ($("#ddlState").val() <= 0) {
        alert("Select Valid State");
    
        $("#ddlState").focus();
        
        return false;
    }
    
    if ($("#ddlCity").val() <= 0) {
        alert("Select Valid City");
      
        $("#ddlCity").focus();
        
        return false;
    }
    
    if ($("#txtMobile").val() == "") {
        alert("Enter Valid Mobile No ");
    
        $("#txtMobile").focus();
        
        return false;
    }
    
    
    if ($("#txtEmail").val() == "") {
        alert("Enter Valid Email Address");
       
        $("#txtEmail").focus();
        
        return false;
    }
    if ($("#txtPassword").val() == "") {
        alert("Enter Valid Password");
        
        $("#txtPassword").focus();
        
        return false;
    }
    
    if ($("#txtEmail").val() != "") {
        if (!validateEmail($("#txtEmail").val())) {
            alert("Enter Valid E-Mail Address ");
            $("#txtEmail").val('');
            $("#txtEmail").focus();
            
            return false;
        }
    }
    
    
    if ($("#ddlIsActive").html() == "") {
        alert("Select Valid IsActive Mode");
     
        $("#ddlIsActive").focus();
        
        return false;
    }
    
    
    
    
    
    return true;

}


/* update record by ajax post method */
function Edit() {
    
    if (validate()) {
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#uid").html().trim(), FirstName: $("#txtFirstName").val().trim(), Initial: $("#txtInitial").val().trim(), LastName: $("#txtLastName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Phone: $("#txtPhone").val(), Mobile: $("#txtMobile").val(), Password: $("#txtPassword").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val(), IsActive: $("#ddlIsActive :selected").text() });
        xhr = $.ajax({
            type: "POST", 
            url: "../AgentProfile/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
                
                $('#EntryModal').modal('hide');
                $("#mmsg").html("updated successfully...");
                $("#MessageModal").modal("show");
                
                $("#fgrdData").flexReload({ url: "../Agent" });
                result = msg;
                cancelAdd();
                alert("Updated successfully...")
                GetAgentProfileData();
                window.location = '../Dashboard';

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
    $("#txtFirstName").val('');
    $("#txtInitial").val('');
    $("#txtLastName").val('');
    $("#txtAddress").val('');
    $("#ddlCountry").val(0);
    $("#ddlState").val(0);
    $("#ddlCity").val(0);
    $("#txtZipcode").val('');
    $("#txtPhone").val('');
    $("#txtMobile").val('');
    $("#txtEmail").val('');
    $("#txtPassword").val('');
    $("#uid").html('');
    $('#EntryModal').modal('hide');
}

/* Clear all controls & open entry dialog when add button clicked */
function addclicked(com, grid) {
    $("#myModalLabel").html('Agent Creation');
    $("#txtFirstName").val('');
    $("#txtInitial").val('');
    $("#txtLastName").val('');
    $("#txtAddress").val('');
    $("#ddlCountry").val(0);
    $("#ddlState").val(0);
    $("#ddlCity").val(0);
    $("#txtZipcode").val('');
    $("#txtPhone").val('');
    $("#txtMobile").val('');
    $("#txtEmail").val('');
    $("#uid").html('');
    $("#txtPassword").val('');
    $('#EntryModal').modal('show');
    $(".YellowWarning").hide();
    $(".Warning").hide();
}



function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}




