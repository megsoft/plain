

$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    debugger;
    /* binding flexi grid data by connecting node url */
 $("#fgrdData").flexigrid({
        dataType: 'json',
        url: "../Constant",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 100,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'Company Name',
                name: 'CompanyName',
                width: 200,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Address',
                name: 'Address',
                width: 260,
                sortable: true,
                align: 'left'
            },
            {
                display: 'CountryName',
                name: 'CountryName',
                width: 150,
                sortable: true,
                align: 'left'
            },
            {
                display: 'State Name',
                name: 'StateName',
                width: 150,
                sortable: true,
                align: 'left'
            },
            {
                display: 'City Name',
                name: 'CityName',
                width: 150,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Phone',
                name: 'Phone',
                width: 100,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ], 
        
        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked },
        ],
        
        searchitems: [{
                display: 'Company Name',
                name: 'CompanyName',
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
            EditEmployee();
            
        }
        else {
            saveEmployee();
        }
    });

      /* delete process by ajax post after confirm delete clicked */
    $("#btnMDelete").live("click", function () {
        var SelectedID = $("#uid").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: SelectedID.trim() });
        $('.YellowWarning').hide();
        $.ajax({
            type: "POST",
            url: '../Constant/' + SelectedID,
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
        $("#myModalLabel").html('Edit Company');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var SelectedID = sourceCtl.attr('id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: SelectedID.trim() });
        $("#OldCode").html(SelectedID);
        $.ajax({
            type: "POST",
            url: '../Constant/' + SelectedID,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {

                var item = output[0];

                if (item.Id == SelectedID) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#uid").html(item.Id);
                    $("#txtName").val(item.CompanyName);
                    $("#txtAddress").val(item.Address);
                    $("#ddlCountry").val(item.CountryId);
                    $("#ddlState").val(item.StateId);
                    $("#ddlCity").val(item.CityId);
                    $("#txtZipcode").val(item.ZipCode);
                    $("#txtPhone").val(item.Phone);
                    $("#txtFax").val(item.Fax);
                    $("#txtWebsite").val(item.Website);
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

        if ($("#txtName").val() == "") {
            $(".YellowWarning").html("Enter Valid Name ");
            $(".YellowWarning").show();
            $("#txtname").focus();

            return false;
        }
        if ($("#txtPhone").val() == "") {
            $(".YellowWarning").html("Enter Valid Phone No ");
            $(".YellowWarning").show();
            $("#txtphone").focus();

            return false;
        }
        return true;

    }

    /* insert new record by ajax post method */
    function saveEmployee() {

        if (validate()) {
            
            var xhr;
           
            var jsondataResource = JSON.stringify({ action: 'save', uid: $("#uid").val().trim(), CompanyName: $("#txtName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Fax: $("#txtFax").val(), Phone: $("#txtPhone").val(), Website: $("#txtWebsite").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val()});
            xhr = $.ajax({
                type: "POST",
                url: "../Constant/save",
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
                        $("#fgrdData").flexReload({ url: "../Constant" });
                        result = msg;
                        cancelAdd();
                    }
                    else if (msg.status == "ER_DUP_ENTRY") {
                        $("#ptitle").html("Warning");
                        $("#mmsg").html(" Constant  : " + $("#txtName").val() + " Already exists ");
                        $("#mmsg").css("color", "red");
                        $("#MessageModal").modal("show");
                        $("#txtName").focus();
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
    function EditEmployee() {
        
        if (validate()) {
            var xhr;
            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#uid").html().trim(), CompanyName: $("#txtName").val().trim(), Address: $("#txtAddress").val(), CountryId: $("#ddlCountry :selected").val(), StateId: $("#ddlState :selected").val(), CityId: $("#ddlCity :selected").val(), Fax: $("#txtFax").val(), Phone: $("#txtPhone").val(), Website: $("#txtWebsite").val(), Email: $("#txtEmail").val(), Zipcode: $("#txtZipcode").val() });
            xhr = $.ajax({
                type: "POST",
                url: "../Constant/transact",
                data: jsondataResource,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {

                    $('#EntryModal').modal('hide');
                    $("#mmsg").html("updated successfully...");
                    $("#MessageModal").modal("show");

                    $("#fgrdData").flexReload({ url: "../Constant" });
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
        $("#txtName").val('');
        $("#txtAddress").val('');       
        $("#ddlCountry").val(0);
        $("#ddlState").val(0);
        $("#ddlCity").val(0);
        $("#txtZipcode").val('');
        $("#txtPhone").val('');
        $("#txtFax").val('');
        $("#txtWebsite").val('');
        $("#txtEmail").val('');
        $("#uid").html('');      
        $('#EntryModal').modal('hide');
    }

      /* Clear all controls & open entry dialog when add button clicked */
    function addclicked(com, grid) {
        $("#myModalLabel").html('Company');
        $("#txtName").val('');
        $("#txtAddress").val('');
        $("#ddlCountry").val(0);
        $("#ddlState").val(0);
        $("#ddlCity").val(0);
        $("#txtZipcode").val('');
        $("#txtPhone").val('');
        $("#txtFax").val('');
        $("#txtWebsite").val('');
        $("#txtEmail").val('');
        $("#uid").html('');      
        $('#EntryModal').modal('show');
        $(".YellowWarning").hide();
        $(".Warning").hide();
    }
    
    
   

   
