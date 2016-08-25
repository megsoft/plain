/*
 * GET Benificiary listing.
 */
var cnt = 0;
var totalrows = 0;
var connection = require('./db');
var logger = require('./logger');

var fs = require('fs');
var path = require('path'); 


exports.ApplicationList = function (req, result) {
    if (req.session.userId <= 0) {

        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    else if (typeof (req.session.userId) == "undefined") {
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }



    var flexiformat = '';
    var count = 'none'
    var option = "";


    var async = require('async');
    var existsCount; //Define `existsCount` out here, so both tasks can access the variable
    async.series([
        //Load user to get `existsCount` first
        function (callback) {


            var PageName = "/ApplicationDetails";
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
                if (req.session.UserType == "ADMIN") {
                    option = "tbl.id > 0";
                }
                else {
                    option = "tbl.ApplicantId=" + req.session.userId + " ";
                }


                connection.query("CALL GetLetterOfCreditTerms('" + option + "','',0,10);", function (err, rows) {

                    if (!err) {
                        var page = 1;
                        var totalrows = eval(rows[1])[0].cnt;
                        flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
                        for (j = 0; j < eval(rows[0]).length; j++) {
                            var row = eval(rows[0])[j];
                            //'" + req.body.PaymentTermsId + "','" + req.body.CurrencyId + "','" + req.body.IncoTermsId + "',                                                                                                     '" + req.body.ShipById + "','" + req.body.FrieghtChargesId + "','" + req.body.InsurenceId + "','" + req.body.ApplicationStatusId + "','" + req.body.CreditAmountRequested + "','" + req.body.Tolerance + "','" + req.body.IfOtherSpecify+ "','" + req.body.PartialShipment + "','" + req.body.Transhipment + "','" + req.body.ExpirationDate + "','" + req.body.DaysToPresentDocuments + "', '" + req.body.Transferable + "','" + req.body.ConfirmationInstructions + "', '" + req.body.CreatedDate + "','" + req.body.ModifiedDate + "','" + req.body.CreaterId + "', '" + req.body.ModifierId + "','" + req.body.BenificiaryId + "','" + req.body.BankId + "','" + req.body.ApplicantId + "'  

                            flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.LcaNo + '</a></b>" ,"' + row.PaymentTermsType + '","' + row.Currency + '", "' + row.Through + '","' + row.FrieghtChargeType + '","' + row.InsuranceType + '","' + row.Status + '","' + row.CreditAmountRequested + '","' + row.PartialShipment + '","' + row.TranShipment + '","' + row.ExpirationDate + '","' + row.LatestShipment + '","' + row.PortOfLoading + '","' + row.PortOfDischarge + '","' + row.Transferable + '","' + row.ConfirmationInstructions + '","' + row.User + '"   "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
                        }
                        flexiformat = flexiformat.substring(0, flexiformat.length - 1);
                        flexiformat += '] }';

                    }
                    else
                        logger.info('Error while performing Query.' + err);

                });


                // sending final formatted json to html


                result.render('PageApplicationDetails', {
                    page_title: "Application Details",
                    data: flexiformat
                });
            }
            else {
                result.render('PageDashboard', { title: 'Letter Of Credit Application :' });

            }
        }
    ]);

};
exports.display = function (req, result) {
    //result.render('PageApplicationEditShow', {
    //    page_title: "ApplicationDetails - Node.js",

    //});
};
// get all data by filtering & sorting conditions....
exports.GetApplicationData = function (req, result) {
    var flexiformat = '';
    logger.info("Function Getdata..........");
    var count = 'none'

    var query = "";
    var wherecond = " ";
    var sort = " ";
    var doubleqte = '"';
    var option;
    if (req.session.UserType == "ADMIN") {
        wherecond = "tbl.id > 0 ";
    }
    else {
        wherecond = "tbl.ApplicantId=" + req.session.userId + " ";
    }
    option = wherecond;
    if (req.body.qtype != "" && req.body.query != "") {
        wherecond = " " + req.body.qtype + " like " + doubleqte + "%" + req.body.query + "%" + doubleqte + " or " + req.body.qtype + "= " + doubleqte + "" + req.body.query + "" + doubleqte + " ";
    }

    if (req.body.sortname != "" && req.body.sortorder != "") {
        sort += " order by " + req.body.sortname + " " + req.body.sortorder + " ";
    }

    var start = ((req.body.page - 1) * req.body.rp);

    var rp = req.body.rp;
    var search;
    if (req.body.query != "") {
        search = " CALL GetLetterOfCreditTerms('" + option + "' 'and' '" + wherecond + "','" + sort + "', " + start + ", " + rp + ")";
    }
    else {
        search = " CALL GetLetterOfCreditTerms('" + wherecond + " ','" + sort + "', " + start + ", " + rp + ")";
    }
    // CALL GetLetterOfCreditTerms('tbl.ApplicantId=98 ' 'and' ' PortOfLoading like "%m%" or PortOfLoading= "m"  ', '  order by Id asc ', 0, 11)
    connection.query(search, function (err, rows) {

        if (!err) {
            var page = 1;
            var totalrows = eval(rows[1])[0].cnt;
            flexiformat = "";
            flexiformat = '{  "stat": "ok",  "page":' + page + ',  "total": ' + totalrows + ',  "rows": [ ';
            var RptData = "<html> <style> tr:nth-child(even){background-color: #f2f2f2}   th, td {  text - align: left; padding: 8px; } </style>   <body>"
                + " <h2>LOC Details</h2>"
                + " <table style='color:Grey;  width: 780px;   border: 1px solid Grey; font-size: 15px;  font - weight:Bold; '>  <tr  style='color:red'> <th style=' background-color: #09aaf9;color: white;width: 20px;'>Application No</th> <th  style='  background-color: #09aaf9;color: white;width:40px'>Payment Type</th> <th  style='  background-color: #09aaf9;color: white;width:40px'>Ship by</th> <th  style=' background-color: #09aaf9;color: white;width:40px'>Currency</th> <th  style=' background-color: #09aaf9;color: white;width:40px'>Amount</th> <th  style=' background-color: #09aaf9;color: white;width: 35px'>Expiration Date</th> <th  style=' background-color: #09aaf9;color: white;width: 40px'>Port of Loading</th><th  style=' background-color: #09aaf9;color: white;width: 40px'>Port of Discharge</th></tr>";
            for (j = 0; j < eval(rows[0]).length; j++) {
                var row = eval(rows[0])[j];
                flexiformat += ' {       "id":"' + row.Id + '", "cell":["' + row.Id + '", "<b><a  id=gridedit_' + row.Id + ' >' + row.LcaNo + '</a></b>" ,"' + row.PaymentTermsType + '", "' + row.Currency + '", "' + row.Through + '","' + row.FrieghtChargeType + '","' + row.InsuranceType + '","' + row.Status + '","' + row.CreditAmountRequested + '","' + row.PartialShipment + '","' + row.TranShipment + '","' + row.ExpirationDate + '","' + row.LatestShipment + '","' + row.PortOfLoading + '","' + row.PortOfDischarge + '","' + row.Transferable + '","' + row.ConfirmationInstructions + '","' + row.User + '" , "<b><a  id=griddelete_' + row.Id + ' >' + 'Delete' + '</a></b>"  ]    } ,';
                RptData += '<tr style="font-weight:normal"> <td width="20px" >' + row.LcaNo + '</td> <td width="40px">' + row.PaymentTermsType + '</td> <td width="40px">' + row.Through + '</td><td width="30px">' + row.Currency + '</td> <td width="40px">' + row.CreditAmountRequested + '</td>  <td width="35px">' + row.ExpirationDate + '</td> <td width="40px">' + row.PortOfLoading + '</td> <td width="40px">' + row.PortOfDischarge + '</td></tr>'
            }
            flexiformat = flexiformat.substring(0, flexiformat.length - 1);
            flexiformat += '] }';

        }
        else {
            logger.info('Error while performing Query.' + err);

        }

        ////report  A4 size  210 x 297
        //var pdf = require('html-pdf');
        //var options = { format: 'A4', orientation : 'portrait' };
        //var DestPath = require("path").resolve(__dirname, "..") + "\\public\\reports\\ApplicationList.pdf";
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
exports.Download = function (req, res) {
    // var async = require('async');
    // var path = require('path');
    // var ApplicationNumber = req.body.ApplicationNumber;
    // var sourcepath = require("path").resolve(__dirname, "..") + "\\public\\Files\\";

    // var dirlist = "";
    // //  var finder = require('findit')(__dirname + '\\uploads\\115');
    //  var finder = require('findit')(sourcepath +  ApplicationNumber);


    // finder.on('directory', function (dir, stat, stop) {
    //     var base = path.basename(dir);
    //     if (base === '.git' || base === 'node_modules') {
    //         stop()
    //     }
    //     else {
    //         console.log(dir + '/')
    //         dirlist += dir + '/ ';
    //     }
    // });

    // var fpath = [];
    //// async.series([
    //     //Load user to get `existsCount` first
    //    // function (callback) {

    //         finder.on('file', function (file, stat) {

    //             console.log(file);
    //             dirlist += file + '/ ';
    //             var filePath = file;
    //             var startIndex = (filePath.indexOf('\\') >= 0 ? filePath.lastIndexOf('\\') : filePath.lastIndexOf('/'));
    //             var filename = filePath.substring(startIndex);
    //             if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    //                 filename = filename.substring(1);
    //             }


    //             console.log(filename);


    //             fpath.push({ name: file });



    //         });
    //         finder.on('end', function () {
    //             //callback();
    //         result.contentType('application/json');
    //         result.send(JSON.stringify(fpath));

    //         })
    //    // }, function (callback) {

    //     //    result.contentType('application/json');
    //     //    result.send(JSON.stringify(fpath));

    //     ////}]);
}

exports.DownloadAll = function (req, result) {
    ////var async = require('async');
    //var filename = req.body.filename;
    //var dirlist = "";
    //var finder = require('findit')(__dirname + '\\uploads\\115');
    //var path = require('path');

    //finder.on('directory', function (dir, stat, stop) {
    //    var base = path.basename(dir);
    //    if (base === '.git' || base === 'node_modules') {
    //        stop()
    //    }
    //    else {
    //        console.log(dir + '/')
    //        dirlist += dir + '/ ';
    //    }
    //});

    //var fpath = [];
    //// async.series([
    ////    //Load user to get `existsCount` first
    //// function (callback) {

    //finder.on('file', function (file, stat) {

    //    console.log(file);
    //    dirlist += file + '/ ';
    //    var filePath = file;
    //    var startIndex = (filePath.indexOf('\\') >= 0 ? filePath.lastIndexOf('\\') : filePath.lastIndexOf('/'));
    //    var filename = filePath.substring(startIndex);
    //    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    //        filename = filename.substring(1);
    //    }


    //    if (filename != "Thumbs.db") {
    //        console.log(filename);


    //        fpath.push({ name: file });
    //        var filedir = __dirname + '\\uploads\\' + filename;
    //        var is = fs.createReadStream(filePath);
    //        var os = fs.createWriteStream(filedir);
    //        is.pipe(os);

    //    }

    //});
    //// }
    //finder.on('end', function () {
    //    return result.end('success');


    //});



    //}]);
}


/* Edit,Delete ,get single record (by Id from tblBenificiary table ) process */
exports.transact = function (req, result) {
    logger.info('transact');
    var query = "";


    if (req.body.action == "SelectExistUploadFile") {

        query = "select tbl.Id as FileId, AplicantId,tbl.DocumentType as FileDocumentTypeId ,FileName,FilePath,tbldoc.DocumentType as DocumentType   from tblFiles as tbl join tblDocumentType as tbldoc on tbl.DocumentType=tbldoc.Id   where aplicantId=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {

            if (!err) {
                logger.info(JSON.stringify(rows));
                result.end('[' + JSON.stringify(rows) + ']');
            }
            else
                logger.info('Error while performing Query.' + err);
        });

    }

    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {

        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var UserId = req.session.userId;
        var ter = req.body.Terms;

        query = "update tblLetterOfCreditTerms set PaymentTermsId='" + req.body.PaymentTermsId + "',CurrencyId='" + req.body.CurrencyId + "',IncoTermsId='" + req.body.IncoTermsId + "',ShipById='" + req.body.ShipById + "',FrieghtChargesId='" + req.body.FrieghtChargesId + "',InsuranceId='" + req.body.InsurenceId + "',ApplicationStatusId='" + req.body.ApplicationStatusId + "',CreditAmountRequested='" + req.body.CreditAmountRequested + "',Tolerance='" + req.body.Tolerance + "',ShippingIfOtherSpecify='" + req.body.ShippingIfOtherSpecify + "',PartialShipment='" + req.body.PartialShipment + "',Transhipment='" + req.body.Transhipment + "',ExpirationDate='" + req.body.ExpirationDate + "',LatestShipment='" + req.body.LatestShipment + "',PortOfLoading='" + req.body.PortOfLoading + "',DaysToPresentDocuments='" + req.body.DaysToPresentDocuments + "',Transferable='" + req.body.Transferable + "',ConfirmationInstructions='" + req.body.ConfirmationInstructions + "',ModifiedDate='" + req.body.ModifiedDate + "',ModifierId='" + UserId + "',BenificiaryId='" + req.body.BenificiaryId + "',BankId='" + req.body.BankId + "',LcaNo='" + req.body.LcaNo + "',EtcLcaNo='" + req.body.EtcLcaNo + "',Terms=" + req.body.Terms + ",IsCompleted=" + req.body.IsCompleted + ",DescriptionOfGoods='" + req.body.DescriptionOfGoods + "',RequiredDocuments='" + req.body.RequiredDocuments + "',AdditionalConditions='" + req.body.AdditionalConditions + "',IncoTermIfOtherSpecify='" + req.body.IncoTermIfOtherSpecify + "' where id='" + req.body.Id + "'";
        connection.query(query, function (err, rows, fields) {

            if (!err) {

                result.end(jsonResponse);
            }
            else
                logger.info('Error while performing Query.' + err);
        });


    }
    /* delete code */

    else if (req.body.action == "deletesinglefile") {
        //delete record in database
        //query = "delete FROM tblFiles WHERE Id="+req.body.fileid;
        //connection.query(query, function (err, rows, fields) {

        //    if (!err) {
        //        logger.info(rows);

        //    }
        //    else
        //        logger.info('Error while performing Query.' + err);

        //});

        //delete file in folder 



        //const fs = require('fs');
        //var filepath = require("path").resolve(__dirname, "..") + "//public//Files//" + req.body.applicationno + "//" + req.body.filename;
        // filepath = require("path").normalize(filepath);

        var DestPath = require("path").resolve(__dirname, "..") + "//public";
        DestPath = path.normalize(DestPath);
        var dirs = DestPath + '//Files//';
        dirs = path.normalize(dirs);
        if (!fs.existsSync(dirs)) {
            fs.mkdirSync(dirs);
            console.log(dirs);

        }

        fs.unlink(dirs + "//296//Screenshot_3.png", (err) => {
            if (err) throw err;
            console.log('successfully deleted ');
            var jsonerrResponse = JSON.stringify({
                status: 'File Deleted'

            });
            result.end(jsonerrResponse);
        });


        
        //if (!fs.existsSync(filepath)) {


        //    fs.unlink(filepath);

        //}


    }
    else if (req.body.Id > 0 && req.body.action == "delete") {
        var jsonResponse = JSON.stringify({
            status: 'deleted'
        });
        var applicationId;
        // get Id to Application no(LcaNo)

        query = "select * FROM tblLetterOfCreditTerms WHERE Id=" + req.body.Id;

        connection.query(query, function (err, rows, fields) {

            if (!err) {
                logger.info(rows);
                applicationId = rows[0].LcaNo;
                // delete uploaded  folder 

                var dir = require("path").resolve(__dirname, "..") + "//public//Files//" + applicationId;
                dir = require("path").normalize(dir);
                if (fs.existsSync(dir)) {
                    var rmdir = require('rmdir');
                    rmdir(dir, function (err, dirs, files) {
                        if (!err) {
                            console.log(dirs);
                            console.log(files);
                            console.log('all files are removed');
                        }
                        else {
                            logger.info('Error in Folder delete' + err);
                        }
                    });
                }



                // delete record from tblFile
                query = "delete FROM tblFiles WHERE AplicantId=" + applicationId;
                connection.query(query, function (err, rows, fields) {

                    if (!err) {
                        logger.info(rows);

                    }
                    else
                        logger.info('Error while performing Query.' + err);

                });



                //delete record from tblLetterOfCreditTerms

                query = "delete FROM tblLetterOfCreditTerms WHERE Id=" + req.body.Id;

                connection.query(query, function (err, rows, fields) {

                    if (!err) {
                        logger.info(rows);
                        result.end(jsonResponse);
                    }
                    else
                        logger.info('Error while performing Query.' + err);
                });

            }
            else
                logger.info('Error while performing Query.' + err);
        });



    }
    else if (req.body.action == "DownloadAll") {

        var i = 0;

        var dir = require("path").resolve(__dirname, "..") + "//public//Files//" + req.body.Id;
        dir = require("path").normalize(dir);


        var AdmZip = require('adm-zip');

        var zip = new AdmZip();

        // add file directly
        //  zip.addFile("test.txt", new Buffer("inner content of the file"), "entry comment goes here");
        // add local file
        //  zip.addLocalFile("app.js");
        query = "select *  FROM tblFiles WHERE AplicantId=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {

            if (!err) {
                logger.info(rows);
                for (i = 0; i < rows.length; i++) {
                    var sam = dir + "\\" + rows[i].FileName
                    zip.addLocalFile(dir + "\\" + rows[i].FileName);


                }

                var desFolder = require("path").resolve(__dirname, "..") + "//public//zip//" + req.body.Id + ".zip";
                desFolder = require("path").normalize(desFolder);
                zip.writeZip(desFolder);
                var jsonerrResponse = JSON.stringify({
                    status: 'Zip file created',
                    Folder: desFolder,
                    FolderName: req.body.Id + ".zip"
                });
                result.end(jsonerrResponse);
            }
            else
                logger.info('Error while performing Query.' + err);

        });



    }

    else if (req.body.action == "Download") {
        query = "select tbl.Id,AplicantId as applicationId,tbl.DocumentType,FileName,FilePath,doc.DocumentType from  tblFiles as tbl join tblDocumentType as doc on tbl.DocumentType=doc.Id  where aplicantId=" + req.body.Id;
        connection.query(query, function (err, rows, fields) {

            if (!err) {
                logger.info(JSON.stringify(rows));
                result.end('[' + JSON.stringify(rows) + ']');
            }
            else
                logger.info('Error while performing Query.' + err);
        });



    }
    /* Get Record by Id */
    else {
        if (req.body.action == "getsinglerecord") {
            var i = 1;
            var jsondata = '[';
            //query = "SELECT * FROM tblLetterOfCreditTerms WHERE Id=" + req.body.Id;
            query = "select tbl.Id, PaymentTermsId, CurrencyId, cur.CurrencySymbol, IncoTermsId, ShipById, FrieghtChargesId, InsuranceId, ApplicationStatusId," +
                "CreditAmountRequested, Tolerance , ShippingIfOtherSpecify , PartialShipment , TranShipment , DATE_FORMAT(ExpirationDate, '%m/%d/%Y') as ExpirationDate ," +
                "DATE_FORMAT(LatestShipment, '%m/%d/%Y') as LatestShipment, PortOfLoading , PortOfDischarge, DaysToPresentDocuments , Transferable ," +
                "ConfirmationInstructions ,DATE_FORMAT(CreatedDate, '%m/%d/%Y') as CreatedDate, DATE_FORMAT(ModifiedDate, '%m/%d/%Y') as ModifiedDate," +
                "CreaterId, ModifierId, BenificiaryId, BankId, ApplicantId,LcaNo,EtcLcaNo,Signature,Terms,IsCompleted,DescriptionOfGoods,RequiredDocuments,AdditionalConditions,IncoTermIfOtherSpecify FROM tblLetterOfCreditTerms as tbl join tblCurrency cur on CurrencyId = cur.Id where tbl.Id =" + req.body.Id;

            connection.query(query, function (err, rows, fields) {

                if (!err) {
                    logger.info(JSON.stringify(rows));
                    logger.info(JSON.stringify(rows[0]));
                    result.end('[' + JSON.stringify(rows[0]) + ']');
                }
                else
                    logger.info('Error while performing Query.' + err);
            });


        }


    }

};
