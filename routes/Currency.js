/*
 * GET Country listing.
 */
var cnt = 0;
var connection = require('./db');
var totalrows = 0;
//var logger = require('./logger');
exports.CurrencyList = function (req, result) {
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
            
          
            var PageName = "Currency";
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
              
    
    connection.query("CALL GetCurrency('id  <> 0 ','',0,10);", function (err, rows) {
        if (!err) {
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.Currency + '</a></b>","' + row.CurrencySymbol + '","' + row.Description + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';

        }
        else
            console.log('Error while performing Query.' + err);

    });
    // sending final formatted json to html
    result.render('PageCurrency', {
        page_title: "Currency - Node.js",
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
exports.GetCurrencyData = function (req, result) {
    var flexiformat = '';
    console.log("Function Getdata..........");
    var count = 'none'
   
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    wherecond = " id <> 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond += " and   " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }
    
    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    
    var start = ((req.body.page - 1) * req.body.rp);
    var rp = req.body.rp;
    
    connection.query("CALL GetCurrency('" + wherecond + "','" + sort + "'," + start + "," + rp + ");", function (err, rows) {
        if (!err) {
            
            
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.Currency + '</a></b>","' + row.CurrencySymbol + '","' + row.Description + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
               
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
         
        }
        else {
            console.log('Error while performing Query.' + err);
            
        }
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });


}

/* Insert New Country */
exports.save = function (req, res) {
    var query = "";
    console.log('save process initialized...');
    var jsonResponse = JSON.stringify({
        status: 'saved'
    });
   
    query = "insert into tblCurrency  (Currency,CurrencySymbol,Description) values ('" + req.body.Currency + "','" + req.body.CurrencySymbol + "','" + req.body.Description + "')";
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


};

/* Edit,Delete ,get single record (by Id from Country table ) process */
exports.transact = function (req, result) {
    console.log('transact');
    var query = "";
   
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {
        
        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        query = "update tblCurrency set Currency='" + req.body.Currency + "',CurrencySymbol='" + req.body.CurrencySymbol + "',Description='" + req.body.Description + "' where id='" + req.body.Id + "'";
        connection.query(query, function (err, rows, fields) {
          
            if (!err) {
                console.log(rows);
                result.end(jsonResponse);
            }
            else
                console.log('Error while performing Query.' + err);
        });


    }
    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
       
        query = "delete FROM tblCurrency WHERE id=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {
            if (!err) {
                var jsonResponse = JSON.stringify({ status: 'deleted' });
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
        query = "SELECT * FROM tblCurrency WHERE id=" + req.body.Id
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