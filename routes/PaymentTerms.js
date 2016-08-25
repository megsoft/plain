﻿/*
 * GET PaymentTerms listing.
 */
var cnt = 0;
var db = require('./db');
var totalrows = 0;
//var logger = require('./logger');
exports.GetPaymentTermslist = function (req, result) {

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
        //Load user to get `existsCount` first
        function (callback) {
           
            var PageName = "PaymentTerms";
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
        //Load Country (won't be called before task 1's "task callback" has been called)
        function (callback) {
            
            if (existsCount > 0) {
              
    
    
    db.query("CALL GetPaymentTerms('Id  <> 0 ','',0,10);", function (err, rows) {
        if (!err) {
            
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            // flexi grid json data formatting code
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            
            
            
            
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.Type + '</a></b>" , "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';




        }
        else
            console.log('Error while performing Query.');

    });
    console.log('before head');
      
    // sending final formatted json to view (html) & rendering page
    result.render('PagePaymentTerms', {
        page_title: "PaymentTerms - Node.js",
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
exports.GetPaymentTermsData = function (req, result) {
    var flexiformat = '';
    console.log("Function Getdata..........");
    var count = 'none'
   
    
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    wherecond = " Id <> 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond += " and   " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }
    
    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    
    var start = ((req.body.page - 1) * req.body.rp);
    
    var rp = req.body.rp;
    
    
    
    
   db.query("CALL GetPaymentTerms('" + wherecond + "','" + sort + "'," + start + "," + rp + ");", function (err, rows) {
        if (!err) {
            
            
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
                for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.Type + '</a></b>" , "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
                
              
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
        }
        else {
            console.log('Error while performing Query:'+err);
        }
        
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });


}
/* Insert New Record */
exports.save = function (req, res) {
    
    console.log('save process initialized...');
    var jsonResponse = JSON.stringify({
        status: 'saved'
    });
   
    var Query = "insert into tblPaymentTerms  (Type) values ('" + req.body.Type + "')";
   db.query(Query, function (err, rows, fields) {
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


};

/* Edit,Delete ,get single record (by Id from tblcountry table ) process */
exports.transact = function (req, result) {
    console.log('transact');
    
    
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {
        
        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var Query = "update tblPaymentTerms set Type='" + req.body.Type + "' where Id='" + req.body.Id + "'";
        db.query(Query, function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                result.end(jsonResponse);
            }
            else
                console.log('Error while performing Query.');
        });


    }
    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
       
        var query = "delete FROM tblPaymentTerms WHERE Id=" + req.body.Id;
        db.query(query, function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                var jsonResponse = JSON.stringify({
                    status: 'deleted'
                });
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
         /* download click */
    else if (req.body.Id <= 0 && req.body.action == "down") {
       /*do code for download */        
    }
    /* Get Record by id */
    else {
        
        console.log('Get Record by id');
        console.log(req.body.Id);
        var i = 1;
        var jsondata = '[';
        var query = "SELECT * FROM tblPaymentTerms WHERE Id=" + req.body.Id;
          db.query(query, function (err, rows, fields) {
            if (!err) {
                console.log(JSON.stringify(rows));
                console.log(JSON.stringify(rows[0]));
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
                console.log('Error while performing Query.');
        });

    }

};