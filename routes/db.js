var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'megdb.cya7a7ahiavf.us-west-2.rds.amazonaws.com',
    user: 'meguser',
    password: 'megsoft$123',
    port: '3306',
    database: 'Customers'
});

connection.connect(function (err) {
    if (!err) {
       console.log("Database is connected ... nn");
    } else {
       console.log("Error connecting database ... nn" + err);
    }
});

module.exports = connection;