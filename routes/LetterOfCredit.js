 
var db = require('./db');
var fs = require('fs');

var path = require('path'); 
var logger = require('./logger');
exports.Upload = function (req, res) {
    var j = 0;
    var k = req.files.file.length;
    console.log(k);
    var DestPath = require("path").resolve(__dirname, "..") + "//public";
    DestPath = path.normalize(DestPath);
   var dirs = DestPath + '//Files//';
    dirs = path.normalize(dirs);
    if (!fs.existsSync(dirs)) {
        fs.mkdirSync(dirs);
        console.log(dirs);

    }
    var dir = dirs + req.body.Id;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(dir);

    }
    
    for (j = 0; j < req.body.documenttypeId.length; j++) {
        var FileName;
        if (req.files.file.name != undefined) {  //single file upload
            FileName = req.files.file.name;
        }
        else {
            FileName = req.files.file[j].name;
        }
        var filedir = dir + '\\' + FileName;
         var FilePath = filedir.toString();
        FilePath = FilePath.replace(/\\/g, "\\\\");
        query = "insert into tblFiles(AplicantId, DocumentType, FileName, FilePath) values('" + req.body.Id + "', '" + req.body.documenttypeId[j] + "','" + FileName + "','" + FilePath + "')";
        connection.query(query, function (err, rows, fields) {
            
            if (err) {
                logger.info('Error while performing Query.' + err);
            }
        
        });
    }

    if (k > 0) {
        for (var i = 0; i < k ; i++) {
            var filetype = req.files.file[i].type;

            var filedir = dir + '//' + req.files.file[i].name;
            filedir = path.normalize(filedir);
            var is = fs.createReadStream(req.files.file[i].path);
            var os = fs.createWriteStream(filedir);
            is.pipe(os);
        }
        console.log("File is uploaded");
        return res.end('Upload success');
    }
    if (req.files.file.name != "" && req.files.file.name != undefined) {
        var filedir = dir + '//' + req.files.file.name;
        filedir = path.normalize(filedir);
        var is = fs.createReadStream(req.files.file.path);
        var os = fs.createWriteStream(filedir);
        is.pipe(os);
        
        console.log("File is uploaded");
        return res.end('Upload success');
    }
   
  
       
   
};

///* Insert New Record*/
exports.save = function (req, res) {

    logger.info('save process initialized...');
    var jsonResponse = JSON.stringify({
        status: 'saved'
    });
    var query = "";
   
  
    var UserId = req.session.userId;
    query = "insert into tblLetterOfCreditTerms(PaymentTermsId,CurrencyId,IncoTermsId,ShipById," +
    "FrieghtChargesId, InsuranceId,ApplicationStatusId, CreditAmountRequested, Tolerance, ShippingIfOtherSpecify," +
    "PartialShipment, Transhipment, ExpirationDate, LatestShipment, PortOfLoading, PortOfDischarge," +
    "DaysToPresentDocuments, Transferable, ConfirmationInstructions, CreatedDate, ModifiedDate, CreaterId," +
    "ModifierId, BenificiaryId, BankId, ApplicantId,LcaNo,EtcLcaNo,Signature,Terms,IsCompleted,DescriptionOfGoods,RequiredDocuments,AdditionalConditions,IncoTermIfOtherSpecify)values('" + req.body.PaymentTermsId + "','" + req.body.CurrencyId + "','" + req.body.IncoTermsId + "','" + req.body.ShipById + "','" + req.body.FrieghtChargesId + "','" + req.body.InsurenceId + "','" + req.body.ApplicationStatusId + "','" + req.body.CreditAmountRequested + "','" + req.body.Tolerance + "','" + req.body.ShippingIfOtherSpecify+ "','" + req.body.PartialShipment + "','" + req.body.Transhipment + "','" + req.body.ExpirationDate + "','" + req.body.LatestShipment + "','" + req.body.PortOfLoading + "','" + req.body.PortOfDischarge + "','" + req.body.DaysToPresentDocuments + "', '" + req.body.Transferable + "','" + req.body.ConfirmationInstructions + "', '" + req.body.CreatedDate + "','" + req.body.ModifiedDate + "','" + UserId + "', '" + UserId + "','" + req.body.BenificiaryId + "','" + req.body.BankId + "','" + UserId + "','" + req.body.LcaNo + "','" + req.body.EtcLcaNo + "','" + req.body.Signature + "'," + req.body.Terms + "," + req.body.IsCompleted + ",'" + req.body.DescriptionOfGoods + "','" + req.body.RequiredDocuments + "','" + req.body.AdditionalConditions + "','" + req.body.IncoTermIfOtherSpecify + "')";
   db.query(query, function (err, rows, fields) {
        if (!err) {
            logger.info(res);
            res.end(jsonResponse);
        }
        else
            logger.info('Error while performing Query.' +err);
    });
  
   };

exports.GetApplicantDetails = function (req, result) {
    logger.info('transact');
    var query = "";
  
       var jsondata = '[';
     
   // query = "select distinct tbl.Id ,CONCAT (tbl.FirstName,' ',tbl.LastName)Name,tbl.CompanyLegalName,tbl.CompanyPhone,tbl.Mobile,tbl.Email,tbl.JobTitle,tbl.Fax,CONCAT(bk.BankLegalName,' ',bk.Address, ' ',bk.SwiftCode)Bank ,CONCAT(bc.LegalName,' ',bc.Address )Benificiary,tbl.Address   from tblUser as tbl   join tblBank bk on tbl.Id=bk.RefLedgerId  join tblBenificiary bc on tbl.Id=bc.RefLedgerId where tbl.Id=" + req.session.userId;  
    query = " select distinct tbl.Id ,CONCAT (tbl.FirstName,' ',tbl.LastName)Name,tbl.CompanyLegalName,tbl.CompanyPhone,tbl.Mobile,tbl.Email,tbl.JobTitle,tbl.Fax,tbl.Address   from tblUser as tbl     where tbl.Id=" + req.session.userId;  
    db.query(query, function (err, rows, fields) {
            if (!err) {
                logger.info(JSON.stringify(rows));
                logger.info(JSON.stringify(rows[0]));
                result.end('[' + JSON.stringify(rows[0]) + ']');
            }
            else
                logger.info('Error while performing Query.' + err);
        });

};

exports.display = function (req, result) {
    
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
            
            var PageName = "LetterOfCredit";
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
             
                result.render('PageLOC', {
                    page_title: "PageLOC - Node.js",
                    data: flexiformat
                });
            }
            else {
                result.render('PageDashboard', { title: 'Letter Of Credit Application :' });
                               
            }
        }
    ]);
   
};

exports.deletefile = function (req, result) {
    if (req.body.action == "deletesinglefile") {
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
}



  