/*
 * GET City listing.
 */
var cnt = 0;
var totalrows = 0;
var connection = require('./db');
var logger = require('./logger');
exports.GetCityList = function (req, result) {
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
            
           
            var PageName = "City";
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
                
               
  
     
    
    
    connection.query("CALL GetCity('tbl.id  > 0 ','',0,10);", function (err, rows) {
         
        if (!err) {
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            // flexi grid json data formatting code

            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.CityName + '</a></b>" ,"' + row.StateName + '" ,"' + row.CountryName + '" ,"' + row.Description + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
            
            logger.info(flexiformat);


        }
        else
            logger.info('Error while performing Query.');

    });
    logger.info('before head');
    
    
    // sending final formatted json to view (html) & rendering page
    
    
    result.render('PageCity', {
        page_title: "City - Node.js",
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

exports.GetCityData = function (req, result) {
    var flexiformat = '';
    logger.info("Function Getdata..........");
    var count = 'none'
     
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    wherecond = " tbl.id > 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond += " and   " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }
    
    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    
    var start = ((req.body.page - 1) * req.body.rp);
    
    var rp = req.body.rp;
    
    
    
    
    connection.query("CALL GetCity('" + wherecond + "','" + sort + "'," + start + "," + rp + ");", function (err, rows) {
        
        if (!err) {
            
            
            var page = req.body.page;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
             for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.CityName + '</a></b>" ,"' + row.StateName + '" ,"' + row.CountryName + '" ,"' + row.Description + '", "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
            logger.info('ge tfinal need out' + flexiformat);



        }
        else {
            logger.info('Error while performing Query.');
            logger.info(err);
        }
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });
}

/* Insert New Country */
exports.save = function (req, res) {
    
    logger.info('save process initialized...');
  
     
    var Query = "insert into tblCity  (CityName,Description,StateId,CountryId) values ('" + req.body.CityName + "','" + req.body.Description + "','" + req.body.StateId + "','" + req.body.CountryId + "')";
    connection.query(Query, function (err, rows, fields) {
        
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

/* Edit,Delete ,get single record (by Id from tblcountry table ) process */
exports.transact = function (req, result) {
    logger.info('transact');
    
   
    
    
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {
        
        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var Query = "update tblCity set CityName='" + req.body.CityName + "',Description='" + req.body.Description + "',StateId='" + req.body.StateId + "',CountryId='" + req.body.CountryId + "' where Id='" + req.body.Id + "'";
        connection.query(Query, function (err, rows, fields) {
            
            if (!err) {
                logger.info(rows);
                result.end(jsonResponse);
            }
            else
                logger.info('Error while performing Query.');
        });


    }
    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
       
        var query = "delete FROM tblCity WHERE Id=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {
            
            if (!err) {
                var jsonResponse = JSON.stringify({
                    status: 'deleted'
                });
                logger.info(rows);
                result.end(jsonResponse);
            }
            else {
                logger.info('Error while performing Query.' + err);
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
    /* Get Record by uid */
    else {
        
        logger.info('Get Record by id');
        logger.info(req.body.Id);
        var i = 1;
        var jsondata = '[';
        var query = "SELECT * FROM tblCity WHERE id="+ req.body.Id;
        connection.query(query, function (err, rows, fields) {
           
            if (!err) {
                logger.info(JSON.stringify(rows));
                logger.info(JSON.stringify(rows[0]));
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
                logger.info('Error while performing Query.');
        });




    }

};