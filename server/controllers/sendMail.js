var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'kumarvermaankit9555@gmail.com',
    pass: 'wipvuwgffivpchnc'
  }
}));

function sendMail(receiver){
  var mailOptions = {
    from: 'kumarvermaankit9555@gmail.com',
    to: receiver,
    subject: 'Alert',
    text: 'Alert from your chat app'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = sendMail;
