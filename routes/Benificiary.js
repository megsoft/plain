/*
 * GET Benificiary listing.
 */
var cnt = 0;
var totalrows = 0;
var connection = require('./db');
//var logger = require('./logger');
exports.BenificiaryList = function (req, result) {
    //if (req.session.UserType == "ADMIN") {
        
    //    result.render('PageDashboard', { title: 'Letter Of Credit Application :' });
    //}
    if (req.session.userId <= 0) {
        
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    else if (typeof (req.session.userId) == "undefined") {
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    
    var mysql = require('mysql');
    
    var flexiformat = '';
    var count = 'none'
    
    
    
    var async = require('async');
    var existsCount; //Define `existsCount` out here, so both tasks can access the variable
    async.series([
        //Load user to get `existsCount` first
        function (callback) {
            
            
            var PageName = "Benificiary";
            var Query = "select Count(ac.Id) as Count  from tblAccess ac join tblMenu mn on mn.Id = ac.MenuId where mn.Path like '%" + PageName + "%' and ac.RoleId =" + req.session.RoleId + "";
           
            connection.query(Query, function (err, rows) {
                
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
        //Load Country (won't be called before task 1's "task callback" has been called)
        function (callback) {
            
            if (existsCount > 0) {
                
                
   connection.query("CALL GetBenificiary('tbl.Id  >  0 ','',0,10);", function (err, rows) {
 
        if (!err) {
         var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
           for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.LegalName + '</a></b>" ,"' + row.CompanyDBA + '","' + row.Address + '", "' + row.CountryName + '","' + row.User + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1); 
            flexiformat += '] }';
        
        }
        else
            console.log('Error while performing Query.'+err);

    });
    
    
    // sending final formatted json to html
    
    
    result.render('PageBenificiary', {
        page_title: "Benificiary - Node.js",
        data: flexiformat
    });
            }
            else {
                result.render('PageDashboard', { title: 'Letter Of Credit Application :' });
                               
            }
        }
    ]);


};
// get all data by filtering & sorting conditions....
exports.GetBenificiaryData = function (req, result) {
    var flexiformat = '';
    console.log("Function Getdata..........");
    var count = 'none'
  
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    wherecond = "tbl.Id > 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond += " and   " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }
    
    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    
    var start = ((req.body.page - 1) * req.body.rp);
    
    var rp = req.body.rp;
    var Query = "CALL GetBenificiary('" + wherecond + "','" + sort + "'," + start + "," + rp + ");";
    connection.query(Query, function (err, rows) {
        
        if (!err) {
           var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
           for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.LegalName + '</a></b>" ,"' + row.CompanyDBA + '", "' + row.Address + '","' + row.CountryName + '", "' + row.User + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';

               
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
           }
        else {
            console.log('Error while performing Query.'+err);
            
        }
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });
}
/* Insert New Record*/
exports.save = function (req, res) {

    console.log('save process initialized...');
    var jsonResponse = JSON.stringify({
        status: 'saved'
    });
    var query = "";
    var AgentId;
    var AgentIdSelect = "";
    AgentIdSelect = "select * from  tblUser where Id=" + req.session.userId;
    connection.query(AgentIdSelect, function (err, row, fields) {
        
        if (!err) {
            
            if (row[0].UserType == "AGENT") {
                AgentId = req.session.userId;
            }
            else {
                AgentId = row[0].AgentId;
            }
            

            query = "insert into tblBenificiary  (LegalName,CompanyDBA,Address, CountryId,RefLedgerId) values ('" + req.body.LegalName + "', '" + req.body.CompanyDBA + "','" + req.body.Address + "','" + req.body.CountryId + "','" + AgentId + "')";
            connection.query(query, function (err, rows, fields) {
                
                if (!err) {
                    
                    var jsonResponse = JSON.stringify({
                        status: 'saved'
                    });
                    res.end(jsonResponse);
                }
                else {
                    console.log('Error while performing Query.' + err);
                    var jsonResponse = JSON.stringify({
                        status: err.code
                    });
                    res.end(jsonResponse);
                }
            });

        }
        else
            console.log('Error while performing Query.' + err);
    });

        
    

};

/* Edit,Delete ,get single record (by Id from tblBenificiary table ) process */
exports.transact = function (req, result) {
    console.log('transact');
    var query = "";
    var AgentId;
    
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {
        
        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var AgentIdSelect = "";
        AgentIdSelect = "select * from  tblUser where Id=" + req.session.userId;
        connection.query(AgentIdSelect, function (err, row, fields) {
            
            if (!err) {
                
                if (row[0].UserType == "AGENT") {
                    AgentId = req.session.userId;
                }
                else {
                    AgentId = row[0].AgentId;
                }
                
                
                query = "update tblBenificiary set LegalName='" + req.body.LegalName + "',CompanyDBA='" + req.body.CompanyDBA + "',Address='" + req.body.Address + "',CountryId='" + req.body.CountryId + "',RefLedgerId='" + AgentId + "' where id='" + req.body.Id + "'";
                connection.query(query, function (err, rows, fields) {
                    
                    if (!err) {
                        
                        result.end(jsonResponse);
                    }
                    else
                        console.log('Error while performing Query.' + err);
                });


            }
            else
                console.log('Error while performing Query.' + err);
        });

        
        

    }
    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
      
        query = "delete FROM tblBenificiary WHERE id=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {
           
            if (!err) {
                var jsonResponse = JSON.stringify({
                    status: 'deleted'
                });
                console.log(rows);
                result.end(jsonResponse);
            }
            else {
                console.log('Error while performing Query.' + err);
                var jsonResponse = JSON.stringify({
                    status: err.code
                });
                result.end(jsonResponse);
            }
        });


    }
         
    /* Get Record by Id */
    else {
          var i = 1;
          var jsondata = '[';
        query = "SELECT * FROM tblBenificiary WHERE Id=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {
            
            if (!err) {
                console.log(JSON.stringify(rows));
                console.log(JSON.stringify(rows[0]));
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
                console.log('Error while performing Query.' + err);
        });





    }

};