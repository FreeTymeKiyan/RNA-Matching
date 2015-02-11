var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: 'freetymekiyan@foxmail.com',
    pass: '0Forever0'
  }
});

var mailOpts = {
  from: 'freetymekiyan@foxmail.com', 
  to: 'freetymesunkiyan@gmail.com', 
  subject: 'Test Email', 
  text: 'Hello',
  attachments: [
    {
      filename: 'result1.txt',
      content: 'result1'
    },
    {
      filename: 'result2.txt',
      path: './output.txt'
    }
  ]
};

transporter.sendMail(mailOpts, function (err, info) {
  if (err) {
    console.log(err);
  } else {
    console.log('Msg sent: ' + info.response);
  }
});
