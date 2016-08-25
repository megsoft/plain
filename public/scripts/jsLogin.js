
$(document).ready(function () {

    //Events
    $("#btncancel").click(function () {
        
        cancelAdd();
    });
    /* choose save or update method whecn click save */
    $("#btnlogin").click(function () {
        
        if ($("#txtUserName").val().trim() != "") {
            Login();
        }
        else {

        }

    });
    
    
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
//save validation
function validate() {
    
    if ($("#txtUserName").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid User Name ");
        $(".YellowWarning").show();
        $("#txtUserName").focus();
        
        return false;
    }
    if ($("#txtPassword").val().trim() == "") {
        $(".YellowWarning").html("Enter Valid Password ");
        $(".YellowWarning").show();
        $("#txtPassword").focus();
        
        return false;
    }
    return true;

}
/* insert new record by ajax post method */
function Login() {
    
    if (validate()) {
        
        var xhr;
        var jsondataResource = JSON.stringify({ action: 'login', UserName: $("#txtUserName").val().trim(), Password: $("#txtPassword").val() });
        xhr = $.ajax({
            type: "POST",
            url: "../Login/validate",      
            data: jsondataResource ,
            contentType: 'application/json', // content type sent to server
            dataType: 'json', // Expected data format from server
            processdata: true, // True or False
            crossDomain: true,
            success: function (Result) {
                if (Result.status == "VALID") {

                    $("#lblCurrentUser").html($("#txtUserName").val());
                    window.location = '../Dashboard';
                   

                }
                else {
                    $(".YellowWarning").html("Enter Valid User Name or password ");
                    $(".YellowWarning").show();
                    
                    $("#txtUserName").focus();
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


function forgotpassword() {



}