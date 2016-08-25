

/*
 * GET home page.
 */
var cnt = 0;
var totalrows = 0;
var connection = require('./db');
var logger = require('./logger');
exports.DashboardList = function (req, result) {


    logger.info('started');


    if (req.session.userId <= 0) {
        
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    else if (typeof (req.session.userId) == "undefined") {
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    
    var flexiformat = '';
  
    var count = 'none'
    query = "CALL GetLOCDetails('tbl.id  <> 0 ','', 0, 10," + req.session.userId + ", '" + req.session.UserType + "')";
    connection.query(query, function (err, rows) {
    
        if (!err) {
            var page = 1;
            var slno = 0;
            var totalrows = rows[0].length;
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                slno = slno + 1;
                flexiformat += ' {       "id":"' + slno + '", "cell":["' + slno + '","' + row.Agent   + '","' + row.SubAgent + '","' + row.Client   + '","' + row.CompanyName + '","' + row.Number + '","' + row.Amount + '","' + row.ApplicationDate    + '","' + row.LCStatus    + '"  ]    } ,';
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
        
        }
        else
            logger.info('Error while performing Query.' + err);

    });
        
    result.render('PageDashboard', {
        page_title: "Dashboard",
        data: flexiformat
    });



};

//// get all data by filtering & sorting conditions....
exports.GetDashboardData = function (req, result) {
    var flexiformat = '';
 
    var count = 'none'
    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    wherecond = "tbl.Id <> 0 ";
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond = "  " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }
    
    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }
    
    var start = ((req.body.page - 1) * req.body.rp);
    
    var rp = req.body.rp;
    Query = "CALL GetLOCDetails('" + wherecond + "','" +  sort + "'," + start + "," + rp + "," + req.session.userId + ", '" + req.session.UserType + "')";
    connection.query(Query , function (err, rows) {
     
        if (!err) {
            var page = 1;
            var totalrows =rows[0].length;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            var RptData = "<html> <style> tr:nth-child(even){background-color: #f2f2f2}   th, td {  text - align: left; padding: 8px; } </style>   <body>" 
                + " <h2>LOC Details</h2>" 
                + " <table style='color:Grey;  width: 780px;   border: 1px solid Grey; font-size: 15px;  font - weight:Bold; '>  <tr  style='color:red'> <th style=' background-color: #09aaf9;color: white;width: 20px;'>No</th> <th  style='  background-color: #09aaf9;color: white;width:40px'>Agent</th> <th  style='  background-color: #09aaf9;color: white;width:40px'>SubAgent</th> <th  style=' background-color: #09aaf9;color: white;width:40px'>Client</th> <th  style=' background-color: #09aaf9;color: white;width:40px'>Company Name</th> <th  style=' background-color: #09aaf9;color: white;width: 30px'>Number</th> <th  style=' background-color: #09aaf9;color: white;width: 35px'>Amount</th><th  style=' background-color: #09aaf9;color: white;width: 30px'>Application Date</th><th  style=' background-color: #09aaf9;color: white;width: 30px'>LC Status</th></tr>";
            var slno = 0;
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                slno = slno + 1;
                flexiformat += ' {       "id":"' + slno + '", "cell":["' + slno + '","' + row.Agent   + '","' + row.SubAgent + '","' + row.Client   + '","' + row.CompanyName + '","' + row.Number + '","' + row.Amount + '","' + row.ApplicationDate    + '","' + row.LCStatus    + '"  ]    } ,';
                RptData += '<tr style="font-weight:normal"> <td width="20px" >' + slno+ '</td> <td width="40px">' + row.Agent + '</td> <td width="40px">' + row.SubAgent + '</td> <td width="40px">' + row.Client + '</td>  <td width="40px">' + row.CompanyName + '</td> <td width="30px">' + row.Number + '</td> <td width="35px" align="right">' + row.Amount + '</td><td width="30px" >' + row.ApplicationDate + '</td><td width="30px">' + row.LCStatus + '</td></tr>'
        
               
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';
        }
        else {
            logger.info('Error while performing Query.' + err);
            
        }
        
        //////report  A4 size  210 x 297
        //var pdf = require('html-pdf');
        //var options = { format: 'A4', orientation : 'portrait' };
        //var DestPath = require("path").resolve(__dirname, "..") + "\\public\\reports\\LOCDetails.pdf";
        //pdf.create(RptData, options).toFile(DestPath, function (err, res) {
        //    if (err) return logger.info(err);
        //    logger.info(res); // { filename: '/app/businesscard.pdf' }
        //});
        
        ////end report
        result.writeHead(200, { 'Content-Type': 'application/json' });
        // sending final formatted json to html
        result.end(flexiformat);
    });
}

