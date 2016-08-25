

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'megsoftbs@gmail.com',
        pass: 'megsoft$123'
    }
});


module.exports = transporter;