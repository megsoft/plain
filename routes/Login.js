var connection = require('./db');

/*
 * GET home page.
 */

exports.LoginLoad = function (req, res) {
  
    req.session.reset();
    res.render('PageLogin', { title: 'Letter Of Credit Application :' });
};

exports.validate = function (req, res) {
    
    var query = "";
    var uname = "'" + req.body.UserName + "'";
    var pwd = "'" + req.body.Password + "'";
    req.session.username = req.body.UserName;


    query = "SELECT * FROM tblUser WHERE Email=" + uname + " and password=" + pwd + " ";

    connection.query(query, function (err, rows) {
   
        if (!err) {
            var jsonResponse = "";

            if (rows.length > 0) {
                req.session.userId = rows[0].Id;
                req.session.UserType = rows[0].UserType;
                req.session.IsActive = rows[0].IsActive;                
                req.session.IsAdmin = rows[0].IsAdmin;
                req.session.AgentId = rows[0].AgentId;
                req.session.SubAgentId = rows[0].SubAgentId;
                req.session.RoleId = rows[0].RoleId;
                jsonResponse=  JSON.stringify({
                    status: 'VALID',
                    UserId: rows[0].Id
                });
                
               
                res.end(jsonResponse);
            }
            else {
                jsonResponse = JSON.stringify({
                    status: 'INVALID',
                    UserId:0
                });
                res.end(jsonResponse);
            }
           
        }
        else
           console.log('Error while performing Query.' + err);
    });



};
exports.SubMenu = function (req, res) {
    var query = "";
  

    var MenuID= "'" + req.body.MenuID + "'";
    
    
    Menuquery = "SELECT * FROM tblMenu WHERE MenuId="+MenuID+"";
    
    connection.query(Menuquery, function (err, rows) {
      connection.end();
        if (!err) {
            jsonRes = JSON.stringify(rows);
            res.end(jsonRes);
        }
        else
           console.log('Error while performing Query.' + err);
    });
};