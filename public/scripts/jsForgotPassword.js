
$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    $("#Msg").css('visibility', 'hidden');
    $("#btnforgotpassword").click(function () {
        
        if ($("#txtEmail").val().trim() != "") {
            forgotpassword();
        }
        else {

        }
    });
   
    //End Events
 			
});
//Function

function validate() {
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
    
    return true;

}
function randomPassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}
function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}
/* insert new record by ajax post method */
function forgotpassword() {
    if (validate()) {
        var password = randomPassword(10);
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'login', UserName: $("#txtEmail").val().trim(),Password : password });
        xhr = $.ajax({
            type: "POST",
            url: "../ForgotPassword/validate",      
            data: jsondataResource ,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (Result) {
                debugger;    
                if (Result.status == "VALID") {
                   // $("#Msg").css('visibility', 'visible');
                    
                    $("#mmsg").html("Password sent to your Email..");
                    $("#mmsg").css("color", "green");
                    $("#MessageModal").modal("show");
                   // window.location = '../Login';
                }
                else if (Result.status == "INVALID")  {
                    $("#mmsg").html(Result.Msg);
                    $("#mmsg").css("color", "Red");
                    $("#MessageModal").modal("show");
                }
            },
            error: function (err) {
                
                alert('error' + err);
	 
            }
        });
        
        return xhr;
    }
}
/* clear all html controls when cancel click */
function cancelAdd() {    
    $("#txtUserName").val('');
    $("#Id").html('');
    $("#txtPassword").val('');  
}