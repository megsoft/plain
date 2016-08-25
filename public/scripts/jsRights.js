


    $(document).ready(new function () {
        $('.modal ').insertAfter($('body'));
        var height = $(window).height();
        $("#UserInfo").css('height', $(window).height()-50);


        $("#UserArticles").css({ "display": "none" })
        getmenuslsst();

        $.ajax({
            type: "POST",
            url: 'Rights/GetMenuTypes',
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {
                debugger;
                var data = output;

                $("#DivMenuTypes").html("");
                for (var i in data) {
                    
                    var TypeDetails = data[i];

                    $("#DivMenuTypes").append("<button class='groupbuttons'  id='btnmenutypes_" + TypeDetails.Type + "' value='" + TypeDetails.Type + "'>" + TypeDetails.Type + "</button>");

                }

            }
        });


        ldmnus();



     
});

$(document).on("click", "#btnsave", function () {
    debugger;
    Save();
});

$("#btncancel").click(function () {
    debugger;
    cancelAdd();
});
    function getmenuslsst() {
        $.ajax({
            type: "POST",
            url: 'Rights/GetMenuslst',
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output, status) {

                $('#cssmenu').append(output.html);
            }
        });
    }
    function ldmnus() {
        $.ajax({
            type: "POST",
            url: 'Rights/LoadMenus',
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (output) {
                debugger;
                var data = output;
                $("#lstMenu").empty();
                $("#lstMenu").append("<option id='0' value='0'>--Select--</option>");
                for (var i in data) {

                    var LoadMenu = data[i];

                    $("#lstMenu").append("<option id='menuName_" + LoadMenu.Id + "' value='" + LoadMenu.Id + "'>" + LoadMenu.Name + "</option>");

                }

                $("#lstPage").empty();
                $("#lstPage").append("<option id='0' value='0'>--Select--</option>");
                $("#lstMenu").attr('enabled', 'enabled');
            }

        });

    }



    function SlideDown(obj) {

        if ($("#Page_" + obj).css('display') == "none") {
            $("[id^=Page_]").slideUp();
            $("[id^=imgplus_]").attr("src", "css/images/plusim.png");

            $("[id^=Section_]").slideUp();
            $("[id^=imgSecExpand_]").attr("src", "css/images/plusim.png");
            $("#Page_" + obj).slideDown();
            $("#imgplus_" + obj).attr("src", "css/images/minus.png");
            $("#Section_" + obj).slideDown();
            $("#imgSecExpand_" + obj).attr("src", "css/images/minus.png");

        }
        else {
            $("#Page_" + obj).slideUp();
            $("#imgplus_" + obj).attr("src", "css/images/plusim.png");
            $("#Section_" + obj).slideUp();
            $("#imgSecExpand_" + obj).attr("src", "css/images/plusim.png");
        }

    }


    function SlidDown(obj) {

        debugger;
        if ($("#Section_" + obj).css('display') == "none") {
            $("[id^=imgSecExpand_]").attr("src", "css/images/plusim.png");
            $("#Section_" + obj).slideDown();
            $("#imgSecExpand_" + obj).attr("src", "css/images/minus.png");
        }
        else {
            $("#Section_" + obj).slideUp();
            $("#imgSecExpand_" + obj).attr("src", "css/images/plusim.png");
        }
    }


    function validate() {
        debugger;
        $('.YellowWarning2').hide();
        if ($("#txtmenuname").val() == "") {
            $('.YellowWarning2').html("Menu/Page Name is required!");
            $('.YellowWarning2').show();
            $("#txtmenuname").focus();
            return false;
        }
        if ($("#txtPath").val() == "") {
            $('.YellowWarning2').html("Path is required!");
            $('.YellowWarning2').show();
            $("#txtPath").focus();
            return false;
        }

       
        if ($("#lstMenu").val() == "0" && ($("#DivMenuTypes .groupbuttons").hasClass("is-checked") != true)) {
            $('.YellowWarning2').html("Select Menu!");
            $('.YellowWarning2').show();
            $("#lstMenu").focus();
            return false;
        }

        
        return true;
    }




    function btnSetMenuID(ID, Name, MenuID, Type)
    {
        $('.modal ').insertAfter($('body'));
              debugger;
              $("#mmsg").html("Please wait...  <img src='css/images/ajax-loader.gif' />");
              $("#pleaseWaitDialog").modal("show");
              
              $('.YellowWarning2').hide();
            $('.AdminsettingsYellowWarning').hide();
            $('.AdminsettingsWarning').hide();
           
            var ID = ID;
            var GetIDValue = ID;
            var Name =Name;
            var Menuid = MenuID;
            var Type = Type;
            
            $("#OldID").html(ID);
            $("#DivSaveMenuID").html(ID);
          
        
              $.ajax({
                type: "POST",
                url: 'Rights/LoadUsertypeSetting',
                data: '{}',
                contentType: "application/json; charset=utf-8",
               // dataType: "json",
                success: function (output) {
                    debugger;
                    $("#tblTeamUser").html("");
                    $("#trUsertype").html("");
                    $("#tblTeamUser").html('<tr id="trUsertype"><td  style="width: 50px;height:30px;"><div style="line-height: 26px;height: 30px;text-align: center; font-size: 14px;">Team/UserType</div></td></tr>');
                    $("#trUsertype").append(output);

                    $.ajax({
                        type: "POST",
                        url: 'Rights/LoadTeamSetting',
                        data: '{}',
                        contentType: "application/json; charset=utf-8",
                       // dataType: "json",
                        success: function (output) {
                            debugger;
                            $('#tblTeamUser').append(output);
                            if (Menuid != "0") {
                                ID = Menuid;
                                $('img[id^="isactive_"]').attr("src", "css/images/close.png");
                                $('img[id^="isactive_').css('cursor', 'default');
                               

                            }
                            $.ajax({
                                type: "POST",
                                url: 'Rights/getAccessValues',
                                data: '{"Type":"'+Type+'","MenuID":"' + ID + '"}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (output) {
                                    debugger;
                                    var data = JSON.parse(output);
                                    for (var i in data) {
                                        var getUserandTeamID = data[i];
                                        $("#isactive_" + getUserandTeamID.UTypeIDandTeamID).attr("src", "css/images/check-off.png");
                                        $("#isactive_" + getUserandTeamID.UTypeIDandTeamID).css('cursor', 'pointer');
                                    }

                                    $.ajax({
                                        type: "POST",
                                        url: 'Rights/getAccessValues',
                                        data: '{"Type":"' + Type + '","MenuID":"' + GetIDValue + '"}',
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (output) {
                                            debugger;
                                            var data = JSON.parse(output);
                                            for (var i in data) {
                                                var FinalUserandTeamID = data[i];
                                                $("#isactive_" + FinalUserandTeamID.UTypeIDandTeamID).attr("src", "css/images/check-on.png");
                                                $("#isactive_" + FinalUserandTeamID.UTypeIDandTeamID).css('cursor', 'pointer');
                                            }
                                            
                                            if (Menuid != "0") {
                                                ID = GetIDValue;
                                            }
                                            $.ajax({
                                                type: "POST",
                                                url: 'Rights/GetMenuByID',
                                                data: '{"ID":"' + ID + '" }',
                                                contentType: "application/json; charset=utf-8",
                                                dataType: "json",
                                                success: function (output, status) {
                                                    debugger;
                                                    var GtMnuDetails = output[0];
                                                    if ((GtMnuDetails.Id == ID)) {
                                                        debugger;
                                                        $("#txtmenuname").val(GtMnuDetails.Name);
                                                        $("#spantitle").html('Menu/Team-Usertype Settings ||&nbsp;'+GtMnuDetails.Name);
                                                        
                                                        $("#txtPath").val(GtMnuDetails.Path);
                                                        $('#chkSubmenu').prop('checked', GtMnuDetails.SubMenu.data[0] == 0 ? false : true);
                                                        //$("#chkStatusIsActive").iButton("toggle", GtMnuDetails.IsActive.data[0] == 0 ? false : true);
                                                        $(".groupbuttons-group").find('.is-checked').removeClass('is-checked');

                                                        $('#DivMenuTypes').find('button:contains("' + GtMnuDetails.Type + '")').addClass('is-checked');

                                                        if (GtMnuDetails.Type == "Page") {
                                                          

                                                            $("#lstMenu option[value=" + GtMnuDetails.MenuID + "]").attr('selected', 'selected');
                                                            $("#DivselectMenu").show();
                                                            $("#DivlstMenu").show();
                                                            $("#DivselectPage").hide();
                                                            $("#DivlstPage").hide();
                                                            $("#lstMenu").attr('disabled', 'disabled');

                                                        }

                                                        else if (GtMnuDetails.Type == "Section") {

                                                            $.ajax({
                                                                type: "POST",
                                                                url: 'Rights/GetMenuByIDForSection',
                                                                data: '{"MenuID":"' + ID + '" }',
                                                                contentType: "application/json; charset=utf-8",
                                                                dataType: "json",
                                                                success: function (output) {
                                                                    debugger;
                                                                    var datas = output.d;
                                                                    $("#DivSavePageID").html(GtMnuDetails.PageID);

                                                                    $("#lstMenu option[value=" + datas.ID + "]").attr('selected', 'selected');

                                                                    $("#lstMenu").trigger("change");
                                                                    $("#DivselectMenu").show();
                                                                    $("#DivlstMenu").show();
                                                                    $("#DivselectPage").show();
                                                                    $("#DivlstPage").show();


                                                                    $("#lstMenu").attr('disabled', 'disabled');
                                                                    $("#lstPage").attr('disabled', 'disabled');
                                                                }
                                                            });
                                                            }

                                                        else if (GtMnuDetails.Type == "Menu") {

                                                            $("#DivselectMenu").hide();
                                                            $("#DivlstMenu").hide();
                                                            $("#DivselectPage").hide();
                                                            $("#DivlstPage").hide();
                                                            $('#DivMenuTypes').find('button:contains("btnmenutypes_Section")').removeClass('hover');


                                                        }


                                                     
                                                    }
                                                    else {
                                                        $("#mmsg").html("Unable to get the Menu details, please contact site admin.");
                                                        $("#MessageModal").modal("show");
                                                    }
                                                    $('#DivTeamUserTypeSetting').modal('show');
                                                    $("#pleaseWaitDialog").modal("hide");
                                                },
                                                error: function (e) {
                                                    $("#mmsg").html("OOPS! Something went wrong, please contact site administrator.");
                                                    $("#MessageModal").modal("show");
                                                }
                                            });
                                        }
                                    });


                                }

                            });

                        }

                    });
                
                }


            });
            $("#btnAllEnty").removeClass("FilterSelected");
            $("#btnNoneEnty").removeClass("FilterSelected");
            

        }

function cancelAdd() {
    SelectNoneSettings();
    $('#DivTeamUserTypeSetting').modal('hide');
    }


function Save() {
    debugger;
    if (validate()) {

            $('.YellowWarning2').html("Please wait...");
            $('.YellowWarning2').show();
            $('.Warning').hide();
            var OldID = $("#OldID").html();
            var Menutype = $("#DivMenuTypes .groupbuttons.is-checked")[0].value;
            var Submenuvalue = $('#chkSubmenu').is(":checked") ? "1" : "0";
            var isactive = $('#chkStatusIsActive').is(":checked") ? "1" : "0";
            var SelMenuID = "0";
            var SelPageID = "0";

            if (Menutype == "Page") {
                var SelMenuID = $('#lstMenu').val();
                Submenuvalue = "0";


            }
            if (Menutype == "Section") {
                if ($("#lstPage").val() == "0") {
                    $('.YellowWarning2').html("Select Page!");
                    $('.YellowWarning2').show();
                    $("#lstPage").focus();
                    return false;
                }
                SelMenuID = $('#lstMenu').val();
                SelPageID = $('#lstPage').val();
                Submenuvalue = "0";

            }
            $("#mmsg").html("Please wait...  <img src='css/images/ajax-loader.gif' />");
            $("#pleaseWaitDialog").modal("show");

            var Menuname = $("#txtmenuname").val();
            var Path = $("#txtPath").val();
            var MenuID;
            var chkDel = 0;
            var Mode = 1;

            var TeamIDs = "";
            var UsertypeIDs = "";
            $("[id^=isactive_]").each(function () {

                if ($(this)[0].src.toLowerCase().indexOf("css/images/check-on.png") >= 0) {

                    var CtrlChkID = $(this)[0].id.substring(9);
                    var ArrayTeamUsertype = CtrlChkID.split("_");

                    TeamIDs += ArrayTeamUsertype[0] + ",";

                    UsertypeIDs += ArrayTeamUsertype[1] + ",";

                }

            });

            TeamIDs = TeamIDs.slice(0, -1);
            UsertypeIDs = UsertypeIDs.slice(0, -1);


            if (OldID == "~NEW~") {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: 'Rights/AddMenuDetails',
                    data: '{"Menuname":"' + Menuname + '","Menutype":"' + Menutype + '","Path":"' + Path + '","SelMenuID":"' + SelMenuID + '","SelPageID":"' + SelPageID + '","Submenuvalue":"' + Submenuvalue + '","isactive":"' + isactive + '"}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (output, status) {
                        debugger;
                        //alert(output);
                        if (output.status == "ER_DUP_ENTRY") {
                            $("#mtitle").html("Warning");
                            $("#mmsg").html(" Menu Name  : " + Menuname + " Already exists ");
                            $("#mmsg").css("color", "red");
                            $("#pleaseWaitDialog").modal("hide");
                            $('.YellowWarning2').hide();
                            $("#MessageModal").modal("show");
                            $("#txtmenuname").select();
                            return false;
                        }

                        $("#DivSaveNewMenuID").html(output.MenuID);
                        MenuID = $("#DivSaveNewMenuID").html();
                        $.ajax({
                            type: "POST",
                            url: 'Rights/SaveTeamUsertypesettings',
                            data: '{"Menutype":"' + Menutype + '","MenuID":"' + MenuID + '","TeamIDs":"' + TeamIDs + '","UsertypeIDs":"' + UsertypeIDs + '"}',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (output) {

                                if (output.status == "saved") {
                                    $('#cssmenu').html("");
                                    $.ajax({
                                        type: "POST",
                                        url: 'Rights/GetMenuslst',
                                        data: '{}',
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (output, status) {

                                            $("#pleaseWaitDialog").modal("hide");
                                            $('#DivTeamUserTypeSetting').modal('hide');
                                            $('#cssmenu').append(output.html);
                                            if (Menutype == 'Menu') {
                                                SlideDown(OldID);
                                            }
                                            else if (Menutype == 'Page') {
                                                SlideDown(SelMenuID);
                                            }
                                            else if (Menutype == 'Section') {
                                                SlideDown($('#lstMenu').val());
                                                SlidDown(SelMenuID);
                                                //$("#Section_173").SlideDown();
                                            }
                                        }
                                    });
                                    return true;

                                }

                                else if (output.status == "ER_DUP_ENTRY") {
                                    $("#mtitle").html("Warning");
                                    $("#mmsg").html(" Menu/Page already exists! ");
                                    $("#mmsg").css("color", "red");
                                    $("#pleaseWaitDialog").modal("hide");
                                  
                                    $("#MessageModal").modal("show");
                                   
                                    $("#txtmenuname").select();
                                    return false;
                                }

                                else {
                                    $('.YellowWarning2').html(output.d);
                                    if (output.d.indexOf("UNIQUE KEY") >= 0) {
                                        $('.YellowWarning2').html("Menu/Page already exists!");
                                        $("#txtcode").focus();
                                    }
                                    else
                                        $('.YellowWarning2').html(d.output);
                                    return false;
                                }

                            },
                            error: function (e) {
                                $('.YellowWarning2').hide();
                                $('.Warning').show();
                                return false;
                            }


                        });
                    }

                });


            }
            else {

                $.ajax({
                    type: "POST",
                    url: 'Rights/EditMenuDetails',
                    data: '{"Menuname":"' + Menuname + '","Menutype":"' + Menutype + '","Path":"' + Path + '","SelMenuID":"' + SelMenuID + '","SelPageID":"' + SelPageID + '","Submenuvalue":"' + Submenuvalue + '","isactive":"' + isactive + '","ID":"' + OldID + '"}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (output, status) {

                        var data = 'valid';
                        $("#DivSaveNewMenuID").html(output.status);
                        MenuID = OldID;
                        $.ajax({
                            type: "POST",
                            url: 'Rights/SaveTeamUsertypesettings',
                            data: '{"Menutype":"' + Menutype + '","MenuID":"' + MenuID + '","TeamIDs":"' + TeamIDs + '","UsertypeIDs":"' + UsertypeIDs + '"}',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (output) {

                                if (output.status == "saved") {
                                    $('#cssmenu').html("");

                                    $.ajax({
                                        type: "POST",
                                        url: 'Rights/GetMenuslst',
                                        data: '{}',
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (output, status) {
                                            debugger;
                                            $("#pleaseWaitDialog").modal("hide");
                                            $('#DivTeamUserTypeSetting').modal('hide');
                                            $('#cssmenu').append(output.html);
                                            if (Menutype == 'Menu') {
                                                SlideDown(OldID);
                                            }
                                            else if (Menutype == 'Page') {
                                                SlideDown(SelMenuID);
                                            }
                                            else if (Menutype == 'Section') {
                                                SlideDown($('#lstMenu').val());
                                                SlidDown(SelMenuID);
                                                //$("#Section_173").SlideDown();
                                            }
                                        },
                                        error: function (err) {
                                            alert(err);
                                        }
                                    });
                                    return true;

                                }


                                else {
                                    $("#pleaseWaitDialog").modal("hide");
                                    $('.YellowWarning2').html(output.d);
                                    if (output.d.indexOf("UNIQUE KEY") >= 0) {
                                        $('.YellowWarning2').html("Menu/Page already exists!");
                                        $("#txtcode").focus();
                                    }
                                    else
                                        $('.YellowWarning2').html(d.output);
                                    return false;
                                }

                            },
                            error: function (e) {
                                $('.YellowWarning2').hide();
                                $('.Warning').show();
                                return false;
                            }


                        });
                    },
                    error: function (e) {
                        $('.YellowWarning2').hide();
                        $('.Warning').show();
                        return false;
                    }
                });
            }
        }


    
}



          function SelectAllSettings() {
              $("#btnAllEnty").addClass("FilterSelected");
              $("#btnNoneEnty").removeClass("FilterSelected");

              $("[id^=isactive_]").each(function () {
                  if ($(this)[0].src.toLowerCase().indexOf("css/images/check-off.png") >= 0) {
                      $(this).attr("src", "css/images/check-on.png");

                  }
              });

          }

          function SelectNoneSettings() {
              
              $("#btnNoneEnty").addClass("FilterSelected");
              $("#btnAllEnty").removeClass("FilterSelected");
              $("[id^=isactive_]").each(function () {
                  if ($(this)[0].src.toLowerCase().indexOf("css/images/check-on.png") >= 0) {
                      $(this).attr("src", "css/images/check-off.png");
                  }
              });
          }


          $("[id^=isactive_]").die("click").live("click", function () {
              debugger;
              $("#btnNoneEnty").removeClass("FilterSelected");
              $("#btnAllEnty").removeClass("FilterSelected");
              var sourceCtl = $(this);
              var ID = sourceCtl.attr('id').substring(9);
              if ($("#isactive_" + ID)[0].src.toLowerCase().indexOf("css/images/check-on.png") >= 0) {

                  $("#isactive_" + ID).attr("src", "css/images/check-off.png");
              }
              else if ($("#isactive_" + ID)[0].src.toLowerCase().indexOf("css/images/check-off.png") >= 0) {
                  $("#isactive_" + ID).attr("src", "css/images/check-on.png");
              }

          });

          function btnSortUp(ID, Sort, Type, MenuID)
          {
              
              var ID = ID;
              var sortID = Sort;
              var Type = Type;
              var MenuID = MenuID
              
              $.ajax({
                  type: "POST",
                  url: 'Rights/MenuSortUpByID',
                  data: '{"ID":"' + ID + '" ,"Sort":"' + sortID + '","Type":"' + Type + '" ,"MenuID":"' + MenuID + '"}',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (output, status) {
                      
                      $.ajax({
                          type: "POST",
                          url: 'Rights/GetMenuslst',
                          data: '{}',
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (output, status) {
                              $('#cssmenu').html("");
                              $('#cssmenu').append(output.html);
                              SlideDown(MenuID);
                          }
                      });

                  }
              });


          }
          function btnSortDown(ID, Sort, Type, MenuID) {
              
              var ID = ID;
                var sortID = Sort
              var Type = Type;
              var MenuID = MenuID
              
              $.ajax({
                  type: "POST",
                  url: 'Rights/MenuSortDownByID',
                  data: '{"ID":"' + ID + '" ,"Sort":"' + sortID + '","Type":"' + Type + '" ,"MenuID":"' + MenuID + '"}',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (output, status) {

                      $.ajax({
                          type: "POST",
                          url: 'Rights/GetMenuslst',
                          data: '{}',
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (output, status) {
                              $('#cssmenu').html("");
                              $('#cssmenu').append(output.html);
                              SlideDown(MenuID);
                          }
                      });

                  }
              });

          }

          function AddMenu() {
              $('.modal ').insertAfter($('body'));

              debugger;
              $(".groupbuttons-group").find('.is-checked').removeClass('is-checked');
              $("#btnMenu").addClass("is-checked");
              $("#txtmenuname").val("");
              $("#txtPath").val("");
             //$("#chkStatusIsActive").iButton("toggle", true);
              //$("#chkSubmenu").iButton("toggle", false);
              $("#OldID").html("~NEW~");
              $(".YellowWarning2").hide();
              $(".Warning").hide();
              $("#DivselectMenu").hide();
              $("#DivlstMenu").hide();
              $("#DivselectPage").hide();
              $("#DivlstPage").hide();
              $("#Divsubmnu").show();
              $("#DivchSubmenu").show();
              $("#lstPage").removeAttr('disabled', 'disabled');
              $("#lstMenu").removeAttr('disabled', 'disabled');
              $("#lstMenu").val("0");
              $('#DivMenuTypes').find('button:contains("Menu")').addClass('is-checked');
              $("#spantitle").html("Menu/Team-Usertype Settings || New");
              btnAddMenu();
              $("#DivSavePageID").html("");
          }


          //$("#chkStatusIsActive").iButton({
          //    labelOn: "Active",
          //    labelOff: "InActive"
          //});

          //$("#chkSubmenu").iButton({
          //    labelOn: "Yes",
          //    labelOff: "No"
          //});




          function btnAddMenu()
          {
            
           
              
              $('.YellowWarning2').hide();
              $('.AdminsettingsYellowWarning').hide();
              $('.AdminsettingsWarning').hide();

              $("#mmsg").html("Please wait...  <img src='css/images/ajax-loader.gif' />");
              $("#pleaseWaitDialog").modal("show");
               $.ajax({
                  type: "POST",
                  url: 'Rights/LoadUsertypeSetting',
                  data: '{}',
                  contentType: "application/json; charset=utf-8",
                  //dataType: "json",
                  success: function (output) {
                      debugger;
                     
                      $("#tblTeamUser").html("");
                      $("#trUsertype").html("");
                      $("#tblTeamUser").html('<tr id="trUsertype"><td style="width: 50px;height:30px;"><div style="line-height: 26px;height: 30px;text-align: center;color: black; font-size: 14px;">Team/UserType</div></td></tr>');
                      $("#trUsertype").append(output);

                      $.ajax({
                          type: "POST",
                          url: 'Rights/LoadTeamSetting',
                          data: '{}',
                          contentType: "application/json; charset=utf-8",
                          //dataType: "json",
                          success: function (output) {
                             
                              $('#tblTeamUser').append(output);
                              $("#pleaseWaitDialog").modal("hide");
                              $('#DivTeamUserTypeSetting').modal('show');
                           
                             
                          }
                      });
                  },
                  error: function (err) {
                      debugger;
                      alert(err.responseText);
                  }
              });
                                                
              $("#btnAllEnty").removeClass("FilterSelected");
              $("#btnNoneEnty").removeClass("FilterSelected");
            

          }

    

          $('Div.groupbuttons-group').each(function (i, buttonGroup) {
              debugger;
              var $buttonGroup = $(buttonGroup);

              $buttonGroup.on('click', 'button', function () {
                  
                  if ($("#spantitle").html().trim() == "Menu/Team-Usertype Settings || New")
                  {
                  $buttonGroup.find('.is-checked').removeClass('is-checked');
                  $(this).addClass('is-checked');
              }


              });
          });



          $("[id^=btnmenutypes_]").die("click").live("click", function (e) {
              debugger;
              $('.groupbuttons').removeClass('is-checked');
              $(this).addClass('is-checked');
              var getName = $(this).attr('id').substring(13);
              if ($("#spantitle").html().trim() == "Menu/Team-Usertype Settings || New") {
                  if (getName == "Page") {
                      debugger;
                      $("#DivselectMenu").show();
                      $("#DivlstMenu").show();
                      $("#DivselectPage").hide();
                      $("#DivlstPage").hide();
                      ldmnus();
                      $('img[id^="isactive_"]').attr("src", "css/images/check-off.png");
                      $('img[id^="isactive_"]').prop("disabled", true);
                        }
                  else if (getName == "Menu") {
                      $("#DivselectMenu").hide();
                      $("#DivlstMenu").hide();
                      $("#DivselectPage").hide();
                      $("#DivlstPage").hide();
                      $('img[id^="isactive_"]').prop("disabled", false);
                      $('img[id^="isactive_"]').attr("src", "css/images/check-off.png");
                      $('img[id^="isactive_').css('cursor', 'pointer');

                  }
                  else if (getName == "Section") {
                      //$('img[id^="isactive_"]').attr("src", "css/images/close.png");
                      //$('img[id^="isactive_').css('cursor', 'default');
                      $('img[id^="isactive_"]').prop("disabled", true);
                      $("#lstPage").removeAttr('disabled', 'disabled');
                      $("#lstPage").empty();
                      $("#lstPage").append("<option id='0' value='0'>--Select--</option>");
                      $("#DivselectMenu").show();
                      $("#DivlstMenu").show();
                      $("#DivselectPage").show();
                      $("#DivlstPage").show();
                       }
              }
          });


          //$("#lstMenu").change(function () {
          //$('#lstMenu').on('change', function () {
          $(document).on("change", '#lstMenu', function () {
              debugger;
              if ($("#lstPage").css('display') == 'inline-block') {
                      var ID = $(this).val();
                  $("#lstPage").empty();
                  $("#lstPage").append("<option id='0' value='0'>--Select--</option>");

                  $.ajax({
                      type: "POST",
                      url: 'Rights/LoadPage',
                      data: '{"ID":"' + ID + '"}',
                      contentType: "application/json; charset=utf-8",
                      dataType: "json",
                      success: function (output) {
                          debugger;
                          var data = output;
                          for (var i in data) {

                              var LoadPage = data[i];

                              $("#lstPage").append("<option id='pageName_" + LoadPage.Id + "' value='" + LoadPage.Id + "'>" + LoadPage.Name + "</option>");
                              if ($("#DivSavePageID").html() != "") {
                                  $("#lstPage option[value=" + $("#DivSavePageID").html() + "]").attr('selected', 'selected');
                              }
                          }

                          var ID = $("#lstMenu").val();
                          $('img[id^="isactive_"]').prop("disabled", false);
                          //if ($("#DivMenuTypes .groupbuttons.is-checked")[0].value != "Section") {
                          //$.ajax({
                          //    type: "POST",
                          //    url: 'Rights/getAccessValues',
                          //    data: '{"MenuID":"' + ID + '"}',
                          //    contentType: "application/json; charset=utf-8",
                          //    dataType: "json",
                          //    success: function (output) {
                          //        debugger;
                          //        $('img[id^="isactive_"]').attr("src", "css/images/close.png");
                          //        $('img[id^="isactive_').css('cursor', 'default');
                          //        var data = output.d;
                          //        for (var i in data) {
                          //            var getUserandTeamID = data[i];
                          //            $("#isactive_" + getUserandTeamID.UTypeIDandTeamID).attr("src", "css/images/check-off.png");
                          //            $("#isactive_" + getUserandTeamID.UTypeIDandTeamID).css('cursor', 'pointer');
                          //        }
                          //    }

                          //});

                      }
                  });
              }
              
                        

            


              //}
              //else {
              //    $('img[id^="isactive_"]').attr("src", "css/images/close.png");
              //    $('img[id^="isactive_').css('cursor', 'default');
              //}
          });

          function DeleteID(ID,MenuID) {
              
              var ID = ID;
              var MenuID = MenuID;
              $('#MenuID').html(MenuID);
              $('.YellowWarning2').hide();
              $('#OldID').html(ID);
              $.ajax({
                  type: "POST",
                  url: 'Rights/GetMenusDetByID',
                  data: '{"ID":"' + ID + '" }',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (output, status) {
                      debugger;
                      if (output.status == "validdata") {
                          $('#msg').html("Contain Submenus Unable to Delete It!.. ");
                          $('#MessageModal').modal("show");
                      }
                      else {
                        
                          $("#DeleteModal").modal("show");
                     }

                  }
              });
          }

          $("#btnMDelete").live("click",function () {
              debugger;
              var ID = $("#OldID").html();
              var MenuID = $("#MenuID").html();
              $.ajax({
                  type: "POST",
                  url: 'Rights/DeleteMenuDetails',
                  data: '{"DelID":"' + ID + '","MenuID":"' + MenuID + '"}',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (output, status) {
                      if (output.status == 'deleted') {
                          $("#DeleteModal").modal("hide");
                          $('#cssmenu').html("");
                          $.ajax({
                              type: "POST",
                              url: 'Rights/GetMenuslst',
                              data: '{}',
                              contentType: "application/json; charset=utf-8",
                              dataType: "json",
                              success: function (output, status) {

                                  $('#cssmenu').html("");
                                  $('#cssmenu').append(output.html);
                                  SlidDown(ID);
                                  // SlidDown(ID);
                              }
                          });
                      }
                      else {
                          $("#DeleteModal").modal("hide");
                          $("#mmsg").html("There was an error during delete action");
                          $("#MessageModal").modal("show");
                      }
                  }
              });
          });


