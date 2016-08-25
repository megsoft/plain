

$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    // Default Load all data
    var param = JSON.stringify({ action: 'loadall', Id: 0 });
    BindCountry(param);
    BindState(param);
    BindCity(param);

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
    $("#btnsave").click(function () {

        if ($("#uid").html().trim() != "") {

            Edit();
          
        }
        else {
            Save();
        }

    });
    $("#btninvite").click(function () {
        
        if ($("#uid").html().trim() != "") {
            
            SendInvite();
           
        }
        else {
           
        }

    });
    /* binding flexi grid data by connecting node url */
    $("#fgrdData").flexigrid({

        dataType: 'json',
        url: "../SubAgent",
        colModel: [{
            display: 'ID',
            name: 'Id',
            width: 0,
            hide: true,
            sortable: true,
            align: 'center'
        }, {
                display: 'First Name',
                name: 'FirstName',
                width: 200,
                sortable: true,
                align: 'left'
            },
        {
            display: 'Last Name',
            name: 'LastName',
            width: 200,
            sortable: true,
            align: 'left'
        }
            , {
                display: 'Address',
                name: 'Address',
                width: 200,
                sortable: true,
                align: 'left'
            },

            {
                display: 'Conuntry',
                name: 'ConuntryName',
                width: 100,
                sortable: true,
                align: 'left'
            },

            {
                display: 'State',
                name: 'StateName',
                width: 100,
                sortable: true,
                align: 'left'
            }
            ,

            {
                display: 'City',
                name: 'CityName',
                width: 100,
                sortable: true,
                align: 'left'
            },

            {
                display: 'Phone',
                name: 'Phone',
                width: 98,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ],

        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked }],

        searchitems: [{
            display: 'Address',
            name: 'Address'
        }, {
                display: 'FirstName',
                name: 'FirstName',
                isdefault: true
            },

        {
            display: 'Last Name',
            name: 'LastName',
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
        var SelectedID = $("#uid").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: SelectedID.trim() });
        $('.YellowWarning').hide();
        $.ajax({
            type: "POST",
            url: '../SubAgent/' + SelectedID,
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
    $("[id^=itemdelete_]").live("click", function () {
        debugger
        var sourceCtl = $(this);
        $("#uid").val(sourceCtl.attr('id').substring(11));
        $('#DeleteModal').modal('show');

    });



    /* set db data to all Controls when edit click */
    $("[id^=itemedit_]").live("click", function () {
        
        $("#pleaseWaitDialog").modal("show");
        $("#myModalLabel").html('Edit Sub Agent');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
        $("#OldCode").html(SelectedID);
        $.ajax({
            type: "POST",
            url: '../SubAgent/' + SelectedID,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {

                var item = output[0];

                if (item.Id == SelectedID) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
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

 // ddlCountry  binding
function BindCountry(jsonddlResource) {
   
    $.ajax({

        type: "POST",

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
    // ddlState  binding
function BindState(jsonddlResource) {
    $.ajax({

        type: "POST",

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

      //save validation
    function validate() {
       
        if ($("#txtFirstName").val() == "") {
            $(".YellowWarning").html("Enter Valid First Name ");
            $(".YellowWarning").show();
            $("#txtFirstName").focus();

            return false;
        }
        if ($("#txtLastName").val() == "") {
            $(".YellowWarning").html("Enter Valid Last Name");
            $(".YellowWarning").show();
            $("#txtLastName").focus();

            return false;
        }
      
        if ($("#ddlCountry :selected").val() <= 0) {
            $(".YellowWarning").html("Select Valid Country");
            $(".YellowWarning").show();
            $("#ddlCountry").focus();

            return false;
        }
        if ($("#ddlState :selected").val() <= 0) {
            $(".YellowWarning").html("Select Valid State");
            $(".YellowWarning").show();
            $("#ddlState").focus();

            return false;
        }

        if ($("#ddlCity :selected").val() <= 0) {
            $(".YellowWarning").html("Select Valid City");
            $(".YellowWarning").show();
            $("#ddlCity").focus();

            return false;
        }

        if ($("#txtMobile").val() == "") {
            $(".YellowWarning").html("Enter Valid Mobile No ");
            $(".YellowWarning").show();
            $("#txtMobile").focus();

            return false;
        }


        if ($("#txtEmail").val() == "") {
            $(".YellowWarning").html("Enter Valid Email Address");
            $(".YellowWarning").show();
            $("#txtEmail").focus();

            return false;
        }
        if ($("#txtEmail").val() != "") {
            if (!validateEmail($("#txtEmail").val())) {
                $(".YellowWarning").html("Enter Valid E-Mail Address ");
                $(".YellowWarning").show();
                $("#txtEmail").val('');
                $("#txtEmail").focus();

                return false;
            }
        }


        if ($("#ddlIsActive").html() == "") {
            $(".YellowWarning").html("Select Valid IsActive Mode");
            $(".YellowWarning").show();
            $("#ddlIsActive").focus();

            return false;
        }

      

       

        return true;

    }

    /* insert new record by ajax post method */
    function Save() {

        if (validate()) {
            
            var xhr;
           
            

            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#uid").html().trim(), FirstName: $("#txtFirstName").val().trim(), Initial: $("#txtInitial").val().trim(), LastName: $("#txtLastName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Phone: $("#txtPhone").val(), Mobile: $("#txtMobile").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val(), IsActive: $("#ddlIsActive :selected").text() });
            xhr = $.ajax({
                type: "POST",
                url: "../SubAgent/save",
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
                        $("#fgrdData").flexReload({ url: "../SubAgent" });
                        result = msg;
                        cancelAdd();
                    }
                    else if (msg.status == "ER_DUP_ENTRY") {
                        $("#ptitle").html("Warning");
                        $("#mmsg").css("color", "red");
                        $("#mmsg").html(" Sub Agent  : " + $("#txtFirstName").val() + " Already exists ");                      
                        $("#MessageModal").modal("show");
                        $("#txtFirstName").focus();
                    }

                },
                error: function (err) {
                    alert('error :' + err);

                }
            });

            return xhr;
        }
}

/* Generate Random Password*/
function randomPassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}
/* Validate Email Address */
function ValidateInviteEmail() {
    if ($("#txtEmail").val() == "") {
        $(".YellowWarning").html("Enter Valid E-Mail Address");
        $(".YellowWarning").show();
        $("#txtEmail").focus();
        
        return false;
    }
    if ($("#txtEmail").val() != "") {
        if (!validateEmail($("#txtEmail").val())) {
            $(".YellowWarning").html("Enter Valid E-Mail Address ");
            $(".YellowWarning").show();
            $("#txtEmail").val('');
            $("#txtEmail").focus();
            
            return false;
        }
    }
    return true;
}
/* Send Invite via Email by ajax post method */
function SendInvite() {
    if (ValidateInviteEmail()){
        var xhr;
        var password = randomPassword(10);
        var jsondataResource = JSON.stringify({ action: 'invite', Id: $("#uid").html().trim(), FirstName: $("#txtFirstName").val().trim(), Initial: $("#txtInitial").val().trim(), LastName: $("#txtLastName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Mobile: $("#txtMobile").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val(), IsActive: $("#ddlIsActive :selected").text(), JobTitle: $("#txtJobTitle").val(), ComLegalName: $("#txtComLegalName").val(), ComDBA: $("#txtComDBA").val(), ComFax: $("#txtComFax").val(), ComPhone: $("#txtComPhone").val(), Website: $("#txtWebsite").val(), Password: password });
        xhr = $.ajax({
            type: "POST",
            url: "../SubAgent/transact",
            data: jsondataResource,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (msg, textStatus, xmlHttp) {
                
                $('#EntryModal').modal('hide');
                $("#mmsg").html("invitation send to ' " + $("#txtEmail").val() +" ' successfully...");
                $("#MessageModal").modal("show");
                
                $("#fgrdData").flexReload({ url: "../SubAgent" });
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
      /* update record by ajax post method */
    function Edit() {
        
        if (validate()) {
            var xhr;
            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#uid").html().trim(), FirstName: $("#txtFirstName").val().trim(), Initial: $("#txtInitial").val().trim(), LastName: $("#txtLastName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Phone: $("#txtPhone").val(), Mobile: $("#txtMobile").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val(), IsActive: $("#ddlIsActive :selected").text() });
            xhr = $.ajax({
                type: "POST",
                url: "../SubAgent/transact",
                data: jsondataResource,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {

                    $('#EntryModal').modal('hide');
                    $("#mmsg").html("updated successfully...");
                    $("#MessageModal").modal("show");

                    $("#fgrdData").flexReload({ url: "../SubAgent" });
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
        $('#EntryModal').modal('hide');
    }

      /* Clear all controls & open entry dialog when add button clicked */
    function addclicked(com, grid) {
        $("#myModalLabel").html('Sub Agent Creation');
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
        $('#EntryModal').modal('show');
        $(".YellowWarning").hide();
        $(".Warning").hide();
    }
    

    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    }



   

   
