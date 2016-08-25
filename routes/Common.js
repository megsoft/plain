var connection = require('./db');
var logger = require('./logger');
// Get & Fill  Country dropdown list data by JSON
exports.GetCountryData = function (req, result) {
    var flexiformat = '';
    var mysql = require('mysql');
     
    var jsondata = "";
    if (req.body.Id == 0 && req.body.action == "loadall") {
        
        connection.query("CALL GetCountry(' id  <> 0 ','',0,10);", function (err, rows) {
          
            if (!err) {
                jsondata = rows[0];
              
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });
    }
    else {
        connection.query("CALL GetCountry(' id  =" + req.body.Id + " ','',0,10);", function (err, rows) {
            
            if (!err) {
                jsondata = rows[0];
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }

}

// Get & Fill  State dropdown list data by JSON
exports.GetStateData = function (req, result) {
    var flexiformat = '';
    
    var jsondata = "";
    
    if (req.body.Id == 0 && req.body.action == "loadall") {
        connection.query("CALL GetState(' tbl.id  <> 0 ','',0,10);", function (err, rows) {
            
            if (!err) {
                jsondata = rows[0];
               
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    } else {
        
        
        connection.query("CALL GetState(' tbl.CountryId =" + req.body.CountryId + " ','',0,10);", function (err, rows) {
             
            if (!err) {
                jsondata = rows[0];
              
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}

// Get & Fill  City dropdown list data by JSON
exports.GetCityData = function (req, result) {
    var flexiformat = '';
    
    var jsondata = "";
    if (req.body.Id == 0 && req.body.action == "loadall") {
        connection.query("CALL GetCity(' tbl.id  <> 0 ','',0,10);", function (err, rows) {
         
            if (!err) {
                jsondata = rows[0];
               
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });
    } else {
        
        var Query = "CALL GetCity(' tbl.CountryId =" + req.body.CountryId + " and tbl.StateId =" + req.body.StateId + "  ','',0,10);";
        connection.query(Query, function (err, rows) {
           
            if (!err) {
                jsondata = rows[0];
              
            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });


    }


}
// Get & Fill  user dropdown list data by JSON
exports.GetAgentData = function (req, result) {
    var flexiformat = '';
    
    
    var jsondata = "";
    
    if (req.body.Id == 0 && req.body.action == "loadall") {
        var type = '"AGENT"';
        connection.query("CALL GetUser(' tbl.id  <> 0 and tbl.UserType=" + type + " ','',0,10);", function (err, rows) {
          
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}



exports.MainMenu = function (req, res) {
    var query = "";
  
    var RoleId = "'" + req.session.RoleId + "'";
    var UserId = req.session.userId;
    //  var UserId = 78;

    Menuquery = "select distinct Email as UserName,tbl.Id,tbl.RoleId,Acs.MenuId,Mn.Name as MenuName,Mn.Path from tblUser as tbl join tblAccess as Acs on tbl.RoleId = Acs.RoleId join tblMenu as Mn on Acs.MenuId = Mn.Id where tbl.Id = '" + UserId + "' and Mn.MenuId = 0  order by Mn.srt ";   

    connection.query(Menuquery, function (err, rows) {
        
        if (!err) {
            var jsonResponse = "";
            jsonResponse = JSON.stringify(rows);
            res.end(jsonResponse);
        }
        else
            logger.info('Error while performing Query.' + err);
    });
    // res.end(jsonResponse);
};

exports.SubMenu = function (req, res) {
    var query = "";
    
   
    var MenuID = "'" + req.body.MenuID + "'";
    var UserId = req.session.userId;
    Menuquery = "select distinct Email as UserName,tbl.Id,tbl.RoleId,Acs.MenuId,Mn.Name as MenuName,Mn.Path from tblUser as tbl join tblAccess as Acs on tbl.RoleId = Acs.RoleId join tblMenu as Mn on Acs.MenuId = Mn.Id where tbl.Id = '" + UserId + "' and  Mn.MenuId=" + MenuID + "  order by Mn.srt ";

 
    req.session.Div = "No";
    connection.query(Menuquery, function (err, rows) {
        
        if (!err) {
            jsonRes = JSON.stringify({
                Data: rows,
                UserType: req.session.UserType,
                UserId: req.session.userId

            });
            res.end(jsonRes);
        }
        else
            logger.info('Error while performing Query.' + err);
    });
};


exports.GetSession = function (req, res) {

    if (typeof (req.session.userId) == "undefined") {

        jsonRes = JSON.stringify({
            userId: 0,
            UserType: 'none',
            IsActive: false,
            IsAdmin: false,
            AgentId: 0,
            SubAgentId: 0,
            RoleId: 0,
            username:""
        });
        res.end(jsonRes);
    }
    else {
        jsonRes = JSON.stringify({
            userId: req.session.userId,
            UserType: req.session.UserType,
            IsActive: req.session.IsActive,
            IsAdmin: req.session.IsAdmin,
            AgentId: req.session.AgentId,
            SubAgentId: req.session.SubAgentId,
            RoleId: req.session.RoleId,
            username: req.session.username
        });

        res.end(jsonRes);  
    }
           

};



exports.LcaNoGenerate = function (req, result) {
    var query = "";
    logger.info('Id Generate initialized...');
   
    // query = "select max(id + 1) LcaNo from tblLetterOfCreditTerms";
    query = "SELECT IFNULL(MAX(LcaNo),76)+1 LcaNo FROM tblLetterOfCreditTerms";
    connection.query(query, function (err, rows, fields) {
        
        if (!err) {
            logger.info("Database is connected ... nn");
            result.end(JSON.stringify(rows[0]));
        }
        else
            logger.info('Error while performing Query.' + err);
    });


};


// Get & Fill   dropdown list data by JSON
exports.GetPaymentTerms = function (req, result) {
    var flexiformat = '';
   

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetPaymentTerms('tbl.Id   >=  0 ','',0,10);", function (err, rows) {
           
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}


//Get & Fill dropdown list data by JSON
exports.GetCurrency = function (req, result) {
    var flexiformat = '';
    

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetCurrency('tbl.Id   >=  0 ','',0,10);", function (err, rows) {
           
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
//Get & Fill dropdown list data by JSON
exports.GetIncoterms = function (req, result) {
    var flexiformat = '';
    

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetIncoterms('tbl.Id  >=  0 ','',0,10);", function (err, rows) {
         
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
exports.GetShipBy = function (req, result) {
    var flexiformat = '';
    

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetShipBy('tbl.Id  >=  0 ','',0,10);", function (err, rows) {
            
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
exports.GetFreightCharges = function (req, result) {
    var flexiformat = '';
    

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetFreightCharges('tbl.Id >=  0 ','',0,10)", function (err, rows) {
             
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
exports.GetInsurance = function (req, result) {
    var flexiformat = '';
     var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetInsurance('tbl.Id   >=  0 ','',0,10)", function (err, rows) {
            
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
exports.GetApplicationStatus = function (req, result) {
    var flexiformat = '';
   

    var jsondata = "";

    if (req.body.Id == 0 && req.body.action == "loadall") {

        connection.query("CALL GetApplicationStatus('tbl.Id   >=  0 ','',0,10)", function (err, rows) {
             
            if (!err) {
                jsondata = rows[0];

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
}
exports.GetBank = function (req, result) {
     var flexiformat = '';
     var jsondata = "";
     var AgentId;
     var AgentIdSelect = "";
    var selectQuery = "";
    AgentIdSelect = "select * from  tblUser where Id=" + req.session.userId;
    connection.query(AgentIdSelect, function (err, row, fields) {
       
        if (!err) {
            
            if (row[0].UserType == "AGENT") {
                AgentId = req.session.userId;
            }
            else {
                AgentId = row[0].AgentId;
            }
            
            if (req.body.Id == 0 && req.body.action == "loadall") {
                
                if (req.session.UserType == "ADMIN") {
                    selectQuery = "CALL GetBank('tbl.Id  >=  0 ','',0,10)";
                }
                else {
                    selectQuery = "CALL GetBank('tbl.Id  =  0 or tbl.RefLedgerId=" + AgentId + " ', '', 0, 10) ";
                }
                connection.query(selectQuery, function (err, rows) {
                    
                    if (!err) {
                        jsondata = rows[0];

                    }
                    else {
                        logger.info('Error while performing Query :' + err);
                    }
                    result.writeHead(200, { 'Content-Type': 'application/json' });
                    // sending final formatted json to html
                    result.end(JSON.stringify(jsondata));
                });

            }
        }
        });
  
}

exports.GetBenificiary = function (req, result) {
    var flexiformat = '';
    var jsondata = "";
    var AgentId;
    var AgentIdSelect = "";
    var selectQuery = "";
    AgentIdSelect = "select * from  tblUser where Id=" + req.session.userId;
    connection.query(AgentIdSelect, function (err, row, fields) {
        if (!err) {
            
            if (row[0].UserType == "AGENT") {
                AgentId = req.session.userId;
            }
            else {
                AgentId = row[0].AgentId;
            }

            if (req.session.UserType == "ADMIN") {
                selectQuery = "CALL GetBenificiary('tbl.Id  >=  0 ','',0,10)";
            }
            else {
                selectQuery = "CALL GetBenificiary('tbl.Id  =  0 or tbl.RefLedgerId=" + AgentId + " ', '', 0, 10) "
            }

            if (req.body.Id == 0 && req.body.action == "loadall") {
                connection.query(selectQuery, function (err, rows) {
                    
                    if (!err) {
                        jsondata = rows[0];

                    }
                    else {
                        logger.info('Error while performing Query :' + err);
                    }
                    result.writeHead(200, { 'Content-Type': 'application/json' });
                    // sending final formatted json to html
                    result.end(JSON.stringify(jsondata));
                });

            }
        }
    });
  
    
  
}
//DocumentType
exports.GetDocumentType = function (req, result) {
    var flexiformat = '';
    var jsondata = "";
    
    if (req.body.Id == 0 && req.body.action == "loadall") {
        
        connection.query("select * from tblDocumentType", function (err, rows) {
            
            if (!err) {
                jsondata = rows;
               

            }
            else {
                logger.info('Error while performing Query :' + err);
            }
            result.writeHead(200, { 'Content-Type': 'application/json' });
            // sending final formatted json to html
            result.end(JSON.stringify(jsondata));
        });

    }
  
}

