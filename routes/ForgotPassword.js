

/*
 * GET home page.
 */
var connection = require('./db');
var logger = require('./logger');

exports.Load = function (req, res) {
    res.render('PageForgotPassword', { title: 'Letter Of Credit Application :' });
};

exports.validate = function (req, res) {
    var query = "";



    var AdmZip = require('adm-zip');

    var zip = new AdmZip();

    // add file directly
      //  zip.addFile("test.txt", new Buffer("inner content of the file"), "entry comment goes here");
    // add local file
          //  zip.addLocalFile("app.js");
    zip.addLocalFolder("public/Files/264");
    // get everything as a buffer
    var willSendthis = zip.toBuffer();
    // or write everything to disk
    zip.writeZip("public/zip/264.zip");



    var uname = "'" + req.body.UserName + "'";
    var pwd = "'" + req.body.Password + "'";
    req.session.username = uname;


    query = "SELECT * FROM tblUser WHERE Email=" + uname + " ";
    connection.query(query, function (err, rows) {
        if (!err) {
            var jsonResponse = "";
            
            if (rows.length > 0) {
                req.session.userId = rows[0].Id;
                req.session.UserType = rows[0].UserType;
                req.session.IsActive = rows[0].IsActive;
                req.session.IsAdmin = rows[0].IsAdmin;
                req.session.AgentId = rows[0].AgentId;
                req.session.SubAgentId = rows[0].SubAgentId;
                req.session.RoleId = rows[0].RoleId;
                req.session.FirstNme = rows[0].FirstName;
                req.session.Email = rows[0].Email;
                jsonResponse = JSON.stringify({
                    status: 'VALID',
                    UserId: rows[0].Id,
                    Msg:'Success'
                });
                var UpdateQuery = "update tblUser set Password ='" + req.body.Password + "' where Id=" + req.session.userId + "";
                
                connection.query(UpdateQuery, function (err, rows) {
                    if (!err) {
                        var hrefhost = "";
                        if (req.session.UserType == 'AGENT') {
                            hrefhost = 'http://localhost:1337/AgentProfile?id=';
                        }
                        else if (req.session.UserType == 'SUBAGENT') {
                            hrefhost = 'http://localhost:1337/SubAgentProfile?id=';
                        }
                        else if (req.session.UserType == 'CLIENT') {
                            hrefhost = 'http://localhost:1337/ClientProfile?id=';
                        }
                        //////////////////////////////////////Password send to Email//////////////////////////////////////////
                        //var nodemailer = require('nodemailer');
                        
                        //// create reusable transporter object using the default SMTP transport 
                        //var transporter = nodemailer.createTransport({
                        //    service: 'gmail',
                        //    auth: {
                        //        user: 'megsoftbs@gmail.com',
                        //        pass: 'megsoft$123'
                        //    }
                        //});
                   
                        var path = __dirname + "\\logo.png";
                        var htmlcontent = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600'> " 
                    + " <tr>" 
                    + " <td style='padding-top:20px;padding-right:20px;padding-left:20px'> " 
                    + "   <table border='0' cellspacing='0' cellpadding='0' width='560' align='center'> " 
                    + "      <tbody><tr>" 
                    + "  <td align='left' width='450'>" 

                    + "    <h1 style='font- size:15px; font - weight:bold; font - family:Arial, Helvetica, sans - serif; line - height:28px; color: Grey'>Hi " + req.session.FirstNme + ",Your Password is " + req.body.Password + "</h1>" 
                    + "   </td>" 
                    + "  <td align='left' width='110'>" 

                    + "   <a href='" + hrefhost + "" + req.session.userId + "' style='line-height:0' target='_blank' data-saferedirecturl='https://www.google.com/url?hl=en&amp;q=http://www.skype.com/&amp;source=gmail&amp;ust=1467271905415000&amp;usg=AFQjCNFKE8GBj2PDd1AVpc6w0golHNm9og'>" 
                    + "   <img src='" + path + "' border='0' alt='www.sgtfinancial.com' vspace='20' class='CToWUd'>" 
                    + "  </a>" 
                    + " </td>" 
                    + " </tr>" 
                    + " </tbody></table>" 
                    + " </td>" 
                    + "</tr>" 
                    + " <tr>" 
                     + " <td style='padding- top:40px; padding - right:20px; padding - left:20px'>" 
                    + " <h2 style='font- weight:bold; font - size:24px; font - family:Helvetica, Arial, sans - serif; line - height:26px; color: #999; margin: 0'>Your Account Regitered Successfully...</h2>" 
                    + "  </td>" 
                    + " </tr>" 
                    + " <tr>" 
                    + " <td style='padding: 20px 20px'>" 
                    + "  <div style='font: normal 14px Helvetica, Arial, sans - serif; line - height:19px; color: #333'>" 
                    + " Your new SGTFinancial account " + req.session.Email + " has been set.<br>" 
                    + " <br>" 
                    + "  You can now <a style='text- decoration:underline; color: #00aff0; font - weight:bold' href='" + hrefhost + "" + req.session.userId + "' > Create password for your account</a>, view your profile or change your account settings.</div> " 
                    + " </td>" 
                    + " </tr>" 
                    + " </table>";


                        var nodemailer = require('nodemailer');

                        // create reusable transporter object using the default SMTP transport 
                        var mailer = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'megsoftbs@gmail.com',
                                pass: 'megsoft$123'
                            }
                        });


                        // setup e-mail data with unicode symbols 
                        var mailOptions = {
                            from: 'megsoftbs@gmail.com', // sender address
                            to: req.session.Email, // list of receivers
                            subject: 'SGT Credit Application Verification', // Subject line
                            text: 'Welcome !', // plaintext body
                            html: htmlcontent // html body 
                        };
                        
                        // send mail with defined transport object 
                        mailer.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                
                                jsonResponse = JSON.stringify({
                                    status: 'INVALID',
                                    UserId: "0",
                                    Msg: "Mail Not Sent." + error
                                });
                                res.end(jsonResponse);
                                return console.log(error);
                            }
                            else {
                                console.log('Message sent: ' + info.response);
                                jsonResponse = JSON.stringify({
                                    status: 'VALID',
                                    UserId: "0",
                                    Msg: "Mail Sent successfully." + info.response
                                });
                                res.end(jsonResponse);
                            }
                        });
                        
                    }
                    else {
                        logger.info('Error while performing Query.' + err);
                    }
                });
            }
            else {
                jsonResponse = JSON.stringify({
                    status: 'INVALID',
                    UserId: 0
                });
                res.end(jsonResponse);
            }
           
        }
        else {
            logger.info('Error while performing Query.' + err);
        }
    });



};
