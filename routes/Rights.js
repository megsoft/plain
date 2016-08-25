

/*
 * GET home page.
 */
var _pageId = 0;
var AtrCode = "";

var doubleqte = '"';

var db = require('./db');
//var logger = require('./logger');
exports.GetMenuTypes = function (req, res) {
    res.end(JSON.stringify([{ Type: "Menu" }, { Type: "Page" }]));
}

exports.GetMenusDetByID = function (req, res) {

   
    var queryString = "select * from tblmenu where MenuID=" + req.body.ID + "";
    db.query(queryString, fetchedMenus);
    function fetchedMenus(err, Menus, fields) {

        var jsondata = JSON.stringify(Menus);
        var jsonResponse = "";

        if (typeof (Menus)  == "undefined") {
            jsonResponse=  JSON.stringify({
                status: 'invaliddata',
                data: jsondata
            });
        }
        else {
            jsonResponse=  JSON.stringify({
                status: 'validdata',
                data: jsondata
            });
        }

         
        res.end(jsonResponse);

    }



}

exports.DeleteMenuDetails = function (req, res) {
   
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
        user: 'meguser',
        password: 'megsoft$123',
        port: '3306',
        database: 'Customers'
        //host : '127.0.0.1',
        //user : 'root',
        //password : 'meg$123',
        //database : 'sgt'
    });

    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... nn");
        } else {
            console.log("Error connecting database ... nn" + err);
        }
    });
    var ResultCount = "";


    var queryString = "select srt from tblMenu Where ID='" + req.body.DelID + "' ";
    connection.query(queryString, fetchedsrt);
    var getsrtval = "";
    function fetchedsrt(err, Results, fields) {
        getsrtval = Results[0].srt;
    }
    if (getsrtval == "")
        getsrtval = 0;


    var queryString = "select * from tblmenu where srt >" + getsrtval + " and MenuID=" + req.body.DelID+"";
    connection.query(queryString, fetchedforupdate);
    function fetchedforupdate(err, Results, fields) { 
               
        var count = "0";

        if (typeof (Results) == "undefined") {
            count = 0;
        }
        else {
            count=  Results[0].length;
        }
               
        (function iterate(i) {
         

            if (i === count) {
              
                var dconnection = mysql.createConnection({
                    host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
                    user: 'meguser',
                    password: 'megsoft$123',
                    port: '3306',
                    database: 'Customers'
                    //host : '127.0.0.1',
                    //user : 'root',
                    //password : 'meg$123',
                    //database : 'sgt'
                });

                dconnection.connect(function (err) {
                    if (!err) {
                        console.log("Database is connected ... nn");
                    } else {
                        console.log("Error connecting database ... nn" + err);
                    }
                });
                query = "";
                query = "Delete from tblMenu Where ID='" + req.body.DelID + "'";

                dconnection.connect(function (err, callback) {
                    dconnection.query(query, function (err, rows, callback) {
                        dconnection.end();
                        if (!err) {

                            var jsonResponse = JSON.stringify({
                                status: 'deleted',
                            });
                            console.log(res);
                            res.end(jsonResponse);

                        }
                        else
                            console.log('Error while performing Query.' + err);
                    });
                });

            }

            if (typeof (Results) != "undefined") {
                query = "";
                query = "update tblMenu set srt='" + Results[0][i].srt - 1 + "' Where ID='" + Results[0][i].Id + "'";

                var vconnection = mysql.createConnection({
                    host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
                    user: 'meguser',
                    password: 'megsoft$123',
                    port: '3306',
                    database: 'Customers'
                    //host : '127.0.0.1',
                    //user : 'root',
                    //password : 'meg$123',
                    //database : 'sgt'
                });

                vconnection.connect(function (err) {
                    if (!err) {
                        console.log("Database is connected ... nn");
                    } else {
                        console.log("Error connecting database ... nn" + err);
                    }
                });

                vconnection.connect(function (err, callback) {
                    vconnection.query(query, function (err, rows, callback) {
                        vconnection.end();
                        if (!err) {
                            iterate(i + 1);
                        }
                        else
                            console.log('Error while performing Query.' + err);
                    });
                });
            }

        })(0);
    }
}

exports.MenuSortUpByID = function (req, res) {

    var queryString = "call spMenuSort('" + req.body.ID + "','" + req.body.Sort + "','" + req.body.MenuID + "','" + req.body.Type + "','Up')";
    db.query(queryString, fetchedMenus);
    function fetchedMenus(err, Menus, fields) {
        var jsonResponse = JSON.stringify({
            status: 'Sorted',
        });
        res.end(jsonResponse);

    }
}

exports.MenuSortDownByID = function (req, res) {


    var queryString = "call spMenuSort('" + req.body.ID + "','" + req.body.Sort + "','" + req.body.MenuID + "','" + req.body.Type + "','Down')";
    db.query(queryString, fetchedMenus);
    function fetchedMenus(err, Menus, fields) {

        var jsonResponse = JSON.stringify({
            status: 'Sorted',
        });
        res.end(jsonResponse);

    }
}




exports.SaveTeamUsertypesettings = function (req, res) {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
        user: 'meguser',
        password: 'megsoft$123',
        port: '3306',
        database: 'Customers'
        //host : '127.0.0.1',
        //user : 'root',
        //password : 'meg$123',
        //database : 'sgt'
    });

    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... nn");
        } else {
            console.log("Error connecting database ... nn" + err);
        }
    });
    var ResultCount = "";
    
    
    var queryString = "CALL spDeleteAccess('" + req.body.MenuID + "') ";
        connection.query(queryString, fetchedDelete);


        function fetchedDelete(err, Results, fields) {

            console.log('Deleted');
            

            console.log('access save process initialized...');

            var strTeamIDs = req.body.TeamIDs;
            var splitTeamsIds = strTeamIDs.split(',');

            var strUsertypeIDs = req.body.UsertypeIDs;
            var splitUsertypeIDs = strUsertypeIDs.split(',');


            var count = splitTeamsIds.length;


            (function iterate(i) {
                var NextID = ""

                if (i === count) {

                    var jsonResponse = JSON.stringify({
                        status: 'saved',
                        MenuID: NextID
                    });
                    console.log(res);
                    res.end(jsonResponse);
                }

                var newTeamId = splitTeamsIds[i];
                var newRoleID = splitUsertypeIDs[i];
              var  query = "";
                query = "CALL spAddAccess( '" + req.body.MenuID + "','" + newTeamId + "','" + newRoleID + "');";

                var vconnection = mysql.createConnection({
                    host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
                    user: 'meguser',
                    password: 'megsoft$123',
                    port: '3306',
                    database: 'Customers'
                    //host : '127.0.0.1',
                    //user : 'root',
                    //password : 'meg$123',
                    //database : 'sgt'
                });

                vconnection.connect(function (err) {
                    if (!err) {
                        console.log("Database is connected ... nn");
                    } else {
                        console.log("Error connecting database ... nn" + err);
                    }
                });

                vconnection.connect(function (err, callback) {
                    vconnection.query(query, function (err, rows, callback) {
                        vconnection.end();
                        if (!err) {
                            NextID = rows[0][0].MaxID + 1;
                            iterate(i + 1);
                        }
                        else
                            console.log('Error while performing Query.' + err);
                    });
                });

              
            }) (0);
        }
}
exports.AddMenuDetails = function (req, res) {

    var query = "";
   
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
        user: 'meguser',
        password: 'megsoft$123',
        port: '3306',
        database: 'Customers'
        //host : '127.0.0.1',
        //user : 'root',
        //password : 'meg$123',
        //database : 'sgt'
    });

    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... nn");
        } else {
            console.log("Error connecting database ... nn" + err);
        }
    });
    var ResultCount = "";
    if (req.body.Menutype == "Menu") {
        var queryString = "Select count(*) as Count  from tblMenu where  type='Menu'";
        connection.query(queryString, fetchedMenuCount);


        function fetchedMenuCount(err, Results, fields) {

            ResultCount = Results[0].Count + 1;


            if (ResultCount == "")
                ResultCount = 0;

            console.log('save process initialized...');
            var issubmenu = req.body.Submenuvalue;
            query = "";
            query = "CALL spInsertMenu( '" + req.body.Menuname + "','" + req.body.Menutype + "','" + req.body.Path + "'," + req.body.SelMenuID + "," + req.body.SelPageID + "," + req.body.Submenuvalue + "," + ResultCount + ",'" + req.body.isactive + "' );";

            connection.query(query, function (err, rows, fields) {
                connection.end();

                if (!err) {
                    var NextID = rows[0][0].MaxID;
                    var jsonResponse = JSON.stringify({
                        status: 'saved',
                        MenuID: NextID
                    });
                    console.log(res);
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

        }
    }
    else if (req.body.Menutype == "Page") {
        var queryString = "Select ifnull(max(srt),0) as MaxID  from tblMenu where  MenuID=" + req.body.SelMenuID + "";
        connection.query(queryString, fetchedMaxID);


        function fetchedMaxID(err, Results, fields) {

            ResultCount = Results[0].MaxID + 1;

            if (ResultCount == "")
                ResultCount = 0;

            console.log('save process initialized...');

            query = "";
            query = "CALL spInsertMenu( '" + req.body.Menuname + "','" + req.body.Menutype + "','" + req.body.Path + "'," + req.body.SelMenuID + "," + req.body.SelPageID + "," + req.body.Submenuvalue + "," + ResultCount + "," + req.body.isactive + " );";

            connection.query(query, function (err, rows, fields) {
                connection.end();

                if (!err) {
                    var NextID = rows[0][0].MaxID;
                    var jsonResponse = JSON.stringify({
                        status: 'saved',
                        MenuID: NextID
                    });
                    console.log(res);
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
           

        }

    }


   

}

exports.EditMenuDetails = function (req, res) {

    var query = "";
    var htmlNode = "";
   
    var isactive = req.body.isactive;
    query = "";
    query = "update tblMenu set Name='" + req.body.Menuname + "',Type='" + req.body.Menutype + "', Path = '" + req.body.Path + "',MenuID='" + req.body.SelMenuID + "',PageID='" + req.body.SelPageID + "', SubMenu = " + req.body.Submenuvalue + ",isactive=" + req.body.isactive + "  WHERE ID='" + req.body.ID + "' ;";
    db.query(query, function (err, rows, fields) {
       
        if (!err) {          
            var jsonResponse = JSON.stringify({
                status: 'Edited',
                MenuID: req.body.ID 
            });
            console.log(res);
            res.end(jsonResponse);
        }
        else
            console.log('Error while performing Query.' + err);
    });

}


exports.LoadMenus = function (req, res) {

    var queryString = "Select * from tblMenu where Type='Menu' order by srt";
    db.query(queryString, fetchedMenus);
    function fetchedMenus(err, Menus, fields) {
     
        var jsondata = JSON.stringify(Menus);
        res.end(jsondata);
       
    }

}


exports.LoadPage = function (req, res) {
      
    var queryString = "Select * from tblMenu where  Type='Page' and MenuID= " + req.body.ID + " ";
    db.query(queryString, fetchedMenus);
    function fetchedMenus(err, Menus, fields) {
     
        var jsondata = JSON.stringify(Menus);
        res.end(jsondata);

    }

}


exports.GetMenuByID = function (req, res) {
    
    var queryString = "select * from tblMenu where ID=" + req.body.ID + "";
    db.query(queryString, fetchedMenus);

    function fetchedMenus(err, Menus, fields) {

        var jsondata = JSON.stringify(Menus);
        res.end(jsondata);

    }

}

exports.GetMenuByIDForSection = function (req, res) {

    var queryString = "select ID,MenuID from tblmenu where ID=(select MenuID  from tblmenu where ID=" + req.body.MenuID + ")";
    db.query(queryString, fetchedMenus);
   
    function fetchedMenus(err, Menus, fields) {

        var jsondata = JSON.stringify(Menus);
        res.end(jsondata);

    }

}

exports.getAccessValues = function (req, res) {
    var htmlNode = "";
    var queryString = "select TeamID,RoleID from tblAccess where MenuID=" + req.body.MenuID + "";
    db.query(queryString, fetchedAccess);



    function fetchedAccess(err, Access, fields) {
       
        var count = Access.length;

        (function iterate(i) {

            if (i === count) {
                // all blogs processed!

                htmlNode = htmlNode.substring(0, htmlNode.length - 1);
                htmlNode = "[ "+ htmlNode +"]";
                res.end(JSON.stringify( htmlNode));
            }
            if (i < count) {
                htmlNode += '{'+  doubleqte + 'UTypeIDandTeamID' + doubleqte + ':'  ;
                htmlNode += doubleqte + Access[i].TeamID + "_" + Access[i].RoleID + doubleqte;
                htmlNode += '},';
                iterate(i + 1);
            }
        })(0);
    }
}

exports.LoadUsertypeSetting = function (req, res) {
   
    var queryString = "Select * from tblRole";
    db.query(queryString, fetchedRoles);

    var roleHtml = "";

    function fetchedRoles(err, Roles, fields) {
    
        var count = Roles.length;

        for (j = 0; j < eval(Roles).length; j++) {
            var row = eval(Roles)[j];
            roleHtml += "<td style='width:50px;' ><div class='DivUsertypes' style='' id='Utype_" + row.Id + "'>" + row.Role + "</div></td>"

        }
      res.end(roleHtml);
    }
}


exports.LoadTeamSetting = function (req, res) {
  
    var queryString = "Select * from tblTeam Where isActive=1";
    db.query(queryString, fetchedTeam);

    var Code = "";

    function fetchedTeam(err, Teams, fields) {
       
        var teamcount = Teams.length;
        (function teamiterate(i) {
           

                Code += "<tr><td  style='height: 30px;width:50px'><div class='DivTeams'  id='Utype_" + Teams[i].Id + "'>" + Teams[i].Team + "</div></td>";

                var queryString = "Select * from tblRole";
                db.query(queryString, fetchedRole);


                function fetchedRole(err, Roles, fields) {

                    var rolecount = Roles.length;
                    (function roleiterate(j) {
                        if (j < rolecount) {





                            var teamid = Teams[i].Id;
                            var roleid = Roles[j].Id;
                            Code += "<td style='height: 30px;background-color: lightgrey;'><div  style='text-align: center;'><img style='Cursor:pointer;' id='isactive_" + Teams[i].Id + "_" + Roles[j].Id + "' src='css/images/check-off.png'/></div></td>";
                            roleiterate(j + 1);
                        }

                    }
                    )(0);
                    Code += "</tr>";
                    if (i === teamcount - 1) {

                        res.end(Code);
                    }
                    if (i < teamcount-1) {
                        teamiterate(i + 1);
                    }

                   
            }
        }
        )(0);
    }
}


exports.Load = function (req, res) {

    if (req.session.UserType == "ADMIN") {


        res.render('PageRights', { title: 'Letter Of Credit Application :' });
    } else {

        res.render('PageLogin', { title: 'Letter Of Credit Application :' });
    }

};
var subMenuCount = 0;
exports.GetMenuslst = function (req, res) {

    var query = "";
    var htmlNode = "";
    

    var queryString = "Select * from tblMenu where Type='Menu' order by srt ";
    db.query(queryString, fetchedMenus);

  

    function fetchedMenus(err, Menus, fields) {

        if (err || !Menus || !Menus.length) {
            // an error occurred or no blogs available
            // handle error or send empty blog array
            return res.end(htmlNode);
        }

        var count = Menus.length;

        (function iterate(i) {
            if (i === count) {
                // all blogs processed!
                jsonResponse = JSON.stringify({
                    status: 'VALID',
                    html: htmlNode
                });
               // res.end(jsonResponse);


                return res.end(jsonResponse);
            }



            var Menu = Menus[i];
            console.log("Menu Name : " + Menu.Name);
            htmlNode += "<ul style='list-style: none;'>";
            htmlNode += "<li style='  margin-top: 2px;'><div style=''><table  cellspacing='0' cellpadding='0' style='border-radius: 3px; width: 415px;height:32px;background:#2E5894;'" +
                "'><tr><td style='width:30px'> ";

            htmlNode += "<a href='#' id='Menu_" + Menu.Id + "' onclick='SlideDown(" + Menu.Id + ")'><img style='margin-left:7px;'  id='imgplus_" + Menu.Id + "' src='css/images/plusim.png'></a>";

            //subMenuCount = 0;

            //var squeryString = "Select * from tblMenu where  Type='Page' and MenuID= "+ Menu.Id + " ";
            //connection.query(squeryString, fetchedsubMenusCount);
            //function fetchedsubMenusCount(err, subMenus, fields) {

            //    subMenuCount = subMenus.length;
            //    if (subMenuCount > 0) {
            //        htmlNode += "<a href='#' id='Menu_" + Menu.Id + "' onclick='SlideDown(" + Menu.Id + ")'><img style='margin-left:7px;'  id='imgplus_" + Menu.Id + "' src='css/images/plusim.png'></a>";
            //    }
            //}


          

            htmlNode += "</td><td style='width:225px;border-right: thin double black;'><div style='margin-left:20px;'><div style='color: white;font-weight: bold;' >" + Menu.Name + "</div></div></td> " +
                "<td style='width:40px;border-right: thin double black;' ><div style='cursor:pointer;margin-left: 9px;' class='sprite useracc'  id='" + Menu.Id + "' onclick='btnSetMenuID(" + doubleqte + Menu.Id + doubleqte + "," + doubleqte + Menu.Name + doubleqte + "," + doubleqte + Menu.MenuID + doubleqte + "," + doubleqte + Menu.Type + doubleqte + ")' ></div></td>" +
                "<td style='width:40px; border-right: thin double black;'><div style='  margin-left:9px;border-radius:5px;cursor:pointer;' id='btnSort" + Menu.Id + "' class='sprite srtup'  onclick='btnSortUp(" + doubleqte + Menu.Id + doubleqte + "," + doubleqte + Menu.srt + doubleqte + "," + doubleqte + Menu.Type + doubleqte + "," + doubleqte + Menu.MenuID + doubleqte + ")'></div></td>" +
                "<td style='width:40px; border-right: thin double black;'><div id='btnSortM' class='sprite srtdwn' style='  margin-left: 9px;border-radius:5px;cursor:pointer;' onclick='btnSortDown(" + doubleqte + Menu.Id + doubleqte + "," + doubleqte + Menu.srt + doubleqte + "," + doubleqte + Menu.Type + doubleqte + "," + doubleqte + Menu.MenuID + doubleqte + ")'></div></td>" +
                "<td style=''><div style='  margin-left: 7px;border-radius:5px;cursor:pointer;' id='btnSortM' class='sprite clse' onclick='DeleteID(" + doubleqte + Menu.Id + doubleqte + "," + doubleqte + Menu.MenuID + doubleqte + ")'></td>" +
                "</td ></tr ></table ></div > ";





            var SubMenu_query = " SELECT mp.* FROM tblMenu m JOIN tblMenu mp ON m.ID = mp.MenuID where mp.MenuID = " + Menu.Id + " and mp.type = 'Page'  order by m.srt, mp.srt";
            db.query(SubMenu_query, fetchedSubMenus);

            function fetchedSubMenus(err, SubMenus, fields) {
                if (SubMenus.length > 0) {
                    htmlNode += "<ul style='list-style: none;display:none;' id=Page_" + Menu.Id + ">"
                    for (j = 0; j < SubMenus.length; j++) {
                        console.log("     Sub Menu Name : " + SubMenus[j].Name);
                        var SubMenu = SubMenus[j];
                       
                        htmlNode += "<li style='  margin-top: 2px;'><div style=''><table  cellspacing='0' cellpadding='0' style='border-radius: 3px; width: 415px;height:32px;background:darkseagreen;'" +
                            "'><tr><td style='width:30px'> ";
                        htmlNode += "<a href='#' id='Page_" + SubMenu.Id + "' onclick='SlideDown(" + SubMenu.Id + ")'></a>"; // i removed image code   <img style='margin-left:7px;'  id='imgplus_" + SubMenu.Id + "'  src='css/images/plusim.png'  > here

                        htmlNode += "</td><td style='width:225px;border-right: thin double black;'><div style='margin-left:20px;'><div style='color: white;font-weight: bold;' >" + SubMenu.Name + "</div></div></td> " +
                            "<td style='width:40px;border-right: thin double black;' ><div style='cursor:pointer;margin-left: 9px;' class='sprite useracc'  id='" + SubMenu.Id + "' onclick='btnSetMenuID(" + doubleqte + SubMenu.Id + doubleqte + "," + doubleqte + SubMenu.Name + doubleqte + "," + doubleqte + SubMenu.MenuID + doubleqte + "," + doubleqte + SubMenu.Type + doubleqte + ")' ></div></td>" +
                            "<td style='width:40px; border-right: thin double black;'><div style='  margin-left:9px;border-radius:5px;cursor:pointer;' id='btnSort" + SubMenu.Id + "' class='sprite srtup'  onclick='btnSortUp(" + doubleqte + SubMenu.Id + doubleqte + "," + doubleqte + SubMenu.srt + doubleqte + "," + doubleqte + SubMenu.Type + doubleqte + "," + doubleqte + SubMenu.MenuID + doubleqte + ")'></div></td>" +
                            "<td style='width:40px; border-right: thin double black;'><div id='btnSortM' class='sprite srtdwn' style='  margin-left: 9px;border-radius:5px;cursor:pointer;' onclick='btnSortDown(" + doubleqte + SubMenu.Id + doubleqte + "," + doubleqte + SubMenu.srt + doubleqte + "," + doubleqte + SubMenu.Type + doubleqte + "," + doubleqte + SubMenu.MenuID + doubleqte + ")'></div></td>" +
                            "<td style=''><div style='  margin-left: 7px;border-radius:5px;cursor:pointer;' id='btnSortM' class='sprite clse' onclick='DeleteID(" + doubleqte + SubMenu.Id + doubleqte + "," + doubleqte + SubMenu.MenuID + doubleqte + ")'></td>" +
                            "</td ></tr ></table ></div > ";
                        //   PagesCode += GetSections(I.ID.ToString()) + "</li>"
                        htmlNode += "</li>";

                      
                    }
                    htmlNode += "</ul>";
                }
                htmlNode += "</li>";

                htmlNode += "</ul>";
                Menu.tags = SubMenus;
                iterate(i + 1);
            }
        })(0);
    }










}


exports.LoadSectionforPages = function (req, res) {

  var  query = "SELECT mp.* FROM tblMenu m JOIN tblMenu mp ON m.ID = mp.MenuID where mp.PageID = " + req + "  order by m.srt, mp.srt ";
    db.query(query, function (err, rows) {

        if (!err) {
            if (rows.length > 0) {

                for (j = 0; j < eval(rows).length; j++) {
                    var row = eval(rows)[j];
                    AtrCode += "<a href='#' id='Menu_" + row.Id + "' onclick='SlideDown(" + row.Id + ")'><img style='margin-left:7px;'  id='imgplus_" + row.Id + "' src='css/images/plusim.png'></a>";
                }
            }
        }
    });

}


exports.GetPagesforMenu = function (req, res) {


  var  query = "SELECT mp.* FROM tblMenu m JOIN tblMenu mp ON m.ID = mp.MenuID where mp.MenuID = " + req + " and mp.type='Page'  order by m.srt, mp.srt";

   
    db.query(query, function (err, rows) {

        if (!err) {
            if (rows.length > 0) {
                step3 = "<ul style='list-style: none;display:none;' id=Page_" + req + ">"
               

                for (j = 0; j < eval(rows).length; j++) {
                    var I = eval(rows)[j];
                    step3 += "<li ><div style=''><table style='background-color:darkseagreen;width:375px;border-radius:5px;margin-top:1px;'><tr><td style='width:30px'>"
              

                    step3 += "</td><td style='width:225px;border-right: thin double black;'><div style='margin-left:20px;'><div style='color: white;font-weight: bold;' >" + I.Name + "</div></div></td> " +
                        "<td style='width:40px;border-right: thin double black;' ><div style='cursor:pointer;margin-left: 9px;' class='sprite useracc'  id='" + I.Id + "' onclick='btnSetMenuID(" + doubleqte + I.Id + doubleqte + "," + doubleqte + I.Name + doubleqte + "," + doubleqte + I.MenuID + doubleqte + "," + doubleqte + I.Type + doubleqte + ")' ></div></td>" +
                        "<td style='width:40px; border-right: thin double black;'><div style='  margin-left:9px;border-radius:5px;cursor:pointer;' id='btnSort" + I.Id + "' class='sprite srtup'  onclick='btnSortUp(" + doubleqte + I.Id + doubleqte + "," + doubleqte + I.Sort + doubleqte + "," + doubleqte + I.Type + doubleqte + "," + doubleqte + I.MenuID + doubleqte + ")'></div></td>" +
                        "<td style='width:40px; border-right: thin double black;'><div id='btnSortM' class='sprite srtdwn' style='  margin-left: 9px;border-radius:5px;cursor:pointer;' onclick='btnSortDown(" + doubleqte + I.Id + doubleqte + "," + doubleqte + I.Sort + doubleqte + "," + doubleqte + I.Type + doubleqte + "," + doubleqte + I.MenuID + doubleqte + ")'></div></td>" +
                        "<td style=''><div style='  margin-left: 7px;border-radius:5px;cursor:pointer;' id='btnSortM' class='sprite clse' onclick='DeleteID(" + doubleqte + I.Id + doubleqte + "," + doubleqte + I.MenuID + doubleqte + ")'></td>" +
                        "</td ></tr ></table ></div > ";
                                 //   PagesCode += GetSections(I.ID.ToString()) + "</li>"
                    step3 += "</li>";

                }
            }
        }
    });

}