
$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    // Default Load all data
    var param = JSON.stringify({ action: 'loadall', Id: 0 });
    BindCountry(param);
    BindState(param);
    
    $("#ddlCountry").change(function () {
        
        var SelectedCountryId = $("#ddlCountry :selected").val();
        
        var param = JSON.stringify({ action: 'state', CountryId: SelectedCountryId });
        
        BindState(param);
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
    // ddlState  binding
    function BindState(jsonddlResource) {
        $.ajax({
            
            type: "POST",
            
            contentType: "application/json; charset=utf-8",
            
            url: "../Constant/GetStateData",
            
            data: jsonddlResource,
            
            dataType: "json",
            
            success: function (Result) {
                debugger;
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
    //save validation
    function validate() {
        
        if ($("#ddlCountry").val() == "0") {
            $(".YellowWarning").html("Select Country Name ");
            $(".YellowWarning").show();
            $("#ddlCountry").focus();
            
            return false;
        }
        if ($("#ddlState").val() == "0") {
            $(".YellowWarning").html("Select State Name ");
            $(".YellowWarning").show();
            $("#ddlState").focus();
            
            return false;
        }
        
        if ($("#txtCityName").val() == "") {
            $(".YellowWarning").html("Enter Valid City Name ");
            $(".YellowWarning").show();
            $("#txtCityName").focus();
            
            return false;
        }
        return true;

    }
    /* insert new record by ajax post method */
    function Save() {
        if (validate()) {
            
            var xhr;
            var jsondataResource = JSON.stringify({ action: 'save', Id: $("#Id").html().trim(), CityName: $("#txtCityName").val().trim(), CountryId: $("#ddlCountry :selected").val().trim(), StateId: $("#ddlState :selected").val().trim(), Description: $("#txtDescription").val() });
            xhr = $.ajax({
                type: "POST",
                url: "../City/save",      
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
                        $("#fgrdData").flexReload({ url: "../City" });
                        result = msg;
                        cancelAdd();
                    }
                    else if (msg.status=="ER_DUP_ENTRY") {
                        $("#ptitle").html("Warning");
                        $("#mmsg").html(" City Name : " + $("#txtCityName").val() + " Already exists ");
                        $("#mmsg").css("color", "red");
                        $("#MessageModal").modal("show");
                        $("#txtCityName").focus();                        
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
            var jsondataResource = JSON.stringify({ action: 'edit', Id: $("#Id").html().trim(), CityName: $("#txtCityName").val().trim(), CountryId: $("#ddlCountry :selected").val().trim(), StateId: $("#ddlState :selected").val().trim(), Description: $("#txtDescription").val() });
            xhr = $.ajax({
                type: "POST",
                url: "../City/transact",      
                data: jsondataResource ,
                contentType: 'application/json', // content type sent to server
                dataType: 'json', // Expected data format from server
                processdata: true, // True or False
                crossDomain: true,
                success: function (msg, textStatus, xmlHttp) {
                    
                    $('#EntryModal').modal('hide');
                    $("#mmsg").html("Updated successfully...");
                    $("#MessageModal").modal("show");
                    
                    $("#fgrdData").flexReload({ url: "../City" });
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
        $("#mmsg").css("color", "green");
        $("#txtCityName").val('');
        $("#txtDescription").val('');
        $("#Id").html('');
        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $('#EntryModal').modal('hide');
    }
    
    /* binding flexi grid data by connecting node url */
    $("#fgrdData").flexigrid({
        
        dataType: 'json',
        url: "../City",
        colModel: [{
                display: 'ID',
                name: 'Id',
                width: 100,
                hide: true,
                sortable: true,
                align: 'center'
            }, {
                display: 'City Name',
                name: 'CityName',
                width: 250,
                sortable: true,
                align: 'left'
            }, {
                display: 'State Name',
                name: 'StateName',
                width: 250,
                sortable: true,
                align: 'left'
            }, {
                display: 'Country Name',
                name: 'CountryName',
                width: 250,
                sortable: true,
                align: 'left'
            },
             
            {
                display: 'Description',
                name: 'Description',
                width: 280,
                sortable: true,
                align: 'left'
            },
            { display: 'Delete', name: 'Delete', width: 80, sortable: true, align: 'center' },
        ], 
        
        buttons: [{ name: 'Add', bclass: 'add', onpress: addclicked },
        ],
        
        searchitems: [{
                display: 'City Name',
                name: 'CityName',
                isdefault: true
            }],
        sortname: "Id",
        sortorder: "asc",
        usepager: true,
        resizable: false,
        useRp: true,
        rp: parseInt(($(window).height() - 380) / 26),
        showTableToggleBtn: true,
        
        height: $(window).height() - 380,

    });
    /* Clear all controls & open entry dialog when add button clicked */
    function addclicked(com, grid) {
        debugger;
        $("#mmsg").css("color", "green");
        $("#myModalLabel").html('Add City');
        $("#txtCityName").val('');
        $("#txtDescription").val('');
        $("#Id").html('');
        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $('#EntryModal').modal('show');
        $(".YellowWarning").hide();
        $(".Warning").hide();
    }
   
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
        var Id = $("#Id").val();
        var jsondataResource = JSON.stringify({ action: 'delete', Id: Id.trim() });
        $('.YellowWarning').hide();
        //$('#uid').html(ItemCode);
        $.ajax({
            type: "POST",
            url: '../City/' + Id ,
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
                    $("#mmsg").css("color", "green");
                    $("#mmsg").html("Deleted successfully...");
                    $("#MessageModal").modal("show");
                    
                    
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
        
        $("#pleaseWaitDialog").modal("show");
        $("#myModalLabel").html('Edit City');
        $('.YellowWarning').hide();
        $('.Warning').hide();
        var sourceCtl = $(this);
        var Id = sourceCtl.attr('Id').substring(9);
        var jsondataResource = JSON.stringify({ action: 'getsinglerecord', Id: Id.trim() });
        $("#OldCode").html(Id);
        $.ajax({
            type: "POST",
            url: '../City/' + Id ,
            data: jsondataResource,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                
                var row = output[0];
                
                if (row.Id == Id) {
                    $('#pleaseWaitDialog').modal('hide');
                    $('#EntryModal').modal('show');
                    $("#Id").html(row.Id);
                    $("#txtCityName").val(row.CityName);
                    $("#ddlCountry ").val(row.CountryId);
                    $("#ddlState").val(row.StateId);
                    
                    $("#txtDescription").val(row.Description);
                   
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
    
    $("#btnAdd").click(function () {
        debugger;
        $("#myModalLabel").html('Add City');
        $("#txtCityName").val('');
        $("#txtDescription").val('');
        $("#Id").html('');
        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
    });

});