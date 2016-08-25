

$(document).ready(function () { 
    var jsondataResource = JSON.stringify({ action: 'GetSession' });   
    $.ajax({
        type: "GET",
        url: '../Common/GetSession',
        data: jsondataResource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (output) {
            debugger;
            var Type = "";
            var UserId = 0;
            if (output.username.trim() =="") {
                $("#lblCurrentUser").html('-');
                $("#lblLogOut").html('Login');
                $('#lblLogOut').css({ 'visibility': 'hidden' });
                $('#lblCurrentUser').css({ 'visibility': 'hidden' });
                $('#imgCurrentUser').css({ 'visibility': 'hidden' });
                $('#imgLogout').css({ 'visibility': 'hidden' });
                $('#topnav').css({ 'visibility': 'hidden' });
                
            }
            else {
                Type = output.UserType;
                UserId = output.userId;
                if (Type == "ADMIN") {
                    anchorpath = "AdminProfile?id=" + UserId + "";
                }
                else if (Type == "AGENT") {
                    anchorpath = "AgentProfile?id=" + UserId + "";
                }
                else if (Type == "SUBAGENT") {
                    anchorpath = "SubAgentProfile?id=" + UserId + "";

                }
                else if (Type == "CLIENT") {
                    anchorpath = "ClientProfile?id=" + UserId + "";
                }
                $("#lblCurrentUser").html(output.username);
                $("#lblCurrentUser").attr('href', "" + anchorpath + "");
                $("#lblLogOut").html('Logout');

              
            }
        },
        error: function (err) {

        }
    });

})