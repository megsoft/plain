/*
 * GET Constant listing.
 */
var cnt = 0;
var totalrows = 0;
var pagetype = '"AdminProfile"';
var connection = require('./db');
//var logger = require('./logger');
exports.Adminlist = function (req, result) {
    if (req.session.userId <= 0) {

        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }
    else if (typeof (req.session.userId) == "undefined") {
        result.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }


    result.render('PageAdminProfile', {
        page_title: "AdminProfile"
    });
    req.session.PageTitle = "Admin Profiledfghjkl";
    $("#PageTitle").Val(req.session.PageTitle);
};

/* Edit,Delete ,get single record (by Id from Constant table ) process */
exports.transact = function (req, result) {
    console.log('transact');
   
    /* edit code */
    if (req.body.Id > 0 && req.body.action == "edit") {
        var jsonResponse = JSON.stringify({
            status: 'edited'
        });
        var Query = "update tblUser set FirstName='" + req.body.FirstName + "',Initial='" + req.body.Initial + "',LastName='" + req.body.LastName + "' ,Address='" + req.body.Address + "',CountryId=" + req.body.CountryId + ",StateId=" + req.body.StateId + ",CityId=" + req.body.CityId + ",ZipCode='" + req.body.Zipcode + "',Email='" + req.body.Email + "',Phone='" + req.body.Phone + "',Password='" + req.body.Password+ "',Mobile ='" + req.body.Mobile + "' where Id=" + req.body.Id + "";
        connection.query(Query, function (err, rows, fields) {
            if (!err) {
                result.end(jsonResponse);
            }
            else
                console.log('Error while performing Query :' + err);
        });
    }
    /* Get Record by Id */
    else {
        var i = 1;
        var jsondata = '[';
        connection.query("SELECT * FROM tblUser WHERE id=" + req.body.Id, function (err, rows, fields) {
            if (!err) {
                jsonRes = JSON.stringify({
                    Data: rows,
                    MSGDiv: req.session.Div
                });
                result.end(jsonRes);
              //  result.end('[' + JSON.stringify(rows[0]) + ']');

            }
            else
                console.log('Error while performing Query :' + err);
        });
    }
};