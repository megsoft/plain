/*
 * GET Constant listing.
 */
var cnt = 0;
var totalrows = 0;
var connection = require('./db');

exports.Constantlist = function (req, result) {
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
            
          
            var PageName = "Constant";
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
               
    connection.query("CALL GetConstant(' tbl.Id  <> 0 ','',0,10);", function (err, rows) {
        if (!err) {
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            // flexi grid json data formatting code
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];

                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=itemedit_' + row.Id + ' >' + row.CompanyName + '</a></b>","' + row.Address + '" ,"' + row.CountryName + '","' + row.StateName + '","' + row.CityName + '","' + row.Phone + '", "<b><a  id=itemdelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
                            
                }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';

        }
        else
           ('Error while performing Query :' + err);

    });
   
    // sending final formatted json to view (html) & rendering page
    result.render('PageConstant', {
        page_title: "Constant - Node.js",
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
exports.GetConstantData = function (req, result) {
    var flexiformat = '';
   ("Function Getdata..........");
    var count = 'none'
    
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';

    wherecond = " tbl.id <> 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond = "  " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }

    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    var start = ((req.body.page - 1) * req.body.rp);
    var rp = req.body.rp;


    connection.query("CALL GetConstant('" + wherecond + "','" + sort + "'," + start + "," + rp + ");", function (err, rows) {
        if (!err) {


            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];

               flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=itemedit_' + row.Id + ' >' + row.CompanyName + '</a></b>","' + row.Address + '","' + row.CountryName + '","' + row.StateName + '","' + row.CityName + '","' + row.Phone + '", "<b><a  id=itemdelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
              
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
           console.log('get final need out' + flexiformat);


        }
        else {
           console.log('Error while performing Query :'+err);
          
        }
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });


}

/* Insert New Record */
exports.save = function (req, res) {

    var jsonResponse = JSON.stringify({
        status: 'saved'
    });
  
    var strGender = "";
    if (req.body.gender == "Male") {
        strGender = "M";

    }
    else if (req.body.gender == "Female") {
        strGender = "F";
    }
    else {
        strGender = "O";
    }
    var Query = "insert into tblConstant  (CompanyName,Address,CountryId,StateId,CityId,Fax,Phone,Website,Email,ZipCode,Logo) values ('" + req.body.CompanyName + "','" + req.body.Address + "'," + req.body.CountryId + "," + req.body.StateId + "," + req.body.CityId + ",'" + req.body.Fax + "','" + req.body.Phone + "','" + req.body.Website + "','" + req.body.Email + "','" + req.body.Zipcode + "','')";
    connection.query(Query, function (err, rows, fields) {
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

/* Edit,Delete ,get single record (by Id from Constant table ) process */
exports.transact = function (req, result) {
   console.log('transact');

  
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {

        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        
        var Query = "update tblConstant set CompanyName='" + req.body.CompanyName + "' ,Address='" + req.body.Address + "',CountryId=" + req.body.CountryId + ",StateId=" + req.body.StateId + ",CityId=" + req.body.CityId + ",Fax='" + req.body.Fax + "',ZipCode='" + req.body.Zipcode + "',Email='" + req.body.Email + "',Phone='" + req.body.Phone + "',Website='" + req.body.Website + "' where Id=" + req.body.Id + "";
        connection.query(Query, function (err, rows, fields) {
            if (!err) {
                result.end(jsonResponse);
            }
            else
               console.log('Error while performing Query :' + err);
        });


    }

    /* delete code */
    else if (req.body.Id > 0 && req.body.action == "delete") {
        var jsonResponse = JSON.stringify({
            status: 'deleted'
        });
        connection.query("delete FROM tblConstant WHERE Id=" + req.body.Id, function (err, rows, fields) {
            if (!err) {
                result.end(jsonResponse);
            }
            else
               console.log('Error while performing Query :' + err);
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

        connection.query("SELECT * FROM tblConstant WHERE id=" + req.body.Id, function (err, rows, fields) {
            if (!err) {
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
               console.log('Error while performing Query :' + err);
        });




    }

};