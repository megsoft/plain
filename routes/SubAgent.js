/*
 * GET Constant listing.
 */
var cnt = 0;
var totalrows = 0;
var pagetype = '"SUBAGENT"';
var db = require('./db');
var logger = require('./logger');

exports.SubAgentlist = function (req, result) {
    if (req.session.userId <= 0) {

        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    else if (typeof (req.session.userId) == "undefined") {
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }


  
    var flexiformat = '';
    var count = 'none'
    var async = require('async');
    var existsCount; //Define `existsCount` out here, so both tasks can access the variable
    async.series([
        //Load Access to get `existsCount` first
        function (callback) {
          
            var PageName = "SubAgent";
            var Query = "select Count(ac.Id) as Count  from tblAccess ac join tblMenu mn on mn.Id = ac.MenuId where mn.Path like '%" + PageName + "%' and ac.RoleId =" + req.session.RoleId + "";
          
            db.query(Query, function (err, rows) {
               
                if (!err) {
                    jsondata = rows[0];
                    if (rows[0].Count > 0) {
                        existsCount = rows[0].Count;
                    }
                    else {
                        existsCount = 0;
                    }
                }
                callback();
            });

        },
        function (callback) {
            if (existsCount > 0) {

                var flexiformat = '';
                var mysql = require('mysql');


                var Query = "CALL GetUser(' tbl.Id  <> 0 and tbl.UserType=" + pagetype + " ','',0,10);";
                db.query(Query, function (err, rows) {
                   
                    if (!err) {
                        var page = 1;
                        var totalrows = eval(rows[1])[0].cnt;
                        // flexi grid json data formatting code
                        flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
                        for (j = 0; j < eval(rows[0]).length; j++) {
                            var row = eval(rows[0])[j];

                            flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=itemedit_' + row.Id + ' >' + row.FirstName + '</a></b>" ,"' + row.LastName + '","' + row.Address + '","' + row.CountryName + '","' + row.StateName + '","' + row.CityName + '","' + row.Phone + '", "<b><a  id=itemdelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
                        }
                        flexiformat = flexiformat.substring(0, flexiformat.length - 1);
                        flexiformat += '] }';

                    }
                    else
                        logger.info('Error while performing Query :' + err);

                });

                // sending final formatted json to view (html) & rendering page
                result.render('PageSubAgent', {
                    page_title: "Agent",
                    data: flexiformat
                });
            }
            else {
                result.render('PageDashboard', { title: 'Letter Of Credit Application :' });
            }
        }
    ]);


};

// get all data by filtering & sorting conditions to fill flexigrid....
exports.GetSubAgentData = function (req, result) {
    var flexiformat = '';
   
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';

    wherecond = " tbl.Id <> 0 and tbl.UserType=" + pagetype + " ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond = " tbl.UserType=" + pagetype + " and  " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " ";
    }

    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    var start = ((req.body.page - 1) * req.body.rp);
    var rp = req.body.rp;

    var Query="CALL GetUser('" + wherecond + "','" + sort + "'," + start + "," + rp + ");";
    db.query(Query, function (err, rows) {
        if (!err) {


            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];

                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=itemedit_' + row.Id + ' >' + row.FirstName + '</a></b>" ,"' + row.LastName + '","' + row.Address + '","' + row.CountryName + '","' + row.StateName + '","' + row.CityName + '","' + row.Phone + '", "<b><a  id=itemdelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';

        }
        else {
            logger.info('Error while performing Query :' + err);

        }
        result.writeHead(200, { 'Content-Type': 'application/json' });

        // sending final formatted json to html
        result.end(flexiformat);
    });


}

/* Insert New Record */
exports.save = function (req, res) {

    
    var Active = 0;
    if (req.body.IsActive == "Yes") {
        Active = 1;

    }

    else {
        Active = 0;
    }
    var AgentId = req.session.userId;
    var Query = "insert into tblUser  (FirstName,Initial,LastName,Address,CountryId,StateId,CityId,Phone,Mobile,Email,ZipCode,IsActive,UserType,RoleId,AgentId,SubAgentId) values ('" + req.body.FirstName + "','" + req.body.Initial + "','" + req.body.LastName + "','" + req.body.Address + "'," + req.body.CountryId + "," + req.body.StateId + "," + req.body.CityId + ",'" + req.body.Phone + "','" + req.body.Mobile + "','" + req.body.Email + "','" + req.body.Zipcode + "','" + Active + "','SUBAGENT','78','" + AgentId + "','0')";
    db.query(Query, function (err, rows, fields) {

        if (!err) {
            logger.info(res);
            var jsonResponse = JSON.stringify({
                status: 'saved'
            });
            res.end(jsonResponse);
        }
        else {
            logger.info('Error while performing Query.' + err);
            var jsonResponse = JSON.stringify({
                status: err.code
            });
            res.end(jsonResponse);
        }

    });


};

/* Edit,Delete ,get single record (by Id from Constant table ) process */
exports.transact = function (req, result) {
    logger.info('transact');

    

    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {

        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var AgentId = req.session.userId;
        var SubAgentId = req.session.SubAgentId;
        var Query = "update tblUser set FirstName='" + req.body.FirstName + "',Initial='" + req.body.Initial + "',LastName='" + req.body.LastName + "' ,Address='" + req.body.Address + "',CountryId=" + req.body.CountryId + ",StateId=" + req.body.StateId + ",CityId=" + req.body.CityId + ",ZipCode='" + req.body.Zipcode + "',Email='" + req.body.Email + "',Phone='" + req.body.Phone + "',Mobile ='" + req.body.Mobile + "',AgentId ='" + AgentId + "',SubAgentId ='" + SubAgentId + "' where Id=" + req.body.Id + "";
    db.query(Query, function (err, rows, fields) {
            if (!err) {
                result.end(jsonResponse);
            }
            else
                logger.info('Error while performing Query :' + err);
        });
    }
      /* invite code */
    else if (req.body.Id > 0 && req.body.action == "invite") {
        
        var jsonResponse = JSON.stringify({
            status: 'invited'
        });
        req.session.Div = "Yes";
        var Query = "update tblUser set Password='" + req.body.Password + "' where Id=" + req.body.Id + "";
        db.query(Query, function (err, rows, fields) {
            if (!err) {
               
                var path = __dirname + "\\logo.png";
                var htmlcontent = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600'> " 
                    + " <tr>" 
                    + " <td style='padding-top:20px;padding-right:20px;padding-left:20px'> " 
                    + "   <table border='0' cellspacing='0' cellpadding='0' width='560' align='center'> " 
                    + "      <tbody><tr>" 
                    + "  <td align='left' width='450'>" 

                    + "    <h1 style='font- size:15px; font - weight:bold; font - family:Arial, Helvetica, sans - serif; line - height:28px; color: Grey'>Hi " + req.body.FirstName + ",Your Password is " + req.body.Password + "</h1>" 
                    + "   </td>" 
                    + "  <td align='left' width='110'>" 

                    + "   <a href='http://localhost:1337/ClientProfile?id=" + req.body.Id + "' style='line-height:0' target='_blank' data-saferedirecturl='https://www.google.com/url?hl=en&amp;q=http://www.skype.com/&amp;source=gmail&amp;ust=1467271905415000&amp;usg=AFQjCNFKE8GBj2PDd1AVpc6w0golHNm9og'>" 
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
                    + " Your new SGTFinancial account " + req.body.Email + " has been set.<br>" 
                    + " <br>" 
                    + "  You can now <a style='text- decoration:underline; color: #00aff0; font - weight:bold' href='http://localhost:1337/ClientProfile?id=" + req.body.Id + "' > Create password for your account</a>, view your profile or change your account settings.</div> " 
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
                    to: req.body.Email, // list of receivers
                    subject: 'SGT Credit Application Verification', // Subject line
                    text: 'Welcome !', // plaintext body
                    html: htmlcontent // html body
                }

                // send mail with defined transport object
                mailer.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        logger.info(error);
                    } else {
                        logger.info("Message sent: " + response.message);
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
                
                result.end(jsonResponse);
            }
            else
                logger.info('Error while performing Query :' + err);
        });


    }
    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
        var jsonResponse = JSON.stringify({
            status: 'deleted'
        });
        db.query("delete FROM tblUser WHERE Id=" + req.body.Id, function (err, rows, fields) {
            if (!err) {
                result.end(jsonResponse);
            }
            else
                logger.info('Error while performing Query :' + err);
        });


    }

    /* download click */
    else if (req.body.Id <= 0 && req.body.action == "down") {
        /*do code for download */
    }

    /* Get Record by Id */
    else {

        var i = 1;
        var jsondata = '[';

        db.query("SELECT * FROM tblUser WHERE id=" + req.body.Id, function (err, rows, fields) {
            if (!err) {
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
                logger.info('Error while performing Query :' + err);
        });




    }

};